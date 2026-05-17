import mongoose from 'mongoose';

const DepartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    longDescription: String,
    icon: String,
    image: String,
    color: String,
    treatments: [String],
    timings: String,
    faqs: [{ question: String, answer: String }],
    headDoctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

DepartmentSchema.index({ slug: 1 });

export default mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
