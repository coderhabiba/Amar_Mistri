import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { email, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json(
        {
          success: false,
          message: 'ইমেইল অ্যাড্রেস এবং রোল দেওয়া আবশ্যক।',
        },
        { status: 400 },
      );
    }

    const db = await getDB();
    const collectionName = role === 'mistri' ? 'mechanics' : 'users';
    const user: any = await db.collection(collectionName).findOne({ email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'এই ইমেইল দিয়ে কোনো অ্যাকাউন্ট খুঁজে পাওয়া যায়নি।',
        },
        { status: 404 },
      );
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await db.collection(collectionName).updateOne(
      { email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } },
      {
        $set: {
          resetPasswordToken: otpCode,
          resetPasswordExpires: otpExpires,
        },
      },
    );

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'info.amarmistri@gmail.com',
        pass: process.env.EMAIL_PASS || 'yjnrdzisdhzuxkfq',
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'info.amarmistri@gmail.com',
      to: email,
      subject: 'পাসওয়ার্ড রিসেট ওটিপি (Password Reset OTP)',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
          <h2 style="color: #333;">পাসওয়ার্ড রিসেট রিকোয়েস্ট</h2>
          <p>আপনার অ্যাকাউন্ট থেকে পাসওয়ার্ড রিসেটের জন্য আবেদন করা হয়েছে। নিচে দেওয়া ওটিপি (OTP) কোডটি ব্যবহার করুন। কোডটির মেয়াদ ১০ মিনিট থাকবে।</p>
          <div style="background-color: #fff; padding: 15px; border-left: 4px solid #f59e0b; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 15px 0;">
            ${otpCode}
          </div>
          <p>যদি আপনি এই রিকোয়েস্ট না করে থাকেন, তবে ইমেইলটি ইগনোর করুন।</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        success: true,
        message: 'আপনার ইমেইলে একটি ৬ ডিজিটের ওটিপি কোড পাঠানো হয়েছে।',
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Forgot Password Server Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'সার্ভারে কোনো একটি সমস্যা হয়েছে।',
        error: error.message,
      },
      { status: 500 },
    );
  }
}
