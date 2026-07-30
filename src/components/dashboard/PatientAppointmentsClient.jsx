'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AppointmentTable } from './AppointmentTable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { Plus, X } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { RescheduleDialog } from '@/components/appointments/RescheduleDialog';

export function PatientAppointmentsClient({ appointments: initial }) {
  const [appointments, setAppointments] = useState(initial);
  const [reschedulingAppt, setReschedulingAppt] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

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

  const filterByStatus = (status) => {
    if (status === 'all') return appointments;
    return appointments.filter(a => a.status === status);
  };

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-500 text-sm">Track and manage your appointments</p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="relative flex items-center">
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
          <Button className="bg-blue-600 hover:bg-blue-700 h-9 rounded-xl text-xs" asChild>
            <Link href="/appointments/book"><Plus className="w-4 h-4 mr-2" /> Book New</Link>
          </Button>
        </div>
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
                onReschedule={setReschedulingAppt}
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
