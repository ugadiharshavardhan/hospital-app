import { z } from 'zod';

export const bookAppointmentSchema = z.object({
  doctorId: z.string().min(1, 'Please select a doctor'),
  departmentId: z.string().min(1, 'Please select a department'),
  date: z.string().min(1, 'Please select a date'),
  slot: z.string().min(1, 'Please select a time slot'),
  type: z.enum(['in-person', 'online']).default('in-person'),
  symptoms: z.string().max(500).optional(),
  isEmergency: z.boolean().default(false),
});

export const updateAppointmentSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled']),
  notes: z.string().max(1000).optional(),
  cancelReason: z.string().max(500).optional(),
});

export const prescriptionSchema = z.object({
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  medicines: z.array(z.object({
    name: z.string().min(1, 'Medicine name is required'),
    dosage: z.string(),
    frequency: z.string(),
    duration: z.string(),
    instructions: z.string().optional(),
  })).min(1, 'At least one medicine is required'),
  notes: z.string().optional(),
  followUpDate: z.string().optional(),
});
