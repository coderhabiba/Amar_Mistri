import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const db = await getDB();
    const applicationsCollection = db.collection('support_applications');
    const body = await request.json();
    const { name, email, experience, portfolio } = body;

    if (!name || !email || !portfolio) {
      return NextResponse.json(
        {
          success: false,
          message: 'All fields are required.',
        },
        { status: 400 },
      );
    }

    const newApplication = {
      name,
      email,
      experience: experience || 'fresher',
      portfolio,
      status: 'reviewing',
      appliedAt: new Date(),
    };

    const result = await applicationsCollection.insertOne(newApplication);

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully!',
        insertedId: result.insertedId,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Support Job API Error:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
