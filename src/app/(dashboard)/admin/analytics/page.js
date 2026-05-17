import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import User from '@/models/User';
import { AdminAnalyticsClient } from '@/components/dashboard/AdminAnalyticsClient';

export const metadata = { title: 'Analytics - Admin Dashboard' };

export default async function AdminAnalyticsPage() {
  const session = await auth();
  if (!session || session.user.role !== 'admin') redirect('/dashboard');

  await connectDB();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    totalAppointments, thisMonthAppts, lastMonthAppts,
    completedAppts, cancelledAppts, totalRevenue,
    totalPatients, newPatientsThisMonth, departmentStats
  ] = await Promise.all([
    Appointment.countDocuments(),
    Appointment.countDocuments({ createdAt: { $gte: monthStart } }),
    Appointment.countDocuments({ createdAt: { $gte: lastMonthStart, $lt: monthStart } }),
    Appointment.countDocuments({ status: 'completed' }),
    Appointment.countDocuments({ status: 'cancelled' }),
    Appointment.aggregate([{ $match: { paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]),
    User.countDocuments({ role: 'patient' }),
    User.countDocuments({ role: 'patient', createdAt: { $gte: monthStart } }),
    Appointment.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
  ]);

  const stats = {
    totalAppointments,
    thisMonthAppts,
    lastMonthAppts,
    completedAppts,
    cancelledAppts,
    completionRate: totalAppointments > 0 ? Math.round((completedAppts / totalAppointments) * 100) : 0,
    totalRevenue: totalRevenue[0]?.total || 0,
    totalPatients,
    newPatientsThisMonth,
    departmentStats: departmentStats.map(d => ({ department: d._id || 'Unknown', count: d.count })),
  };

  return <AdminAnalyticsClient stats={JSON.parse(JSON.stringify(stats))} />;
}
