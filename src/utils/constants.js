export const DEPARTMENTS = [
  {
    name: 'Cardiology',
    slug: 'cardiology',
    icon: '❤️',
    color: 'red',
    description: 'Expert care for heart and cardiovascular conditions',
    treatments: ['Angioplasty', 'Bypass Surgery', 'Heart Transplant', 'ECG', 'Echocardiogram'],
  },
  {
    name: 'Neurology',
    slug: 'neurology',
    icon: '🧠',
    color: 'purple',
    description: 'Comprehensive neurological care and treatment',
    treatments: ['EEG', 'Brain MRI', 'Stroke Treatment', 'Epilepsy Management', 'Migraine Care'],
  },
  {
    name: 'Orthopedics',
    slug: 'orthopedics',
    icon: '🦴',
    color: 'blue',
    description: 'Advanced bone, joint and spine treatments',
    treatments: ['Joint Replacement', 'Spine Surgery', 'Sports Medicine', 'Fracture Care', 'Arthroscopy'],
  },
  {
    name: 'Pediatrics',
    slug: 'pediatrics',
    icon: '👶',
    color: 'green',
    description: 'Specialized care for children and adolescents',
    treatments: ['Vaccination', 'Growth Monitoring', 'Neonatal Care', 'Child Nutrition', 'Immunization'],
  },
  {
    name: 'ENT',
    slug: 'ent',
    icon: '👂',
    color: 'yellow',
    description: 'Ear, nose and throat specialist care',
    treatments: ['Tonsillectomy', 'Hearing Tests', 'Sinus Surgery', 'Sleep Apnea', 'Voice Disorders'],
  },
  {
    name: 'Oncology',
    slug: 'oncology',
    icon: '🎗️',
    color: 'pink',
    description: 'Comprehensive cancer diagnosis and treatment',
    treatments: ['Chemotherapy', 'Radiation Therapy', 'Immunotherapy', 'Tumor Surgery', 'Bone Marrow Transplant'],
  },
  {
    name: 'General Medicine',
    slug: 'general-medicine',
    icon: '🩺',
    color: 'teal',
    description: 'Primary care and general health management',
    treatments: ['General Checkup', 'Diabetes Care', 'Hypertension', 'Infection Treatment', 'Preventive Care'],
  },
  {
    name: 'Emergency Care',
    slug: 'emergency-care',
    icon: '🚨',
    color: 'orange',
    description: '24/7 emergency medical services',
    treatments: ['Trauma Care', 'Critical Care', 'Resuscitation', 'Emergency Surgery', 'ICU Care'],
  },
  {
    name: 'Dermatology',
    slug: 'dermatology',
    icon: '🧴',
    color: 'pink',
    description: 'Expert skin, hair and nail care',
    treatments: ['Acne Treatment', 'Skin Cancer Screening', 'Psoriasis', 'Eczema', 'Laser Therapy'],
  },
  {
    name: 'Gynecology',
    slug: 'gynecology',
    icon: '👩‍⚕️',
    color: 'purple',
    description: "Women's health and maternity care",
    treatments: ['Prenatal Care', 'Normal Delivery', 'C-Section', 'PCOS', 'IVF'],
  },
  {
    name: 'Ophthalmology',
    slug: 'ophthalmology',
    icon: '👁️',
    color: 'blue',
    description: 'Comprehensive eye care and vision correction',
    treatments: ['Cataract Surgery', 'LASIK', 'Glaucoma', 'Retina Treatment', 'Eye Checkup'],
  },
  {
    name: 'Psychiatry',
    slug: 'psychiatry',
    icon: '🧘',
    color: 'teal',
    description: 'Mental health diagnosis and treatment',
    treatments: ['Depression', 'Anxiety', 'Schizophrenia', 'Addiction', 'Counselling'],
  },
];

export const APPOINTMENT_STATUSES = {
  pending: { label: 'Pending', color: 'yellow' },
  confirmed: { label: 'Confirmed', color: 'blue' },
  completed: { label: 'Completed', color: 'green' },
  cancelled: { label: 'Cancelled', color: 'red' },
  'no-show': { label: 'No Show', color: 'gray' },
};

export const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM',
  '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
  '04:30 PM', '05:00 PM', '05:30 PM',
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const HOSPITAL_STATS = [
  { value: '500+', label: 'Expert Doctors' },
  { value: '50K+', label: 'Happy Patients' },
  { value: '25+', label: 'Departments' },
  { value: '15+', label: 'Years of Excellence' },
];

export const EMERGENCY_NUMBER = '+91 98765 43210';
export const HOSPITAL_NAME = 'MediCare Hospital';
export const HOSPITAL_ADDRESS = '123 Healthcare Avenue, Medical City, India - 400001';
export const HOSPITAL_EMAIL = 'info@medicare-hospital.com';
