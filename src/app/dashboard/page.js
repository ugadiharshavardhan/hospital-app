import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

// Server component — reads session on server, redirects to correct role panel.
// LoginForm always sends users here after sign-in (window.location.href)
// so the session cookie is guaranteed to be available.
export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) redirect('/login');

  const routes = {
    patient: '/patient',
    doctor: '/doctor',
    admin: '/admin',
    receptionist: '/admin',
  };

  redirect(routes[session.user.role] || '/patient');
}
