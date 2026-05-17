'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { DoctorCard } from './DoctorCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { DEPARTMENTS } from '@/utils/constants';

// Build slug→name map once
const DEPT_NAME_MAP = Object.fromEntries(DEPARTMENTS.map(d => [d.slug, d.name]));

export function DoctorsPageClient({ doctors, initialSearch, initialDept }) {
  const [search, setSearch] = useState(initialSearch);
  const [dept, setDept] = useState(initialDept);
  const [sortBy, setSortBy] = useState('rating');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    // Resolve slug to full department name for comparison
    const deptName = dept && dept !== 'all' ? (DEPT_NAME_MAP[dept] || dept) : '';

    return doctors
      .filter(d => {
        const name = d.userId?.name?.toLowerCase() || '';
        const spec = d.specialization?.toLowerCase() || '';
        const dName = d.departmentName?.toLowerCase() || '';
        const matchSearch = !q || name.includes(q) || spec.includes(q) || dName.includes(q);
        const matchDept = !deptName || dName === deptName.toLowerCase();
        return matchSearch && matchDept;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.ratings?.average || 0) - (a.ratings?.average || 0);
        if (sortBy === 'experience') return (b.experience || 0) - (a.experience || 0);
        if (sortBy === 'fee') return (a.consultationFee || 0) - (b.consultationFee || 0);
        return 0;
      });
  }, [doctors, search, dept, sortBy]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-[116px]">
        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Find Your Doctor</h1>
            <p className="text-blue-200 mb-8">500+ specialists across 25+ departments</p>
            <div className="max-w-2xl mx-auto bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or specialty..." className="pl-9 border-0 focus-visible:ring-0" />
              </div>
              <Select value={dept || 'all'} onValueChange={v => setDept(v === 'all' ? '' : v)}>
                <SelectTrigger className="sm:w-48 border-0 focus:ring-0">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {DEPARTMENTS.map(d => <SelectItem key={d.slug} value={d.slug}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Filters + Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-500 text-sm">{filtered.length} doctors found</p>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
                <SelectItem value="fee">Lowest Fee</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-blue-300" />
              </div>
              <p className="text-gray-600 font-medium text-lg mb-1">No doctors found</p>
              <p className="text-gray-400 text-sm mb-4">
                {search || dept
                  ? 'Try clearing filters or searching with a different term'
                  : 'No doctors are available yet. Run the seed to add sample data.'}
              </p>
              {(search || dept) && (
                <button
                  onClick={() => { setSearch(''); setDept(''); }}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((doc, i) => (
                <motion.div key={doc._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <DoctorCard doctor={doc} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
