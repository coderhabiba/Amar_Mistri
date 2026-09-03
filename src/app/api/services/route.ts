import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDB();
    const servicesCollection = db.collection('services');

    const doc = await servicesCollection.findOne({});
    if (!doc) {
      return NextResponse.json({ message: 'No data found' }, { status: 404 });
    }

    const { _id, ...servicesData } = doc;
    return NextResponse.json(servicesData, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
