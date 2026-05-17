import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Appointment from '@/models/Appointment';
import Doctor from '@/models/Doctor';
import Department from '@/models/Department';
import { AdminDashboardClient } from '@/components/dashboard/AdminDashboardClient';

export const metadata = { title: 'Admin Dashboard - MediCare' };

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session || !['admin', 'receptionist'].includes(session.user.role)) redirect('/dashboard');

  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [totalPatients, totalDoctors, totalDepts, todayAppts, monthAppts, pendingAppts, recentAppts] = await Promise.all([
    User.countDocuments({ role: 'patient' }),
    Doctor.countDocuments({ isActive: true }),
    Department.countDocuments({ isActive: true }),
    Appointment.countDocuments({ date: { $gte: today, $lt: tomorrow } }),
    Appointment.countDocuments({ createdAt: { $gte: monthStart } }),
    Appointment.countDocuments({ status: 'pending' }),
    Appointment.find({}).populate('patientId', 'name').populate('doctorId', 'name').sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  return (
    <AdminDashboardClient
      stats={{ totalPatients, totalDoctors, totalDepts, todayAppts, monthAppts, pendingAppts }}
      recentAppointments={JSON.parse(JSON.stringify(recentAppts))}
    />
  );
}
