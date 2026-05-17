'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@/schemas/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { forgotPassword } from '@/actions/auth';

export function ForgotPasswordForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const form = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.set('email', values.email);
    const result = await forgotPassword(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      setSent(true);
      toast.success(result.message);
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="text-center bg-green-50 border border-green-200 rounded-2xl p-8">
        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="font-semibold text-gray-900 mb-2">Email Sent!</h3>
        <p className="text-gray-500 text-sm">Check your inbox for the password reset link. It expires in 1 hour.</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
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
        <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Send Reset Link
        </Button>
      </form>
    </Form>
  );
}
