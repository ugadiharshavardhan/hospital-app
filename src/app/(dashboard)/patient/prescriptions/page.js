import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Prescription from '@/models/Prescription';
import { PatientPrescriptionsClient } from '@/components/dashboard/PatientPrescriptionsClient';

export const metadata = { title: 'Prescriptions - MediCare' };

export default async function PrescriptionsPage({ searchParams }) {
  const session = await auth();
  if (!session || session.user.role !== 'patient') redirect('/dashboard');

  const params = await searchParams;
  const selectedDate = params.date || '';

  await connectDB();
  const query = { patientId: session.user.id };
  if (selectedDate) {
    const startOfDay = new Date(`${selectedDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${selectedDate}T23:59:59.999Z`);
    query.createdAt = { $gte: startOfDay, $lte: endOfDay };
  }

  const prescriptions = await Prescription.find(query)
    .populate('doctorId', 'name')
    .sort({ createdAt: -1 })
    .lean();

  return (
    <PatientPrescriptionsClient prescriptions={JSON.parse(JSON.stringify(prescriptions))} />
  );
}
