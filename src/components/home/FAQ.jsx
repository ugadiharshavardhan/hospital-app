'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    q: 'How do I book an appointment online?',
    a: "Simply click \"Book Appointment\", select your preferred department and doctor, choose an available date and time slot, fill in your details, and confirm. You'll receive an email confirmation instantly.",
  },
  {
    q: 'What insurance plans do you accept?',
    a: 'We accept all major health insurance plans including CGHS, ECHS, ESI, and most private insurance policies like Star Health, HDFC Ergo, Bajaj Allianz, and more. Contact our billing team for specific plan verification.',
  },
  {
    q: 'What are the visiting hours?',
    a: 'Visiting hours are 10 AM – 12 PM and 5 PM – 7 PM daily. ICU and special ward visiting hours may differ. Please check with the nursing station for specific ward timings.',
  },
  {
    q: 'Do you offer online consultations?',
    a: "Yes, we offer video consultations with most of our specialist doctors. You can select \"Online Consultation\" while booking an appointment, and you'll receive a secure meeting link via email.",
  },
  {
    q: 'How can I access my medical reports online?',
    a: 'Log into your patient portal on our website, navigate to "My Reports" section, and you can view and download all your medical reports, lab results, and prescriptions securely.',
  },
  {
    q: 'What should I bring for my first appointment?',
    a: "Please bring your government-issued photo ID, insurance card (if applicable), previous medical records/reports, list of current medications, and any referral letters from your primary doctor.",
  },
  {
    q: 'Is there parking available at the hospital?',
    a: 'Yes, we have multi-level parking for 500+ vehicles. The first 2 hours are complimentary for outpatients. Valet parking is available at the main entrance.',
  },
];

export function FAQ() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">FAQ</span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-500">Everything you need to know about our services</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="bg-white rounded-xl border border-gray-100 px-5 shadow-sm"
              >
                <AccordionTrigger className="text-left text-sm font-medium text-gray-900 hover:text-blue-600 hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-500 text-sm leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
