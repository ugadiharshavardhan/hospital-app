import { connectDB } from '@/lib/db';
import Doctor from '@/models/Doctor';
import { DoctorsPageClient } from '@/components/doctors/DoctorsPageClient';
import { DEPARTMENTS } from '@/utils/constants';

export const metadata = {
  title: 'Find Doctors - MediCare Hospital',
  description: 'Find and book appointments with 500+ specialist doctors across all departments.',
};

export default async function DoctorsPage({ searchParams }) {
  const params = await searchParams;
  await connectDB();

  const query = { isActive: true };

  // Map slug → full department name for accurate DB query
  if (params.dept && params.dept !== 'all') {
    const deptObj = DEPARTMENTS.find(d => d.slug === params.dept);
    if (deptObj) {
      query.departmentName = { $regex: deptObj.name, $options: 'i' };
    }
  }

  let doctors = await Doctor.find(query)
    .populate('userId', 'name email avatar phone')
    .populate('department', 'name slug')
    .lean();

  // Client-safe search filter
  if (params.q) {
    const q = params.q.toLowerCase();
    doctors = doctors.filter(d =>
      d.userId?.name?.toLowerCase().includes(q) ||
      d.specialization?.toLowerCase().includes(q) ||
      d.departmentName?.toLowerCase().includes(q)
    );
  }

  return (
    <DoctorsPageClient
      doctors={JSON.parse(JSON.stringify(doctors))}
      initialSearch={params.q || ''}
      initialDept={params.dept || ''}
    />
  );
}
