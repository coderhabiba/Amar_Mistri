import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import { ObjectId } from 'mongodb';

// GET /api/mechanics/nearby?lat=...&lng=...&categoryKey=...&district=...&thana=...
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const categoryKey = searchParams.get('categoryKey') || '';
    const district = searchParams.get('district') || '';
    const thana = searchParams.get('thana') || '';

    const db = await getDB();
    const col = db.collection('mechanics');

    const query: any = { status: { $regex: '^approved\\s*$', $options: 'i' } };
    if (categoryKey && categoryKey !== 'all') {
      query.categories = { $in: [categoryKey] };
    }
    if (district) {
      query.$or = [
        { district: { $regex: district, $options: 'i' } },
        { 'liveLocation.address': { $regex: district, $options: 'i' } },
      ];
    }

    const mechanics: any[] = await col
      .find(query)
      .project({ nidNumber: 0, nidFrontUrl: 0, nidBackUrl: 0, password: 0 })
      .toArray();

    // Haversine distance calculation
    const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const withDistance = mechanics.map((m) => {
      let distance = 9999;
      const coords = m.liveLocation?.coordinates;
      if (lat && lng && coords && coords.length === 2) {
        distance = haversine(lat, lng, coords[1], coords[0]); // [lng, lat] stored as GeoJSON
      }
      return {
        _id: m._id,
        mistriId: m.mistriId,
        fullName: m.fullName || m.name,
        faceImageUrl: m.faceImageUrl || '',
        phone: m.phone || '',
        charge: m.charge || 500,
        categories: m.categories || [],
        services: m.services || [],
        address: m.address || m.liveLocation?.address || '',
        district: m.district || '',
        thana: m.thana || '',
        liveLocation: m.liveLocation || null,
        rating: m.rating || 5.0,
        experience: m.experience || 0,
        distance: Math.round(distance * 10) / 10,
      };
    });

    withDistance.sort((a, b) => a.distance - b.distance);

    return NextResponse.json({ success: true, mechanics: withDistance });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
