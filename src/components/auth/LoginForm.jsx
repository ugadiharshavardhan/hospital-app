'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { loginSchema } from '@/schemas/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Eye, EyeOff, Loader2, Mail, Lock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const ERROR_MESSAGES = {
  Configuration:    'Server configuration error. Check that NEXTAUTH_URL and AUTH_SECRET are set correctly in your environment.',
  AccessDenied:     'Access denied. Your account may be inactive.',
  Verification:     'Email not verified. Check your inbox.',
  CredentialsSignin:'Invalid email or password.',
  Default:          'An unexpected error occurred. Please try again.',
};

const DEMO_ACCOUNTS = [
  { label: 'Admin',   email: 'admin@medicare.com',      password: 'Password123', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { label: 'Doctor',  email: 'dr.rajesh@medicare.com',  password: 'Password123', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { label: 'Patient', email: 'patient@medicare.com',    password: 'Password123', color: 'bg-green-50 text-green-700 border-green-200' },
];

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(null);
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const doLogin = async (email, password, demoLabel = null) => {
    setLoading(true);
    if (demoLabel) setLoadingDemo(demoLabel);
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (!result) {
        toast.error('No response from server. Please try again.');
        return;
      }

      if (result.error || !result.ok) {
        if (result.error === 'CredentialsSignin') {
          toast.error('Invalid email or password. Make sure you have seeded the database.');
        } else {
          toast.error('Login failed: ' + (result.error || 'Unknown error'));
        }
        return;
      }

      // SUCCESS — use full-page navigation so the session cookie is
      // guaranteed to be read server-side at /dashboard
      toast.success('Login successful! Redirecting...');
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Something went wrong. Check the console for details.');
    } finally {
      setLoading(false);
      setLoadingDemo(null);
    }
  };

  const onSubmit = (values) => doLogin(values.email, values.password);

  // One-click demo login: fill AND immediately submit
  const loginAsDemo = async (demo) => {
    form.setValue('email', demo.email);
    form.setValue('password', demo.password);
    await doLogin(demo.email, demo.password, demo.label);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* URL error banner (e.g. ?error=Configuration after redirect) */}
        {urlError && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700">Login Error: {urlError}</p>
              <p className="text-xs text-red-500 mt-0.5">
                {ERROR_MESSAGES[urlError] || ERROR_MESSAGES.Default}
              </p>
              {urlError === 'Configuration' && (
                <p className="text-xs text-red-400 mt-1">
                  Check the server console for the real error (often a MongoDB Atlas IP whitelist issue).
                </p>
              )}
            </div>
          </div>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Email Address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input {...field} type="email" placeholder="you@example.com" className="pl-9" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="text-gray-700">Password</FormLabel>
                <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    {...field}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className="pl-9 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-white">
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</> : 'Sign In'}
        </Button>

        {/* One-click demo accounts */}
        <div className="space-y-2 pt-1">
          <p className="text-center text-xs text-gray-400">
            — Quick login with demo accounts —
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_ACCOUNTS.map((demo) => (
              <button
                key={demo.label}
                type="button"
                disabled={loading}
                onClick={() => loginAsDemo(demo)}
                className={`text-xs border rounded-lg py-2 px-1 font-medium transition-all hover:opacity-80 disabled:opacity-40 ${demo.color}`}
              >
                {loadingDemo === demo.label ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : demo.label}
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400">
            Password: <span className="font-mono font-medium text-gray-600">Password123</span>
          </p>
        </div>

        {/* Seed reminder */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
          <p className="font-semibold mb-0.5">First time? Set up the database first:</p>
          <button
            type="button"
            onClick={async () => {
              toast.loading('Seeding database...', { id: 'seed' });
              try {
                const res = await fetch('/api/seed', { method: 'POST' });
                const data = await res.json();
                if (data.success) {
                  toast.success('Database ready! Use demo buttons above to log in.', { id: 'seed', duration: 5000 });
                } else {
                  toast.error(data.error || 'Seed failed', { id: 'seed' });
                }
              } catch {
                toast.error('Seed request failed', { id: 'seed' });
              }
            }}
            className="underline font-medium hover:text-amber-900 mt-0.5 block"
          >
            Click here to seed demo data →
          </button>
        </div>
      </form>
    </Form>
  );
}
