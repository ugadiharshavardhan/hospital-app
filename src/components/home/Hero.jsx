'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Phone, Shield, Award, Clock } from 'lucide-react';
import { EMERGENCY_NUMBER } from '@/utils/constants';

import { useSession } from 'next-auth/react';

export function Hero() {
  const { data: session } = useSession();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 pt-[116px]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating blobs */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: '1s' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-blue-700/50 border border-blue-500/30 text-blue-200 px-4 py-2 rounded-full text-sm font-medium mb-6"
            >
              <Shield className="w-4 h-4" />
              NABH Accredited Hospital
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Your Health,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-300">
                Our Priority
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-blue-200 text-lg leading-relaxed mb-8 max-w-xl"
            >
              Experience world-class healthcare with our team of 500+ expert doctors across 25+
              specialties. Modern facilities, compassionate care, and cutting-edge treatments — all
              under one roof.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap gap-4"
            >
              {session?.user?.role === 'admin' ? (
                <Button
                  size="lg"
                  className="bg-white text-blue-900 hover:bg-blue-50 font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  asChild
                >
                  <Link href="/admin">
                    <Calendar className="w-5 h-5 mr-2" />
                    Admin Dashboard
                  </Link>
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="bg-white text-blue-900 hover:bg-blue-50 font-semibold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
                  asChild
                >
                  <Link href="/appointments/book">
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Appointment
                  </Link>
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                className="border-red-400 text-red-300 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all"
                asChild
              >
                <a href={`tel:${EMERGENCY_NUMBER}`}>
                  <Phone className="w-5 h-5 mr-2" />
                  Emergency Care
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-6 mt-10"
            >
              {[
                { icon: Shield, text: 'NABH Certified' },
                { icon: Award, text: 'ISO 9001:2015' },
                { icon: Clock, text: '24/7 Emergency' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-blue-200 text-sm">
                  <item.icon className="w-4 h-4 text-teal-400" />
                  {item.text}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Card Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            {[
              {
                icon: '🫀',
                title: 'Cardiology',
                desc: 'Heart specialist care',
                color: 'from-red-500/20 to-red-600/20',
              },
              {
                icon: '🧠',
                title: 'Neurology',
                desc: 'Brain & nerve treatment',
                color: 'from-purple-500/20 to-purple-600/20',
              },
              {
                icon: '🦴',
                title: 'Orthopedics',
                desc: 'Bone & joint care',
                color: 'from-blue-500/20 to-blue-600/20',
              },
              {
                icon: '👶',
                title: 'Pediatrics',
                desc: 'Child healthcare',
                color: 'from-green-500/20 to-green-600/20',
              },
              {
                icon: '🔬',
                title: 'Diagnostics',
                desc: 'Advanced lab tests',
                color: 'from-yellow-500/20 to-yellow-600/20',
              },
              {
                icon: '🚑',
                title: 'Emergency',
                desc: '24/7 emergency care',
                color: 'from-orange-500/20 to-red-600/20',
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className={`bg-gradient-to-br ${card.color} backdrop-blur-sm border border-white/10 rounded-2xl p-5 cursor-pointer hover:border-white/20 transition-all`}
              >
                <div className="text-3xl mb-2">{card.icon}</div>
                <h3 className="text-white font-semibold text-sm">{card.title}</h3>
                <p className="text-blue-200 text-xs mt-1">{card.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
