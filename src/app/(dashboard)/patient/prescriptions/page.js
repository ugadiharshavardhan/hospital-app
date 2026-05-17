import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Prescription from '@/models/Prescription';
import { formatShortDate } from '@/utils/formatters';
import { FileText, Pill, Calendar } from 'lucide-react';

export const metadata = { title: 'Prescriptions - MediCare' };

export default async function PrescriptionsPage() {
  const session = await auth();
  if (!session || session.user.role !== 'patient') redirect('/dashboard');

  await connectDB();
  const prescriptions = await Prescription.find({ patientId: session.user.id })
    .populate('doctorId', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>
        <p className="text-gray-500 text-sm">Your prescription history</p>
      </div>

      {prescriptions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">No prescriptions yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((p) => (
            <div key={p._id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{p.diagnosis || 'Prescription'}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-3.5 h-3.5" /> {formatShortDate(p.createdAt)}
                    {p.doctorId && ` • Dr. ${p.doctorId.name}`}
                  </p>
                </div>
                <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
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
                <p className="text-xs text-blue-600 mt-2">Follow-up: {formatShortDate(p.followUpDate)}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
