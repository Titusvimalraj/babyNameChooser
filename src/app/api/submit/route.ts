// app/api/submit/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Submission from '@/models/Submission';
import { withAuth } from '@/utils/withAuth';

export const POST = withAuth(async (req: Request) => {
  await dbConnect();
  const { userName, selectedNames } = await req.json();
  const newSubmission = new Submission({ userName, selectedNames });
  await newSubmission.save();
  return NextResponse.json({ message: 'Submission saved' });
});
