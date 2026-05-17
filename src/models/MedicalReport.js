import mongoose from 'mongoose';

const MedicalReportSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    reportType: {
      type: String,
      enum: ['blood-test', 'x-ray', 'mri', 'ct-scan', 'ecg', 'urine-test', 'biopsy', 'other'],
      required: true,
    },
    reportName: { type: String, required: true },
    reportUrl: { type: String, required: true },
    publicId: String,
    description: String,
    uploadedBy: { type: String, enum: ['patient', 'doctor', 'lab'], default: 'patient' },
    labName: String,
    isNormal: Boolean,
    reportDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

MedicalReportSchema.index({ patientId: 1 });

export default mongoose.models.MedicalReport || mongoose.model('MedicalReport', MedicalReportSchema);
