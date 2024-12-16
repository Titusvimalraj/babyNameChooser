// app/api/admin/generate-token/route.ts
import { NextResponse } from 'next/server';
import { dbConnect, dbDisconnect } from '@/utils/dbConnect';
import jwt from 'jsonwebtoken';
import { withAdminAuth } from '@/utils/withAuth';

export const POST = withAdminAuth(async (req: Request) => {
  await dbConnect();
  try {
    const token = jwt.sign({ role: 'user' }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    const link = `${process.env.NEXT_PUBLIC_APP_URL}?token=${token}`;
    return NextResponse.json({ token, link });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({ message: 'Error generating token' }, { status: 500 });
  }
});
