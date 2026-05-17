import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import MedicalReport from '@/models/MedicalReport';
import { formatShortDate } from '@/utils/formatters';
import { ClipboardList, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = { title: 'Medical Reports - MediCare' };

export default async function ReportsPage() {
  const session = await auth();
  if (!session || session.user.role !== 'patient') redirect('/dashboard');

  await connectDB();
  const reports = await MedicalReport.find({ patientId: session.user.id })
    .sort({ reportDate: -1 })
    .lean();

  const typeLabels = {
    'blood-test': 'Blood Test', 'x-ray': 'X-Ray', 'mri': 'MRI',
    'ct-scan': 'CT Scan', 'ecg': 'ECG', 'urine-test': 'Urine Test', 'other': 'Other'
  };

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Medical Reports</h1>
        <p className="text-gray-500 text-sm">Your diagnostic reports and lab results</p>
      </div>

      {reports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No reports uploaded yet</p>
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
