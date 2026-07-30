import { connectDB } from '@/lib/db';
import Doctor from '@/models/Doctor';
import User from '@/models/User';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DoctorProfileClient } from '@/components/doctors/DoctorProfileClient';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { id } = await params;
  await connectDB();
  const user = await User.findById(id).lean();
  if (!user) return { title: 'Doctor Not Found' };
  return {
    title: `${user.name} - MediCare Hospital`,
    description: `Book appointment with ${user.name} at MediCare Hospital.`,
  };
}

export default async function DoctorProfilePage({ params }) {
  const { id } = await params;

  await connectDB();
  const [user, doctor] = await Promise.all([
    User.findById(id).lean(),
    Doctor.findOne({ userId: id }).populate('department', 'name slug').lean(),
  ]);

  if (!user || !doctor) notFound();

  const data = { ...doctor, userId: user };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-[80px]">
        <DoctorProfileClient doctor={JSON.parse(JSON.stringify(data))} />
      </main>
      <Footer />
    </>
  );
}
