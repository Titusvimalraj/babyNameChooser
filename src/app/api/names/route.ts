// app/api/names/route.ts
import { NextResponse } from 'next/server';
import { dbConnect } from '@/utils/dbConnect';
import Name from '@/models/Name';

export async function GET() {
  try {
    await dbConnect();
    const girlNames = await Name.find({ type: 'girl' });
    const boyNames = await Name.find({ type: 'boy' });
    // Shuffle the names
    girlNames.sort(() => Math.random() - 0.5);
    boyNames.sort(() => Math.random() - 0.5);

    return NextResponse.json({ girlNames, boyNames });
  } catch (error) {
    console.error('Error fetching names:', error);
    return NextResponse.json({ message: 'Error fetching names' }, { status: 500 });
  } 
}
