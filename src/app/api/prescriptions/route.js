import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Prescription from '@/models/Prescription';
import Appointment from '@/models/Appointment';
import Notification from '@/models/Notification';
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();

    const query = session.user.role === 'doctor'
      ? { doctorId: session.user.id }
      : { patientId: session.user.id };

    const prescriptions = await Prescription.find(query)
      .populate('patientId', 'name email avatar')
      .populate('doctorId', 'name email avatar')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ data: JSON.parse(JSON.stringify(prescriptions)) });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch prescriptions' }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await auth();
  if (!session || session.user.role !== 'doctor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { appointmentId, patientId, diagnosis, medicines, notes, followUpDate } = body;

    if (!patientId || !diagnosis || !medicines?.length) {
      return NextResponse.json({ error: 'Patient, diagnosis and at least one medicine are required' }, { status: 400 });
    }

    await connectDB();

    const prescription = await Prescription.create({
      appointmentId: appointmentId || undefined,
      doctorId: session.user.id,
      patientId,
      diagnosis,
      medicines,
      notes,
      followUpDate: followUpDate ? new Date(followUpDate) : undefined,
      isActive: true,
    });

    // Link prescription to appointment
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, {
        prescription: prescription._id,
        status: 'completed',
        completedAt: new Date(),
      });
    }

    // Notify patient
    await Notification.create({
      recipient: patientId,
      title: 'New Prescription',
      message: `Dr. has issued a prescription for you. Diagnosis: ${diagnosis}`,
      type: 'prescription',
      link: '/patient/prescriptions',
    });

    return NextResponse.json({ success: true, data: JSON.parse(JSON.stringify(prescription)) }, { status: 201 });
  } catch (err) {
    console.error('Create prescription error:', err);
    return NextResponse.json({ error: 'Failed to create prescription' }, { status: 500 });
  }
}
