// app/api/admin/random-names/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { dbConnect, dbDisconnect } from '@/utils/dbConnect';
import Submission from '@/models/Submission';
import { withAuth } from '@/utils/withAuth';
import { Submission as Submissions } from '@/app/admin/dashboard/page';

interface NameWeight {
  name: string;
  weight: number;
}

function getRandomNameWeighted(namesWithWeights: NameWeight[]): string {
  const sum = namesWithWeights.reduce((acc, { weight }) => acc + weight, 0);
  let rand = Math.random() * sum;

  for (const { name, weight } of namesWithWeights) {
    if (rand < weight) {
      return name;
    }
    rand -= weight;
  }

  return ''; // Fallback in case no name is selected
}

export const GET = withAuth(async (req: NextRequest) => {
  await dbConnect();
  try {
    const submissions = await Submission.find({})
      .populate({
        path: 'selectedNames',
        model: 'Name',
        select: 'name type',
      })
      .exec() as unknown as Submissions[];

    const boyNameCounts: { [key: string]: number } = {};
    const girlNameCounts: { [key: string]: number } = {};

    submissions.forEach(submission => {
      submission.selectedNames.forEach(name => {
        if (name.type === 'boy') {
          if (!boyNameCounts[name.name]) {
            boyNameCounts[name.name] = 0;
          }
          boyNameCounts[name.name] += 1;
        } else if (name.type === 'girl') {
          if (!girlNameCounts[name.name]) {
            girlNameCounts[name.name] = 0;
          }
          girlNameCounts[name.name] += 1;
        }
      });
    });

    const boyNamesWithWeights: NameWeight[] = Object.entries(boyNameCounts).map(([name, weight]) => ({ name, weight }));
    const girlNamesWithWeights: NameWeight[] = Object.entries(girlNameCounts).map(([name, weight]) => ({ name, weight }));

    const randomBoyName = getRandomNameWeighted(boyNamesWithWeights);
    const randomGirlName = getRandomNameWeighted(girlNamesWithWeights);

    return NextResponse.json({ randomBoyName, randomGirlName });
  } catch (error) {
    console.error('Error getting random names:', error);
    return NextResponse.json({ message: 'Error getting random names' }, { status: 500 });
  }
});
