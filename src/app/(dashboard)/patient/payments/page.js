import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Payment from '@/models/Payment';
import Appointment from '@/models/Appointment';
import { PatientPaymentsClient } from '@/components/payments/PatientPaymentsClient';

export const metadata = { title: 'Payments - MediCare Hospital' };

export default async function PatientPaymentsPage({ searchParams }) {
  const session = await auth();
  if (!session || session.user.role !== 'patient') redirect('/dashboard');

  const params = await searchParams;
  const selectedDate = params.date || '';

  await connectDB();

  const paymentQuery = { patientId: session.user.id };
  const appointmentQuery = {
    patientId: session.user.id,
    paymentStatus: 'pending',
    status: { $in: ['confirmed', 'pending'] },
  };

  if (selectedDate) {
    const startOfDay = new Date(`${selectedDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${selectedDate}T23:59:59.999Z`);
    paymentQuery.createdAt = { $gte: startOfDay, $lte: endOfDay };
    appointmentQuery.date = { $gte: startOfDay, $lte: endOfDay };
  }

  const [payments, pendingAppointments] = await Promise.all([
    Payment.find(paymentQuery)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
    Appointment.find(appointmentQuery)
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
