'use client';

import { motion } from 'framer-motion';
import { Phone, AlertCircle } from 'lucide-react';
import { EMERGENCY_NUMBER } from '@/utils/constants';

export function EmergencyBanner() {
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white py-2 px-4 text-center overflow-hidden"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm">
        <AlertCircle className="w-4 h-4 shrink-0 animate-pulse" />
        <span className="font-medium">24/7 Emergency Services Available</span>
        <span className="hidden sm:block">•</span>
        <a
          href={`tel:${EMERGENCY_NUMBER}`}
          className="flex items-center gap-1.5 font-bold hover:underline"
        >
          <Phone className="w-4 h-4" />
          {EMERGENCY_NUMBER}
        </a>
      </div>
    </motion.div>
  );
}
