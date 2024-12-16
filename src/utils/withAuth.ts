// utils/withAuth.ts
import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    try {
      jwt.verify(token, process.env.JWT_SECRET!);
      return await handler(req);
    } catch (error) {
      console.log("🚀 ~ return ~ error:", error);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  };
}

export function withAdminAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {role:string};
      if (decoded.role !== 'admin') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
      return await handler(req);
    } catch (error) {
      console.log("🚀 ~ return ~ error:", error);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  };
}
