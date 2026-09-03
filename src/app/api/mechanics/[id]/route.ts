import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDB();
    const mechanicsCollection = db.collection('mechanics');

    let query: any;
    if (ObjectId.isValid(id)) {
      query = {
        $or: [{ _id: id as any }, { _id: new ObjectId(id) }, { mistriId: id }],
      };
    } else {
      query = { mistriId: id };
    }

    const mechanic: any = await mechanicsCollection.findOne(query);

    if (!mechanic) {
      return NextResponse.json(
        { success: false, message: 'Mechanic profile not found.' },
        { status: 404 },
      );
    }

    const cleanedMechanic = {
      _id: mechanic._id,
      mistriId: mechanic.mistriId,
      referCode: mechanic.referCode,
      fullName: mechanic.fullName || mechanic.name,
      faceImageUrl: mechanic.faceImageUrl || mechanic.photo,
      charge: mechanic.charge || 500,
      address:
        mechanic.address ||
        mechanic.liveLocation?.address ||
        'Location Not Available',
      specificServices: mechanic.services || [],
      categoryKeys: mechanic.categories || [],
      liveLocation: mechanic.liveLocation,
      experience: mechanic.experience || 0,
    };

    return NextResponse.json(cleanedMechanic, { status: 200 });
  } catch (error: any) {
    console.error('Critical Error finding individual mechanic:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error processing query identity.' },
      { status: 500 },
    );
  }
}

// PUT /api/mechanics/[id] — admin approve/reject/pending toggle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }
    const decoded: any = verifyToken(authHeader.split(' ')[1]);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required.' }, { status: 403 });
    }

    const { id } = await params;
    const { status } = await request.json();
    if (!['approved', 'pending', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status value.' }, { status: 400 });
    }

    const db = await getDB();
    const col = db.collection('mechanics');
    let query: any = ObjectId.isValid(id)
      ? { $or: [{ _id: new ObjectId(id) }, { _id: id as any }, { mistriId: id }] }
      : { mistriId: id };

    await col.updateOne(query, { $set: { status, updatedAt: new Date() } });
    return NextResponse.json({ success: true, message: `Status updated to ${status}.` });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

// PATCH /api/mechanics/[id] — update live location coordinates
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { coordinates, address } = await request.json();
    const db = await getDB();
    const col = db.collection('mechanics');
    let query: any = ObjectId.isValid(id)
      ? { $or: [{ _id: new ObjectId(id) }, { _id: id as any }, { mistriId: id }] }
      : { mistriId: id };

    await col.updateOne(query, {
      $set: {
        liveLocation: {
          type: 'Point',
          coordinates, // [lng, lat]
          address: address || '',
          updatedAt: new Date(),
        },
        updatedAt: new Date(),
      },
    });
    return NextResponse.json({ success: true, message: 'Live location updated.' });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

