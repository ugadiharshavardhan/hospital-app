import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata = { title: 'Reset Password - MediCare' };

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const { token, email } = params;

  return (
    <div className="flex items-center justify-center min-h-screen w-full p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
          <p className="text-gray-500">Enter your new password</p>
        </div>
        <ResetPasswordForm token={token} email={email} />
      </div>
    </div>
  );
}
