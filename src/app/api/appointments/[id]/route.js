import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import { auth } from '@/lib/auth';

export async function PATCH(request, context) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await context.params;

  try {
    const body = await request.json();
    await connectDB();
    const appointment = await Appointment.findByIdAndUpdate(id, body, { new: true });
    if (!appointment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ data: appointment });
  } catch (err) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(request, context) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await context.params;

  try {
    await connectDB();
    await Appointment.findByIdAndUpdate(id, { status: 'cancelled', cancelledBy: session.user.role });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Cancellation failed' }, { status: 500 });
  }
}
