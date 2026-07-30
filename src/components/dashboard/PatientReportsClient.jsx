'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatShortDate } from '@/utils/formatters';
import { ClipboardList, Download, ExternalLink, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

export function PatientReportsClient({ reports: initial }) {
  const [reports, setReports] = useState(initial);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const dateFilter = searchParams.get('date') || '';

  useEffect(() => {
    setReports(initial);
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

  const typeLabels = {
    'blood-test': 'Blood Test', 'x-ray': 'X-Ray', 'mri': 'MRI',
    'ct-scan': 'CT Scan', 'ecg': 'ECG', 'urine-test': 'Urine Test', 'other': 'Other'
  };

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Medical Reports</h1>
          <p className="text-gray-500 text-sm">Your diagnostic reports and lab results</p>
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

      {reports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No reports found</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((r) => (
            <div key={r._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                    {typeLabels[r.reportType] || r.reportType}
                  </span>
                  <h3 className="font-semibold text-gray-900 mt-2">{r.reportName}</h3>
                  <p className="text-xs text-gray-400 mt-1">{formatShortDate(r.reportDate)}</p>
                </div>
                {r.isNormal !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${r.isNormal ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {r.isNormal ? 'Normal' : 'Abnormal'}
                  </span>
                )}
              </div>
              {r.description && <p className="text-sm text-gray-500 mb-4">{r.description}</p>}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs" asChild>
                  <a href={r.reportUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3 h-3 mr-1" /> View
                  </a>
                </Button>
                <Button size="sm" variant="outline" className="flex-1 text-xs" asChild>
                  <a href={r.reportUrl} download>
                    <Download className="w-3 h-3 mr-1" /> Download
                  </a>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
