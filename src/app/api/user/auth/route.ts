// app/api/user/auth/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  const { token } = await req.json();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    return NextResponse.json({ valid: true, user: decoded });
  } catch (error) {
    console.log("🚀 User Auth ~ POST ~ error:", error)
    return NextResponse.json({ valid: false, message: 'Invalid token' }, { status: 401 });
  }
}
