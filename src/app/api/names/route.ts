// app/api/names/route.ts
import { NextResponse } from 'next/server';
// import dbConnect from '@/utils/dbConnect';
// import Name from '@/models/Name';

export async function GET() {
  // await dbConnect();
  // const girlNames = await Name.find({ type: 'girl' }).select('name -_id');
  // const boyNames = await Name.find({ type: 'boy' }).select('name -_id');
  const girlNames= [
    { _id: 'dkslfsjfksdf', type: 'girl', name: 'Shania'},
  ];
  const boyNames= [
    { _id:'dksflsdfk333', type: 'boy', name: 'Titus'},
    { _id:'dks343423423', type: 'boy', name: 'Vimal'},
  ];
  // Shuffle the names
  girlNames.sort(() => Math.random() - 0.5);
  boyNames.sort(() => Math.random() - 0.5);

  return NextResponse.json({ girlNames, boyNames });
}
