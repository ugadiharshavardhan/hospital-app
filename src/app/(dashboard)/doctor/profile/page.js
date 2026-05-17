import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Doctor from '@/models/Doctor';
import { DoctorProfileEditClient } from '@/components/profile/DoctorProfileEditClient';

export const metadata = { title: 'My Profile - MediCare' };

export default async function DoctorProfilePage() {
  const session = await auth();
  if (!session || session.user.role !== 'doctor') redirect('/dashboard');

  await connectDB();
  const [user, doctor] = await Promise.all([
    User.findById(session.user.id).lean(),
    Doctor.findOne({ userId: session.user.id }).lean(),
  ]);

  return (
    <DoctorProfileEditClient
      user={JSON.parse(JSON.stringify(user))}
      doctor={JSON.parse(JSON.stringify(doctor || {}))}
    />
  );
}
