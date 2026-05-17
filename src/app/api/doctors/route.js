import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Doctor from '@/models/Doctor';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const query = { isActive: true };
    if (department) query.departmentName = { $regex: department, $options: 'i' };

    let doctors = await Doctor.find(query)
      .populate('userId', 'name email avatar phone')
      .populate('department', 'name slug')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    if (search) {
      doctors = doctors.filter(d =>
        d.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization?.toLowerCase().includes(search.toLowerCase()) ||
        d.departmentName?.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = await Doctor.countDocuments(query);
    return NextResponse.json({ data: doctors, total, page, limit });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  }
}
