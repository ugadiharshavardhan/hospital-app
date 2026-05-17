'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookAppointmentSchema } from '@/schemas/appointment';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Check, Calendar, User, Clock, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { TIME_SLOTS } from '@/utils/constants';
import axios from 'axios';

const steps = ['Department', 'Doctor', 'Date & Time', 'Confirm'];

export function BookingWizard({ doctors, departments, preselectedDoctor }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(bookAppointmentSchema),
    defaultValues: {
      departmentId: '',
      doctorId: preselectedDoctor || '',
      date: '',
      slot: '',
      type: 'in-person',
      symptoms: '',
      isEmergency: false,
    },
  });

  const watchDept = form.watch('departmentId');
  const watchDoctor = form.watch('doctorId');

  const filteredDoctors = watchDept
    ? doctors.filter(d => {
        const dept = departments.find(dep => dep._id === watchDept || dep.slug === watchDept);
        return d.departmentName?.toLowerCase() === dept?.name?.toLowerCase();
      })
    : doctors;

  const selectedDoctor = doctors.find(d => (d.userId?._id || d.userId) === watchDoctor || d._id === watchDoctor);

  const handleNext = async () => {
    const fieldMap = [
      ['departmentId'],
      ['doctorId'],
      ['date', 'slot'],
      [],
    ];
    const valid = await form.trigger(fieldMap[step]);
    if (valid) setStep(s => Math.min(s + 1, steps.length - 1));
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      await axios.post('/api/appointments', values);
      toast.success('Appointment booked successfully!');
      router.push('/patient/appointments');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100">
      {/* Progress Steps */}
      <div className="px-6 pt-6 pb-0">
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-xs font-medium hidden sm:block ${i === step ? 'text-blue-600' : 'text-gray-400'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-green-400' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-5">
          <AnimatePresence mode="wait">
            {/* Step 0: Department */}
            {step === 0 && (
              <motion.div key="dept" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Department</h2>
                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department</FormLabel>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                        {departments.map(dept => (
                          <button
                            key={dept._id || dept.slug}
                            type="button"
                            onClick={() => field.onChange(dept._id || dept.slug)}
                            className={`p-3 rounded-xl border-2 text-left transition-all ${field.value === (dept._id || dept.slug) ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                          >
                            <div className="text-2xl mb-1">{dept.icon}</div>
                            <p className="text-xs font-medium text-gray-900">{dept.name}</p>
                          </button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}

            {/* Step 1: Doctor */}
            {step === 1 && (
              <motion.div key="doc" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Choose Doctor</h2>
                <FormField
                  control={form.control}
                  name="doctorId"
                  render={({ field }) => (
                    <FormItem>
                      <div className="space-y-2">
                        {filteredDoctors.map(doc => (
                          <button
                            key={doc._id}
                            type="button"
                            onClick={() => field.onChange(doc.userId?._id || doc._id)}
                            className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${field.value === (doc.userId?._id || doc._id) ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}
                          >
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                              {(doc.userId?.name || 'Dr').charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">{doc.userId?.name}</p>
                              <p className="text-sm text-blue-600">{doc.specialization}</p>
                              <p className="text-xs text-gray-400">{doc.experience}y exp • ₹{doc.consultationFee}</p>
                            </div>
                            {field.value === (doc.userId?._id || doc._id) && <Check className="w-5 h-5 text-blue-600 ml-auto" />}
                          </button>
                        ))}
                        {filteredDoctors.length === 0 && <p className="text-gray-400 text-center py-8">No doctors available for this department</p>}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}

            {/* Step 2: Date & Time */}
            {step === 2 && (
              <motion.div key="time" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Select Date &amp; Time</h2>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} min={new Date().toISOString().split('T')[0]} className="w-full" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Slot</FormLabel>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                        {TIME_SLOTS.map(slot => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => field.onChange(slot)}
                            className={`py-2 px-3 rounded-lg text-xs font-medium border transition-all ${field.value === slot ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:border-blue-300'}`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Consultation Type</FormLabel>
                      <div className="grid grid-cols-2 gap-3">
                        {[{ v: 'in-person', l: '🏥 In-Person' }, { v: 'online', l: '💻 Online' }].map(t => (
                          <button key={t.v} type="button" onClick={() => field.onChange(t.v)}
                            className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${field.value === t.v ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-600'}`}>
                            {t.l}
                          </button>
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Symptoms / Reason (optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Briefly describe your symptoms..." rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Confirm Appointment</h2>
                <div className="bg-blue-50 rounded-2xl p-5 space-y-3">
                  {[
                    { label: 'Doctor', value: selectedDoctor?.userId?.name || 'Selected Doctor' },
                    { label: 'Specialty', value: selectedDoctor?.specialization || '-' },
                    { label: 'Date', value: form.watch('date') },
                    { label: 'Time', value: form.watch('slot') },
                    { label: 'Type', value: form.watch('type') },
                    { label: 'Fee', value: `₹${selectedDoctor?.consultationFee || 0}` },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-medium text-gray-900 capitalize">{value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-4 text-center">
                  By confirming, you agree to our appointment policy. You'll receive an email confirmation.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setStep(s => Math.max(s - 1, 0))} disabled={step === 0}>
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>
            {step < steps.length - 1 ? (
              <Button type="button" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                Next <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Confirm Booking
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
