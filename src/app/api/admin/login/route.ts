// app/api/admin/login/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
// import User from '@/models/User';
import dbConnect from '@/utils/dbConnect';

export async function POST(req: Request) {
  // await dbConnect();
  const { username, password } = await req.json();
  // const user = await User.findOne({ username });
  // const token = jwt.sign({ userId: user._id, role: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  const token = jwt.sign({ userId: '22343423423kk', role: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  return NextResponse.json({ token });

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ userId: user._id, role: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    return NextResponse.json({ token });
  } else {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }
}
