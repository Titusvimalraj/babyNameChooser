// app/api/submissions/route.ts
import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/dbConnect';
// import Submission from '@/models/Submission';
import { withAuth } from '@/utils/withAuth';
import { submissionsDummyData } from './dummyData';

export const GET = withAuth(async () => {
  // await dbConnect();
  // const submissions = await Submission.find({});
  // return NextResponse.json(submissions);
  return NextResponse.json(submissionsDummyData);
});
