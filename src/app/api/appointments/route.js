import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import Department from '@/models/Department';
import Notification from '@/models/Notification';
import User from '@/models/User';
import { auth } from '@/lib/auth';
import { reassignTokens } from '@/utils/token';

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

    let deptName = '';
    if (body.departmentId) {
      const mongoose = require('mongoose');
      let dept = null;
      if (mongoose.Types.ObjectId.isValid(body.departmentId)) {
        dept = await Department.findById(body.departmentId);
      } else {
        dept = await Department.findOne({ slug: body.departmentId });
      }
      if (dept) {
        deptName = dept.name;
      }
    }

    const appointment = await Appointment.create({
      ...body,
      department: deptName || body.departmentId,
      patientId: session.user.id,
      status: 'pending',
    });

    // Recalculate tokens
    await reassignTokens(body.doctorId, body.date);

    // Fetch doctor name for notification
    const doctor = await User.findById(body.doctorId);
    const dateStr = new Date(body.date).toLocaleDateString();

    // Create notifications
    await Notification.create({
      recipient: session.user.id,
      title: 'Appointment Booked',
      message: `Your appointment with Dr. ${doctor?.name || 'Doctor'} has been booked for ${dateStr} at ${body.slot}.`,
      type: 'appointment',
      link: '/patient/appointments',
    });

    await Notification.create({
      recipient: body.doctorId,
      title: 'New Appointment',
      message: `New appointment booked by ${session.user.name} for ${dateStr} at ${body.slot}.`,
      type: 'appointment',
      link: '/doctor/appointments',
    });

    return NextResponse.json({ data: appointment }, { status: 201 });
  } catch (err) {
    console.error('Create appointment error:', err);
    return NextResponse.json({ error: 'Failed to create appointment' }, { status: 500 });
  }
}
