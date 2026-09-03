import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDB();
    const reviews = await db
      .collection('reviews')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(reviews, { status: 200 });
  } catch (error: any) {
    console.error('All reviews fetch error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
