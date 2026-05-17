'use client';
import { motion } from 'framer-motion';
import { StatsCard } from './StatsCard';
import { AppointmentChart, RevenueChart } from './Chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Calendar, CheckCircle, XCircle, TrendingUp, Users, DollarSign, Percent } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const PIE_COLORS = ['#2563EB', '#0D9488', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316'];

export function AdminAnalyticsClient({ stats }) {
  const pieData = [
    { name: 'Completed', value: stats.completedAppts },
    { name: 'Cancelled', value: stats.cancelledAppts },
    { name: 'Other', value: stats.totalAppointments - stats.completedAppts - stats.cancelledAppts },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
        <p className="text-gray-500 text-sm">Hospital performance metrics</p>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Appointments" value={stats.totalAppointments} icon={Calendar} color="blue" trend={stats.thisMonthAppts > stats.lastMonthAppts ? 1 : -1} trendValue={stats.lastMonthAppts > 0 ? Math.round(((stats.thisMonthAppts - stats.lastMonthAppts) / stats.lastMonthAppts) * 100) : 0} />
        <StatsCard title="Completed" value={stats.completedAppts} icon={CheckCircle} color="green" />
        <StatsCard title="Completion Rate" value={`${stats.completionRate}%`} icon={Percent} color="teal" />
        <StatsCard title="Total Patients" value={stats.totalPatients} icon={Users} color="purple" trend={1} trendValue={stats.newPatientsThisMonth} />
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Appointment Trends (12 months)</h2>
          <AppointmentChart />
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Revenue (Last 6 months)</h2>
          <RevenueChart />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        {stats.departmentStats.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Appointments by Department</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.departmentStats} layout="vertical" margin={{ left: 80, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="department" tick={{ fontSize: 11, fill: '#374151' }} axisLine={false} tickLine={false} width={75} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', fontSize: 12 }} />
                <Bar dataKey="count" fill="#2563EB" radius={[0, 6, 6, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Appointment Status Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Appointment Status</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" paddingAngle={3}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-gray-600">{v}</span>} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {[
              { label: 'Completed', value: stats.completedAppts, color: 'text-blue-600' },
              { label: 'Cancelled', value: stats.cancelledAppts, color: 'text-red-600' },
              { label: 'Rate', value: `${stats.completionRate}%`, color: 'text-green-600' },
            ].map(s => (
              <div key={s.label} className="text-center bg-gray-50 rounded-xl p-3">
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
