import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import { Gallery } from '../../../lib/models/Gallery';
import jwt from 'jsonwebtoken';

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
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const userId = getUserIdFromAuthHeader(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
    }

    // Accept both JSON and multipart/form-data to avoid JSON.parse errors from FormData submits.
    const contentTypeHeader = req.headers.get('content-type') || '';
    let body: any = {};
    if (contentTypeHeader.includes('application/json')) {
      body = await req.json();
    } else {
      const form = await req.formData();
      form.forEach((value, key) => {
        // Only keep strings; files are ignored in this lightweight serverless handler
        if (typeof value === 'string') {
          body[key] = value;
        }
      });
    }

    const { title, tags, contentType, embedCode, thumbnail } = body;

    const galleryData: any = {
      title,
      tags: typeof tags === 'string' ? tags.split(',').map((t: string) => t.trim()) : tags || [],
      contentType,
      embedCode,
      thumbnail
    };

    // For simplicity on serverless, we only support embed + external thumbnail URLs.
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


