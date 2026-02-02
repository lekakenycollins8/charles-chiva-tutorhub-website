import { Metadata } from 'next';
import PricingSection from '@/components/pricing/PricingSection';

export const metadata: Metadata = {
  title: 'Pricing Plans | TutorHub',
  description: 'Explore our flexible tutoring plans designed to fit your academic needs and budget.',
};

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <PricingSection />
    </main>
  );
}
