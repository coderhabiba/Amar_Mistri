import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;
    const db = await getDB();
    const referrer: any = await db
      .collection('mechanics')
      .findOne({ referCode: code, status: 'approved' });

    if (!referrer) {
      return NextResponse.json(
        {
          success: false,
          message: 'The referral code entered is invalid or inactive.',
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Referral code validated successfully.',
        referrerName: referrer.fullName || referrer.name,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error verifying campaign code.',
      },
      { status: 500 },
    );
  }
}
