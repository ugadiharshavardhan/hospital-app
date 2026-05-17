import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import { auth } from '@/lib/auth';

export async function GET(request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const query = {};
    if (session.user.role === 'patient') query.patientId = session.user.id;
    else if (session.user.role === 'doctor') query.doctorId = session.user.id;
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name email avatar phone')
      .populate('doctorId', 'name email avatar')
      .sort({ date: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ data: appointments });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    await connectDB();

    const existing = await Appointment.findOne({
      doctorId: body.doctorId,
      date: new Date(body.date),
      slot: body.slot,
      status: { $in: ['pending', 'confirmed'] },
    });

    if (existing) return NextResponse.json({ error: 'Slot already booked' }, { status: 409 });

    const appointment = await Appointment.create({
      ...body,
      patientId: session.user.id,
      status: 'pending',
    });

    return NextResponse.json({ data: appointment }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
