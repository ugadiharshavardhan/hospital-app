import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Prescription from '@/models/Prescription';
import Appointment from '@/models/Appointment';
import { DoctorPrescriptionsClient } from '@/components/dashboard/DoctorPrescriptionsClient';

export const metadata = { title: 'Prescriptions - Doctor Dashboard' };

export default async function DoctorPrescriptionsPage() {
  const session = await auth();
  if (!session || session.user.role !== 'doctor') redirect('/dashboard');

  await connectDB();

  const [prescriptions, completedAppointments] = await Promise.all([
    Prescription.find({ doctorId: session.user.id })
      .populate('patientId', 'name email avatar')
      .populate('appointmentId', 'date slot department')
      .sort({ createdAt: -1 })
      .lean(),
    // Appointments that can still get a prescription (confirmed or completed without one)
    Appointment.find({
      doctorId: session.user.id,
      status: { $in: ['confirmed', 'completed'] },
    })
      .populate('patientId', 'name email')
      .sort({ date: -1 })
      .limit(50)
      .lean(),
  ]);

  return (
    <DoctorPrescriptionsClient
      prescriptions={JSON.parse(JSON.stringify(prescriptions))}
      appointments={JSON.parse(JSON.stringify(completedAppointments))}
      doctorId={session.user.id}
    />
  );
}
