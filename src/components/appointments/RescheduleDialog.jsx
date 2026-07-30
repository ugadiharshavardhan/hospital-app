'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TIME_SLOTS } from '@/utils/constants';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

export function RescheduleDialog({ isOpen, onClose, appointment, onSuccess }) {
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (appointment) {
      const d = new Date(appointment.date);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      setDate(`${yyyy}-${mm}-${dd}`);
      setSlot(appointment.slot || '');
    }
  }, [appointment, isOpen]);

  const handleReschedule = async () => {
    if (!date || !slot) {
      toast.error('Please select both date and time slot');
      return;
    }
    setLoading(true);
    try {
      await axios.patch(`/api/appointments/${appointment._id}`, { date, slot });
      toast.success('Appointment rescheduled successfully!');
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Reschedule failed');
    } finally {
      setLoading(false);
    }
  };

  const getLocalDateString = (d) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const parseSlotToMinutes = (s) => {
    const [time, period] = s.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
    return hours * 60 + minutes;
  };

  const todayStr = getLocalDateString(new Date());
  const isToday = date === todayStr;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const filteredSlots = TIME_SLOTS.filter(s => {
    if (!isToday) return true;
    return parseSlotToMinutes(s) > currentMinutes;
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[460px] rounded-3xl p-6 bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">Reschedule Appointment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm font-semibold text-gray-900">New Date</Label>
            <Input
              type="date"
              id="date"
              min={todayStr}
              value={date}
              className="rounded-xl border-gray-200"
              onChange={(e) => {
                setDate(e.target.value);
                setSlot('');
              }}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-gray-900">Available Time Slots</Label>
            <div className="grid grid-cols-3 gap-2 max-h-[180px] overflow-y-auto pr-1">
              {filteredSlots.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlot(s)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${slot === s ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50/10'}`}
                >
                  {s}
                </button>
              ))}
            </div>
            {filteredSlots.length === 0 && (
              <p className="text-xs text-red-500 text-center font-medium mt-1">
                No remaining time slots for today. Please select a future date.
              </p>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose} className="rounded-xl border-gray-200 text-xs">
            Cancel
          </Button>
          <Button
            onClick={handleReschedule}
            disabled={loading || !date || !slot}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs"
          >
            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...</> : 'Confirm Reschedule'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
