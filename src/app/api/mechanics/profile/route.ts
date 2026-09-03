import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

async function getMechanicByToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  const decoded: any = verifyToken(token);
  if (!decoded) return null;
  const db = await getDB();
  const col = db.collection('mechanics');
  const userIdStr = decoded.userId ? decoded.userId.toString() : '';
  const conditions: any[] = [{ email: decoded.email?.toLowerCase().trim() }];
  if (userIdStr) {
    conditions.push({ _id: userIdStr });
    if (ObjectId.isValid(userIdStr)) conditions.push({ _id: new ObjectId(userIdStr) });
  }
  const mechanic = await col.findOne({ $or: conditions });
  return { mechanic, db, col, decoded };
}

// GET /api/mechanics/profile — full profile
export async function GET(request: NextRequest) {
  try {
    const result = await getMechanicByToken(request);
    if (!result || !result.mechanic) {
      return NextResponse.json({ success: false, message: 'Unauthorized or not found.' }, { status: 401 });
    }
    const m = result.mechanic as any;
    
    // Backward compatibility: Extract district and thana from address if missing
    let parsedDistrict = m.district || '';
    let parsedThana = m.thana || '';
    if ((!parsedDistrict || !parsedThana) && m.address) {
      const parts = m.address.split(',').map((p: string) => p.trim());
      // Expected address format: area, thana, district, division
      if (parts.length >= 3) {
        if (!parsedThana) parsedThana = parts[parts.length - 3] || '';
        if (!parsedDistrict) parsedDistrict = parts[parts.length - 2] || '';
      }
    }

    return NextResponse.json({
      success: true,
      mechanic: {
        _id: m._id,
        mistriId: m.mistriId || 'AM-000',
        fullName: m.fullName || m.name || '',
        phone: m.phone || '',
        email: m.email || '',
        address: m.address || m.liveLocation?.address || '',
        district: parsedDistrict,
        thana: parsedThana,
        certificates: m.certificates || [],
        categories: m.categories || [],
        services: m.services || [],
        charge: m.charge || 500,
        faceImageUrl: m.faceImageUrl || '',
        experience: m.experience || 0,
        status: m.status || 'pending',
        liveLocation: m.liveLocation || null,
        joinedAt: m.createdAt || null,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

// PUT /api/mechanics/profile — update profile fields, categories, photo, live location
export async function PUT(request: NextRequest) {
  try {
    const result = await getMechanicByToken(request);
    if (!result || !result.mechanic) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }
    const { mechanic, col } = result;
    const body = await request.json();
    const {
      fullName, phone, address, district, thana,
      categories, services, charge, faceImageUrl, experience,
      liveLocation, certificates,
    } = body;

    const updateFields: any = {};
    if (fullName !== undefined) updateFields.fullName = fullName;
    if (phone !== undefined) updateFields.phone = phone;
    if (address !== undefined) updateFields.address = address;
    if (district !== undefined) updateFields.district = district;
    if (thana !== undefined) updateFields.thana = thana;
    if (categories !== undefined) updateFields.categories = categories;
    if (services !== undefined) updateFields.services = services;
    if (charge !== undefined) updateFields.charge = Number(charge);
    if (faceImageUrl !== undefined) updateFields.faceImageUrl = faceImageUrl;
    if (experience !== undefined) updateFields.experience = Number(experience);
    if (liveLocation !== undefined) updateFields.liveLocation = liveLocation;
    if (certificates !== undefined) updateFields.certificates = certificates;

    updateFields.updatedAt = new Date();

    await col.updateOne({ _id: mechanic._id }, { $set: updateFields });
    return NextResponse.json({ success: true, message: 'Profile updated successfully.' });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

// POST /api/mechanics/profile — change password
export async function POST(request: NextRequest) {
  try {
    const result = await getMechanicByToken(request);
    if (!result || !result.mechanic) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }
    const { mechanic, col } = result;
    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, message: 'Both current and new password are required.' }, { status: 400 });
    }
    const m = mechanic as any;
    const valid = await bcrypt.compare(currentPassword, m.password || '');
    if (!valid) {
      return NextResponse.json({ success: false, message: 'Current password is incorrect.' }, { status: 400 });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await col.updateOne({ _id: mechanic._id }, { $set: { password: hashed, updatedAt: new Date() } });
    return NextResponse.json({ success: true, message: 'Password changed successfully.' });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
