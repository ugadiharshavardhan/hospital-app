import Link from 'next/link';
import { Stethoscope, Phone, Mail, MapPin, Share2, MessageCircle, Globe, Link2 } from 'lucide-react';
import {
  HOSPITAL_NAME,
  HOSPITAL_ADDRESS,
  HOSPITAL_EMAIL,
  EMERGENCY_NUMBER,
} from '@/utils/constants';

const footerLinks = {
  services: [
    { label: 'Book Appointment', href: '/appointments/book' },
    { label: 'Find Doctors', href: '/doctors' },
    { label: 'Departments', href: '/departments' },
    { label: 'Emergency', href: '/emergency' },
    { label: 'Health Packages', href: '/#packages' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Team', href: '/doctors' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
    { label: 'Blog', href: '/blog' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">MediCare</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Providing world-class healthcare with compassion and expertise. Your health is our
              highest priority.
            </p>
            <div className="flex gap-3">
              {[Share2, MessageCircle, Globe, Link2].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-blue-400 text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span className="text-gray-400 text-sm">{HOSPITAL_ADDRESS}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href={`tel:${EMERGENCY_NUMBER}`}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {EMERGENCY_NUMBER}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href={`mailto:${HOSPITAL_EMAIL}`}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {HOSPITAL_EMAIL}
                </a>
              </li>
            </ul>
            <div className="mt-4 bg-red-900/30 border border-red-700/50 rounded-lg p-3">
              <p className="text-red-400 text-xs font-semibold flex items-center gap-1">
                <Phone className="w-3 h-3" /> Emergency: {EMERGENCY_NUMBER}
              </p>
              <p className="text-gray-400 text-xs mt-0.5">Available 24/7</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {HOSPITAL_NAME}. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-gray-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-300 transition-colors">
              Terms of Service
            </Link>
            <Link href="/sitemap.xml" className="hover:text-gray-300 transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
