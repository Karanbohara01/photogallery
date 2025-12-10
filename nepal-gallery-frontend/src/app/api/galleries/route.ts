import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { Gallery } from '../../../lib/models/Gallery';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

const JWT_SECRET = process.env.JWT_SECRET as string;

function getUserIdFromAuthHeader(req: NextRequest): string | null {
  const auth = req.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ') || !JWT_SECRET) return null;
  const token = auth.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded.id;
  } catch {
    return null;
  }
}

// GET /api/galleries
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10) || 1;
    const limit = parseInt(searchParams.get('limit') || '16', 10) || 16;
    const startIndex = (page - 1) * limit;

    const searchTerm = searchParams.get('search');
    let query: any = {};
    if (searchTerm && searchTerm.trim() !== '') {
      const searchRegex = new RegExp(searchTerm, 'i');
      query = {
        $or: [{ title: { $regex: searchRegex } }, { tags: { $regex: searchRegex } }]
      };
    }

    const total = await Gallery.countDocuments(query);
    const galleries = await Gallery.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    return NextResponse.json({
      success: true,
      count: galleries.length,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasMore: startIndex + galleries.length < total
      },
      data: galleries
    });
  } catch (err: any) {
    console.error('Error in GET /api/galleries', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Server Error' },
      { status: 500 }
    );
  }
}

// POST /api/galleries
// NOTE: On Vercel we avoid local file storage; this implementation supports EMBED content only.
// POST /api/galleries
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromAuthHeader(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const title = formData.get('title') as string;
    const tagsInfo = formData.get('tags') as string;
    const contentType = formData.get('contentType') as string;
    const embedCode = formData.get('embedCode') as string;

    const galleryData: any = {
      title,
      tags: tagsInfo ? tagsInfo.split(',').map((t: string) => t.trim()) : [],
      contentType,
      embedCode,
    };

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Helper to save file
    const saveFile = async (file: File): Promise<string> => {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      // Clean filename
      const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const filename = `${uniqueSuffix}-${originalName}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, buffer);
      return `uploads/${filename}`; // Return relative path
    };

    // 1. Handle Thumbnail
    const thumbnailFile = formData.get('thumbnail') as File | null;
    if (thumbnailFile && thumbnailFile.size > 0) {
      galleryData.thumbnail = await saveFile(thumbnailFile);
    }

    // 2. Handle Gallery Images
    // formData.getAll('images') returns an array of entries
    const imageFiles = formData.getAll('images') as File[];
    if (imageFiles && imageFiles.length > 0) {
      const savedImages = [];
      for (const file of imageFiles) {
        if (file.size > 0) {
          const url = await saveFile(file);
          savedImages.push({ url, altText: title });
        }
      }
      galleryData.images = savedImages;

      // Fallback: if no thumbnail was uploaded, use first image
      if (!galleryData.thumbnail && savedImages.length > 0) {
        galleryData.thumbnail = savedImages[0].url;
      }
    }

    const gallery = await Gallery.create(galleryData);

    return NextResponse.json({ success: true, data: gallery }, { status: 201 });
  } catch (err: any) {
    console.error('Error in POST /api/galleries', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Server Error' },
      { status: 400 }
    );
  }
}


