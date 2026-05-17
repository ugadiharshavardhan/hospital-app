import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { connectDB } from '@/lib/db';
import Department from '@/models/Department';
import Doctor from '@/models/Doctor';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = { title: 'Manage Departments - Admin' };

export default async function AdminDepartmentsPage() {
  const session = await auth();
  if (!session || session.user.role !== 'admin') redirect('/dashboard');

  await connectDB();
  const departments = await Department.find({}).sort({ order: 1 }).lean();
  const doctorCounts = await Doctor.aggregate([
    { $group: { _id: '$departmentName', count: { $sum: 1 } } }
  ]);
  const countMap = Object.fromEntries(doctorCounts.map(d => [d._id, d.count]));

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Departments</h1>
          <p className="text-gray-500 text-sm">{departments.length} departments</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {departments.map(dept => (
          <div key={dept._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="text-3xl">{dept.icon}</div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${dept.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {dept.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">{dept.name}</h3>
            <p className="text-gray-500 text-xs mb-3 line-clamp-2">{dept.description}</p>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{countMap[dept.name] || 0} doctors</span>
              <Link href={`/departments/${dept.slug}`} className="text-blue-600 flex items-center gap-1 hover:underline">
                View <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
