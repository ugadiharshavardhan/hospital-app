import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { connectDB } from '@/lib/db';
import Department from '@/models/Department';
import { DEPARTMENTS } from '@/utils/constants';
import { ArrowRight, Clock, Users } from 'lucide-react';

export const metadata = {
  title: 'Departments - MediCare Hospital',
  description: 'Explore our 25+ medical departments with expert specialists and modern treatments.',
};

export default async function DepartmentsPage() {
  let departments = [];
  try {
    await connectDB();
    departments = await Department.find({ isActive: true }).sort({ order: 1 }).lean();
  } catch {
    departments = DEPARTMENTS;
  }

  const colorMap = {
    red: 'from-red-50 to-red-100/50 border-red-100 hover:border-red-300',
    purple: 'from-purple-50 to-purple-100/50 border-purple-100 hover:border-purple-300',
    blue: 'from-blue-50 to-blue-100/50 border-blue-100 hover:border-blue-300',
    green: 'from-green-50 to-green-100/50 border-green-100 hover:border-green-300',
    yellow: 'from-yellow-50 to-yellow-100/50 border-yellow-100 hover:border-yellow-300',
    pink: 'from-pink-50 to-pink-100/50 border-pink-100 hover:border-pink-300',
    teal: 'from-teal-50 to-teal-100/50 border-teal-100 hover:border-teal-300',
    orange: 'from-orange-50 to-orange-100/50 border-orange-100 hover:border-orange-300',
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-[80px]">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Our Medical Departments</h1>
            <p className="text-blue-200">World-class care across 25+ specialties</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {departments.map((dept, i) => (
              <Link key={dept.slug} href={`/departments/${dept.slug}`}>
                <div className={`bg-gradient-to-br ${colorMap[dept.color] || 'from-gray-50 to-gray-100/50 border-gray-100 hover:border-gray-300'} border rounded-2xl p-6 h-full hover:shadow-md transition-all group cursor-pointer`}>
                  <div className="text-4xl mb-4">{dept.icon}</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{dept.name}</h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">{dept.description}</p>
                  {dept.timings && (
                    <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
                      <Clock className="w-3 h-3" /> {dept.timings}
                    </p>
                  )}
                  {dept.treatments?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {dept.treatments.slice(0, 2).map(t => (
                        <span key={t} className="text-xs bg-white/70 text-gray-600 px-2 py-0.5 rounded-full">{t}</span>
                      ))}
                      {dept.treatments.length > 2 && <span className="text-xs text-gray-400">+{dept.treatments.length - 2}</span>}
                    </div>
                  )}
                  <div className="flex items-center gap-1 mt-4 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
