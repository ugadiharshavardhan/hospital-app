import { Geist } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers';
import { auth } from '@/lib/auth';

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata = {
  title: {
    default: 'MediCare Hospital - Your Health, Our Priority',
    template: '%s | MediCare Hospital',
  },
  description:
    'MediCare Hospital provides world-class healthcare services with 500+ expert doctors, 25+ specialties, and state-of-the-art facilities. Book appointments online.',
  keywords: ['hospital', 'doctor', 'appointment', 'healthcare', 'medical', 'medicare'],
  authors: [{ name: 'MediCare Hospital' }],
  creator: 'MediCare Hospital',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'MediCare Hospital',
    title: 'MediCare Hospital - Your Health, Our Priority',
    description: 'World-class healthcare services with 500+ expert doctors.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MediCare Hospital',
    description: 'World-class healthcare services.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({ children }) {
  const session = await auth();
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers session={session}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
