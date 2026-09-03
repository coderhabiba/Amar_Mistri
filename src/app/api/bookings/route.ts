import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fetchAll = searchParams.get('fetchAll');
    const db = await getDB();

    const totalBookingsCount = await db.collection('bookings').countDocuments({});

    if (fetchAll === 'true') {
      const allBookings = await db
        .collection('bookings')
        .find({})
        .sort({ createdAt: -1 })
        .toArray();
      return NextResponse.json(allBookings, { status: 200 });
    }

    return NextResponse.json(
      {
        success: true,
        length: totalBookingsCount,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error retrieving bookings:', error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      categoryKey,
      categoryName,
      specificService,
      date,
      timeSlot,
      name,
      phone,
      address,
      notes,
      mistriId,
      mistriName,
      status,
    } = body;

    if (!categoryKey || !specificService || !name || !phone || !mistriId) {
      return NextResponse.json(
        { message: 'Required fields are missing.' },
        { status: 400 },
      );
    }

    const db = await getDB();
    const newBooking = {
      categoryKey,
      categoryName,
      specificService,
      date,
      timeSlot,
      clientName: name,
      clientPhone: phone,
      deliveryAddress: address,
      additionalNotes: notes,
      mistriId,
      mistriName,
      status: status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('bookings').insertOne(newBooking);

    if (result.acknowledged) {
      return NextResponse.json(
        {
          success: true,
          message: 'Booking registered successfully!',
          bookingId: result.insertedId,
          booking: newBooking,
        },
        { status: 201 },
      );
    } else {
      throw new Error('Failed to insert booking document.');
    }
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { message: 'Server Error', error: error.message },
      { status: 500 },
    );
  }
}
