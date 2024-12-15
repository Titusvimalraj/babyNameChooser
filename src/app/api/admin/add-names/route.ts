// app/api/admin/add-names/route.ts
import { NextResponse } from 'next/server';
import { dbConnect, dbDisconnect } from '@/utils/dbConnect';
import Name from '@/models/Name';
import { withAuth } from '@/utils/withAuth';

export const POST = withAuth(async (req: Request) => {
  await dbConnect();
  try {
    const { names, type } = await req.json();
    const newNames = names.map((name: string) => ({ name, type }));
    await Name.insertMany(newNames);
    return NextResponse.json({ message: 'Names added successfully' });
  } catch (error) {
    console.error('Error adding names:', error);
    return NextResponse.json({ message: 'Error adding names' }, { status: 500 });
  } 
});