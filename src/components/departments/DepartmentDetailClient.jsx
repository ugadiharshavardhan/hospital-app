'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DoctorCard } from '@/components/doctors/DoctorCard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calendar, Clock, Check, ArrowRight, Stethoscope } from 'lucide-react';

export function DepartmentDetailClient({ department, doctors }) {
  const colorMap = {
    red: 'from-red-900 via-red-800 to-red-700',
    purple: 'from-purple-900 via-purple-800 to-purple-700',
    blue: 'from-blue-900 via-blue-800 to-blue-700',
    green: 'from-green-900 via-green-800 to-green-700',
    yellow: 'from-yellow-900 via-yellow-800 to-yellow-700',
    orange: 'from-orange-900 via-orange-800 to-orange-700',
    teal: 'from-teal-900 via-teal-800 to-teal-700',
    pink: 'from-pink-900 via-pink-800 to-pink-700',
  };

  const gradient = colorMap[department.color] || colorMap.blue;

  return (
    <div>
      {/* Hero */}
      <div className={`bg-gradient-to-br ${gradient} py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/departments" className="text-white/60 hover:text-white text-sm">Departments</Link>
            <span className="text-white/40">/</span>
            <span className="text-white text-sm">{department.name}</span>
          </div>
          <div className="flex items-start gap-6">
            <div className="text-6xl">{department.icon}</div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-3">{department.name}</h1>
              <p className="text-white/70 text-lg max-w-2xl">{department.description}</p>
              {department.timings && (
                <p className="text-white/60 text-sm flex items-center gap-2 mt-3">
                  <Clock className="w-4 h-4" /> {department.timings}
                </p>
              )}
              <div className="flex gap-3 mt-6">
                <Button className="bg-white text-gray-900 hover:bg-gray-100" asChild>
                  <Link href={`/appointments/book`}>
                    <Calendar className="w-4 h-4 mr-2" /> Book Appointment
                  </Link>
                </Button>
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                  <Link href="/doctors">Find Doctors</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Overview & Treatments */}
        <div className="grid lg:grid-cols-2 gap-8">
          {department.longDescription && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Department Overview</h2>
              <p className="text-gray-600 leading-relaxed">{department.longDescription}</p>
            </div>
          )}

          {department.treatments?.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                <Stethoscope className="w-5 h-5 inline mr-2 text-blue-500" />
                Treatments Available
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {department.treatments.map((t) => (
                  <div key={t} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 shrink-0" />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Doctors */}
        {doctors.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Department Specialists</h2>
              <Link href={`/doctors?dept=${department.slug}`} className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {doctors.map((doc) => (
                <DoctorCard key={doc._id} doctor={doc} />
              ))}
            </div>
          </motion.div>
        )}

        {/* FAQ */}
        {department.faqs?.length > 0 && (
          <div className="max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-3">
              {department.faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="bg-white rounded-xl border border-gray-100 px-5 shadow-sm"
                >
                  <AccordionTrigger className="text-left text-sm font-medium hover:no-underline hover:text-blue-600">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500 text-sm">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
}
