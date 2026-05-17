'use client';
import { motion } from 'framer-motion';
import { StatsCard } from './StatsCard';
import { AppointmentTable } from './AppointmentTable';
import { AppointmentChart } from './Chart';
import { Calendar, Users, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import { toast } from 'sonner';
import { useState } from 'react';

export function DoctorDashboardClient({ user, appointments: initial, stats }) {
  const [appointments, setAppointments] = useState(initial);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`/api/appointments/${id}`, { status });
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
      toast.success(`Appointment ${status}`);
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
          <p className="text-gray-500 text-sm">Welcome back, Dr. {user?.name?.split(' ').slice(1).join(' ')}</p>
        </div>
        <Link href="/doctor/appointments" className="text-sm text-blue-600 hover:underline">View All</Link>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Today's Appointments" value={stats.todayTotal} icon={Calendar} color="blue" />
        <StatsCard title="Pending Today" value={stats.todayPending} icon={Clock} color="yellow" />
        <StatsCard title="Total Patients" value={stats.totalPatients} icon={Users} color="green" />
        <StatsCard title="Completed" value={stats.completedTotal} icon={CheckCircle} color="teal" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Appointment Trends</h2>
          <AppointmentChart />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Appointments</h2>
            <Link href="/doctor/appointments" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="p-4">
            <AppointmentTable appointments={appointments.slice(0, 5)} showPatient={true} onStatusChange={handleStatusChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
