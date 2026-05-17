'use client';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const monthlyData = [
  { month: 'Jan', appointments: 120, revenue: 45000, patients: 85 },
  { month: 'Feb', appointments: 145, revenue: 52000, patients: 98 },
  { month: 'Mar', appointments: 132, revenue: 48500, patients: 91 },
  { month: 'Apr', appointments: 178, revenue: 63000, patients: 125 },
  { month: 'May', appointments: 165, revenue: 58500, patients: 115 },
  { month: 'Jun', appointments: 192, revenue: 71000, patients: 138 },
  { month: 'Jul', appointments: 210, revenue: 78000, patients: 155 },
  { month: 'Aug', appointments: 189, revenue: 68000, patients: 140 },
  { month: 'Sep', appointments: 225, revenue: 84000, patients: 168 },
  { month: 'Oct', appointments: 241, revenue: 91000, patients: 175 },
  { month: 'Nov', appointments: 258, revenue: 97000, patients: 192 },
  { month: 'Dec', appointments: 275, revenue: 105000, patients: 210 },
];

export function AppointmentChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={monthlyData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', fontSize: 12 }}
        />
        <Area type="monotone" dataKey="appointments" stroke="#2563EB" strokeWidth={2} fill="url(#blueGradient)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function RevenueChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={monthlyData.slice(-6)} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
        <Tooltip
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', fontSize: 12 }}
          formatter={(v) => [`₹${v.toLocaleString()}`, 'Revenue']}
        />
        <Bar dataKey="revenue" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
}
