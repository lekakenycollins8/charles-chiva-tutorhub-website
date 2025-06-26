import React from 'react';
import AboutHero from '@/components/about/AboutHero';
import TutorProfile from '@/components/about/TutorProfile';
import Qualifications from '@/components/about/Qualifications';
import Philosophy from '@/components/about/Philosophy';
import WhyChooseUs from '@/components/about/WhyChooseUs';
import { aboutContent } from '@/data/aboutData';

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
      
      {/* Goals Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {aboutContent.goals.title}
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              {aboutContent.goals.description}
            </p>
            <button className="px-8 py-3 bg-white text-blue-600 hover:bg-blue-50 font-medium rounded-lg shadow-lg transition-all hover:-translate-y-0.5">
              Contact Me Today
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
