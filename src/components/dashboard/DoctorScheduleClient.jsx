'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Calendar, Clock, Save, Loader2, Plus, Trash2,
  CheckCircle, XCircle, Users, Activity,
} from 'lucide-react';
import { toast } from 'sonner';
import { getInitials } from '@/lib/utils';
import { formatShortDate } from '@/utils/formatters';
import { getStatusColor } from '@/utils/formatters';
import axios from 'axios';

const ALL_SLOTS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM',
];

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Group upcoming appointments by date
function groupByDate(appointments) {
  return appointments.reduce((acc, appt) => {
    const key = new Date(appt.date).toDateString();
    if (!acc[key]) acc[key] = [];
    acc[key].push(appt);
    return acc;
  }, {});
}

export function DoctorScheduleClient({ availability: initialAvailability, upcomingAppointments }) {
  const [availability, setAvailability] = useState(
    DAY_ORDER.map(day => {
      const existing = initialAvailability.find(a => a.day === day);
      return existing || { day, isAvailable: false, startTime: '09:00', endTime: '17:00', slots: [] };
    })
  );
  const [saving, setSaving] = useState(false);
  const [activeDay, setActiveDay] = useState('Monday');

  const grouped = groupByDate(upcomingAppointments);

  const toggleDay = (day) => {
    setAvailability(prev =>
      prev.map(a => a.day === day ? { ...a, isAvailable: !a.isAvailable } : a)
    );
  };

  const toggleSlot = (day, slot) => {
    setAvailability(prev =>
      prev.map(a => {
        if (a.day !== day) return a;
        const slots = a.slots.includes(slot)
          ? a.slots.filter(s => s !== slot)
          : [...a.slots, slot].sort((x, y) => ALL_SLOTS.indexOf(x) - ALL_SLOTS.indexOf(y));
        return { ...a, slots };
      })
    );
  };

  const updateTime = (day, field, value) => {
    setAvailability(prev =>
      prev.map(a => a.day === day ? { ...a, [field]: value } : a)
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('/api/doctor/schedule', { availability });
      toast.success('Schedule saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save schedule');
    } finally {
      setSaving(false);
    }
  };

  const activeDayData = availability.find(a => a.day === activeDay);

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Schedule</h1>
          <p className="text-gray-500 text-sm">Manage your weekly availability and time slots</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
          {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : <><Save className="w-4 h-4 mr-2" /> Save Schedule</>}
        </Button>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Weekly overview + day selector */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Weekly Availability</h2>
          {availability.map((day, i) => (
            <motion.button
              key={day.day}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveDay(day.day)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${activeDay === day.day ? 'border-blue-400 bg-blue-50 shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200'}`}
            >
              {/* Toggle */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); toggleDay(day.day); }}
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${day.isAvailable ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}
              >
                {day.isAvailable ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${activeDay === day.day ? 'text-blue-700' : 'text-gray-900'}`}>{day.day}</p>
                <p className="text-xs text-gray-400">
                  {day.isAvailable
                    ? day.slots.length > 0 ? `${day.slots.length} slots` : 'No slots set'
                    : 'Not available'}
                </p>
              </div>
              {day.isAvailable && day.slots.length > 0 && (
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 text-xs shrink-0">
                  {day.slots.length}
                </Badge>
              )}
            </motion.button>
          ))}
        </div>

        {/* Right: Slot editor for active day */}
        <div className="lg:col-span-2 space-y-4">
          {/* Day settings */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500" /> {activeDay} Settings
              </h2>
              <button
                type="button"
                onClick={() => toggleDay(activeDay)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${activeDayData?.isAvailable ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100'}`}
              >
                {activeDayData?.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
              </button>
            </div>

            {activeDayData?.isAvailable ? (
              <>
                {/* Working hours */}
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1 block">Start Time</label>
                    <input
                      type="time"
                      value={activeDayData.startTime}
                      onChange={e => updateTime(activeDay, 'startTime', e.target.value)}
                      className="w-full h-9 rounded-lg border border-gray-200 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-medium mb-1 block">End Time</label>
                    <input
                      type="time"
                      value={activeDayData.endTime}
                      onChange={e => updateTime(activeDay, 'endTime', e.target.value)}
                      className="w-full h-9 rounded-lg border border-gray-200 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <Separator className="mb-4" />

                {/* Slot grid */}
                <div>
                  <p className="text-xs text-gray-500 font-medium mb-3">
                    Select available time slots ({activeDayData.slots.length} selected)
                  </p>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                    {ALL_SLOTS.map(slot => {
                      const selected = activeDayData.slots.includes(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => toggleSlot(activeDay, slot)}
                          className={`py-2 px-1 rounded-lg text-xs font-medium border transition-all ${selected ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600'}`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => setAvailability(prev => prev.map(a => a.day === activeDay ? { ...a, slots: [...ALL_SLOTS] } : a))}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Select All
                    </button>
                    <span className="text-gray-300">·</span>
                    <button
                      type="button"
                      onClick={() => setAvailability(prev => prev.map(a => a.day === activeDay ? { ...a, slots: [] } : a))}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <XCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Not available on {activeDay}</p>
                <button
                  type="button"
                  onClick={() => toggleDay(activeDay)}
                  className="text-blue-600 text-sm hover:underline mt-2"
                >
                  Enable this day
                </button>
              </div>
            )}
          </div>

          {/* Upcoming Appointments This Week */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-blue-500" /> Upcoming Appointments (Next 7 Days)
            </h2>
            {Object.keys(grouped).length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm">No appointments in the next 7 days</p>
              </div>
            ) : (
              <div className="space-y-4">
                {Object.entries(grouped).map(([dateStr, appts]) => (
                  <div key={dateStr}>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                      {new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
                    </p>
                    <div className="space-y-2">
                      {appts.map(appt => (
                        <div key={appt._id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                            <Clock className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm truncate">{appt.patientId?.name || 'Patient'}</p>
                            <p className="text-gray-400 text-xs">{appt.slot} · {appt.type || 'In-person'}</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize shrink-0 ${getStatusColor(appt.status)}`}>
                            {appt.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
