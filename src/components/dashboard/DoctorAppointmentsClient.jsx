'use client';
import { useState, useEffect } from 'react';
import { AppointmentTable } from './AppointmentTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { RescheduleDialog } from '@/components/appointments/RescheduleDialog';
import axios from 'axios';
import { toast } from 'sonner';

export function DoctorAppointmentsClient({ appointments: initial }) {
  const [appointments, setAppointments] = useState(initial);
  const [reschedulingAppt, setReschedulingAppt] = useState(null);
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const isAdmin = session?.user?.role === 'admin';
  const dateFilter = searchParams.get('date') || '';

  useEffect(() => {
    setAppointments(initial);
  }, [initial]);

  const handleDateChange = (val) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set('date', val);
    } else {
      params.delete('date');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Appointments</h1>
          <p className="text-gray-500 text-sm">Manage and update appointment statuses</p>
        </div>
        <div className="relative flex items-center self-end sm:self-auto">
          <Input
            type="date"
            className="w-40 bg-white pr-8 text-xs h-9 rounded-xl border-gray-200"
            value={dateFilter}
            onChange={(e) => handleDateChange(e.target.value)}
          />
          {dateFilter && (
            <button
              onClick={() => handleDateChange('')}
              className="absolute right-2.5 text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
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
              <AppointmentTable
                appointments={filterByStatus(status)}
                onStatusChange={handleStatusChange}
                onReschedule={isAdmin ? setReschedulingAppt : undefined}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <RescheduleDialog
        isOpen={!!reschedulingAppt}
        appointment={reschedulingAppt}
        onClose={() => setReschedulingAppt(null)}
        onSuccess={() => router.refresh()}
      />
    </div>
  );
}
