import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mistriId = searchParams.get('mistriId');
    const db = await getDB();

    const query: any = {};
    if (mistriId) {
      if (ObjectId.isValid(mistriId)) {
        query.mistriId = new ObjectId(mistriId);
      } else {
        return NextResponse.json(
          { message: 'Invalid mistriId format' },
          { status: 400 },
        );
      }
    }

    const reviews = await db
      .collection('reviews')
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(reviews, { status: 200 });
  } catch (error: any) {
    console.error('Review fetch error:', error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const db = await getDB();
    const reviewsCollection = db.collection('reviews');
    const mechanicsCollection = db.collection('mechanics');

    const {
      mistriId,
      rating,
      comment,
      reviewerName,
      reviewerPhone,
      reviewerEmail,
      reviewerPhoto,
    } = body;

    if (!mistriId || !rating || !comment) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: mistriId, rating, or comment.',
        },
        { status: 400 },
      );
    }
    if (!ObjectId.isValid(mistriId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid mistriId format.',
        },
        { status: 400 },
      );
    }

    const newReview = {
      mistriId: new ObjectId(mistriId),
      reviewerName: reviewerName ? reviewerName.trim() : null,
      reviewerPhone: reviewerPhone ? reviewerPhone.trim() : null,
      reviewerEmail: reviewerEmail ? reviewerEmail.trim() : null,
      reviewerPhoto: reviewerPhoto ? reviewerPhoto.trim() : null,
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date(),
    };

    const reviewResult = await reviewsCollection.insertOne(newReview);

    const allReviews = await reviewsCollection
      .find({ mistriId: new ObjectId(mistriId) })
      .toArray();
    const totalReviews = allReviews.length;
    const avgRating =
      totalReviews > 0
        ? allReviews.reduce((sum, r: any) => sum + r.rating, 0) / totalReviews
        : 5.0;

    await mechanicsCollection.updateOne(
      { _id: new ObjectId(mistriId) },
      { $set: { totalReviews, rating: Number(avgRating.toFixed(1)) } },
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Review submitted successfully',
        data: { _id: reviewResult.insertedId, ...newReview },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Error in createReview:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Server Error. Could not submit review.',
      },
      { status: 500 },
    );
  }
}
