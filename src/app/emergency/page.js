'use client';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Phone, Ambulance, AlertTriangle, Clock, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { EMERGENCY_NUMBER } from '@/utils/constants';
import { toast } from 'sonner';
import axios from 'axios';

export default function EmergencyPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ patientName: '', patientPhone: '', location: '', emergencyType: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.patientName || !form.patientPhone || !form.location || !form.emergencyType) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      await axios.post('/api/ambulance', { ...form, location: { address: form.location }, status: 'pending' });
      setSubmitted(true);
      toast.success('Ambulance dispatched! ETA: 8-12 minutes');
    } catch {
      toast.error('Request failed. Please call directly: ' + EMERGENCY_NUMBER);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-[80px]">
        {/* Emergency Banner */}
        <div className="bg-red-600 py-6">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
              <AlertTriangle className="w-8 h-8 animate-pulse" />
              Emergency Services
            </h1>
            <p className="text-red-200 mt-2">24/7 Emergency Care · Immediate Response</p>
            <a href={`tel:${EMERGENCY_NUMBER}`} className="inline-flex items-center gap-2 mt-4 bg-white text-red-600 font-bold text-xl px-6 py-3 rounded-2xl hover:bg-red-50 transition-colors">
              <Phone className="w-6 h-6" /> {EMERGENCY_NUMBER}
            </a>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Emergency Contacts */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Emergency Contacts</h2>
              {[
                { icon: Phone, label: 'Emergency Hotline', value: EMERGENCY_NUMBER, bg: '#FEE2E2', fg: '#DC2626', desc: 'Available 24/7' },
                { icon: Ambulance, label: 'Ambulance Service', value: '+91 98765 00001', bg: '#FFEDD5', fg: '#EA580C', desc: 'ETA: 8-12 minutes' },
                { icon: Phone, label: 'ICU Direct', value: '+91 98765 00002', bg: '#DBEAFE', fg: '#2563EB', desc: 'Critical care unit' },
                { icon: Phone, label: 'Poison Control', value: '+91 98765 00003', bg: '#DCFCE7', fg: '#16A34A', desc: 'Toxicology helpline' },
              ].map(c => (
                <a key={c.label} href={`tel:${c.value}`} className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md transition-all group">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: c.bg }}>
                    <c.icon className="w-5 h-5" style={{ color: c.fg }} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{c.label}</p>
                    <p className="font-bold text-lg" style={{ color: c.fg }}>{c.value}</p>
                    <p className="text-gray-400 text-xs">{c.desc}</p>
                  </div>
                </a>
              ))}

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mt-6">
                <h3 className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Emergency Department Hours
                </h3>
                <p className="text-amber-700 text-sm">Open 24 hours, 7 days a week, 365 days a year. No appointment needed for emergencies.</p>
              </div>
            </div>

            {/* Ambulance Request Form */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Ambulance Dispatched!</h3>
                  <p className="text-gray-500 mb-2">Estimated arrival: <span className="font-bold text-green-600">8-12 minutes</span></p>
                  <p className="text-gray-400 text-sm">Stay calm. Help is on the way. Keep your phone line open.</p>
                  <a href={`tel:${EMERGENCY_NUMBER}`} className="mt-6 flex items-center gap-2 text-red-600 font-semibold">
                    <Phone className="w-4 h-4" /> Call if needed: {EMERGENCY_NUMBER}
                  </a>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Ambulance className="w-5 h-5 text-red-500" /> Request Ambulance
                  </h2>
                  <p className="text-gray-500 text-sm mb-6">Fill this form for faster dispatch. Or call {EMERGENCY_NUMBER}</p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Patient Name</label>
                      <Input value={form.patientName} onChange={e => setForm(f => ({...f, patientName: e.target.value}))} placeholder="Full name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Contact Phone</label>
                      <Input value={form.patientPhone} onChange={e => setForm(f => ({...f, patientPhone: e.target.value}))} placeholder="Mobile number" type="tel" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Current Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} placeholder="Address or landmark" className="pl-9" />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Emergency Type</label>
                      <Select value={form.emergencyType} onValueChange={v => setForm(f => ({...f, emergencyType: v}))}>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="accident">Accident / Trauma</SelectItem>
                          <SelectItem value="cardiac">Cardiac Emergency</SelectItem>
                          <SelectItem value="stroke">Stroke</SelectItem>
                          <SelectItem value="breathing">Breathing Difficulty</SelectItem>
                          <SelectItem value="pregnancy">Pregnancy Emergency</SelectItem>
                          <SelectItem value="other">Other Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 text-lg">
                      {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Dispatching...</> : <><Ambulance className="w-5 h-5 mr-2" /> Request Ambulance</>}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
