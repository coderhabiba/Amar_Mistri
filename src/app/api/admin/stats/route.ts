import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { verifyToken } from '@/lib/auth';

// GET /api/admin/stats — admin statistics
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const decoded: any = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Admin access required.' }, { status: 403 });
    }

    const db = await getDB();
    const mechanicsCol = db.collection('mechanics');
    const bookingsCol = db.collection('bookings');

    const [totalMistri, approvedMistri, pendingMistri, rejectedMistri, totalBookings, completedBookings] = await Promise.all([
      mechanicsCol.countDocuments(),
      mechanicsCol.countDocuments({ status: { $regex: '^approved\\s*$', $options: 'i' } }),
      mechanicsCol.countDocuments({ status: { $regex: '^pending\\s*$', $options: 'i' } }),
      mechanicsCol.countDocuments({ status: { $regex: '^rejected\\s*$', $options: 'i' } }),
      bookingsCol.countDocuments(),
      bookingsCol.countDocuments({ status: 'completed' }),
    ]);

    const totalRevenue = await bookingsCol
      .aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ])
      .toArray();

    return NextResponse.json({
      success: true,
      stats: {
        totalMistri,
        approvedMistri,
        pendingMistri,
        rejectedMistri,
        totalBookings,
        completedBookings,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
