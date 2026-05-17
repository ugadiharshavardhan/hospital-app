'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  FileText, Plus, Trash2, Loader2, Calendar,
  Pill, User, ClipboardList, ChevronRight, Stethoscope,
} from 'lucide-react';
import { toast } from 'sonner';
import { getInitials } from '@/lib/utils';
import { formatShortDate } from '@/utils/formatters';
import axios from 'axios';

const FREQUENCIES = ['Once daily', 'Twice daily', 'Three times daily', 'Four times daily', 'Every 6 hours', 'Every 8 hours', 'As needed', 'At bedtime'];
const DURATIONS  = ['3 days', '5 days', '7 days', '10 days', '14 days', '1 month', '2 months', '3 months', 'Ongoing'];

export function DoctorPrescriptionsClient({ prescriptions: initial, appointments, doctorId }) {
  const [prescriptions, setPrescriptions] = useState(initial);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const { register, control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      patientId: '',
      appointmentId: '',
      diagnosis: '',
      notes: '',
      followUpDate: '',
      medicines: [{ name: '', dosage: '', frequency: 'Once daily', duration: '7 days', instructions: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'medicines' });

  const watchAppointment = watch('appointmentId');

  // Auto-fill patient when appointment is selected
  const handleAppointmentChange = (e) => {
    const apptId = e.target.value;
    setValue('appointmentId', apptId);
    const appt = appointments.find(a => a._id === apptId);
    if (appt?.patientId?._id) setValue('patientId', appt.patientId._id);
  };

  const onSubmit = async (values) => {
    if (!values.patientId) { toast.error('Please select an appointment or patient'); return; }
    if (!values.diagnosis)  { toast.error('Diagnosis is required'); return; }

    setLoading(true);
    try {
      const { data } = await axios.post('/api/prescriptions', values);
      toast.success('Prescription created successfully!');
      setPrescriptions(prev => [{ ...data.data, patientId: appointments.find(a => a._id === values.appointmentId)?.patientId }, ...prev]);
      reset();
      setOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create prescription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pt-14 lg:pt-0">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-500 text-sm">{prescriptions.length} prescriptions issued</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> New Prescription
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-blue-600" /> Create Prescription
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-2">
              {/* Appointment / Patient */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Link to Appointment</Label>
                  <select
                    value={watchAppointment}
                    onChange={handleAppointmentChange}
                    className="w-full h-10 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select appointment (optional)</option>
                    {appointments.map(a => (
                      <option key={a._id} value={a._id}>
                        {a.patientId?.name} — {formatShortDate(a.date)} {a.slot}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Patient ID</Label>
                  <Input {...register('patientId')} placeholder="Auto-filled or paste patient ID" readOnly={!!watchAppointment} className={watchAppointment ? 'bg-gray-50 text-gray-500' : ''} />
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <Label className="text-gray-700 mb-1.5 block">Diagnosis <span className="text-red-500">*</span></Label>
                <Input {...register('diagnosis')} placeholder="e.g. Hypertension Stage 2, Type 2 Diabetes" />
              </div>

              <Separator />

              {/* Medicines */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-gray-700 font-semibold flex items-center gap-2">
                    <Pill className="w-4 h-4 text-blue-500" /> Medicines <span className="text-red-500">*</span>
                  </Label>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => append({ name: '', dosage: '', frequency: 'Once daily', duration: '7 days', instructions: '' })}
                    className="text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Medicine
                  </Button>
                </div>

                <div className="space-y-3">
                  {fields.map((field, idx) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 relative"
                    >
                      <p className="text-xs font-semibold text-blue-600 mb-3">Medicine {idx + 1}</p>
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <Label className="text-gray-600 text-xs mb-1 block">Medicine Name *</Label>
                          <Input {...register(`medicines.${idx}.name`)} placeholder="e.g. Amlodipine 5mg" className="h-9 text-sm" />
                        </div>
                        <div>
                          <Label className="text-gray-600 text-xs mb-1 block">Dosage</Label>
                          <Input {...register(`medicines.${idx}.dosage`)} placeholder="e.g. 5mg, 1 tablet" className="h-9 text-sm" />
                        </div>
                        <div>
                          <Label className="text-gray-600 text-xs mb-1 block">Frequency</Label>
                          <select
                            {...register(`medicines.${idx}.frequency`)}
                            className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {FREQUENCIES.map(f => <option key={f} value={f}>{f}</option>)}
                          </select>
                        </div>
                        <div>
                          <Label className="text-gray-600 text-xs mb-1 block">Duration</Label>
                          <select
                            {...register(`medicines.${idx}.duration`)}
                            className="w-full h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                          </select>
                        </div>
                        <div className="sm:col-span-2">
                          <Label className="text-gray-600 text-xs mb-1 block">Special Instructions</Label>
                          <Input {...register(`medicines.${idx}.instructions`)} placeholder="e.g. Take after food, Avoid sunlight" className="h-9 text-sm" />
                        </div>
                      </div>
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(idx)}
                          className="absolute top-3 right-3 text-red-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Notes & Follow-up */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label className="text-gray-700 mb-1.5 block">Doctor's Notes</Label>
                  <Textarea {...register('notes')} rows={2} placeholder="Lifestyle advice, dietary restrictions, warnings..." />
                </div>
                <div>
                  <Label className="text-gray-700 mb-1.5 block">Follow-up Date</Label>
                  <Input {...register('followUpDate')} type="date" min={new Date().toISOString().split('T')[0]} />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => { reset(); setOpen(false); }}>Cancel</Button>
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</> : <><FileText className="w-4 h-4 mr-2" /> Create Prescription</>}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Prescription List */}
        <div className="lg:col-span-2 space-y-3">
          {prescriptions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <FileText className="w-10 h-10 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No prescriptions yet.</p>
              <p className="text-gray-300 text-xs mt-1">Click "New Prescription" to get started.</p>
            </div>
          ) : (
            prescriptions.map((p, i) => (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedPrescription(p)}
                className={`bg-white rounded-2xl border p-4 cursor-pointer hover:shadow-md transition-all ${selectedPrescription?._id === p._id ? 'border-blue-400 shadow-md ring-1 ring-blue-200' : 'border-gray-100'}`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-9 h-9 shrink-0">
                    <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-bold">
                      {getInitials(p.patientId?.name || 'P')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{p.patientId?.name || 'Patient'}</p>
                    <p className="text-blue-600 text-xs font-medium truncate">{p.diagnosis}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-400 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {formatShortDate(p.createdAt)}
                      </span>
                      <span className="text-gray-300">·</span>
                      <span className="text-gray-400 text-xs">{p.medicines?.length || 0} medicine{p.medicines?.length !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 shrink-0 mt-1" />
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Prescription Detail */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {selectedPrescription ? (
              <motion.div
                key={selectedPrescription._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                {/* Detail Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12 ring-2 ring-white/30">
                      <AvatarFallback className="bg-white/20 text-white font-bold">
                        {getInitials(selectedPrescription.patientId?.name || 'P')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-white font-bold text-lg">{selectedPrescription.patientId?.name || 'Patient'}</p>
                      <p className="text-blue-200 text-sm">{selectedPrescription.patientId?.email}</p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className="text-white font-semibold text-sm">{formatShortDate(selectedPrescription.createdAt)}</p>
                      <Badge className="bg-white/20 text-white hover:bg-white/20 text-xs mt-1">
                        {selectedPrescription.isActive ? 'Active' : 'Completed'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Diagnosis */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider mb-1">Diagnosis</p>
                    <p className="text-gray-900 font-semibold">{selectedPrescription.diagnosis}</p>
                  </div>

                  {/* Medicines */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
                      <Pill className="w-4 h-4 text-blue-500" /> Prescribed Medicines
                    </p>
                    <div className="space-y-2">
                      {selectedPrescription.medicines?.map((m, i) => (
                        <div key={i} className="bg-gray-50 rounded-xl p-3 flex items-start gap-3">
                          <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold text-blue-600">{i + 1}</div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm">{m.name}</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {m.dosage && <span className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{m.dosage}</span>}
                              {m.frequency && <span className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{m.frequency}</span>}
                              {m.duration && <span className="text-xs bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded-full">{m.duration}</span>}
                            </div>
                            {m.instructions && <p className="text-xs text-gray-400 mt-1 italic">{m.instructions}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  {selectedPrescription.notes && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                      <p className="text-xs font-semibold text-amber-600 mb-1">Doctor's Notes</p>
                      <p className="text-gray-700 text-sm">{selectedPrescription.notes}</p>
                    </div>
                  )}

                  {/* Follow-up */}
                  {selectedPrescription.followUpDate && (
                    <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl p-3">
                      <Calendar className="w-5 h-5 text-green-500 shrink-0" />
                      <div>
                        <p className="text-xs text-green-600 font-semibold">Follow-up Appointment</p>
                        <p className="text-gray-700 text-sm font-medium">{formatShortDate(selectedPrescription.followUpDate)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border border-gray-100 p-16 text-center"
              >
                <ClipboardList className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400">Select a prescription to view details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
