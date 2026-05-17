import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { registerSchema } from '@/schemas/auth';
import { generateOTP } from '@/lib/utils';
import { sendEmail, getOTPEmailTemplate } from '@/lib/mail';

export async function POST(request) {
  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 });
    }

    await connectDB();
    const existing = await User.findOne({ email: body.email });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(body.password, 12);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await User.create({
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      password: hashedPassword,
      role: 'patient', // public registration is always patient; doctors are created by admin only
      otp,
      otpExpiry,
      isVerified: process.env.NODE_ENV === 'development',
    });

    if (process.env.SMTP_USER) {
      await sendEmail({
        to: body.email,
        subject: 'Verify Your Email - MediCare',
        html: getOTPEmailTemplate(body.name, otp),
      }).catch(console.error);
    }

    return NextResponse.json({ success: true, message: 'Account created successfully.' });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
