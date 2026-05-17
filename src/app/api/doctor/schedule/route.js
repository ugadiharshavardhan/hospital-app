import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Doctor from '@/models/Doctor';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session || session.user.role !== 'doctor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const doctor = await Doctor.findOne({ userId: session.user.id }).lean();
    if (!doctor) return NextResponse.json({ error: 'Doctor profile not found' }, { status: 404 });
    return NextResponse.json({ data: JSON.parse(JSON.stringify(doctor.availability || [])) });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
  }
}

export async function PUT(request) {
  const session = await auth();
  if (!session || session.user.role !== 'doctor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { availability } = await request.json();
    await connectDB();

    await Doctor.findOneAndUpdate(
      { userId: session.user.id },
      { $set: { availability } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: 'Schedule updated successfully' });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update schedule' }, { status: 500 });
  }
}
