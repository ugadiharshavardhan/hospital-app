'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DashboardBackButton() {
  const pathname = usePathname();
  const router = useRouter();

  // Root dashboard paths where we don't show the back button
  const rootPaths = ['/admin', '/doctor', '/patient'];
  
  if (rootPaths.includes(pathname)) {
    return null;
  }

  return (
    <div className="mb-4 -mt-2 flex items-center">
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-500 hover:text-gray-950 hover:bg-gray-200/50 -ml-2 gap-1.5 font-medium transition-all"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
    </div>
  );
}
