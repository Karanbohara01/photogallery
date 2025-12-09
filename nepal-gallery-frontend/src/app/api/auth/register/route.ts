import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '../../../../lib/db';
import { User } from '../../../../lib/models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;

const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { username, password } = await req.json();

    const existing = await User.findOne({ username });
    if (existing) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    const user = await User.create({ username, password });

    return NextResponse.json(
      {
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(String(user._id))
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}


