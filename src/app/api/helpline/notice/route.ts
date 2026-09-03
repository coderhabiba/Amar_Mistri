import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const db = await getDB();
    const helplineCollection = db.collection('user_notices');
    const body = await request.json();
    const { name, phone, orderId, details } = body;

    if (!name || !phone || !details) {
      return NextResponse.json(
        {
          success: false,
          message: 'Fill in all required fields',
        },
        { status: 400 },
      );
    }

    const newNotice = {
      name,
      phone,
      orderId: orderId || null,
      details,
      status: 'monitoring',
      createdAt: new Date(),
    };

    const result = await helplineCollection.insertOne(newNotice);

    return NextResponse.json(
      {
        success: true,
        message: 'Emergency notice recorded successfully.',
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
