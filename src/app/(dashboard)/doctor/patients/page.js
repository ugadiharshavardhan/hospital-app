import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import User from '@/models/User';
import { formatShortDate } from '@/utils/formatters';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import { Calendar } from 'lucide-react';

export const metadata = { title: 'My Patients - Doctor Dashboard' };

export default async function DoctorPatientsPage() {
  const session = await auth();
  if (!session || session.user.role !== 'doctor') redirect('/dashboard');

  await connectDB();

  // Get unique patients who have had appointments with this doctor
  const patientIds = await Appointment.distinct('patientId', { doctorId: session.user.id });
  const patients = await User.find({ _id: { $in: patientIds } })
    .select('name email phone avatar createdAt')
    .lean();

  const patientsWithStats = await Promise.all(
    patients.map(async (p) => {
      const lastAppt = await Appointment.findOne({ doctorId: session.user.id, patientId: p._id })
        .sort({ date: -1 })
        .select('date status')
        .lean();
      const count = await Appointment.countDocuments({ doctorId: session.user.id, patientId: p._id });
      return { ...p, lastAppointment: lastAppt, appointmentCount: count };
    })
  );

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Patients</h1>
        <p className="text-gray-500 text-sm">{patients.length} patients seen</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {patientsWithStats.map((p) => (
          <div key={p._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-12 h-12">
                <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                  {getInitials(p.name || '')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900">{p.name}</h3>
                <p className="text-gray-400 text-xs">{p.email}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center justify-between">
                <span>Total visits</span>
                <span className="font-medium text-gray-900">{p.appointmentCount}</span>
              </div>
              {p.lastAppointment && (
                <div className="flex items-center justify-between">
                  <span>Last visit</span>
                  <span className="font-medium text-gray-900 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatShortDate(p.lastAppointment.date)}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
        {patients.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-400">
            <p>No patients yet. They'll appear after appointments are completed.</p>
          </div>
        )}
      </div>
    </div>
  );
}
