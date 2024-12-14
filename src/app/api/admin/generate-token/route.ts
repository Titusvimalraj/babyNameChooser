// app/api/admin/generate-token/route.ts
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { withAdminAuth } from '@/utils/withAuth';

export const POST = withAdminAuth(async (req: Request) => {
  const token = jwt.sign({ role: 'user' }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  return NextResponse.json({ token });
});
