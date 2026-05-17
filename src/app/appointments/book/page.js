import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BookingWizard } from '@/components/appointments/BookingWizard';
import { connectDB } from '@/lib/db';
import Doctor from '@/models/Doctor';
import Department from '@/models/Department';
import { DEPARTMENTS } from '@/utils/constants';

export const metadata = { title: 'Book Appointment - MediCare Hospital' };

export default async function BookAppointmentPage({ searchParams }) {
  const session = await auth();
  if (!session) redirect('/login?redirect=/appointments/book');

  const params = await searchParams;

  let doctors = [];
  let departments = DEPARTMENTS;

  try {
    await connectDB();
    doctors = await Doctor.find({ isActive: true })
      .populate('userId', 'name email avatar')
      .lean();
    const dbDepts = await Department.find({ isActive: true }).sort({ order: 1 }).lean();
    if (dbDepts.length) departments = dbDepts;
  } catch (err) {
    console.error('Error loading booking data:', err);
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-[116px] pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Book an Appointment</h1>
            <p className="text-gray-500">Select your preferred doctor and time slot</p>
          </div>
          <BookingWizard
            doctors={JSON.parse(JSON.stringify(doctors))}
            departments={JSON.parse(JSON.stringify(departments))}
            preselectedDoctor={params.doctor || ''}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
