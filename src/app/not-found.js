import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Stethoscope } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Stethoscope className="w-10 h-10 text-blue-600" />
        </div>
        <h1 className="text-7xl font-bold text-gray-200 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Page Not Found</h2>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist. It may have been moved or deleted.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/appointments/book">Book Appointment</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
