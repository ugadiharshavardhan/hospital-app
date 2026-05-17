import mongoose from 'mongoose';

const MedicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dosage: String,
  frequency: String,
  duration: String,
  instructions: String,
}, { _id: false });

const PrescriptionSchema = new mongoose.Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    medicines: [MedicineSchema],
    diagnosis: String,
    notes: String,
    followUpDate: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PrescriptionSchema.index({ patientId: 1 });
PrescriptionSchema.index({ doctorId: 1 });

export default mongoose.models.Prescription || mongoose.model('Prescription', PrescriptionSchema);
