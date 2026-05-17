import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import { DoctorAppointmentsClient } from '@/components/dashboard/DoctorAppointmentsClient';

export const metadata = { title: 'All Appointments - Admin' };

export default async function AdminAppointmentsPage() {
  const session = await auth();
  if (!session || !['admin', 'receptionist'].includes(session.user.role)) redirect('/dashboard');

  await connectDB();
  const appointments = await Appointment.find({})
    .populate('patientId', 'name email avatar')
    .populate('doctorId', 'name avatar')
    .sort({ date: -1 })
    .limit(100)
    .lean();

  return <DoctorAppointmentsClient appointments={JSON.parse(JSON.stringify(appointments))} />;
}
