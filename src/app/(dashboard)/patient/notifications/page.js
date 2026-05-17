import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Notification from '@/models/Notification';
import { NotificationsClient } from '@/components/dashboard/NotificationsClient';

export const metadata = { title: 'Notifications - MediCare' };

export default async function PatientNotificationsPage() {
  const session = await auth();
  if (!session || session.user.role !== 'patient') redirect('/dashboard');

  await connectDB();
  const notifications = await Notification.find({ recipient: session.user.id })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return <NotificationsClient notifications={JSON.parse(JSON.stringify(notifications))} />;
}
