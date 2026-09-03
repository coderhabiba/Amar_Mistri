import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { email, otp, role } = await request.json();
    if (!email || !otp) {
      return NextResponse.json(
        {
          success: false,
          message: 'ইমেইল এবং ওটিপি দুটোই দেওয়া আবশ্যক।',
        },
        { status: 400 },
      );
    }

    const db = await getDB();
    const collectionName = role === 'mistri' ? 'mechanics' : 'users';
    const user: any = await db.collection(collectionName).findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'ইউজার খুঁজে পাওয়া যায়নি।',
        },
        { status: 404 },
      );
    }

    const currentTime = new Date();

    if (user.resetPasswordToken !== otp) {
      return NextResponse.json(
        {
          success: false,
          message: 'ওটিপি কোডটি সঠিক নয়।',
        },
        { status: 400 },
      );
    }

    if (currentTime > new Date(user.resetPasswordExpires)) {
      return NextResponse.json(
        {
          success: false,
          message: 'ওটিপি কোডটির মেয়াদ শেষ হয়ে গেছে। আবার চেষ্টা করুন।',
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'ওটিপি সফলভাবে ভেরিফাই হয়েছে। এখন নতুন পাসওয়ার্ড দিন।',
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Verify OTP Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'সার্ভারে সমস্যা হয়েছে।',
      },
      { status: 500 },
    );
  }
}
