import { Metadata } from 'next';
import PricingSection from '@/components/pricing/PricingSection';

export const metadata: Metadata = {
  title: 'Affordable Tutoring Pricing | Flexible Plans | Chiva TutorHub',
  description: 'Transparent and affordable tutoring pricing for Chemistry, Mathematics, Business Studies, and Accounting. Flexible plans designed to fit your academic needs and budget. Quality education accessible to all.',
  keywords: 'tutoring pricing, affordable tutor, tutoring rates Kenya, chemistry tutor cost, math tutor pricing, flexible tutoring plans, hourly tutoring rates',
  openGraph: {
    title: 'Affordable Tutoring Pricing | Chiva TutorHub',
    description: 'Transparent pricing for professional tutoring services. Flexible plans for Chemistry, Math, Business Studies, and Accounting.',
    url: 'https://chivatutorhub.com/pricing',
    siteName: 'Chiva TutorHub',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Tutoring Pricing | Chiva TutorHub',
    description: 'Affordable and transparent pricing for professional tutoring services.',
  },
  alternates: {
    canonical: 'https://chivatutorhub.com/pricing',
  },
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <PricingSection />
    </main>
  );
}
