import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import { PatientAppointmentsClient } from '@/components/dashboard/PatientAppointmentsClient';

export const metadata = { title: 'My Appointments - MediCare' };

export default async function PatientAppointmentsPage() {
  const session = await auth();
  if (!session || session.user.role !== 'patient') redirect('/dashboard');

  await connectDB();
  const appointments = await Appointment.find({ patientId: session.user.id })
    .populate('doctorId', 'name avatar email')
    .sort({ date: -1 })
    .lean();

  return <PatientAppointmentsClient appointments={JSON.parse(JSON.stringify(appointments))} />;
}
