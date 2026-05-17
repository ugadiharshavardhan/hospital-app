import { RegisterForm } from '@/components/auth/RegisterForm';
import Link from 'next/link';
import { Stethoscope, Check } from 'lucide-react';

export const metadata = { title: 'Register - MediCare Hospital' };

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-900 via-teal-800 to-blue-800 flex-col justify-between p-12 relative overflow-hidden">
        <div className="relative">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">MediCare</span>
          </Link>
        </div>
        <div className="relative">
          <h1 className="text-4xl font-bold text-white mb-6">Join Thousands of Satisfied Patients</h1>
          <ul className="space-y-3">
            {[
              'Book appointments with 500+ specialist doctors',
              'Access your medical records anytime',
              'Receive prescription and report reminders',
              'Online video consultations available',
              'Track your health journey',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-teal-100">
                <div className="w-5 h-5 bg-teal-400/30 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-teal-300" />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-teal-300 text-sm">Free to register. No credit card required.</p>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500">Sign up to access all healthcare services</p>
          </div>
          <RegisterForm />
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
