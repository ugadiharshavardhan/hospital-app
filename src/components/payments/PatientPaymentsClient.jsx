'use client';

import { motion } from 'framer-motion';
import { RazorpayButton } from './RazorpayButton';
import { Badge } from '@/components/ui/badge';
import { CreditCard, CheckCircle, Clock, XCircle, Calendar, Receipt } from 'lucide-react';
import { formatShortDate } from '@/utils/formatters';

const statusConfig = {
  success: { label: 'Paid', icon: CheckCircle, cls: 'bg-green-100 text-green-700' },
  pending: { label: 'Pending', icon: Clock, cls: 'bg-yellow-100 text-yellow-700' },
  failed: { label: 'Failed', icon: XCircle, cls: 'bg-red-100 text-red-700' },
  refunded: { label: 'Refunded', icon: Receipt, cls: 'bg-gray-100 text-gray-600' },
};

export function PatientPaymentsClient({ payments, pendingAppointments }) {
  const totalPaid = payments
    .filter((p) => p.status === 'success')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <p className="text-gray-500 text-sm">Manage your appointment payments</p>
      </motion.div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Paid', value: `₹${totalPaid.toLocaleString()}`, icon: CheckCircle, bg: '#F0FDF4', fg: '#16A34A' },
          { label: 'Transactions', value: payments.filter(p => p.status === 'success').length, icon: Receipt, bg: '#EFF6FF', fg: '#2563EB' },
          { label: 'Pending Dues', value: pendingAppointments.length, icon: Clock, bg: '#FFFBEB', fg: '#D97706' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: s.bg, color: s.fg }}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Pending Payments */}
      {pendingAppointments.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Pending Payments</h2>
          <div className="space-y-3">
            {pendingAppointments.map((appt) => (
              <div
                key={appt._id}
                className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      Appointment – {appt.doctorId?.name || 'Doctor'}
                    </p>
                    <p className="text-sm text-gray-500">{formatShortDate(appt.date)} · {appt.slot}</p>
                    <p className="text-xs text-amber-600 font-medium mt-0.5">Payment due</p>
                  </div>
                </div>
                <RazorpayButton
                  amount={appt.amount || 500}
                  appointmentId={appt._id}
                  label="Pay"
                  className="shrink-0"
                  onSuccess={() => window.location.reload()}
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Test Payment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <p className="font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-600" /> Test Razorpay Payment
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Use test card <span className="font-mono bg-white px-1.5 py-0.5 rounded text-xs border">4111 1111 1111 1111</span> · Exp: any future · CVV: any
          </p>
        </div>
        <RazorpayButton amount={499} label="Test Pay" className="shrink-0" />
      </motion.div>

      {/* Payment History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm"
      >
        <div className="p-5 border-b">
          <h2 className="font-semibold text-gray-900">Payment History</h2>
        </div>

        {payments.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No payment history yet</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {payments.map((p) => {
              const cfg = statusConfig[p.status] || statusConfig.pending;
              return (
                <div key={p._id} className="p-5 flex items-center gap-4 hover:bg-gray-50/50 transition-colors">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center shrink-0">
                    <cfg.icon className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">
                      {p.invoiceNumber || 'Payment'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatShortDate(p.createdAt)}
                      {p.transactionId && (
                        <> · <span className="font-mono">{p.transactionId.slice(0, 18)}…</span></>
                      )}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-gray-900">₹{p.amount?.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cfg.cls}`}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
