import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { email, otp, newPassword, role } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: 'সবগুলো ফিল্ড পূরণ করা বাধ্যতামূলক।',
        },
        { status: 400 },
      );
    }

    const db = await getDB();
    const collectionName = role === 'mistri' ? 'mechanics' : 'users';
    const user: any = await db.collection(collectionName).findOne({ email: email.toLowerCase().trim() });

    if (!user || user.resetPasswordToken !== otp) {
      return NextResponse.json(
        {
          success: false,
          message: 'অননুমোদিত রিকোয়েস্ট বা ওটিপি সঠিক নয়।',
        },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.collection(collectionName).updateOne(
      { email: email.toLowerCase().trim() },
      {
        $set: { password: hashedPassword },
        $unset: { resetPasswordToken: '', resetPasswordExpires: '' },
      },
    );

    return NextResponse.json(
      {
        success: true,
        message: 'আপনার পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে। এখন লগইন করুন।',
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Reset Password Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'সার্ভারে সমস্যা হয়েছে।',
      },
      { status: 500 },
    );
  }
}
