import { Suspense } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';
import { Stethoscope, Loader2 } from 'lucide-react';

export const metadata = { title: 'Login - MediCare Hospital' };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
        </div>
        <div className="relative">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">MediCare</span>
          </Link>
        </div>
        <div className="relative">
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            World-Class Healthcare at Your Fingertips
          </h1>
          <p className="text-blue-200 text-lg mb-8">
            Book appointments, consult doctors online, access medical records — all in one secure portal.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { n: '500+', l: 'Expert Doctors' },
              { n: '50K+', l: 'Happy Patients' },
              { n: '25+', l: 'Departments' },
              { n: '24/7', l: 'Emergency Care' },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 rounded-xl p-4">
                <p className="text-2xl font-bold text-white">{s.n}</p>
                <p className="text-blue-200 text-sm">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-blue-300 text-sm">© 2025 MediCare Hospital. All rights reserved.</p>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold">MediCare</span>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500">Sign in to your patient portal</p>
          </div>
          <Suspense fallback={<div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-blue-600" /></div>}>
            <LoginForm />
          </Suspense>
          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
