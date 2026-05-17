import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Doctor from '@/models/Doctor';
import Patient from '@/models/Patient';
import { auth } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await connectDB();
    const user = await User.findById(session.user.id).lean();
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    let extra = null;
    if (user.role === 'doctor') {
      extra = await Doctor.findOne({ userId: user._id }).lean();
    } else if (user.role === 'patient') {
      extra = await Patient.findOne({ userId: user._id }).lean();
    }

    return NextResponse.json({ data: JSON.parse(JSON.stringify({ ...user, extra })) });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

export async function PATCH(request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    await connectDB();

    const { name, phone, address, emergencyContact, currentPassword, newPassword, ...extra } = body;

    const updates = {};
    if (name) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (address) updates.address = address;
    if (emergencyContact) updates.emergencyContact = emergencyContact;

    // Password change
    if (newPassword && currentPassword) {
      const user = await User.findById(session.user.id).select('+password');
      const valid = await bcrypt.compare(currentPassword, user.password);
      if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
      updates.password = await bcrypt.hash(newPassword, 12);
    }

    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updates },
      { new: true }
    ).lean();

    // Update role-specific profile
    const role = session.user.role;
    if (role === 'doctor' && Object.keys(extra).length > 0) {
      const { bio, experience, consultationFee, languages, isAvailableForOnline } = extra;
      const doctorUpdates = {};
      if (bio !== undefined) doctorUpdates.bio = bio;
      if (experience !== undefined) doctorUpdates.experience = Number(experience);
      if (consultationFee !== undefined) doctorUpdates.consultationFee = Number(consultationFee);
      if (languages !== undefined) doctorUpdates.languages = languages;
      if (isAvailableForOnline !== undefined) doctorUpdates.isAvailableForOnline = isAvailableForOnline;

      await Doctor.findOneAndUpdate(
        { userId: session.user.id },
        { $set: doctorUpdates },
        { upsert: true }
      );
    }

    if (role === 'patient' && Object.keys(extra).length > 0) {
      const { bloodGroup, allergies, gender, dateOfBirth } = extra;
      const patientUpdates = {};
      if (bloodGroup) patientUpdates.bloodGroup = bloodGroup;
      if (allergies) patientUpdates.allergies = allergies;
      if (gender) patientUpdates.gender = gender;
      if (dateOfBirth) patientUpdates.dateOfBirth = dateOfBirth;

      await Patient.findOneAndUpdate(
        { userId: session.user.id },
        { $set: patientUpdates },
        { upsert: true }
      );
    }

    return NextResponse.json({ success: true, message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Profile update error:', err);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
