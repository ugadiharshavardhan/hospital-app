import mongoose from 'mongoose';

const AvailabilitySchema = new mongoose.Schema({
  day: { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
  startTime: String,
  endTime: String,
  isAvailable: { type: Boolean, default: true },
  slots: [String],
}, { _id: false });

const DoctorSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    specialization: { type: String, required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    departmentName: String,
    qualifications: [{ degree: String, institution: String, year: Number }],
    experience: { type: Number, default: 0 },
    consultationFee: { type: Number, default: 500 },
    availability: [AvailabilitySchema],
    bio: { type: String, maxlength: 1000 },
    languages: [String],
    awards: [String],
    ratings: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0 },
    },
    isAvailableForOnline: { type: Boolean, default: false },
    registrationNumber: String,
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

DoctorSchema.index({ userId: 1 });
DoctorSchema.index({ department: 1 });
DoctorSchema.index({ specialization: 1 });

export default mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);
