import mongoose from 'mongoose';

const AppointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorProfileId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    department: String,
    departmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    date: { type: Date, required: true },
    slot: { type: String, required: true },
    type: { type: String, enum: ['in-person', 'online'], default: 'in-person' },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'pending',
    },
    symptoms: String,
    notes: String,
    prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'refunded'], default: 'pending' },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    amount: Number,
    isEmergency: { type: Boolean, default: false },
    cancelledBy: String,
    cancelReason: String,
    completedAt: Date,
    meetingLink: String,
    tokenNumber: Number,
  },
  { timestamps: true }
);

AppointmentSchema.index({ patientId: 1, date: -1 });
AppointmentSchema.index({ doctorId: 1, date: -1 });
AppointmentSchema.index({ status: 1 });

export default mongoose.models.Appointment || mongoose.model('Appointment', AppointmentSchema);
