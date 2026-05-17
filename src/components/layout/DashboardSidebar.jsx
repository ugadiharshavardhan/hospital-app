'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn, getInitials } from '@/lib/utils';
import {
  LayoutDashboard, Calendar, FileText, User, Bell,
  Settings, LogOut, Menu, X, Stethoscope, Users,
  Hospital, BarChart3, ClipboardList, CreditCard,
  Shield, Activity, MessageSquare, Home, ExternalLink
} from 'lucide-react';

const navItems = {
  patient: [
    { href: '/patient', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/patient/appointments', icon: Calendar, label: 'Appointments' },
    { href: '/patient/prescriptions', icon: FileText, label: 'Prescriptions' },
    { href: '/patient/reports', icon: ClipboardList, label: 'Reports' },
    { href: '/patient/payments', icon: CreditCard, label: 'Payments' },
    { href: '/patient/notifications', icon: Bell, label: 'Notifications' },
    { href: '/patient/profile', icon: User, label: 'My Profile' },
  ],
  doctor: [
    { href: '/doctor', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/doctor/appointments', icon: Calendar, label: 'Appointments' },
    { href: '/doctor/patients', icon: Users, label: 'My Patients' },
    { href: '/doctor/prescriptions', icon: FileText, label: 'Prescriptions' },
    { href: '/doctor/schedule', icon: Activity, label: 'Schedule' },
    { href: '/doctor/notifications', icon: Bell, label: 'Notifications' },
    { href: '/doctor/profile', icon: User, label: 'Profile' },
  ],
  admin: [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/doctors', icon: Stethoscope, label: 'Doctors' },
    { href: '/admin/patients', icon: Users, label: 'Patients' },
    { href: '/admin/appointments', icon: Calendar, label: 'Appointments' },
    { href: '/admin/departments', icon: Hospital, label: 'Departments' },
    { href: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
    { href: '/admin/notifications', icon: Bell, label: 'Notifications' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
  ],
  receptionist: [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/appointments', icon: Calendar, label: 'Appointments' },
    { href: '/admin/patients', icon: Users, label: 'Patients' },
  ],
};

export function DashboardSidebar({ user }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const role = user?.role || 'patient';
  const links = navItems[role] || navItems.patient;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-gray-900">MediCare</span>
        </Link>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.image} />
            <AvatarFallback className="bg-blue-600 text-white text-sm font-bold">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm text-gray-900 truncate">{user?.name}</p>
            <Badge variant="secondary" className="text-xs capitalize bg-blue-50 text-blue-700 mt-0.5">
              {role}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-200'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <item.icon className={cn('w-4 h-4', active ? 'text-white' : 'text-gray-400')} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t space-y-1">
        {/* Home — always visible so users can return to the landing page */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
        >
          <Home className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
          Home Page
          <ExternalLink className="w-3 h-3 ml-auto text-gray-300 group-hover:text-blue-400" />
        </Link>
        <Link
          href={`/${role}/profile`}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          <Settings className="w-4 h-4 text-gray-400" />
          Settings
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 flex-col shadow-sm z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <Stethoscope className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-bold text-gray-900">MediCare</span>
        </Link>
        <button onClick={() => setMobileOpen(true)} className="p-2 text-gray-600">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-full w-72 bg-white shadow-2xl z-50 lg:hidden"
            >
              <div className="absolute right-4 top-4">
                <button onClick={() => setMobileOpen(false)} className="p-1 text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
