import React from 'react';
import AboutHero from '@/components/about/AboutHero';
import TutorProfile from '@/components/about/TutorProfile';
import Qualifications from '@/components/about/Qualifications';
import Philosophy from '@/components/about/Philosophy';
import WhyChooseUs from '@/components/about/WhyChooseUs';
import GoalsCTA from '@/components/about/GoalsCTA';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | Chiva TutorHub',
  description: 'Learn about our expert tutor, qualifications, teaching philosophy, and approach to academic excellence.',
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
