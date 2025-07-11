"use client";
import { useEffect, useState } from 'react';
import { person, aboutContent } from '@/data/aboutData';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const AboutHero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative py-12 md:py-16 overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Top section with badge and title */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-500/40 to-blue-400/40 backdrop-blur-md rounded-full text-sm font-medium border border-blue-400/30 shadow-lg shadow-blue-500/20 mb-4">
            Welcome to CHIVA TutorHub
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">About</span>{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent">Chiva TutorHub</span>
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full"></span>
            </span>
          </h1>
          
          <p className="text-lg text-blue-100/90 max-w-2xl mx-auto">
            Dedicated to academic excellence through personalized tutoring and educational support.
          </p>
        </div>
        
        {/* Main content area */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {/* Left panel - Mission */}
            <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-blue-100/80">
                To help students achieve their full potential through expert guidance and tailored learning experiences that build confidence and academic success.
              </p>
            </div>
            
            {/* Middle panel - Tutor Profile */}
            <div className="p-6 md:p-8 bg-gradient-to-b from-blue-800/30 to-blue-900/30 border-b md:border-b-0 md:border-r border-white/10 flex flex-col items-center text-center">
              <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-2 border-white/20 shadow-lg">
                <Image 
                  src={person.avatar} 
                  alt={person.name} 
                  fill 
                  className="object-cover"
                />
              </div>
              
              <h2 className="text-xl font-bold text-white mb-1">{person.name}</h2>
              <p className="text-blue-200 mb-3">{person.role}</p>
              
              <div className="flex items-center justify-center space-x-2 mb-4">
                <span className="px-2 py-1 bg-blue-600/30 rounded-md text-xs text-blue-100">10+ Years Exp</span>
                <span className="px-2 py-1 bg-blue-600/30 rounded-md text-xs text-blue-100">{person.location}</span>
              </div>
            </div>
            
            {/* Right panel - Key Stats */}
            <div className="p-6 md:p-8">
              <h2 className="text-xl font-bold text-white mb-4">Why Choose Us</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-blue-100">98%</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Student Satisfaction</p>
                    <p className="text-blue-200/70 text-sm">Based on student feedback</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-blue-100">A+</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Grade Improvement</p>
                    <p className="text-blue-200/70 text-sm">Average student outcome</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-blue-100">4+</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Subject Areas</p>
                    <p className="text-blue-200/70 text-sm">Specialized expertise</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom action area */}
        <div className="mt-8 text-center">
          <p className="text-blue-100 mb-4">Ready to transform your academic journey?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button className='bg-blue-600 hover:bg-blue-700'>Contact Us</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
