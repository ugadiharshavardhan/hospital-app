import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import { DoctorAppointmentsClient } from '@/components/dashboard/DoctorAppointmentsClient';

export const metadata = { title: 'Doctor Appointments - MediCare' };

export default async function DoctorAppointmentsPage() {
  const session = await auth();
  if (!session || session.user.role !== 'doctor') redirect('/dashboard');

  await connectDB();
  const appointments = await Appointment.find({ doctorId: session.user.id })
    .populate('patientId', 'name avatar email phone')
    .sort({ date: -1 })
    .lean();

  return <DoctorAppointmentsClient appointments={JSON.parse(JSON.stringify(appointments))} />;
}
