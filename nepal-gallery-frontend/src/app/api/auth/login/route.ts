import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { connectDB } from '../../../../lib/db';
import { User } from '../../../../lib/models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  console.warn('JWT_SECRET is not set. Auth routes will fail.');
}

const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '30d' });
};

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { username, password } = await req.json();

    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      return NextResponse.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        token: generateToken(String(user._id))
      });
    }

    return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 });
  }
}


