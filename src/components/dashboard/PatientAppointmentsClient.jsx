'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppointmentTable } from './AppointmentTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

export function PatientAppointmentsClient({ appointments: initial }) {
  const [appointments, setAppointments] = useState(initial);

  const filterByStatus = (status) => {
    if (status === 'all') return appointments;
    return appointments.filter(a => a.status === status);
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await axios.delete(`/api/appointments/${id}`);
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status: 'cancelled' } : a));
      toast.success('Appointment cancelled');
    } catch {
      toast.error('Failed to cancel');
    }
  };

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 text-sm">Track and manage your appointments</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" asChild>
          <Link href="/appointments/book"><Plus className="w-4 h-4 mr-2" /> Book New</Link>
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <Tabs defaultValue="all" className="p-4">
          <TabsList className="mb-4">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
              <TabsTrigger key={s} value={s} className="capitalize text-xs">{s}</TabsTrigger>
            ))}
          </TabsList>
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(status => (
            <TabsContent key={status} value={status}>
              <AppointmentTable
                appointments={filterByStatus(status)}
                showPatient={false}
                onStatusChange={status !== 'cancelled' && status !== 'completed' ? (id, _) => handleCancel(id) : null}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
