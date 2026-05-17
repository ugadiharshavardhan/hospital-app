'use client';
import { useState } from 'react';
import { AppointmentTable } from './AppointmentTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { toast } from 'sonner';

export function DoctorAppointmentsClient({ appointments: initial }) {
  const [appointments, setAppointments] = useState(initial);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`/api/appointments/${id}`, { status });
      setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error('Update failed');
    }
  };

  const filterByStatus = (status) => status === 'all' ? appointments : appointments.filter(a => a.status === status);

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Patient Appointments</h1>
        <p className="text-gray-500 text-sm">Manage and update appointment statuses</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <Tabs defaultValue="all" className="p-4">
          <TabsList className="mb-4">
            {['all', 'pending', 'confirmed', 'completed'].map(s => (
              <TabsTrigger key={s} value={s} className="capitalize text-xs">{s}</TabsTrigger>
            ))}
          </TabsList>
          {['all', 'pending', 'confirmed', 'completed'].map(status => (
            <TabsContent key={status} value={status}>
              <AppointmentTable appointments={filterByStatus(status)} onStatusChange={handleStatusChange} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
