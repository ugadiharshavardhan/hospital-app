import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import { PatientAppointmentsClient } from '@/components/dashboard/PatientAppointmentsClient';

export const metadata = { title: 'My Appointments - MediCare' };

export default async function PatientAppointmentsPage({ searchParams }) {
  const session = await auth();
  if (!session || session.user.role !== 'patient') redirect('/dashboard');

  const params = await searchParams;
  const selectedDate = params.date || '';

  await connectDB();
  const query = { patientId: session.user.id };
  if (selectedDate) {
    const startOfDay = new Date(`${selectedDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${selectedDate}T23:59:59.999Z`);
    query.date = { $gte: startOfDay, $lte: endOfDay };
  }

  const appointments = await Appointment.find(query)
    .populate('doctorId', 'name avatar email')
    .sort({ date: -1 })
    .lean();

  return <PatientAppointmentsClient appointments={JSON.parse(JSON.stringify(appointments))} />;
}
