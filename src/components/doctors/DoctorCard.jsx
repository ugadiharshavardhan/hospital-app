'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Calendar, Clock } from 'lucide-react';
import { getInitials } from '@/lib/utils';

export function DoctorCard({ doctor }) {
  const user = doctor.userId || {};
  const isAvailable = doctor.availability?.some(d => d.isAvailable);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-lg transition-all"
    >
      <div className="flex flex-col items-center text-center">
        <div className="relative">
          <Avatar className="w-20 h-20 mb-3 ring-4 ring-blue-50">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-blue-600 text-white text-xl font-bold">
              {getInitials(user.name || 'Dr')}
            </AvatarFallback>
          </Avatar>
          <div className={`absolute bottom-2 right-0 w-4 h-4 rounded-full border-2 border-white ${isAvailable ? 'bg-green-400' : 'bg-gray-300'}`} />
        </div>

        <Badge variant="secondary" className={`text-xs mb-2 ${isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {isAvailable ? '● Available' : 'Not Available'}
        </Badge>

        <h3 className="font-bold text-gray-900 hover:text-blue-600 transition-colors">{user.name}</h3>
        <p className="text-blue-600 text-sm font-medium">{doctor.specialization}</p>
        <p className="text-gray-400 text-xs mt-0.5">{doctor.departmentName}</p>

        {doctor.qualifications?.length > 0 && (
          <p className="text-xs text-gray-500 mt-1">{doctor.qualifications.map(q => q.degree).join(', ')}</p>
        )}

        <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {doctor.experience || 0}y Exp
          </span>
          <span className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            {doctor.ratings?.average?.toFixed(1) || 'N/A'}
          </span>
        </div>

        <div className="w-full border-t mt-4 pt-4">
          <p className="text-xs text-gray-400 mb-3">
            Consultation: <span className="font-semibold text-gray-900">₹{doctor.consultationFee}</span>
          </p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1 text-xs" asChild>
              <Link href={`/doctors/${user._id}`}>View Profile</Link>
            </Button>
            <Button size="sm" className="flex-1 text-xs bg-blue-600 hover:bg-blue-700" asChild>
              <Link href={`/appointments/book?doctor=${user._id}`}>
                <Calendar className="w-3 h-3 mr-1" /> Book
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
