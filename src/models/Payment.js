import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    method: { type: String, enum: ['razorpay', 'stripe', 'cash', 'insurance', 'upi'] },
    status: { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' },
    transactionId: String,
    orderId: String,
    receipt: String,
    invoiceNumber: String,
    notes: String,
    refundId: String,
    refundedAt: Date,
    paidAt: Date,
  },
  { timestamps: true }
);

PaymentSchema.index({ patientId: 1 });
PaymentSchema.index({ transactionId: 1 });

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
