import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/home/Hero';
import { EmergencyBanner } from '@/components/home/EmergencyBanner';
import { Stats } from '@/components/home/Stats';
import { SearchSection } from '@/components/home/SearchSection';
import { Departments } from '@/components/home/Departments';
import { WhyChooseUs } from '@/components/home/WhyChooseUs';
import { FeaturedDoctors } from '@/components/home/FeaturedDoctors';
import { HealthPackages } from '@/components/home/HealthPackages';
import { Testimonials } from '@/components/home/Testimonials';
import { FAQ } from '@/components/home/FAQ';
import { Newsletter } from '@/components/home/Newsletter';
import { AIAssistant } from '@/components/chatbot/AIAssistant';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <EmergencyBanner />
      <Hero />
      <Stats />
      <SearchSection />
      <Departments />
      <WhyChooseUs />
      <FeaturedDoctors />
      <HealthPackages />
      <Testimonials />
      <FAQ />
      <Newsletter />
      <Footer />
      <AIAssistant />
    </main>
  );
}
