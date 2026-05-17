import mongoose from 'mongoose';

const PatientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    dateOfBirth: Date,
    age: Number,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    bloodGroup: { type: String, enum: ['A+','A-','B+','B-','AB+','AB-','O+','O-'] },
    weight: Number,
    height: Number,
    allergies: [String],
    chronicConditions: [String],
    currentMedications: [String],
    medicalHistory: [
      {
        condition: String,
        diagnosis: String,
        date: Date,
        doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
        notes: String,
      },
    ],
    insuranceInfo: {
      provider: String,
      policyNumber: String,
      validUntil: Date,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PatientSchema.index({ userId: 1 });

export default mongoose.models.Patient || mongoose.model('Patient', PatientSchema);
