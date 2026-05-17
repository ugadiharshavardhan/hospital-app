import { connectDB } from './db.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

// Inline model schemas for seed script
const UserSchema = new mongoose.Schema({ name: String, email: { type: String, unique: true }, phone: String, password: String, role: String, avatar: String, isVerified: Boolean }, { timestamps: true });
const DepartmentSchema = new mongoose.Schema({ name: String, slug: String, description: String, icon: String, color: String, isActive: Boolean, order: Number, treatments: [String], timings: String }, { timestamps: true });
const DoctorSchema = new mongoose.Schema({ userId: mongoose.Schema.Types.ObjectId, specialization: String, departmentName: String, experience: Number, consultationFee: Number, bio: String, ratings: { average: Number, count: Number }, isActive: Boolean, qualifications: [{ degree: String, institution: String, year: Number }], availability: [{ day: String, startTime: String, endTime: String, isAvailable: Boolean, slots: [String] }] }, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Department = mongoose.models.Department || mongoose.model('Department', DepartmentSchema);
const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', DoctorSchema);

const departments = [
  { name: 'Cardiology', slug: 'cardiology', description: 'Expert care for heart and cardiovascular conditions', icon: '❤️', color: 'red', order: 1, isActive: true, treatments: ['Angioplasty', 'Bypass Surgery', 'ECG', 'Echocardiogram'], timings: 'Mon-Sat: 8AM - 8PM' },
  { name: 'Neurology', slug: 'neurology', description: 'Comprehensive neurological care', icon: '🧠', color: 'purple', order: 2, isActive: true, treatments: ['EEG', 'Brain MRI', 'Stroke Treatment'], timings: 'Mon-Sat: 9AM - 6PM' },
  { name: 'Orthopedics', slug: 'orthopedics', description: 'Advanced bone and joint treatments', icon: '🦴', color: 'blue', order: 3, isActive: true, treatments: ['Joint Replacement', 'Spine Surgery', 'Fracture Care'], timings: 'Mon-Sat: 8AM - 7PM' },
  { name: 'Pediatrics', slug: 'pediatrics', description: 'Specialized care for children', icon: '👶', color: 'green', order: 4, isActive: true, treatments: ['Vaccination', 'Growth Monitoring', 'Neonatal Care'], timings: 'Mon-Sat: 9AM - 8PM' },
  { name: 'ENT', slug: 'ent', description: 'Ear, nose and throat specialist care', icon: '👂', color: 'yellow', order: 5, isActive: true, treatments: ['Tonsillectomy', 'Hearing Tests', 'Sinus Surgery'], timings: 'Mon-Fri: 9AM - 5PM' },
  { name: 'Oncology', slug: 'oncology', description: 'Comprehensive cancer treatment', icon: '🎗️', color: 'pink', order: 6, isActive: true, treatments: ['Chemotherapy', 'Radiation Therapy', 'Immunotherapy'], timings: 'Mon-Sat: 8AM - 6PM' },
  { name: 'General Medicine', slug: 'general-medicine', description: 'Primary care and health management', icon: '🩺', color: 'teal', order: 7, isActive: true, treatments: ['General Checkup', 'Diabetes Care', 'Hypertension'], timings: 'Mon-Sun: 24/7' },
  { name: 'Emergency Care', slug: 'emergency-care', description: '24/7 emergency medical services', icon: '🚨', color: 'orange', order: 8, isActive: true, treatments: ['Trauma Care', 'Critical Care', 'Emergency Surgery'], timings: '24/7 Emergency' },
];

const seedDoctors = [
  { name: 'Dr. Rajesh Kumar', email: 'dr.rajesh@medicare.com', specialization: 'Cardiologist', department: 'Cardiology', experience: 15, fee: 1500, bio: 'Expert cardiologist with 15 years of experience in interventional cardiology.', qualifications: [{ degree: 'MBBS', institution: 'AIIMS Delhi', year: 2005 }, { degree: 'MD (Cardiology)', institution: 'PGIMER', year: 2010 }], rating: 4.8, ratingCount: 234 },
  { name: 'Dr. Priya Sharma', email: 'dr.priya@medicare.com', specialization: 'Neurologist', department: 'Neurology', experience: 12, fee: 1200, bio: 'Neurologist specializing in stroke treatment and epilepsy management.', qualifications: [{ degree: 'MBBS', institution: 'KMC Manipal', year: 2008 }, { degree: 'DM (Neurology)', institution: 'NIMHANS', year: 2013 }], rating: 4.7, ratingCount: 189 },
  { name: 'Dr. Arjun Mehta', email: 'dr.arjun@medicare.com', specialization: 'Orthopedic Surgeon', department: 'Orthopedics', experience: 18, fee: 1800, bio: 'Senior orthopedic surgeon specializing in joint replacement and sports medicine.', qualifications: [{ degree: 'MBBS', institution: 'Grant Medical College', year: 2002 }, { degree: 'MS (Ortho)', institution: 'KEM Hospital', year: 2007 }], rating: 4.9, ratingCount: 312 },
  { name: 'Dr. Sneha Patel', email: 'dr.sneha@medicare.com', specialization: 'Pediatrician', department: 'Pediatrics', experience: 10, fee: 800, bio: 'Child specialist with expertise in pediatric care and vaccination.', qualifications: [{ degree: 'MBBS', institution: 'BJ Medical College', year: 2010 }, { degree: 'MD (Pediatrics)', institution: 'Seth GS Medical College', year: 2015 }], rating: 4.8, ratingCount: 267 },
  { name: 'Dr. Vikram Singh', email: 'dr.vikram@medicare.com', specialization: 'ENT Specialist', department: 'ENT', experience: 8, fee: 900, bio: 'ENT specialist with expertise in minimally invasive surgeries.', qualifications: [{ degree: 'MBBS', institution: 'JIPMER', year: 2012 }, { degree: 'MS (ENT)', institution: 'AIIMS', year: 2016 }], rating: 4.6, ratingCount: 145 },
  { name: 'Dr. Meera Krishnan', email: 'dr.meera@medicare.com', specialization: 'Oncologist', department: 'Oncology', experience: 20, fee: 2000, bio: 'Senior oncologist with expertise in cancer treatment and chemotherapy protocols.', qualifications: [{ degree: 'MBBS', institution: 'Madras Medical College', year: 2000 }, { degree: 'DM (Oncology)', institution: 'Tata Memorial Hospital', year: 2006 }], rating: 4.9, ratingCount: 198 },
];

async function seed() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    await Department.deleteMany({});
    await Department.insertMany(departments);
    console.log('Departments seeded');

    const password = await bcrypt.hash('Password123', 12);

    await User.deleteMany({ role: { $in: ['doctor', 'admin'] } });

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@medicare.com',
      password,
      role: 'admin',
      isVerified: true,
      phone: '9876543210',
    });
    console.log('Admin user created:', admin.email);

    await Doctor.deleteMany({});
    for (const d of seedDoctors) {
      const user = await User.create({
        name: d.name,
        email: d.email,
        password,
        role: 'doctor',
        isVerified: true,
        phone: '98' + Math.floor(10000000 + Math.random() * 90000000),
      });

      await Doctor.create({
        userId: user._id,
        specialization: d.specialization,
        departmentName: d.department,
        experience: d.experience,
        consultationFee: d.fee,
        bio: d.bio,
        qualifications: d.qualifications,
        ratings: { average: d.rating, count: d.ratingCount },
        isActive: true,
        availability: [
          { day: 'Monday', startTime: '09:00', endTime: '17:00', isAvailable: true, slots: ['09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'] },
          { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isAvailable: true, slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:30 PM'] },
          { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isAvailable: true, slots: ['09:30 AM', '10:30 AM', '11:30 AM', '02:30 PM', '04:00 PM'] },
          { day: 'Thursday', startTime: '09:00', endTime: '17:00', isAvailable: true, slots: ['09:00 AM', '10:00 AM', '02:00 PM', '03:00 PM'] },
          { day: 'Friday', startTime: '09:00', endTime: '17:00', isAvailable: true, slots: ['09:00 AM', '09:30 AM', '11:00 AM', '02:00 PM', '04:30 PM'] },
          { day: 'Saturday', startTime: '09:00', endTime: '13:00', isAvailable: true, slots: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM'] },
        ],
      });
    }
    console.log('Doctors seeded');

    const testPatient = await User.create({
      name: 'Test Patient',
      email: 'patient@medicare.com',
      password,
      role: 'patient',
      isVerified: true,
      phone: '9123456789',
    });
    console.log('Test patient created:', testPatient.email);

    console.log('\nSeed completed successfully!');
    console.log('Login credentials:');
    console.log('Admin:   admin@medicare.com / Password123');
    console.log('Patient: patient@medicare.com / Password123');
    console.log('Doctor:  dr.rajesh@medicare.com / Password123');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
