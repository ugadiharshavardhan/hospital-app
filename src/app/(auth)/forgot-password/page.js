import Link from 'next/link';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata = { title: 'Forgot Password - MediCare' };

export default function ForgotPasswordPage() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔐</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
          <p className="text-gray-500">Enter your email and we&apos;ll send you a reset link</p>
        </div>
        <ForgotPasswordForm />
        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/login" className="text-blue-600 hover:underline">← Back to login</Link>
        </p>
      </div>
    </div>
  );
}
