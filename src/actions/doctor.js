'use server';

import { connectDB } from '@/lib/db';
import Doctor from '@/models/Doctor';
import User from '@/models/User';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getDoctors({ department, search, page = 1, limit = 12 } = {}) {
  try {
    await connectDB();

    const query = { isActive: true };
    if (department) query.departmentName = { $regex: department, $options: 'i' };

    const doctors = await Doctor.find(query)
      .populate('userId', 'name email avatar phone')
      .populate('department', 'name slug')
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const total = await Doctor.countDocuments(query);

    if (search) {
      const filtered = doctors.filter((d) =>
        d.userId?.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization?.toLowerCase().includes(search.toLowerCase())
      );
      return { data: JSON.parse(JSON.stringify(filtered)), total };
    }

    return { data: JSON.parse(JSON.stringify(doctors)), total };
  } catch (err) {
    console.error('Get doctors error:', err);
    return { data: [], total: 0 };
  }
}

export async function getDoctorById(id) {
  try {
    await connectDB();
    const doctor = await Doctor.findOne({ userId: id })
      .populate('userId', 'name email avatar phone')
      .populate('department', 'name slug')
      .lean();
    return { data: JSON.parse(JSON.stringify(doctor)) };
  } catch (err) {
    return { error: 'Doctor not found', data: null };
  }
}

export async function updateDoctorAvailability(availability) {
  const session = await auth();
  if (!session || session.user.role !== 'doctor') return { error: 'Unauthorized' };

  try {
    await connectDB();
    await Doctor.findOneAndUpdate(
      { userId: session.user.id },
      { availability },
      { upsert: true }
    );
    revalidatePath('/doctor');
    return { success: true };
  } catch (err) {
    return { error: 'Failed to update availability' };
  }
}
