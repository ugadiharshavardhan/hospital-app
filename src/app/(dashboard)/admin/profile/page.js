import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { AdminProfileClient } from '@/components/profile/AdminProfileClient';

export const metadata = { title: 'Profile & Settings - MediCare' };

export default async function AdminProfilePage() {
  const session = await auth();
  if (!session || !['admin', 'receptionist'].includes(session.user.role)) redirect('/dashboard');

  await connectDB();
  const user = await User.findById(session.user.id).lean();

  return <AdminProfileClient user={JSON.parse(JSON.stringify(user))} />;
}
