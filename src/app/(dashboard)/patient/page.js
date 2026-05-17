import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import { PatientDashboardClient } from '@/components/dashboard/PatientDashboardClient';

export const metadata = { title: 'Patient Dashboard - MediCare' };

export default async function PatientDashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== 'patient') redirect('/dashboard');

  await connectDB();
  const appointments = await Appointment.find({ patientId: session.user.id })
    .populate('doctorId', 'name avatar')
    .sort({ date: -1 })
    .limit(10)
    .lean();

  const stats = {
    total: await Appointment.countDocuments({ patientId: session.user.id }),
    upcoming: await Appointment.countDocuments({ patientId: session.user.id, status: 'confirmed', date: { $gte: new Date() } }),
    completed: await Appointment.countDocuments({ patientId: session.user.id, status: 'completed' }),
    pending: await Appointment.countDocuments({ patientId: session.user.id, status: 'pending' }),
  };

  return <PatientDashboardClient user={session.user} appointments={JSON.parse(JSON.stringify(appointments))} stats={stats} />;
}
