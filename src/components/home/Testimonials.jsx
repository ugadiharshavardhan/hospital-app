'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'Rahul Verma',
    role: 'Software Engineer',
    text: 'Excellent healthcare experience. The doctors are very professional and took great care of my cardiac condition. The online booking system is very convenient.',
    rating: 5,
    dept: 'Cardiology',
  },
  {
    name: 'Sunita Reddy',
    role: 'Teacher',
    text: 'My child was treated here and the pediatrics department is exceptional. The doctors explained everything clearly and the staff were very kind and patient.',
    rating: 5,
    dept: 'Pediatrics',
  },
  {
    name: 'Mohit Gupta',
    role: 'Business Owner',
    text: "Had a knee replacement surgery here. Excellent surgical team and post-operative care. I'm fully recovered and very grateful for the orthopedics team.",
    rating: 5,
    dept: 'Orthopedics',
  },
  {
    name: 'Deepa Krishnan',
    role: 'Homemaker',
    text: 'The neurology department gave my mother her life back after a stroke. The treatment was world-class and the support from nurses was phenomenal.',
    rating: 5,
    dept: 'Neurology',
  },
  {
    name: 'Arun Sinha',
    role: 'Retired Officer',
    text: "MediCare's senior citizen care package was perfect for my annual health check. Thorough diagnostics and the doctors explained each report in detail.",
    rating: 4,
    dept: 'General Medicine',
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  };
  const next = () => {
    setDirection(1);
    setCurrent((c) => (c + 1) % testimonials.length);
  };

  const t = testimonials[current];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Patient Stories
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2">
            What Our Patients Say
          </h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 50 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 md:p-12 relative"
            >
              <Quote className="w-10 h-10 text-blue-200 absolute top-6 right-6" />
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-lg leading-relaxed mb-8">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-blue-600 text-white font-bold">
                      {t.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{t.name}</p>
                    <p className="text-gray-500 text-sm">
                      {t.role} · {t.dept} Patient
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1);
                    setCurrent(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current ? 'bg-blue-600 w-6' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
