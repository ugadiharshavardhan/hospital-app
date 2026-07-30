import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import MedicalReport from '@/models/MedicalReport';
import { PatientReportsClient } from '@/components/dashboard/PatientReportsClient';

export const metadata = { title: 'Medical Reports - MediCare' };

export default async function ReportsPage({ searchParams }) {
  const session = await auth();
  if (!session || session.user.role !== 'patient') redirect('/dashboard');

  const params = await searchParams;
  const selectedDate = params.date || '';

  await connectDB();
  const query = { patientId: session.user.id };
  if (selectedDate) {
    const startOfDay = new Date(`${selectedDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${selectedDate}T23:59:59.999Z`);
    query.reportDate = { $gte: startOfDay, $lte: endOfDay };
  }

  const reports = await MedicalReport.find(query)
    .sort({ reportDate: -1 })
    .lean();

  return (
    <PatientReportsClient reports={JSON.parse(JSON.stringify(reports))} />
  );
}
