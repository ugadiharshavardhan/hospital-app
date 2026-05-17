'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { StatsCard } from './StatsCard';
import { AppointmentTable } from './AppointmentTable';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, CheckCircle, AlertCircle, Plus, FileText, CreditCard, Bell } from 'lucide-react';

export function PatientDashboardClient({ user, appointments, stats }) {
  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good morning, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Manage your health journey</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" asChild>
          <Link href="/appointments/book">
            <Plus className="w-4 h-4 mr-2" /> Book Appointment
          </Link>
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Appointments" value={stats.total} icon={Calendar} color="blue" />
        <StatsCard title="Upcoming" value={stats.upcoming} icon={Clock} color="green" />
        <StatsCard title="Completed" value={stats.completed} icon={CheckCircle} color="teal" />
        <StatsCard title="Pending" value={stats.pending} icon={AlertCircle} color="yellow" />
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { icon: Calendar, label: 'Book Appointment', desc: 'Schedule with a doctor', href: '/appointments/book', bg: '#EFF6FF', fg: '#2563EB' },
          { icon: FileText, label: 'My Prescriptions', desc: 'View your medicines', href: '/patient/prescriptions', bg: '#F0FDF4', fg: '#16A34A' },
          { icon: CreditCard, label: 'Payment History', desc: 'View transactions', href: '/patient/payments', bg: '#F5F3FF', fg: '#7C3AED' },
        ].map((action) => (
          <Link key={action.href} href={action.href}>
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: action.bg, color: action.fg }}>
                <action.icon className="w-5 h-5" />
              </div>
              <p className="font-semibold text-gray-900 text-sm">{action.label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{action.desc}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Recent Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm"
      >
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Appointments</h2>
          <Link href="/patient/appointments" className="text-sm text-blue-600 hover:underline">View all</Link>
        </div>
        <div className="p-4">
          <AppointmentTable appointments={appointments} showPatient={false} />
        </div>
      </motion.div>
    </div>
  );
}
