import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Department from '@/models/Department';
import Doctor from '@/models/Doctor';
import bcrypt from 'bcryptjs';

const DEPARTMENTS = [
  { name: 'Cardiology',       slug: 'cardiology',       icon: '❤️',  color: 'red',    order: 1,  timings: 'Mon-Sat: 8AM-8PM',  treatments: ['Angioplasty', 'Bypass Surgery', 'ECG', 'Echocardiogram', 'Pacemaker Implant'], description: 'Expert care for heart and cardiovascular conditions', isActive: true },
  { name: 'Neurology',        slug: 'neurology',        icon: '🧠',  color: 'purple', order: 2,  timings: 'Mon-Sat: 9AM-6PM',  treatments: ['EEG', 'Brain MRI', 'Stroke Treatment', 'Epilepsy Management', 'Migraine Care'], description: 'Comprehensive neurological care and treatment', isActive: true },
  { name: 'Orthopedics',      slug: 'orthopedics',      icon: '🦴',  color: 'blue',   order: 3,  timings: 'Mon-Sat: 8AM-7PM',  treatments: ['Joint Replacement', 'Spine Surgery', 'Sports Medicine', 'Fracture Care', 'Arthroscopy'], description: 'Advanced bone, joint and spine treatments', isActive: true },
  { name: 'Pediatrics',       slug: 'pediatrics',       icon: '👶',  color: 'green',  order: 4,  timings: 'Mon-Sat: 9AM-8PM',  treatments: ['Vaccination', 'Growth Monitoring', 'Neonatal Care', 'Child Nutrition', 'Immunization'], description: 'Specialized care for children and adolescents', isActive: true },
  { name: 'ENT',              slug: 'ent',              icon: '👂',  color: 'yellow', order: 5,  timings: 'Mon-Fri: 9AM-5PM',  treatments: ['Tonsillectomy', 'Hearing Tests', 'Sinus Surgery', 'Sleep Apnea', 'Cochlear Implant'], description: 'Ear, nose and throat specialist care', isActive: true },
  { name: 'Oncology',         slug: 'oncology',         icon: '🎗️', color: 'pink',   order: 6,  timings: 'Mon-Sat: 8AM-6PM',  treatments: ['Chemotherapy', 'Radiation Therapy', 'Immunotherapy', 'Tumor Surgery', 'Bone Marrow Transplant'], description: 'Comprehensive cancer diagnosis and treatment', isActive: true },
  { name: 'General Medicine', slug: 'general-medicine', icon: '🩺',  color: 'teal',   order: 7,  timings: 'Mon-Sun: 24/7',     treatments: ['General Checkup', 'Diabetes Care', 'Hypertension', 'Infection Treatment', 'Preventive Care'], description: 'Primary care and general health management', isActive: true },
  { name: 'Emergency Care',   slug: 'emergency-care',   icon: '🚨',  color: 'orange', order: 8,  timings: '24/7 Emergency',    treatments: ['Trauma Care', 'Critical Care', 'Resuscitation', 'Emergency Surgery', 'ICU Care'], description: '24/7 emergency medical services', isActive: true },
  { name: 'Dermatology',      slug: 'dermatology',      icon: '🧴',  color: 'peach',  order: 9,  timings: 'Mon-Sat: 9AM-5PM',  treatments: ['Acne Treatment', 'Skin Cancer Screening', 'Psoriasis', 'Eczema', 'Laser Therapy'], description: 'Expert skin, hair and nail care', isActive: true },
  { name: 'Gynecology',       slug: 'gynecology',       icon: '👩‍⚕️', color: 'rose', order: 10, timings: 'Mon-Sat: 8AM-6PM',  treatments: ['Prenatal Care', 'Normal Delivery', 'C-Section', 'PCOS', 'Infertility Treatment'], description: "Women's health and maternity care", isActive: true },
  { name: 'Ophthalmology',    slug: 'ophthalmology',    icon: '👁️',  color: 'cyan',   order: 11, timings: 'Mon-Sat: 9AM-6PM',  treatments: ['Cataract Surgery', 'LASIK', 'Glaucoma', 'Retina Treatment', 'Eye Checkup'], description: 'Comprehensive eye care and vision correction', isActive: true },
  { name: 'Psychiatry',       slug: 'psychiatry',       icon: '🧘',  color: 'indigo', order: 12, timings: 'Mon-Fri: 9AM-5PM',  treatments: ['Depression', 'Anxiety', 'Schizophrenia', 'Addiction', 'Counselling'], description: 'Mental health diagnosis and treatment', isActive: true },
];

