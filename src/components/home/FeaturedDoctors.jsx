'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

const doctors = [
  {
    name: 'Dr. Rajesh Kumar',
    specialty: 'Cardiologist',
    experience: '15 Years',
    rating: 4.8,
    reviews: 234,
    fee: '₹1,500',
    available: true,
  },
  {
    name: 'Dr. Priya Sharma',
    specialty: 'Neurologist',
    experience: '12 Years',
    rating: 4.7,
    reviews: 189,
    fee: '₹1,200',
    available: true,
  },
  {
    name: 'Dr. Arjun Mehta',
    specialty: 'Orthopedic Surgeon',
    experience: '18 Years',
    rating: 4.9,
    reviews: 312,
    fee: '₹1,800',
    available: false,
  },
  {
    name: 'Dr. Sneha Patel',
    specialty: 'Pediatrician',
    experience: '10 Years',
    rating: 4.8,
    reviews: 267,
    fee: '₹800',
    available: true,
  },
];

export function FeaturedDoctors() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12"
        >
          <div>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
              Our Specialists
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
              Meet Our Expert Doctors
            </h2>
            <p className="text-gray-500 mt-2">Experienced specialists committed to your health</p>
          </div>
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:gap-3 transition-all mt-4 sm:mt-0"
          >
            View All Doctors <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.map((doc, i) => (
            <motion.div
              key={doc.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-20 h-20 mb-4 ring-4 ring-blue-50">
                  <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
                    {getInitials(doc.name)}
                  </AvatarFallback>
                </Avatar>
                <Badge
                  variant={doc.available ? 'default' : 'secondary'}
                  className={`mb-3 text-xs ${
                    doc.available
                      ? 'bg-green-100 text-green-700 hover:bg-green-100'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {doc.available ? '● Available' : 'Unavailable'}
                </Badge>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {doc.name}
                </h3>
                <p className="text-blue-600 text-sm font-medium">{doc.specialty}</p>
                <p className="text-gray-400 text-xs mt-0.5">{doc.experience} Experience</p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-semibold">{doc.rating}</span>
                  <span className="text-gray-400 text-xs">({doc.reviews})</span>
                </div>
                <div className="mt-3 pt-3 border-t w-full">
                  <p className="text-xs text-gray-500 mb-3">
                    Consultation:{' '}
                    <span className="font-semibold text-gray-900">{doc.fee}</span>
                  </p>
                  <Button
                    size="sm"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-xs"
                    asChild
                  >
                    <Link href="/appointments/book">
                      <Calendar className="w-3 h-3 mr-1" /> Book Now
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
