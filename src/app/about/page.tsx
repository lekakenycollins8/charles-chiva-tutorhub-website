import React from 'react';
import AboutHero from '@/components/about/AboutHero';
import TutorProfile from '@/components/about/TutorProfile';
import Qualifications from '@/components/about/Qualifications';
import Philosophy from '@/components/about/Philosophy';
import WhyChooseUs from '@/components/about/WhyChooseUs';
import GoalsCTA from '@/components/about/GoalsCTA';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Chiva TutorHub | Expert Tutoring in Chemistry, Math & Business',
  description: 'Meet our experienced tutor specializing in Chemistry, Mathematics, Business Studies, and Accounting. Learn about our qualifications, teaching philosophy, and commitment to student success.',
  keywords: 'about tutor, chemistry tutor Kenya, math tutor qualifications, business studies teacher, accounting tutor experience, personalized tutoring',
  openGraph: {
    title: 'About Chiva TutorHub | Expert Tutoring Services',
    description: 'Experienced tutor specializing in Chemistry, Mathematics, Business Studies, and Accounting. Personalized learning approach for academic excellence.',
    url: 'https://chivatutorhub.com/about',
    siteName: 'Chiva TutorHub',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'About Chiva TutorHub',
    description: 'Expert tutoring in Chemistry, Mathematics, Business Studies, and Accounting.',
  },
  alternates: {
    canonical: 'https://chivatutorhub.com/about',
  },
};

export default function About() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <AboutHero />
      
      {/* Tutor Profile Section */}
      <TutorProfile />
      
      {/* Qualifications Section */}
      <Qualifications />
      
      {/* Philosophy Section */}
      <Philosophy />
      
      {/* Why Choose Us Section */}
      <WhyChooseUs />
      
      {/* Goals CTA Section */}
      <GoalsCTA />
    </main>
  );
}
