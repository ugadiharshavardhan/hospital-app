import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Patient from '@/models/Patient';
import { PatientProfileClient } from '@/components/profile/PatientProfileClient';

export const metadata = { title: 'My Profile - MediCare' };

export default async function PatientProfilePage() {
  const session = await auth();
  if (!session || session.user.role !== 'patient') redirect('/dashboard');

  await connectDB();
  const [user, patient] = await Promise.all([
    User.findById(session.user.id).lean(),
    Patient.findOne({ userId: session.user.id }).lean(),
  ]);

  return (
    <PatientProfileClient
      user={JSON.parse(JSON.stringify(user))}
      patient={JSON.parse(JSON.stringify(patient || {}))}
    />
  );
}
