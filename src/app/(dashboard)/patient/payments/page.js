import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Payment from '@/models/Payment';
import Appointment from '@/models/Appointment';
import { PatientPaymentsClient } from '@/components/payments/PatientPaymentsClient';

export const metadata = { title: 'Payments - MediCare Hospital' };

export default async function PatientPaymentsPage() {
  const session = await auth();
  if (!session || session.user.role !== 'patient') redirect('/dashboard');

  await connectDB();

  const [payments, pendingAppointments] = await Promise.all([
    Payment.find({ patientId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
    Appointment.find({
      patientId: session.user.id,
      paymentStatus: 'pending',
      status: { $in: ['confirmed', 'pending'] },
    })
      .populate('doctorId', 'name')
      .sort({ date: -1 })
      .lean(),
  ]);

  return (
    <PatientPaymentsClient
      payments={JSON.parse(JSON.stringify(payments))}
      pendingAppointments={JSON.parse(JSON.stringify(pendingAppointments))}
    />
  );
}
