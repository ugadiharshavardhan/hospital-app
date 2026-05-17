import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { AdminProfileClient } from '@/components/profile/AdminProfileClient';

export const metadata = { title: 'Settings - Admin' };

// Settings reuses the admin profile page
export default async function AdminSettingsPage() {
  const session = await auth();
  if (!session || !['admin', 'receptionist'].includes(session.user.role)) redirect('/dashboard');

  await connectDB();
  const user = await User.findById(session.user.id).lean();

  return <AdminProfileClient user={JSON.parse(JSON.stringify(user))} />;
}
