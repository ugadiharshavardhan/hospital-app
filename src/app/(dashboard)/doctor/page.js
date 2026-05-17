import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import { DoctorDashboardClient } from '@/components/dashboard/DoctorDashboardClient';

export const metadata = { title: 'Doctor Dashboard - MediCare' };

export default async function DoctorDashboardPage() {
  const session = await auth();
  if (!session || session.user.role !== 'doctor') redirect('/dashboard');

  await connectDB();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const appointments = await Appointment.find({ doctorId: session.user.id })
    .populate('patientId', 'name avatar email phone')
    .sort({ date: -1 })
    .limit(20)
    .lean();

  const stats = {
    todayTotal: await Appointment.countDocuments({ doctorId: session.user.id, date: { $gte: today, $lt: tomorrow } }),
    todayPending: await Appointment.countDocuments({ doctorId: session.user.id, date: { $gte: today, $lt: tomorrow }, status: 'pending' }),
    totalPatients: await Appointment.distinct('patientId', { doctorId: session.user.id }).then(r => r.length),
    completedTotal: await Appointment.countDocuments({ doctorId: session.user.id, status: 'completed' }),
  };

  return <DoctorDashboardClient user={session.user} appointments={JSON.parse(JSON.stringify(appointments))} stats={stats} />;
}
