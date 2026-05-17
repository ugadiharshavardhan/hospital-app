'use client';

import { motion } from 'framer-motion';
import { Shield, Users, Clock, Award, Heart, Microscope } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'NABH Accredited',
    desc: 'Highest standards of patient care and safety protocols certified by NABH.',
    color: 'text-blue-600 bg-blue-50',
  },
  {
    icon: Users,
    title: '500+ Expert Doctors',
    desc: 'Board-certified specialists with decades of experience across all fields.',
    color: 'text-green-600 bg-green-50',
  },
  {
    icon: Clock,
    title: '24/7 Emergency',
    desc: 'Round-the-clock emergency services with quick response time and critical care.',
    color: 'text-red-600 bg-red-50',
  },
  {
    icon: Award,
    title: 'Award Winning',
    desc: 'Recognized for excellence in healthcare delivery and patient satisfaction.',
    color: 'text-yellow-600 bg-yellow-50',
  },
  {
    icon: Heart,
    title: 'Patient First',
    desc: 'Compassionate care approach ensuring comfort and dignity for every patient.',
    color: 'text-pink-600 bg-pink-50',
  },
  {
    icon: Microscope,
    title: 'Latest Technology',
    desc: 'State-of-the-art diagnostics, robotic surgery, and AI-assisted treatments.',
    color: 'text-purple-600 bg-purple-50',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
            Why MediCare
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Excellence in Healthcare
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            We combine medical expertise with compassionate care to deliver the best healthcare
            experience.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feat.color}`}
              >
                <feat.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feat.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
