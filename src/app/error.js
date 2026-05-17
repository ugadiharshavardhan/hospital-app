'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('App error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
        <p className="text-gray-500 text-sm mb-2">{error?.message || 'An unexpected error occurred.'}</p>
        <p className="text-gray-400 text-xs mb-6">
          This is often a database connection issue. Make sure your MongoDB URI is correct and the database is accessible.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Try Again
          </Button>
          <Button onClick={() => window.location.href = '/'} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
            <Home className="w-4 h-4" /> Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
