import { connectDB } from '@/lib/db';
import Department from '@/models/Department';
import Doctor from '@/models/Doctor';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DepartmentDetailClient } from '@/components/departments/DepartmentDetailClient';
import { DEPARTMENTS } from '@/utils/constants';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const dept = DEPARTMENTS.find(d => d.slug === slug);
  return {
    title: `${dept?.name || 'Department'} - MediCare Hospital`,
    description: dept?.description || 'Expert medical care at MediCare Hospital',
  };
}

export default async function DepartmentDetailPage({ params }) {
  const { slug } = await params;

  let department = null;
  let doctors = [];

  try {
    await connectDB();
    department = await Department.findOne({ slug, isActive: true }).lean();
    if (department) {
      doctors = await Doctor.find({ departmentName: { $regex: department.name, $options: 'i' }, isActive: true })
        .populate('userId', 'name email avatar')
        .limit(8)
        .lean();
    }
  } catch {}

  if (!department) {
    const staticDept = DEPARTMENTS.find(d => d.slug === slug);
    if (!staticDept) notFound();
    department = staticDept;
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-[80px]">
        <DepartmentDetailClient
          department={JSON.parse(JSON.stringify(department))}
          doctors={JSON.parse(JSON.stringify(doctors))}
        />
      </main>
      <Footer />
    </>
  );
}
