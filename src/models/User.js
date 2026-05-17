import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true, select: false, minlength: 6 },
    role: {
      type: String,
      enum: ['patient', 'doctor', 'admin', 'receptionist'],
      default: 'patient',
    },
    avatar: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    otp: { type: String, select: false },
    otpExpiry: { type: Date, select: false },
    resetToken: { type: String, select: false },
    resetTokenExpiry: { type: Date, select: false },
    address: {
      street: String,
      city: String,
      state: String,
      pincode: String,
      country: { type: String, default: 'India' },
    },
    emergencyContact: {
      name: String,
      phone: String,
      relation: String,
    },
    lastLogin: Date,
  },
  { timestamps: true }
);

UserSchema.index({ email: 1 });

export default mongoose.models.User || mongoose.model('User', UserSchema);
