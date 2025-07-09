import { Metadata } from 'next';
import PricingSection from '@/components/pricing/PricingSection';

export const metadata: Metadata = {
  title: 'Pricing Plans | TutorHub',
  description: 'Explore our flexible tutoring plans designed to fit your academic needs and budget.',
};

export default function PricingPage() {
  return (
    <main className="min-h-screen">
      <PricingSection />
    </main>
  );
}
