'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatShortDate } from '@/utils/formatters';
import { FileText, Pill, Calendar, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function PatientPrescriptionsClient({ prescriptions: initial }) {
  const [prescriptions, setPrescriptions] = useState(initial);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const dateFilter = searchParams.get('date') || '';

  useEffect(() => {
    setPrescriptions(initial);
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

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>
          <p className="text-gray-500 text-sm">Your prescription history</p>
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

      {prescriptions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No prescriptions found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((p) => (
            <div key={p._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all animate-in fade-in-50 duration-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{p.diagnosis || 'Prescription'}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" /> {formatShortDate(p.createdAt)}
                    {p.doctorId && ` • Dr. ${p.doctorId.name}`}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {p.isActive ? 'Active' : 'Completed'}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {p.medicines?.map((med, i) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-3 flex gap-3">
                    <Pill className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-sm text-gray-900">{med.name}</p>
                      <p className="text-xs text-gray-500">{med.dosage} • {med.frequency} • {med.duration}</p>
                      {med.instructions && <p className="text-xs text-gray-400 mt-0.5">{med.instructions}</p>}
                    </div>
                  </div>
                ))}
              </div>
              {p.notes && <p className="text-sm text-gray-500 mt-3 bg-blue-50 p-3 rounded-lg">{p.notes}</p>}
              {p.followUpDate && (
                <p className="text-xs text-blue-600 mt-2 font-medium">Follow-up: {formatShortDate(p.followUpDate)}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
