import ServiceHero from '@/components/services/ServiceHero';
import ServiceDetails from '@/components/services/ServiceDetails';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tutoring Services | Chemistry, Math, Business & Accounting | Chiva TutorHub',
  description: 'Professional tutoring services in Chemistry, Mathematics, Business Studies, and Accounting. Personalized one-on-one sessions, flexible scheduling, and proven results for students in Kenya.',
  keywords: 'tutoring services, chemistry tutoring, math tutoring, business studies tutoring, accounting tutoring, online tutoring Kenya, private tutor, academic support',
  openGraph: {
    title: 'Tutoring Services | Chiva TutorHub',
    description: 'Professional tutoring in Chemistry, Mathematics, Business Studies, and Accounting. Personalized learning for academic success.',
    url: 'https://chivatutorhub.com/services',
    siteName: 'Chiva TutorHub',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Tutoring Services | Chiva TutorHub',
    description: 'Professional tutoring in Chemistry, Mathematics, Business Studies, and Accounting.',
  },
  alternates: {
    canonical: 'https://chivatutorhub.com/services',
  },
};

export default function ServicesPage() {
  return (
    <main>
      <ServiceHero />
      <ServiceDetails />
    </main>
  );
}
