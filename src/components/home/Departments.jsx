'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { DEPARTMENTS } from '@/utils/constants';

const colorMap = {
  red: 'bg-red-50 hover:bg-red-100 border-red-100',
  purple: 'bg-purple-50 hover:bg-purple-100 border-purple-100',
  blue: 'bg-blue-50 hover:bg-blue-100 border-blue-100',
  green: 'bg-green-50 hover:bg-green-100 border-green-100',
  yellow: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-100',
  pink: 'bg-pink-50 hover:bg-pink-100 border-pink-100',
  teal: 'bg-teal-50 hover:bg-teal-100 border-teal-100',
  orange: 'bg-orange-50 hover:bg-orange-100 border-orange-100',
};

export function Departments() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Our Specialties
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">
            World-Class Medical Departments
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Comprehensive healthcare services across 25+ specialties with experienced doctors and
            modern equipment.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {DEPARTMENTS.map((dept, i) => (
            <motion.div
              key={dept.slug}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <Link
                href={`/departments/${dept.slug}`}
                className={`block p-5 rounded-2xl border transition-all cursor-pointer group ${
                  colorMap[dept.color] || 'bg-gray-50 hover:bg-gray-100 border-gray-100'
                }`}
              >
                <div className="text-3xl mb-3">{dept.icon}</div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{dept.name}</h3>
                <p className="text-gray-500 text-xs line-clamp-2">{dept.description}</p>
                <div className="flex items-center gap-1 mt-3 text-blue-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            href="/departments"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all"
          >
            View All Departments <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
