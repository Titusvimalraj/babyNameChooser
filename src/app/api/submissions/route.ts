// app/api/submissions/route.ts
import { NextResponse } from 'next/server';
import { dbConnect, dbDisconnect } from '@/utils/dbConnect';
import Submission from '@/models/Submission';
import { withAdminAuth } from '@/utils/withAuth';

export const GET = withAdminAuth(async () => {
  await dbConnect();
  try {
    const submissions = await Submission.find({})
      .populate({
        path: 'selectedNames',
        model: 'Name',
        select: 'name type -_id',
      })
      .exec();

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json({ message: 'Error fetching submissions' }, { status: 500 });
  } 
});
