import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { DashboardBackButton } from '@/components/layout/DashboardBackButton';

export default async function DashboardLayout({ children }) {
  const session = await auth();

  if (!session?.user) redirect('/login');

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar user={session.user} />
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="p-4 lg:p-8">
          <DashboardBackButton />
          {children}
        </div>
      </main>
    </div>
  );
}
