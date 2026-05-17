'use server';

import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { generateOTP } from '@/lib/utils';
import { sendEmail, getOTPEmailTemplate, getResetPasswordTemplate } from '@/lib/mail';
import crypto from 'crypto';
import { signIn, signOut } from '@/lib/auth';
import { registerSchema, forgotPasswordSchema } from '@/schemas/auth';

export async function registerUser(formData) {
  try {
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      password: formData.get('password'),
      confirmPassword: formData.get('confirmPassword'),
      role: formData.get('role') || 'patient',
    };

    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.errors[0].message };
    }

    await connectDB();

    const existing = await User.findOne({ email: data.email });
    if (existing) return { error: 'Email already registered' };

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await User.create({
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: hashedPassword,
      role: data.role,
      otp,
      otpExpiry,
    });

    await sendEmail({
      to: data.email,
      subject: 'Verify Your Email - MediCare Hospital',
      html: getOTPEmailTemplate(data.name, otp),
    });

    return { success: true, message: 'Registration successful! Please verify your email.' };
  } catch (err) {
    console.error('Register error:', err);
    return { error: 'Something went wrong. Please try again.' };
  }
}

export async function verifyOTP(email, otp) {
  try {
    await connectDB();
    const user = await User.findOne({ email }).select('+otp +otpExpiry');
    if (!user) return { error: 'User not found' };
    if (user.isVerified) return { error: 'Email already verified' };
    if (!user.otp || user.otp !== otp) return { error: 'Invalid OTP' };
    if (user.otpExpiry < new Date()) return { error: 'OTP has expired' };

    await User.findByIdAndUpdate(user._id, {
      isVerified: true,
      otp: undefined,
      otpExpiry: undefined,
    });

    return { success: true, message: 'Email verified successfully!' };
  } catch (err) {
    console.error('OTP verification error:', err);
    return { error: 'Verification failed. Please try again.' };
  }
}

export async function forgotPassword(formData) {
  try {
    const data = { email: formData.get('email') };
    const parsed = forgotPasswordSchema.safeParse(data);
    if (!parsed.success) return { error: parsed.error.errors[0].message };

    await connectDB();
    const user = await User.findOne({ email: data.email });
    if (!user) return { error: 'No account found with this email' };

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, {
      resetToken: await bcrypt.hash(resetToken, 10),
      resetTokenExpiry,
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}&email=${data.email}`;
    await sendEmail({
      to: data.email,
      subject: 'Reset Your Password - MediCare Hospital',
      html: getResetPasswordTemplate(user.name, resetUrl),
    });

    return { success: true, message: 'Password reset link sent to your email.' };
  } catch (err) {
    console.error('Forgot password error:', err);
    return { error: 'Failed to send reset email. Please try again.' };
  }
}

export async function resetPassword(email, token, newPassword) {
  try {
    await connectDB();
    const user = await User.findOne({ email }).select('+resetToken +resetTokenExpiry');
    if (!user) return { error: 'Invalid or expired reset link' };
    if (!user.resetToken || user.resetTokenExpiry < new Date()) {
      return { error: 'Reset link has expired. Please request a new one.' };
    }

    const isValid = await bcrypt.compare(token, user.resetToken);
    if (!isValid) return { error: 'Invalid reset link' };

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await User.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      resetToken: undefined,
      resetTokenExpiry: undefined,
    });

    return { success: true, message: 'Password reset successfully!' };
  } catch (err) {
    console.error('Reset password error:', err);
    return { error: 'Failed to reset password. Please try again.' };
  }
}

export async function loginUser(email, password) {
  try {
    await signIn('credentials', { email, password, redirectTo: '/patient' });
  } catch (err) {
    if (err.type === 'CredentialsSignin') {
      return { error: 'Invalid email or password' };
    }
    throw err;
  }
}

export async function logoutUser() {
  await signOut({ redirectTo: '/login' });
}
