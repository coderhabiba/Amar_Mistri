import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { identifier, password, role } = body;

    if (!identifier || !password || !role) {
      return NextResponse.json(
        {
          success: false,
          message: 'All fields (identifier, password, role) are required!',
        },
        { status: 400 },
      );
    }

    const db = await getDB();

    // ── 1. FIXED ADMIN VALIDATION BLOCK ──
    if (role === 'admin') {
      const FIXED_ADMIN_EMAIL = 'info.amarmistri@gmail.com';
      const FIXED_ADMIN_PASS = 'admin2026';

      if (
        identifier.toLowerCase().trim() === FIXED_ADMIN_EMAIL &&
        password === FIXED_ADMIN_PASS
      ) {
        const token = signToken(
          { role: 'admin', email: FIXED_ADMIN_EMAIL },
          '30d',
        );

        return NextResponse.json(
          {
            success: true,
            message: 'Admin login successful!',
            token: token,
            mistri: {
              name: 'System Admin',
              email: FIXED_ADMIN_EMAIL,
              role: 'admin',
            },
          },
          { status: 200 },
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid Admin credentials!',
          },
          { status: 401 },
        );
      }
    }

    const targetCollection = role === 'mistri' ? 'mechanics' : 'users';

    // Find mistri/user by Email, Phone, OR MistriId/ReferCode
    const identifierUpper = identifier.trim().toUpperCase();
    const mistriData: any = await db.collection(targetCollection).findOne({
      $or: [
        { email: identifier.toLowerCase().trim() },
        { phone: identifier.trim() },
        { mistriId: identifierUpper },
        { referCode: identifierUpper },
      ],
    });

    if (!mistriData) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials or role!',
        },
        { status: 401 },
      );
    }

    const mistriRole = mistriData.role || role;

    // Verify Password
    let isPasswordMatch = false;
    const isHashed =
      mistriData.password &&
      (mistriData.password.startsWith('$2a$') ||
        mistriData.password.startsWith('$2b$'));

    if (isHashed) {
      isPasswordMatch = await bcrypt.compare(password, mistriData.password);
    } else {
      isPasswordMatch = mistriData.password === password;

      if (isPasswordMatch) {
        try {
          const hashedPassword = await bcrypt.hash(password, 10);
          await db
            .collection(targetCollection)
            .updateOne(
              { _id: mistriData._id },
              { $set: { password: hashedPassword } },
            );
        } catch (migrationError) {
          console.error('Password migration failed:', migrationError);
        }
      }
    }

    if (!isPasswordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid credentials or role!',
        },
        { status: 401 },
      );
    }

    const token = signToken(
      { userId: mistriData._id, role: mistriRole, email: mistriData.email },
      '30d',
    );

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful!',
        token: token,
        mistri: {
          _id: mistriData._id,
          id: mistriData._id,
          fullName: mistriData.fullName || mistriData.name || 'Provider',
          name: mistriData.name || mistriData.fullName,
          email: mistriData.email,
          phone: mistriData.phone,
          address: mistriData.address || '',
          charge: mistriData.charge || '500',
          referCode: mistriData.referCode || '',
          role: mistriRole,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Secure Hybrid Auth Engine Failure:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Internal server error.',
      },
      { status: 500 },
    );
  }
}
