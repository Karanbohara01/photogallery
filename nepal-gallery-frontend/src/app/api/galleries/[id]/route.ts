import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/db';
import { Gallery } from '../../../../lib/models/Gallery';
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

// GET /api/galleries/:id
export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await ctx.params;
    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return NextResponse.json({ success: false, error: 'Gallery not found' }, { status: 404 });
    }

    gallery.views += 1;
    await gallery.save();

    return NextResponse.json({ success: true, data: gallery });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Server Error' },
      { status: 500 }
    );
  }
}

// PUT /api/galleries/:id
export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const userId = getUserIdFromAuthHeader(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
    }

    const { id } = await ctx.params;
    const updates = await req.json();
    const gallery = await Gallery.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });
    if (!gallery) {
      return NextResponse.json({ success: false, error: 'Gallery not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: gallery });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Server Error' },
      { status: 500 }
    );
  }
}

// DELETE /api/galleries/:id
export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const userId = getUserIdFromAuthHeader(req);
    if (!userId) {
      return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
    }

    const { id } = await ctx.params;
    const gallery = await Gallery.findById(id);
    if (!gallery) {
      return NextResponse.json({ success: false, error: 'Gallery not found' }, { status: 404 });
    }

    await gallery.deleteOne();
    return NextResponse.json({ success: true, data: {} });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Server Error' },
      { status: 500 }
    );
  }
}


