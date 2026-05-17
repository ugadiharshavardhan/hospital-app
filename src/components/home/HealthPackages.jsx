'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const packages = [
  {
    name: 'Basic Health Checkup',
    price: '₹999',
    original: '₹1,499',
    badge: 'Popular',
    color: 'border-blue-200 hover:border-blue-400',
    buttonColor: 'bg-blue-600 hover:bg-blue-700',
    tests: [
      'Complete Blood Count',
      'Blood Sugar Fasting',
      'Urine Routine',
      'Chest X-Ray',
      'ECG',
      'BMI Assessment',
    ],
  },
  {
    name: 'Comprehensive Wellness',
    price: '₹2,499',
    original: '₹3,999',
    badge: 'Best Value',
    color: 'border-green-200 hover:border-green-400 bg-green-50/50',
    buttonColor: 'bg-green-600 hover:bg-green-700',
    tests: [
      'Full Body Checkup',
      'Thyroid Profile',
      'Lipid Profile',
      'Liver Function',
      'Kidney Function',
      'Vitamin D & B12',
      'Cancer Markers',
      'Consultation',
    ],
  },
  {
    name: 'Senior Citizen Care',
    price: '₹3,499',
    original: '₹5,499',
    badge: 'Premium',
    color: 'border-purple-200 hover:border-purple-400',
    buttonColor: 'bg-purple-600 hover:bg-purple-700',
    tests: [
      'Cardiac Profile',
      'Bone Density',
      'Eye Screening',
      'Dental Checkup',
      'Diabetes Panel',
      'Arthritis Markers',
      'Memory Assessment',
      'Dietitian Consultation',
    ],
  },
];

export function HealthPackages() {
  return (
    <section className="py-20 bg-gray-50" id="packages">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Health Packages
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Comprehensive Health Checkups
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Preventive health packages designed for every age and lifestyle. Early detection saves
            lives.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className={`bg-white rounded-2xl p-6 border-2 transition-all shadow-sm hover:shadow-lg ${pkg.color}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-xs mb-2">
                    {pkg.badge}
                  </Badge>
                  <h3 className="font-bold text-gray-900 text-lg">{pkg.name}</h3>
                </div>
              </div>
              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900">{pkg.price}</span>
                <span className="text-gray-400 line-through text-sm ml-2">{pkg.original}</span>
              </div>
              <ul className="space-y-2 mb-6">
                {pkg.tests.map((test) => (
                  <li key={test} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    {test}
                  </li>
                ))}
              </ul>
              <Button className={`w-full text-white ${pkg.buttonColor}`} asChild>
                <Link href="/appointments/book">
                  Book Now <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
