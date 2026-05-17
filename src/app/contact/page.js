'use client';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { HOSPITAL_ADDRESS, HOSPITAL_EMAIL, EMERGENCY_NUMBER } from '@/utils/constants';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setSent(true);
    toast.success("Message sent! We'll respond within 24 hours.");
    setLoading(false);
  };

  const contactInfo = [
    { icon: Phone, title: 'Phone', value: EMERGENCY_NUMBER, desc: '24/7 Emergency' },
    { icon: Mail, title: 'Email', value: HOSPITAL_EMAIL, desc: 'Response within 24h' },
    { icon: MapPin, title: 'Address', value: HOSPITAL_ADDRESS, desc: 'Main Hospital' },
    { icon: Clock, title: 'Hours', value: 'OPD: Mon-Sat 8AM-8PM', desc: 'Emergency: 24/7' },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 pt-[116px]">
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
            <p className="text-blue-200">We're here to help with all your healthcare needs</p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-4 mb-8">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="w-11 h-11 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                      <info.icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{info.title}</p>
                      <p className="text-gray-700 text-sm">{info.value}</p>
                      <p className="text-gray-400 text-xs">{info.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Map Placeholder */}
              <div className="bg-gray-200 rounded-2xl h-48 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">Google Maps Integration</p>
                  <p className="text-xs">{HOSPITAL_ADDRESS}</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message Received!</h3>
                  <p className="text-gray-500">We'll respond to your inquiry within 24 hours.</p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
                        <Input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Your name" required />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                        <Input value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} type="email" placeholder="you@example.com" required />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
                      <Input value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="Mobile number" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Subject</label>
                      <Input value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} placeholder="What's this about?" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Message</label>
                      <Textarea value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} placeholder="Tell us how we can help..." rows={4} required />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
                      {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...</> : <><Send className="w-4 h-4 mr-2" /> Send Message</>}
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
