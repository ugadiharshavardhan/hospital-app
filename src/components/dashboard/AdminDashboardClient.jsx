'use client';
import { motion } from 'framer-motion';
import { StatsCard } from './StatsCard';
import { AppointmentTable } from './AppointmentTable';
import { AppointmentChart, RevenueChart } from './Chart';
import { Users, Stethoscope, Hospital, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export function AdminDashboardClient({ stats, recentAppointments }) {
  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">Hospital overview and management</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard title="Total Patients" value={stats.totalPatients} icon={Users} color="blue" />
        <StatsCard title="Active Doctors" value={stats.totalDoctors} icon={Stethoscope} color="green" />
        <StatsCard title="Departments" value={stats.totalDepts} icon={Hospital} color="purple" />
        <StatsCard title="Today's Appts" value={stats.todayAppts} icon={Calendar} color="yellow" />
        <StatsCard title="This Month" value={stats.monthAppts} icon={TrendingUp} color="teal" />
        <StatsCard title="Pending" value={stats.pendingAppts} icon={AlertCircle} color="red" />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Appointment Trends</h2>
            <span className="text-xs text-gray-400">Last 12 months</span>
          </div>
          <AppointmentChart />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Revenue Overview</h2>
            <span className="text-xs text-gray-400">Last 6 months</span>
          </div>
          <RevenueChart />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: 'Manage Doctors', href: '/admin/doctors', icon: Stethoscope, bg: '#EFF6FF', fg: '#2563EB' },
          { label: 'Manage Patients', href: '/admin/patients', icon: Users, bg: '#F0FDF4', fg: '#16A34A' },
          { label: 'Departments', href: '/admin/departments', icon: Hospital, bg: '#F5F3FF', fg: '#7C3AED' },
          { label: 'Analytics', href: '/admin/analytics', icon: TrendingUp, bg: '#F0FDFA', fg: '#0D9488' },
        ].map(action => (
          <Link key={action.href} href={action.href}>
            <motion.div
              whileHover={{ y: -2 }}
              className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all"
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2" style={{ backgroundColor: action.bg, color: action.fg }}>
                <action.icon className="w-4 h-4" />
              </div>
              <p className="font-medium text-sm text-gray-900">{action.label}</p>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Recent Appointments</h2>
          <Link href="/admin/appointments" className="text-sm text-blue-600 hover:underline">View all</Link>
        </div>
        <div className="p-4">
          <AppointmentTable appointments={recentAppointments} />
        </div>
      </div>
    </div>
  );
}
