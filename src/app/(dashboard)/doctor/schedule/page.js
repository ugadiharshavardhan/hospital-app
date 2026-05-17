import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Doctor from '@/models/Doctor';
import Appointment from '@/models/Appointment';
import { DoctorScheduleClient } from '@/components/dashboard/DoctorScheduleClient';

export const metadata = { title: 'My Schedule - Doctor Dashboard' };

export default async function DoctorSchedulePage() {
  const session = await auth();
  if (!session || session.user.role !== 'doctor') redirect('/dashboard');

  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const [doctor, upcomingAppointments] = await Promise.all([
    Doctor.findOne({ userId: session.user.id }).lean(),
    Appointment.find({
      doctorId: session.user.id,
      date: { $gte: today, $lte: nextWeek },
      status: { $in: ['pending', 'confirmed'] },
    })
      .populate('patientId', 'name email avatar')
      .sort({ date: 1, slot: 1 })
      .lean(),
  ]);

  const defaultAvailability = [
    { day: 'Monday',    isAvailable: true,  startTime: '09:00', endTime: '17:00', slots: ['09:00 AM','10:00 AM','11:00 AM','02:00 PM','03:00 PM','04:00 PM'] },
    { day: 'Tuesday',   isAvailable: true,  startTime: '09:00', endTime: '17:00', slots: ['09:00 AM','10:00 AM','11:00 AM','02:00 PM','04:00 PM'] },
    { day: 'Wednesday', isAvailable: true,  startTime: '09:00', endTime: '17:00', slots: ['09:30 AM','10:30 AM','11:30 AM','02:30 PM','04:30 PM'] },
    { day: 'Thursday',  isAvailable: true,  startTime: '09:00', endTime: '17:00', slots: ['09:00 AM','10:00 AM','02:00 PM','03:00 PM'] },
    { day: 'Friday',    isAvailable: true,  startTime: '09:00', endTime: '17:00', slots: ['09:00 AM','10:00 AM','11:00 AM','02:00 PM'] },
    { day: 'Saturday',  isAvailable: true,  startTime: '09:00', endTime: '13:00', slots: ['09:00 AM','10:00 AM','11:00 AM','12:00 PM'] },
    { day: 'Sunday',    isAvailable: false, startTime: '',       endTime: '',       slots: [] },
  ];

  return (
    <DoctorScheduleClient
      availability={JSON.parse(JSON.stringify(doctor?.availability || defaultAvailability))}
      upcomingAppointments={JSON.parse(JSON.stringify(upcomingAppointments))}
    />
  );
}
