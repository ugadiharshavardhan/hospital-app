import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Doctor from '@/models/Doctor';
import { AdminDoctorsClient } from '@/components/dashboard/AdminDoctorsClient';

export const metadata = { title: 'Manage Doctors - Admin' };

export default async function AdminDoctorsPage() {
  const session = await auth();
  if (!session || !['admin'].includes(session.user.role)) redirect('/dashboard');

  await connectDB();
  const doctors = await Doctor.find({})
    .populate('userId', 'name email avatar phone isActive')
    .populate('department', 'name')
    .lean();

  return <AdminDoctorsClient doctors={JSON.parse(JSON.stringify(doctors))} />;
}
