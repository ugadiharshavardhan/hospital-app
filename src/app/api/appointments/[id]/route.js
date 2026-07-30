import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import Notification from '@/models/Notification';
import { auth } from '@/lib/auth';
import { reassignTokens } from '@/utils/token';

export async function PATCH(request, context) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await context.params;

  try {
    const body = await request.json();
    await connectDB();

    const oldAppt = await Appointment.findById(id);
    if (!oldAppt) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const isRescheduling = body.date || body.slot;

    if (isRescheduling) {
      const newDate = body.date ? new Date(body.date) : oldAppt.date;
      const newSlot = body.slot || oldAppt.slot;

      // Validate slot availability
      const existing = await Appointment.findOne({
        doctorId: oldAppt.doctorId,
        date: newDate,
        slot: newSlot,
        status: { $in: ['pending', 'confirmed'] },
        _id: { $ne: id },
      });

      if (existing) {
        return NextResponse.json({ error: 'Selected time slot is already booked for this doctor.' }, { status: 409 });
      }
    }

    const appointment = await Appointment.findByIdAndUpdate(id, body, { new: true });

    if (isRescheduling) {
      // Trigger token reassignments on old and new dates
      await reassignTokens(oldAppt.doctorId, oldAppt.date);
      if (body.date && new Date(body.date).toDateString() !== new Date(oldAppt.date).toDateString()) {
        await reassignTokens(oldAppt.doctorId, body.date);
      }

      // Notify patient and doctor
      const dateStr = new Date(appointment.date).toLocaleDateString();
      await Notification.create({
        recipient: appointment.patientId,
        title: 'Appointment Rescheduled',
        message: `Your appointment has been rescheduled to ${dateStr} at ${appointment.slot}.`,
        type: 'appointment',
        link: '/patient/appointments',
      });

      await Notification.create({
        recipient: appointment.doctorId,
        title: 'Appointment Rescheduled',
        message: `An appointment has been rescheduled to ${dateStr} at ${appointment.slot}.`,
        type: 'appointment',
        link: '/doctor/appointments',
      });
    }

    return NextResponse.json({ data: appointment });
  } catch (err) {
    console.error('Update appointment error:', err);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const hard = searchParams.get('hard') === 'true';

  try {
    await connectDB();
    const appointment = await Appointment.findById(id);
    if (!appointment) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    if (hard) {
      await Appointment.findByIdAndDelete(id);
    } else {
      await Appointment.findByIdAndUpdate(id, { status: 'cancelled', cancelledBy: session.user.role });
    }

    // Trigger token reassignment
    await reassignTokens(appointment.doctorId, appointment.date);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Cancellation failed' }, { status: 500 });
  }
}
