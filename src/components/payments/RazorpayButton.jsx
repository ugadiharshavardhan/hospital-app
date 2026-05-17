'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function RazorpayButton({
  amount,
  appointmentId,
  label = 'Pay Now',
  onSuccess,
  disabled = false,
  className = '',
}) {
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Failed to load payment gateway. Check your connection.');
        return;
      }

      const { data: order } = await axios.post('/api/payments/create-order', {
        amount,
        appointmentId,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'MediCare Hospital',
        description: appointmentId ? 'Appointment Payment' : 'Healthcare Payment',
        image: '/favicon.ico',
        order_id: order.orderId,
        handler: async (response) => {
          try {
            const { data } = await axios.post('/api/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              appointmentId,
            });
            setPaid(true);
            toast.success('Payment successful! Transaction ID: ' + response.razorpay_payment_id);
            onSuccess?.(data);
          } catch {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        prefill: {},
        theme: { color: '#2563EB' },
        modal: {
          ondismiss: () => {
            toast.info('Payment cancelled');
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        toast.error('Payment failed: ' + response.error.description);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Payment initiation failed');
    } finally {
      setLoading(false);
    }
  };

  if (paid) {
    return (
      <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
        <CheckCircle className="w-4 h-4" />
        Payment Successful
      </div>
    );
  }

  return (
    <Button
      onClick={handlePayment}
      disabled={loading || disabled}
      className={`bg-blue-600 hover:bg-blue-700 text-white ${className}`}
    >
      {loading ? (
        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</>
      ) : (
        <><CreditCard className="w-4 h-4 mr-2" /> {label} ₹{amount}</>
      )}
    </Button>
  );
}
