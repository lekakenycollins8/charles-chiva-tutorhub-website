import ServiceHero from '@/components/services/ServiceHero';
import ServiceDetails from '@/components/services/ServiceDetails';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Services | Chiva TutorHub',
  description: 'Explore our specialized tutoring services in Chemistry, Mathematics, Business Studies, and Accounting.',
};

export default function ServicesPage() {
  return (
    <main>
      <ServiceHero />
      <ServiceDetails />
    </main>
  );
}
