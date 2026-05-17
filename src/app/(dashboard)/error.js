'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function DashboardError({ error, reset }) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6 pt-14 lg:pt-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 max-w-md w-full text-center">
        <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 mb-2">Dashboard Error</h2>
        <p className="text-gray-500 text-sm mb-1">{error?.message || 'Failed to load dashboard data.'}</p>
        <p className="text-gray-400 text-xs mb-6">
          Check that MongoDB is connected and the database has been seeded.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="outline" size="sm" className="flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </Button>
          <Button
            onClick={() => signOut({ callbackUrl: '/login' })}
            variant="outline"
            size="sm"
            className="text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
