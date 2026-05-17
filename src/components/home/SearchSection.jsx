'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DEPARTMENTS } from '@/utils/constants';

export function SearchSection() {
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (department) params.set('dept', department);
    router.push(`/doctors?${params.toString()}`);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Find the Right Doctor</h2>
          <p className="text-gray-500">Search from 500+ specialists across all departments</p>
        </motion.div>

        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-2 flex flex-col sm:flex-row gap-2"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search doctor, specialty..."
              className="pl-9 border-0 focus-visible:ring-0 bg-transparent text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="w-px bg-gray-100 hidden sm:block" />
          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="flex-1 px-3 py-2 bg-transparent text-gray-700 text-sm focus:outline-none cursor-pointer"
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.slug} value={d.slug}>
                {d.name}
              </option>
            ))}
          </select>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 px-6 rounded-xl">
            Search Doctors
          </Button>
        </motion.form>

        <div className="flex flex-wrap gap-2 mt-4 justify-center">
          {['Cardiologist', 'Neurologist', 'Orthopedic', 'Pediatrician', 'ENT Specialist'].map(
            (tag) => (
              <button
                key={tag}
                onClick={() => {
                  setQuery(tag);
                  router.push(`/doctors?q=${tag}`);
                }}
                className="text-xs text-gray-500 hover:text-blue-600 bg-white hover:bg-blue-50 border hover:border-blue-200 px-3 py-1 rounded-full transition-all"
              >
                {tag}
              </button>
            )
          )}
        </div>
      </div>
    </section>
  );
}
