import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET() {
  try {
    const db = await getDB();
    const locationsData = await db.collection('districts').find({}).toArray();

    if (!locationsData || locationsData.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No location or district data found in the database.',
        },
        { status: 404 },
      );
    }
    return NextResponse.json(locationsData, { status: 200 });
  } catch (error: any) {
    console.error('Error in /locations route:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error while fetching location data.',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
