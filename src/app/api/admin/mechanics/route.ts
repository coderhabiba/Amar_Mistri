import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// GET /api/admin/mechanics — returns ALL mechanics for admin (all statuses)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }
    const decoded: any = verifyToken(authHeader.split(' ')[1]);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required.' }, { status: 403 });
    }

    const db = await getDB();
    const col = db.collection('mechanics');
    const mechanics = await col
      .find({})
      .project({ nidNumber: 0, nidFrontUrl: 0, nidBackUrl: 0, password: 0 })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      mechanics: mechanics.map((m: any) => ({
        _id: m._id,
        mistriId: m.mistriId,
        fullName: m.fullName || m.name,
        email: m.email,
        phone: m.phone,
        faceImageUrl: m.faceImageUrl || '',
        categories: m.categories || [],
        services: m.services || [],
        charge: m.charge || 500,
        address: m.address || m.liveLocation?.address || '',
        district: m.district || '',
        thana: m.thana || '',
        experience: m.experience || 0,
        status: m.status || 'pending',
        liveLocation: m.liveLocation || null,
        createdAt: m.createdAt || null,
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
