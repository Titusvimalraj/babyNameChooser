// app/api/submit/route.ts
import { NextResponse } from 'next/server';
import { dbConnect, dbDisconnect } from '@/utils/dbConnect';
import Submission from '@/models/Submission';
import { withAuth } from '@/utils/withAuth';

export const POST = withAuth(async (req: Request) => {
  await dbConnect();
  try {
    const { userName, selectedNames, token } = await req.json();
    
    // Check if a submission with the same token already exists
    const existingSubmission = await Submission.findOne({ token });
    if (existingSubmission) {
      return NextResponse.json({ message: 'Token already used for a submission' }, { status: 400 });
    }

    const newSubmission = new Submission({ userName, selectedNames, token });
    await newSubmission.save();
    return NextResponse.json({ message: 'Submission saved' });
  } catch (error) {
    console.error('Error saving submission:', error);
    return NextResponse.json({ message: 'Error saving submission or submission already done' }, { status: 500 });
  } 
});
