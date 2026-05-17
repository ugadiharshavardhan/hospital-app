'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    toast.success('Subscribed successfully! Stay healthy.');
    setEmail('');
    setLoading(false);
  };

  return (
    <section className="py-20 bg-blue-600 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-60 h-60 bg-white rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Bell className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-3">Stay Informed, Stay Healthy</h2>
          <p className="text-blue-200 mb-8">
            Subscribe to receive health tips, appointment reminders, and exclusive offers from
            MediCare.
          </p>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <div className="flex-1 relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="pl-9 bg-white border-0 focus-visible:ring-2 focus-visible:ring-white"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shrink-0"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
          <p className="text-blue-200 text-xs mt-4">
            No spam, ever. Unsubscribe anytime. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
