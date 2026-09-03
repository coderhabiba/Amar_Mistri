import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const db = await getDB();
    const mechanicReportsCollection = db.collection('mechanic_reports');
    const body = await request.json();
    const { mechanicName, mechanicPhone, issueType, orderId, description } = body;

    if (
      !mechanicName ||
      !mechanicPhone ||
      !issueType ||
      !orderId ||
      !description
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'সবগুলো প্রয়োজনীয় তথ্য প্রদান করুন।',
        },
        { status: 400 },
      );
    }

    const newReport = {
      mechanicName,
      mechanicPhone,
      issueType,
      orderId,
      description,
      status: 'pending',
      createdAt: new Date(),
    };

    const result = await mechanicReportsCollection.insertOne(newReport);

    return NextResponse.json(
      {
        success: true,
        message: 'Mechanic report registered successfully.',
        insertedId: result.insertedId,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}
