import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Notification from '@/models/Notification';
import { NotificationsClient } from '@/components/dashboard/NotificationsClient';

export const metadata = { title: 'Notifications - Admin' };

export default async function AdminNotificationsPage() {
  const session = await auth();
  if (!session || !['admin', 'receptionist'].includes(session.user.role)) redirect('/dashboard');

  await connectDB();
  const notifications = await Notification.find({ recipient: session.user.id })
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return <NotificationsClient notifications={JSON.parse(JSON.stringify(notifications))} />;
}
