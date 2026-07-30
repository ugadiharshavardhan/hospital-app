'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Star, Calendar, Clock, Award, Languages, Phone, Briefcase, GraduationCap, CheckCircle, ArrowLeft } from 'lucide-react';
import { getInitials } from '@/lib/utils';
import { TIME_SLOTS } from '@/utils/constants';

const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function DoctorProfileClient({ doctor }) {
  const user = doctor.userId || {};
  const availableDays = doctor.availability?.filter(d => d.isAvailable) || [];
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'admin';
  const router = useRouter();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
      {/* Back button */}
      <div className="mb-4 -mt-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-950 hover:bg-gray-200/50 -ml-2 gap-1.5 font-medium transition-all"
          onClick={() => router.back()}
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative">
            <Avatar className="w-28 h-28 ring-4 ring-blue-50">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-blue-600 text-white text-3xl font-bold">
                {getInitials(user.name || 'Dr')}
              </AvatarFallback>
            </Avatar>
            {doctor.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-blue-600 font-medium">{doctor.specialization}</p>
                <p className="text-gray-400 text-sm">{doctor.departmentName || doctor.department?.name}</p>

                <div className="flex flex-wrap gap-3 mt-3">
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    {doctor.experience}+ years experience
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-gray-600">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    {doctor.ratings?.average?.toFixed(1) || 'N/A'} ({doctor.ratings?.count || 0} reviews)
                  </div>
                </div>

                {doctor.qualifications?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {doctor.qualifications.map((q, i) => (
                      <Badge key={i} variant="secondary" className="bg-blue-50 text-blue-700">
                        {q.degree}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-left sm:text-right">
                <p className="text-2xl font-bold text-gray-900">₹{doctor.consultationFee}</p>
                <p className="text-gray-400 text-sm">Consultation fee</p>
                {!isAdmin && (
                  <Button className="mt-4 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto" asChild>
                    <Link href={`/appointments/book?doctor=${user._id}`}>
                      <Calendar className="w-4 h-4 mr-2" /> Book Appointment
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs defaultValue="overview">
          <TabsList className="mb-6 bg-white border border-gray-100">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            {doctor.bio && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-3">About Dr. {user.name?.split(' ').slice(-1)}</h2>
                <p className="text-gray-600 leading-relaxed">{doctor.bio}</p>
              </div>
            )}

            {doctor.languages?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Languages className="w-4 h-4 text-blue-500" /> Languages Spoken
                </h2>
                <div className="flex flex-wrap gap-2">
                  {doctor.languages.map(lang => (
                    <Badge key={lang} variant="secondary">{lang}</Badge>
                  ))}
                </div>
              </div>
            )}

            {doctor.awards?.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4 text-yellow-500" /> Awards & Recognition
                </h2>
                <ul className="space-y-2">
                  {doctor.awards.map((award, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      {award}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Online Consultation */}
            {doctor.isAvailableForOnline && (
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Online Consultation Available</p>
                    <p className="text-gray-500 text-sm">Book a video call consultation from home</p>
                  </div>
                  {!isAdmin && (
                    <Button className="ml-auto bg-blue-600 hover:bg-blue-700" size="sm" asChild>
                      <Link href={`/appointments/book?doctor=${user._id}&type=online`}>Book Online</Link>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="availability">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Weekly Availability</h2>
              {availableDays.length === 0 ? (
                <p className="text-gray-400 text-center py-8">Availability schedule not set</p>
              ) : (
                <div className="space-y-4">
                  {dayOrder.map(day => {
                    const schedule = doctor.availability?.find(d => d.day === day);
                    if (!schedule?.isAvailable) return (
                      <div key={day} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                        <div className="w-28">
                          <p className="font-medium text-sm text-gray-400">{day}</p>
                        </div>
                        <span className="text-xs text-gray-300 bg-gray-50 px-3 py-1 rounded-full">Unavailable</span>
                      </div>
                    );
                    return (
                      <div key={day} className="py-3 border-b border-gray-50 last:border-0">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="w-28">
                            <p className="font-semibold text-sm text-gray-900">{day}</p>
                          </div>
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-sm text-gray-500">{schedule.startTime} - {schedule.endTime}</span>
                        </div>
                        {schedule.slots?.length > 0 && (
                          <div className="flex flex-wrap gap-2 ml-32">
                            {schedule.slots.map(slot => (
                              <span key={slot} className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2.5 py-1 rounded-full">
                                {slot}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="qualifications">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Education & Training</h2>
              {doctor.qualifications?.length === 0 ? (
                <p className="text-gray-400">No qualifications listed</p>
              ) : (
                <div className="space-y-4">
                  {doctor.qualifications?.map((q, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                        <GraduationCap className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{q.degree}</p>
                        <p className="text-gray-600 text-sm">{q.institution}</p>
                        {q.year && <p className="text-gray-400 text-xs mt-0.5">Year: {q.year}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
