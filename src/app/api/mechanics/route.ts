import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { Db } from 'mongodb';

async function getNextMistriId(db: Db): Promise<string> {
  const countersCollection = db.collection('counters');
  const counter = await countersCollection.findOneAndUpdate(
    { _id: 'mistriSeq' as any },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: 'after' },
  );

  const seqVal = counter?.seq || 1;
  const sequenceNumber = seqVal.toString().padStart(3, '0');
  return `AM-${sequenceNumber}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryKey = searchParams.get('categoryKey');
    const specificService = searchParams.get('specificService');

    const query: any = {};
    query.status = { $regex: '^approved\\s*$', $options: 'i' };

    if (categoryKey && categoryKey !== 'all') {
      const categoriesArray = categoryKey.split(',');
      query.categories = { $in: categoriesArray };
    }

    if (specificService && specificService !== 'all') {
      const servicesArray = specificService.split(',');
      query.services = { $in: servicesArray };
    }

    const db = await getDB();
    const mechanicsCollection = db.collection('mechanics');

    const filteredMechanics = await mechanicsCollection
      .find(query)
      .project({ nidNumber: 0, nidFrontUrl: 0, nidBackUrl: 0 })
      .toArray();

    const cleanedMechanics = filteredMechanics.map((m: any) => ({
      _id: m._id,
      mistriId: m.mistriId,
      referCode: m.referCode,
      fullName: m.fullName || m.name,
      faceImageUrl: m.faceImageUrl || m.photo,
      phone: m.phone || '',
      charge: m.charge || 500,
      address: m.address || m.liveLocation?.address || 'Location Not Available',
      specificServices: m.services || [],
      categoryKeys: m.categories || [],
      liveLocation: m.liveLocation,
      experience: m.experience || 0,
      completedTasks: m.completedTasks || 0,
      rating: m.rating || 5.0,
      totalReviews: m.totalReviews || 0,
      hasBadReview: m.hasBadReview || false,
      isNidVerified: m.isNidVerified || false,
      isFaceScanVerified: m.isFaceScanVerified || false,
      isCitizenCertificateSubmitted: m.isCitizenCertificateSubmitted || false,
    }));

    return NextResponse.json(cleanedMechanics, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching mechanics:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDB();
    const mechanicsCollection = db.collection('mechanics');

    const {
      name,
      phone,
      email,
      password,
      categories,
      services,
      experience,
      charge,
      photo,
      nidNumber,
      nidFrontUrl,
      nidBackUrl,
      address,
      district,
      thana,
      liveLocation,
      referredBy,
    } = body;

    if (!name || !phone || !nidNumber || !liveLocation?.coordinates) {
      return NextResponse.json(
        {
          success: false,
          message: 'Required information is missing from the request body (Validation Failed).',
        },
        { status: 400 },
      );
    }

    const existingMechanic = await mechanicsCollection.findOne({
      $or: [{ phone: phone }, { nidNumber: nidNumber }],
    });

    if (existingMechanic) {
      return NextResponse.json(
        {
          success: false,
          message: 'A registration request with this Mobile Number or NID already exists.',
        },
        { status: 400 },
      );
    }

    const uniqueMistriId = await getNextMistriId(db);

    const finalMechanicPayload = {
      mistriId: uniqueMistriId,
      referCode: uniqueMistriId,
      role: 'mistri',
      referredBy: referredBy || null,
      fullName: name,
      phone,
      email: email || '',
      password,
      categories: Array.isArray(categories) ? categories : [],
      services: Array.isArray(services) ? services : [],
      experience: Number(experience) || 0,
      charge: Number(charge) || 100,
      photo,
      faceImageUrl: photo,
      nidNumber,
      nidFrontUrl,
      nidBackUrl,
      address,
      district: district || '',
      thana: thana || '',
      status: 'approved',
      rating: 5.0,
      totalReviews: 0,
      completedTasks: 0,
      isNidVerified: true,
      isFaceScanVerified: true,
      isCitizenCertificateSubmitted: false,
      hasBadReview: false,
      liveLocation: {
        type: 'Point',
        coordinates: [
          Number(liveLocation.coordinates[0]),
          Number(liveLocation.coordinates[1]),
        ],
        address: liveLocation.address || '',
      },
      createdAt: new Date(),
    };

    const result = await mechanicsCollection.insertOne(finalMechanicPayload);

    try {
      await mechanicsCollection.createIndex({ liveLocation: '2dsphere' });
      await mechanicsCollection.createIndex({ mistriId: 1 }, { unique: true });
    } catch (e) {
      // index might already exist
    }

    return NextResponse.json(
      {
        success: true,
        message: `Your registration request has been received. Your generated ID is: ${uniqueMistriId}`,
        mistriId: uniqueMistriId,
        insertedId: result.insertedId,
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Critical Error in Mechanic Registration Route:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error occurred while processing registration.',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
