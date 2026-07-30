import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import { DoctorAppointmentsClient } from '@/components/dashboard/DoctorAppointmentsClient';

export const metadata = { title: 'Doctor Appointments - MediCare' };

export default async function DoctorAppointmentsPage({ searchParams }) {
  const session = await auth();
  if (!session || session.user.role !== 'doctor') redirect('/dashboard');

  const params = await searchParams;
  const selectedDate = params.date || '';

  await connectDB();
  const query = { doctorId: session.user.id };
  if (selectedDate) {
    const startOfDay = new Date(`${selectedDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${selectedDate}T23:59:59.999Z`);
    query.date = { $gte: startOfDay, $lte: endOfDay };
  }

  const appointments = await Appointment.find(query)
    .populate('patientId', 'name avatar email phone')
    .sort({ date: -1 })
    .lean();

  return <DoctorAppointmentsClient appointments={JSON.parse(JSON.stringify(appointments))} />;
}
