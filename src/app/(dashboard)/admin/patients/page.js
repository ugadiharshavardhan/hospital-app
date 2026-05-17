import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Appointment from '@/models/Appointment';
import { AdminPatientsClient } from '@/components/dashboard/AdminPatientsClient';

export const metadata = { title: 'Manage Patients - Admin' };

export default async function AdminPatientsPage() {
  const session = await auth();
  if (!session || !['admin', 'receptionist'].includes(session.user.role)) redirect('/dashboard');

  await connectDB();
  const patients = await User.find({ role: 'patient' })
    .select('name email phone avatar createdAt isVerified isActive')
    .sort({ createdAt: -1 })
    .lean();

  const patientsWithStats = await Promise.all(
    patients.slice(0, 50).map(async (p) => {
      const count = await Appointment.countDocuments({ patientId: p._id });
      return { ...p, appointmentCount: count };
    })
  );

  return <AdminPatientsClient patients={JSON.parse(JSON.stringify(patientsWithStats))} />;
}