const AVAILABILITY = [
  { day: 'Monday',    isAvailable: true,  startTime: '09:00', endTime: '17:00', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM'] },
  { day: 'Tuesday',  isAvailable: true,  startTime: '09:00', endTime: '17:00', slots: ['09:00 AM', '10:00 AM', '10:30 AM', '11:30 AM', '02:00 PM', '03:00 PM', '04:00 PM', '04:30 PM'] },
  { day: 'Wednesday',isAvailable: true,  startTime: '09:00', endTime: '17:00', slots: ['09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '02:30 PM', '03:00 PM', '04:30 PM'] },
  { day: 'Thursday', isAvailable: true,  startTime: '09:00', endTime: '17:00', slots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '02:30 PM', '03:30 PM', '04:00 PM'] },
  { day: 'Friday',   isAvailable: true,  startTime: '09:00', endTime: '17:00', slots: ['09:00 AM', '09:30 AM', '10:30 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:30 PM'] },
  { day: 'Saturday', isAvailable: true,  startTime: '09:00', endTime: '13:00', slots: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'] },
  { day: 'Sunday',   isAvailable: false, slots: [] },
];

const DOCTORS = [
  // ── CARDIOLOGY ──────────────────────────────────────────────────────────────
  {
    name: 'Dr. Rajesh Kumar', email: 'dr.rajesh@medicare.com', phone: '9876501001',
    spec: 'Interventional Cardiologist', dept: 'Cardiology', exp: 15, fee: 1500, rating: 4.8, count: 312,
    bio: 'Expert in complex coronary interventions, angioplasty, and bypass surgery. Former faculty at AIIMS.',
    qual: [{ degree: 'MBBS', institution: 'AIIMS Delhi', year: 2005 }, { degree: 'MD Cardiology', institution: 'PGIMER Chandigarh', year: 2010 }, { degree: 'DM Cardiology', institution: 'PGIMER', year: 2013 }],
    lang: ['English', 'Hindi', 'Punjabi'], online: true,
  },
  {
    name: 'Dr. Aisha Siddiqui', email: 'dr.aisha@medicare.com', phone: '9876501002',
    spec: 'Cardiac Electrophysiologist', dept: 'Cardiology', exp: 10, fee: 1200, rating: 4.6, count: 198,
    bio: 'Specialises in heart rhythm disorders, implantable devices, and catheter ablation procedures.',
    qual: [{ degree: 'MBBS', institution: 'KMC Manipal', year: 2010 }, { degree: 'DM Cardiology', institution: 'Madras Medical College', year: 2015 }],
    lang: ['English', 'Hindi', 'Urdu'], online: true,
  },
  {
    name: 'Dr. Sunil Menon', email: 'dr.sunil.c@medicare.com', phone: '9876501003',
    spec: 'Echocardiologist', dept: 'Cardiology', exp: 12, fee: 1100, rating: 4.7, count: 245,
    bio: 'Advanced echocardiography specialist with expertise in structural heart disease and valvular disorders.',
    qual: [{ degree: 'MBBS', institution: 'CMC Vellore', year: 2008 }, { degree: 'MD Cardiology', institution: 'AIIMS', year: 2013 }],
    lang: ['English', 'Hindi', 'Malayalam'], online: false,
  },

  // ── NEUROLOGY ───────────────────────────────────────────────────────────────
  {
    name: 'Dr. Priya Sharma', email: 'dr.priya@medicare.com', phone: '9876502001',
    spec: 'Neurologist', dept: 'Neurology', exp: 12, fee: 1200, rating: 4.7, count: 267,
    bio: 'Specialising in stroke management, epilepsy, Parkinson\'s, and neurodegenerative diseases.',
    qual: [{ degree: 'MBBS', institution: 'KMC Manipal', year: 2008 }, { degree: 'DM Neurology', institution: 'NIMHANS', year: 2013 }],
    lang: ['English', 'Hindi'], online: true,
  },
  {
    name: 'Dr. Karthik Nair', email: 'dr.karthik@medicare.com', phone: '9876502002',
    spec: 'Neurosurgeon', dept: 'Neurology', exp: 14, fee: 2000, rating: 4.9, count: 178,
    bio: 'Pioneer in minimally invasive brain and spine surgery. Specialises in brain tumours and AVM.',
    qual: [{ degree: 'MBBS', institution: 'Govt Medical College Thiruvananthapuram', year: 2006 }, { degree: 'MCh Neurosurgery', institution: 'NIMHANS', year: 2012 }],
    lang: ['English', 'Hindi', 'Malayalam'], online: false,
  },
  {
    name: 'Dr. Ritu Bansal', email: 'dr.ritu.n@medicare.com', phone: '9876502003',
    spec: 'Pediatric Neurologist', dept: 'Neurology', exp: 9, fee: 1400, rating: 4.8, count: 156,
    bio: 'Dedicated to treating neurological conditions in children including cerebral palsy and autism spectrum disorders.',
    qual: [{ degree: 'MBBS', institution: 'AIIMS New Delhi', year: 2011 }, { degree: 'DM Pediatric Neurology', institution: 'AIIMS', year: 2016 }],
    lang: ['English', 'Hindi'], online: true,
  },

  // ── ORTHOPEDICS ──────────────────────────────────────────────────────────────
  {
    name: 'Dr. Arjun Mehta', email: 'dr.arjun@medicare.com', phone: '9876503001',
    spec: 'Orthopedic Surgeon', dept: 'Orthopedics', exp: 18, fee: 1800, rating: 4.9, count: 412,
    bio: 'Senior orthopedic surgeon specialising in knee and hip replacement with robotic-assisted surgery.',
    qual: [{ degree: 'MBBS', institution: 'Grant Medical College Mumbai', year: 2002 }, { degree: 'MS Ortho', institution: 'KEM Hospital', year: 2007 }],
    lang: ['English', 'Hindi', 'Gujarati'], online: true,
  },
  {
    name: 'Dr. Lakshmi Reddy', email: 'dr.lakshmi@medicare.com', phone: '9876503002',
    spec: 'Spine Specialist', dept: 'Orthopedics', exp: 11, fee: 1400, rating: 4.7, count: 289,
    bio: 'Expert in minimally invasive spine surgery, scoliosis correction, and disc replacement procedures.',
    qual: [{ degree: 'MBBS', institution: 'Osmania Medical College', year: 2009 }, { degree: 'MS Ortho', institution: 'Nizam Institute of Medical Sciences', year: 2014 }],
    lang: ['English', 'Hindi', 'Telugu'], online: false,
  },
  {
    name: 'Dr. Vishal Tiwari', email: 'dr.vishal.o@medicare.com', phone: '9876503003',
    spec: 'Sports Medicine Specialist', dept: 'Orthopedics', exp: 8, fee: 1100, rating: 4.6, count: 167,
    bio: 'Sports medicine expert treating professional athletes. Specialises in ligament reconstruction and arthroscopy.',
    qual: [{ degree: 'MBBS', institution: 'KGMU Lucknow', year: 2012 }, { degree: 'MS Ortho', institution: 'AIIMS Delhi', year: 2017 }],
    lang: ['English', 'Hindi'], online: true,
  },

  // ── PEDIATRICS ───────────────────────────────────────────────────────────────
  {
    name: 'Dr. Sneha Patel', email: 'dr.sneha@medicare.com', phone: '9876504001',
    spec: 'Pediatrician', dept: 'Pediatrics', exp: 10, fee: 800, rating: 4.8, count: 378,
    bio: 'Child health expert with a warm approach. Specialises in newborn care, growth disorders, and vaccinations.',
    qual: [{ degree: 'MBBS', institution: 'BJ Medical College Ahmedabad', year: 2010 }, { degree: 'MD Pediatrics', institution: 'Seth GS Medical College', year: 2015 }],
    lang: ['English', 'Hindi', 'Gujarati'], online: true,
  },
  {
    name: 'Dr. Rohan Desai', email: 'dr.rohan@medicare.com', phone: '9876504002',
    spec: 'Pediatric Pulmonologist', dept: 'Pediatrics', exp: 8, fee: 1000, rating: 4.6, count: 201,
    bio: 'Specialises in childhood asthma, cystic fibrosis, and chronic lung diseases in infants and children.',
    qual: [{ degree: 'MBBS', institution: 'Topiwala National Medical College', year: 2012 }, { degree: 'MD Pediatrics', institution: 'AIIMS', year: 2017 }],
    lang: ['English', 'Hindi', 'Marathi'], online: true,
  },
  {
    name: 'Dr. Ananya Das', email: 'dr.ananya.p@medicare.com', phone: '9876504003',
    spec: 'Neonatologist', dept: 'Pediatrics', exp: 13, fee: 1200, rating: 4.9, count: 234,
    bio: 'Expert in critical newborn care, premature infants, and complex neonatal conditions in level III NICU.',
    qual: [{ degree: 'MBBS', institution: 'Medical College Kolkata', year: 2007 }, { degree: 'MD Neonatology', institution: 'PGIMER', year: 2012 }],
    lang: ['English', 'Hindi', 'Bengali'], online: false,
  },

  // ── ENT ─────────────────────────────────────────────────────────────────────
  {
    name: 'Dr. Vikram Singh', email: 'dr.vikram@medicare.com', phone: '9876505001',
    spec: 'ENT Specialist', dept: 'ENT', exp: 8, fee: 900, rating: 4.6, count: 198,
    bio: 'ENT surgeon skilled in functional endoscopic sinus surgery, tympanoplasty, and cochlear implants.',
    qual: [{ degree: 'MBBS', institution: 'JIPMER Puducherry', year: 2012 }, { degree: 'MS ENT', institution: 'AIIMS', year: 2016 }],
    lang: ['English', 'Hindi'], online: true,
  },
  {
    name: 'Dr. Pooja Iyer', email: 'dr.pooja.ent@medicare.com', phone: '9876505002',
    spec: 'Head & Neck Surgeon', dept: 'ENT', exp: 11, fee: 1100, rating: 4.7, count: 145,
    bio: 'Expert in head and neck cancer surgery, thyroid surgeries, and reconstructive procedures.',
    qual: [{ degree: 'MBBS', institution: 'Coimbatore Medical College', year: 2009 }, { degree: 'MS ENT', institution: 'Madras Medical College', year: 2014 }],
    lang: ['English', 'Tamil', 'Hindi'], online: false,
  },
  {
    name: 'Dr. Nikhil Agarwal', email: 'dr.nikhil.ent@medicare.com', phone: '9876505003',
    spec: 'Audiologist & Otologist', dept: 'ENT', exp: 7, fee: 800, rating: 4.5, count: 122,
    bio: 'Specialises in hearing loss, tinnitus, vertigo, and advanced diagnostic audiology.',
    qual: [{ degree: 'MBBS', institution: 'SMS Medical College Jaipur', year: 2013 }, { degree: 'MS ENT', institution: 'PGIMER', year: 2018 }],
    lang: ['English', 'Hindi', 'Rajasthani'], online: true,
  },

  // ── ONCOLOGY ─────────────────────────────────────────────────────────────────
  {
    name: 'Dr. Meera Krishnan', email: 'dr.meera@medicare.com', phone: '9876506001',
    spec: 'Medical Oncologist', dept: 'Oncology', exp: 20, fee: 2000, rating: 4.9, count: 289,
    bio: 'Senior oncologist with expertise in chemotherapy, targeted therapy, and immunotherapy protocols.',
    qual: [{ degree: 'MBBS', institution: 'Madras Medical College', year: 2000 }, { degree: 'DM Medical Oncology', institution: 'Tata Memorial Hospital Mumbai', year: 2006 }],
    lang: ['English', 'Tamil', 'Hindi'], online: true,
  },
  {
    name: 'Dr. Amit Verma', email: 'dr.amit.onco@medicare.com', phone: '9876506002',
    spec: 'Surgical Oncologist', dept: 'Oncology', exp: 16, fee: 2200, rating: 4.8, count: 167,
    bio: 'Cancer surgeon specialising in breast, colon, and GI tract cancers with minimally invasive techniques.',
    qual: [{ degree: 'MBBS', institution: 'KGMU Lucknow', year: 2004 }, { degree: 'MCh Surgical Oncology', institution: 'Tata Memorial Hospital', year: 2010 }],
    lang: ['English', 'Hindi'], online: false,
  },
  {
    name: 'Dr. Shalini Kapoor', email: 'dr.shalini.onco@medicare.com', phone: '9876506003',
    spec: 'Radiation Oncologist', dept: 'Oncology', exp: 13, fee: 1800, rating: 4.7, count: 134,
    bio: 'Expert in IMRT, stereotactic body radiotherapy (SBRT), and brachytherapy for various cancers.',
    qual: [{ degree: 'MBBS', institution: 'AIIMS New Delhi', year: 2007 }, { degree: 'MD Radiation Oncology', institution: 'AIIMS', year: 2012 }],
    lang: ['English', 'Hindi'], online: true,
  },

  // ── GENERAL MEDICINE ─────────────────────────────────────────────────────────
  {
    name: 'Dr. Suresh Babu', email: 'dr.suresh@medicare.com', phone: '9876507001',
    spec: 'General Physician', dept: 'General Medicine', exp: 16, fee: 600, rating: 4.5, count: 521,
    bio: 'Experienced in managing diabetes, hypertension, respiratory infections, and preventive health.',
    qual: [{ degree: 'MBBS', institution: 'Stanley Medical College Chennai', year: 2004 }, { degree: 'MD General Medicine', institution: 'CMC Vellore', year: 2009 }],
    lang: ['English', 'Tamil', 'Hindi'], online: true,
  },
  {
    name: 'Dr. Anitha George', email: 'dr.anitha@medicare.com', phone: '9876507002',
    spec: 'Diabetologist & Endocrinologist', dept: 'General Medicine', exp: 9, fee: 700, rating: 4.7, count: 345,
    bio: 'Specialist in type 1 and type 2 diabetes, thyroid disorders, hormonal imbalances, and obesity.',
    qual: [{ degree: 'MBBS', institution: 'Government Medical College Thrissur', year: 2011 }, { degree: 'MD Internal Medicine', institution: 'CMC Vellore', year: 2016 }],
    lang: ['English', 'Malayalam', 'Hindi'], online: true,
  },
  {
    name: 'Dr. Prakash Rao', email: 'dr.prakash.gm@medicare.com', phone: '9876507003',
    spec: 'Pulmonologist', dept: 'General Medicine', exp: 14, fee: 800, rating: 4.6, count: 278,
    bio: 'Lung specialist treating asthma, COPD, interstitial lung disease, and sleep apnoea.',
    qual: [{ degree: 'MBBS', institution: 'Bangalore Medical College', year: 2006 }, { degree: 'MD Pulmonary Medicine', institution: 'NIMHANS', year: 2011 }],
    lang: ['English', 'Kannada', 'Hindi'], online: false,
  },

  // ── EMERGENCY CARE ────────────────────────────────────────────────────────────
  {
    name: 'Dr. Sameer Joshi', email: 'dr.sameer@medicare.com', phone: '9876508001',
    spec: 'Emergency Medicine Physician', dept: 'Emergency Care', exp: 7, fee: 1000, rating: 4.8, count: 489,
    bio: '24/7 emergency specialist trained in trauma resuscitation, critical care, and poisoning management.',
    qual: [{ degree: 'MBBS', institution: 'Grant Medical College Mumbai', year: 2013 }, { degree: 'MD Emergency Medicine', institution: 'AIIMS New Delhi', year: 2018 }],
    lang: ['English', 'Hindi', 'Marathi'], online: false,
  },
  {
    name: 'Dr. Kavitha Pillai', email: 'dr.kavitha.er@medicare.com', phone: '9876508002',
    spec: 'Critical Care Intensivist', dept: 'Emergency Care', exp: 12, fee: 1500, rating: 4.9, count: 312,
    bio: 'ICU specialist managing mechanically ventilated patients, sepsis, ARDS, and multiorgan failure.',
    qual: [{ degree: 'MBBS', institution: 'Trivandrum Medical College', year: 2008 }, { degree: 'MD Critical Care', institution: 'CMC Vellore', year: 2014 }],
    lang: ['English', 'Malayalam', 'Hindi'], online: false,
  },
  {
    name: 'Dr. Rahul Chandra', email: 'dr.rahul.er@medicare.com', phone: '9876508003',
    spec: 'Trauma & Acute Care Surgeon', dept: 'Emergency Care', exp: 10, fee: 1200, rating: 4.7, count: 234,
    bio: 'Acute care surgeon handling penetrating and blunt trauma, emergency GI surgery, and damage control.',
    qual: [{ degree: 'MBBS', institution: 'JIPMER Puducherry', year: 2010 }, { degree: 'MS General Surgery', institution: 'AIIMS', year: 2015 }],
    lang: ['English', 'Hindi'], online: false,
  },

  // ── DERMATOLOGY ───────────────────────────────────────────────────────────────
  {
    name: 'Dr. Neha Gupta', email: 'dr.neha.derm@medicare.com', phone: '9876509001',
    spec: 'Dermatologist', dept: 'Dermatology', exp: 9, fee: 900, rating: 4.7, count: 356,
    bio: 'Expert in medical and cosmetic dermatology, treating acne, psoriasis, vitiligo, and skin cancers.',
    qual: [{ degree: 'MBBS', institution: 'MAMC New Delhi', year: 2011 }, { degree: 'MD Dermatology', institution: 'AIIMS', year: 2016 }],
    lang: ['English', 'Hindi'], online: true,
  },
  {
    name: 'Dr. Faisal Khan', email: 'dr.faisal.derm@medicare.com', phone: '9876509002',
    spec: 'Cosmetic Dermatologist', dept: 'Dermatology', exp: 7, fee: 1200, rating: 4.6, count: 289,
    bio: 'Specialises in laser treatments, chemical peels, PRP therapy, and anti-ageing procedures.',
    qual: [{ degree: 'MBBS', institution: 'JNMC Aligarh', year: 2013 }, { degree: 'MD Dermatology', institution: 'BHU Varanasi', year: 2018 }],
    lang: ['English', 'Hindi', 'Urdu'], online: true,
  },
  {
    name: 'Dr. Sunita Rao', email: 'dr.sunita.derm@medicare.com', phone: '9876509003',
    spec: 'Trichologist', dept: 'Dermatology', exp: 11, fee: 1000, rating: 4.8, count: 412,
    bio: 'Hair and scalp specialist treating alopecia, hair loss, scalp infections, and hair transplant consultation.',
    qual: [{ degree: 'MBBS', institution: 'Osmania Medical College', year: 2009 }, { degree: 'MD Dermatology', institution: 'NIMS Hyderabad', year: 2014 }],
    lang: ['English', 'Telugu', 'Hindi'], online: true,
  },

  // ── GYNECOLOGY ────────────────────────────────────────────────────────────────
  {
    name: 'Dr. Divya Nambiar', email: 'dr.divya.gyn@medicare.com', phone: '9876510001',
    spec: 'Obstetrician & Gynaecologist', dept: 'Gynecology', exp: 14, fee: 1000, rating: 4.8, count: 489,
    bio: 'Expert in high-risk pregnancies, laparoscopic gynaecology, and reproductive health management.',
    qual: [{ degree: 'MBBS', institution: 'Amrita Institute of Medical Sciences', year: 2006 }, { degree: 'MS OBG', institution: 'CMC Vellore', year: 2011 }],
    lang: ['English', 'Malayalam', 'Hindi'], online: true,
  },
  {
    name: 'Dr. Swati Mishra', email: 'dr.swati.gyn@medicare.com', phone: '9876510002',
    spec: 'Fertility & IVF Specialist', dept: 'Gynecology', exp: 12, fee: 1500, rating: 4.9, count: 267,
    bio: 'Reproductive medicine expert specialising in IVF, IUI, egg freezing, and recurrent pregnancy loss.',
    qual: [{ degree: 'MBBS', institution: 'GSMC Mumbai', year: 2008 }, { degree: 'MS OBG', institution: 'KEM Hospital', year: 2013 }],
    lang: ['English', 'Hindi', 'Marathi'], online: true,
  },
  {
    name: 'Dr. Revathi Subramaniam', email: 'dr.revathi.gyn@medicare.com', phone: '9876510003',
    spec: 'Gynaecologic Oncologist', dept: 'Gynecology', exp: 18, fee: 1800, rating: 4.7, count: 134,
    bio: 'Specialises in cancers of the uterus, ovary, cervix, and vulva with fertility-preserving techniques.',
    qual: [{ degree: 'MBBS', institution: 'Madras Medical College', year: 2002 }, { degree: 'MS OBG', institution: 'CMC Vellore', year: 2007 }, { degree: 'Fellowship Gyn Oncology', institution: 'Tata Memorial', year: 2010 }],
    lang: ['English', 'Tamil'], online: false,
  },

  // ── OPHTHALMOLOGY ─────────────────────────────────────────────────────────────
  {
    name: 'Dr. Arun Krishnamurthy', email: 'dr.arun.eye@medicare.com', phone: '9876511001',
    spec: 'Ophthalmologist', dept: 'Ophthalmology', exp: 15, fee: 900, rating: 4.7, count: 378,
    bio: 'Comprehensive eye care specialist with expertise in cataract surgery and glaucoma management.',
    qual: [{ degree: 'MBBS', institution: 'MS Ramaiah Medical College', year: 2005 }, { degree: 'MS Ophthalmology', institution: 'AIIMS', year: 2010 }],
    lang: ['English', 'Kannada', 'Hindi'], online: true,
  },
  {
    name: 'Dr. Preethi Chandran', email: 'dr.preethi.eye@medicare.com', phone: '9876511002',
    spec: 'Retina Specialist', dept: 'Ophthalmology', exp: 11, fee: 1200, rating: 4.8, count: 245,
    bio: 'Medical and surgical retina expert treating diabetic retinopathy, macular degeneration, and retinal detachments.',
    qual: [{ degree: 'MBBS', institution: 'PSG Institute of Medical Sciences', year: 2009 }, { degree: 'MS Ophthalmology', institution: 'Sankara Nethralaya', year: 2014 }],
    lang: ['English', 'Tamil', 'Hindi'], online: false,
  },
  {
    name: 'Dr. Manish Sabharwal', email: 'dr.manish.eye@medicare.com', phone: '9876511003',
    spec: 'Cornea & Refractive Surgeon', dept: 'Ophthalmology', exp: 13, fee: 1400, rating: 4.9, count: 312,
    bio: 'LASIK, LASEK, and SMILE laser vision correction expert with over 5000 successful procedures.',
    qual: [{ degree: 'MBBS', institution: 'AIIMS New Delhi', year: 2007 }, { degree: 'MS Ophthalmology', institution: 'AIIMS', year: 2012 }],
    lang: ['English', 'Hindi'], online: true,
  },

  // ── PSYCHIATRY ────────────────────────────────────────────────────────────────
  {
    name: 'Dr. Rohini Chakraborty', email: 'dr.rohini.psy@medicare.com', phone: '9876512001',
    spec: 'Psychiatrist', dept: 'Psychiatry', exp: 16, fee: 1200, rating: 4.8, count: 345,
    bio: 'Expert in mood disorders, schizophrenia, OCD, and trauma. Uses CBT and evidence-based therapies.',
    qual: [{ degree: 'MBBS', institution: 'Calcutta Medical College', year: 2004 }, { degree: 'MD Psychiatry', institution: 'NIMHANS', year: 2009 }],
    lang: ['English', 'Hindi', 'Bengali'], online: true,
  },
  {
    name: 'Dr. Varun Mathur', email: 'dr.varun.psy@medicare.com', phone: '9876512002',
    spec: 'Child & Adolescent Psychiatrist', dept: 'Psychiatry', exp: 10, fee: 1400, rating: 4.7, count: 198,
    bio: 'Specialist in ADHD, autism spectrum, childhood anxiety, and adolescent mental health conditions.',
    qual: [{ degree: 'MBBS', institution: 'Maulana Azad Medical College', year: 2010 }, { degree: 'MD Psychiatry', institution: 'AIIMS', year: 2015 }],
    lang: ['English', 'Hindi'], online: true,
  },
  {
    name: 'Dr. Leena Puri', email: 'dr.leena.psy@medicare.com', phone: '9876512003',
    spec: 'Addiction Psychiatrist', dept: 'Psychiatry', exp: 12, fee: 1000, rating: 4.6, count: 167,
    bio: 'Specialises in substance use disorders, de-addiction, relapse prevention, and dual diagnosis treatment.',
    qual: [{ degree: 'MBBS', institution: 'Lady Hardinge Medical College', year: 2008 }, { degree: 'MD Psychiatry', institution: 'NIMHANS', year: 2013 }],
    lang: ['English', 'Hindi', 'Punjabi'], online: true,
  },
];

export async function POST() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seed not allowed in production' }, { status: 403 });
  }

  try {
    await connectDB();
    const password = await bcrypt.hash('Password123', 12);

    // ── Departments ──────────────────────────────────────────────────────────
    await Department.deleteMany({});
    await Department.insertMany(DEPARTMENTS);

    // ── Clear old doctors & admin ────────────────────────────────────────────
    await User.deleteMany({ role: { $in: ['doctor', 'admin'] } });
    await Doctor.deleteMany({});

    // ── Admin & Patient accounts ─────────────────────────────────────────────
    await User.create([
      { name: 'Admin User',   email: 'admin@medicare.com',   password, role: 'admin',   isVerified: true, phone: '9876543210' },
      { name: 'Test Patient', email: 'patient@medicare.com', password, role: 'patient', isVerified: true, phone: '9123456789' },
    ]);

    // ── Doctors ──────────────────────────────────────────────────────────────
    const createdDoctors = [];
    for (const d of DOCTORS) {
      const user = await User.create({
        name: d.name, email: d.email, phone: d.phone,
        password, role: 'doctor', isVerified: true,
      });

      await Doctor.create({
        userId: user._id,
        specialization: d.spec,
        departmentName: d.dept,
        experience: d.exp,
        consultationFee: d.fee,
        isActive: true,
        bio: d.bio,
        qualifications: d.qual,
        languages: d.lang,
        ratings: { average: d.rating, count: d.count },
        isAvailableForOnline: d.online,
        availability: AVAILABILITY,
      });

      createdDoctors.push({ name: d.name, email: d.email, dept: d.dept, spec: d.spec });
    }

    return NextResponse.json({
      success: true,
      message: `✅ Database seeded: ${DEPARTMENTS.length} departments, ${createdDoctors.length} doctors`,
      logins: {
        admin:   'admin@medicare.com   / Password123',
        patient: 'patient@medicare.com / Password123',
        doctor:  'dr.rajesh@medicare.com / Password123  (and all other dr.* emails)',
      },
      doctors: createdDoctors,
    });
  } catch (err) {
    console.error('Seed error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
