'use server';

import { connectDB } from '@/lib/db';
import Appointment from '@/models/Appointment';
import Notification from '@/models/Notification';
import { sendEmail, getAppointmentConfirmationTemplate } from '@/lib/mail';
import { auth } from '@/lib/auth';
import User from '@/models/User';
import Doctor from '@/models/Doctor';
import { bookAppointmentSchema } from '@/schemas/appointment';
import { revalidatePath } from 'next/cache';

export async function bookAppointment(formData) {
  const session = await auth();
  if (!session) return { error: 'Please login to book an appointment' };

  const data = {
    doctorId: formData.get('doctorId'),
    departmentId: formData.get('departmentId'),
    date: formData.get('date'),
    slot: formData.get('slot'),
    type: formData.get('type') || 'in-person',
    symptoms: formData.get('symptoms'),
    isEmergency: formData.get('isEmergency') === 'true',
  };

  const parsed = bookAppointmentSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.errors[0].message };

  try {
    await connectDB();

    const doctor = await User.findById(data.doctorId);
    if (!doctor) return { error: 'Doctor not found' };

    const existing = await Appointment.findOne({
      doctorId: data.doctorId,
      date: new Date(data.date),
      slot: data.slot,
      status: { $in: ['pending', 'confirmed'] },
    });
    if (existing) return { error: 'This slot is already booked. Please choose another.' };

    let deptName = '';
    if (data.departmentId) {
      const mongoose = require('mongoose');
      const Department = require('@/models/Department').default;
      let dept = null;
      if (mongoose.Types.ObjectId.isValid(data.departmentId)) {
        dept = await Department.findById(data.departmentId);
      } else {
        dept = await Department.findOne({ slug: data.departmentId });
      }
      if (dept) {
        deptName = dept.name;
      }
    }

    const mongoose = require('mongoose');
    const appointment = await Appointment.create({
      patientId: session.user.id,
      doctorId: data.doctorId,
      departmentId: mongoose.Types.ObjectId.isValid(data.departmentId) ? data.departmentId : undefined,
      department: deptName || data.departmentId,
      date: new Date(data.date),
      slot: data.slot,
      type: data.type,
      symptoms: data.symptoms,
      isEmergency: data.isEmergency,
      status: 'pending',
    });

    await Notification.create({
      recipient: session.user.id,
      title: 'Appointment Booked',
      message: `Your appointment with Dr. ${doctor.name} has been booked for ${data.date} at ${data.slot}.`,
      type: 'appointment',
      link: '/patient/appointments',
    });

    await Notification.create({
      recipient: data.doctorId,
      title: 'New Appointment',
      message: `New appointment booked by ${session.user.name} for ${data.date} at ${data.slot}.`,
      type: 'appointment',
      link: '/doctor/appointments',
    });

    const patient = await User.findById(session.user.id);
    await sendEmail({
      to: patient.email,
      subject: 'Appointment Booking Confirmation - MediCare Hospital',
      html: getAppointmentConfirmationTemplate({
        patientName: patient.name,
        doctorName: doctor.name,
        department: data.departmentId,
        date: data.date,
        slot: data.slot,
      }),
    });

    revalidatePath('/patient/appointments');
    return { success: true, appointmentId: appointment._id.toString() };
  } catch (err) {
    console.error('Book appointment error:', err);
    return { error: 'Failed to book appointment. Please try again.' };
  }
}

export async function updateAppointmentStatus(appointmentId, status, notes = '') {
  const session = await auth();
  if (!session) return { error: 'Unauthorized' };

  try {
    await connectDB();
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) return { error: 'Appointment not found' };

    const updates = { status, notes };
    if (status === 'completed') updates.completedAt = new Date();

    await Appointment.findByIdAndUpdate(appointmentId, updates);

    await Notification.create({
      recipient: appointment.patientId,
      title: `Appointment ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your appointment status has been updated to ${status}.`,
      type: 'appointment',
    });

    revalidatePath('/patient/appointments');
    revalidatePath('/doctor/appointments');
    revalidatePath('/admin/appointments');
    return { success: true };
  } catch (err) {
    console.error('Update appointment error:', err);
    return { error: 'Failed to update appointment.' };
  }
}

export async function getPatientAppointments() {
  const session = await auth();
  if (!session) return { error: 'Unauthorized', data: [] };

  try {
    await connectDB();
    const appointments = await Appointment.find({ patientId: session.user.id })
      .populate('doctorId', 'name avatar')
      .sort({ date: -1 })
      .limit(20)
      .lean();

    return { data: JSON.parse(JSON.stringify(appointments)) };
  } catch (err) {
    return { error: 'Failed to fetch appointments', data: [] };
  }
}

export async function getDoctorAppointments() {
  const session = await auth();
  if (!session || session.user.role !== 'doctor') return { error: 'Unauthorized', data: [] };

  try {
    await connectDB();
    const appointments = await Appointment.find({ doctorId: session.user.id })
      .populate('patientId', 'name avatar email phone')
      .sort({ date: -1 })
      .limit(50)
      .lean();

    return { data: JSON.parse(JSON.stringify(appointments)) };
  } catch (err) {
    return { error: 'Failed to fetch appointments', data: [] };
  }
}
