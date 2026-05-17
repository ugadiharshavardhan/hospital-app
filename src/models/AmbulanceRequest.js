import mongoose from 'mongoose';

const AmbulanceRequestSchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    patientPhone: { type: String, required: true },
    location: {
      address: String,
      lat: Number,
      lng: Number,
    },
    emergencyType: {
      type: String,
      enum: ['accident', 'cardiac', 'stroke', 'breathing', 'pregnancy', 'other'],
      required: true,
    },
    description: String,
    status: {
      type: String,
      enum: ['pending', 'dispatched', 'en-route', 'arrived', 'completed'],
      default: 'pending',
    },
    assignedTo: String,
    estimatedTime: Number,
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    completedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.models.AmbulanceRequest || mongoose.model('AmbulanceRequest', AmbulanceRequestSchema);
