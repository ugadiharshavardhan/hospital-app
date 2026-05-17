import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Doctor from '@/models/Doctor';

export async function GET(request, context) {
  const { id } = await context.params;
  try {
    await connectDB();
    const doctor = await Doctor.findOne({ userId: id })
      .populate('userId', 'name email avatar phone')
      .populate('department', 'name slug')
      .lean();
    if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    return NextResponse.json({ data: doctor });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch doctor' }, { status: 500 });
  }
}
