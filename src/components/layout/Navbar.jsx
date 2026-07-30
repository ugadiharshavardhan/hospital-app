'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Phone,
  Menu,
  X,
  Heart,
  Calendar,
  LogOut,
  User,
  LayoutDashboard,
  ChevronDown,
  Stethoscope,
} from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';
import { signOut } from 'next-auth/react';
import { EMERGENCY_NUMBER } from '@/utils/constants';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/doctors', label: 'Doctors' },
  { href: '/departments', label: 'Departments' },
  { href: '/appointments/book', label: 'Book Appointment' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  const isDashboardRoute = pathname.startsWith('/admin') || 
                           pathname === '/doctor' ||
                           pathname.startsWith('/doctor/') || 
                           pathname.startsWith('/patient') ||
                           pathname.startsWith('/dashboard');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (isDashboardRoute) {
    return null;
  }

  const getDashboardLink = () => {
    const role = session?.user?.role;
    if (role === 'admin') return '/admin';
    if (role === 'doctor') return '/doctor';
    return '/patient';
  };

  const filteredNavLinks = navLinks.filter(link => {
    if (link.href === '/appointments/book' && session?.user?.role === 'admin') {
      return false;
    }
    return true;
  });

  return (
    <motion.header
      className={cn(
        'fixed left-0 right-0 z-40 bg-white transition-all duration-300',
        pathname === '/' ? 'top-9' : 'top-0',
        scrolled ? 'shadow-md' : 'shadow-sm border-b border-gray-100'
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">
                Medi<span className="text-blue-600">Care</span>
              </span>
              <p className="text-[10px] text-gray-500 leading-none hidden sm:block">
                Your Health, Our Priority
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {filteredNavLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  pathname === link.href
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Emergency */}
            <a
              href={`tel:${EMERGENCY_NUMBER}`}
              className="hidden sm:flex items-center gap-1.5 text-red-600 hover:text-red-700 transition-colors bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg"
            >
              <Phone className="w-4 h-4" />
              <span className="text-xs font-semibold">Emergency</span>
            </a>

            {session ? (
              <>
                {/* Visible "Go to Dashboard" button — makes it clear user is logged in */}
                <Button
                  size="sm"
                  className="hidden sm:flex bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5"
                  asChild
                >
                  <Link href="/dashboard">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    Dashboard
                  </Link>
                </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={session.user.image} />
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        {getInitials(session.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium text-gray-900 max-w-[140px] truncate">
                      {session.user.name || session.user.email?.split('@')[0]}
                    </span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="font-medium">{session.user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{session.user.role}</p>
                  </DropdownMenuLabel>

                  <DropdownMenuItem asChild>
                    <Link href={session?.user?.role ? `/${session.user.role}/profile` : '/patient/profile'} className="flex items-center gap-2">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-6 mt-6">
                  <Link href="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <Stethoscope className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-lg font-bold">MediCare</span>
                  </Link>
                  <nav className="flex flex-col gap-1">
                    {filteredNavLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                          pathname === link.href
                            ? 'text-blue-600 bg-blue-50'
                            : 'text-gray-700 hover:bg-gray-50'
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="border-t pt-4 flex flex-col gap-2">
                    {!session ? (
                      <>
                        <Button variant="outline" asChild className="w-full">
                          <Link href="/login">Login</Link>
                        </Button>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                          <Link href="/register">Get Started</Link>
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-full text-red-600 border-red-200"
                      >
                        Sign Out
                      </Button>
                    )}
                    <a
                      href={`tel:${EMERGENCY_NUMBER}`}
                      className="flex items-center justify-center gap-2 text-red-600 bg-red-50 py-2 rounded-lg font-medium"
                    >
                      <Phone className="w-4 h-4" /> Emergency: {EMERGENCY_NUMBER}
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
