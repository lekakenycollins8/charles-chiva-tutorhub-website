"use client";

import { useState } from 'react';
import { services } from '@/data/services';
import { FaFlask, FaCalculator, FaGlobe, FaChartLine } from 'react-icons/fa';

// Helper function to get the appropriate icon for each service
const getServiceIcon = (id: string) => {
  switch (id) {
    case 'chemistry':
      return <FaFlask className="h-8 w-8" />;
    case 'mathematics':
      return <FaCalculator className="h-8 w-8" />;
    case 'business':
      return <FaGlobe className="h-8 w-8" />;
    case 'accounting':
      return <FaChartLine className="h-8 w-8" />;
    default:
      return <FaFlask className="h-8 w-8" />;
  }
};

const ServiceHero = () => {
  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-400/10 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-500/40 to-blue-400/40 backdrop-blur-md rounded-full text-sm font-medium border border-blue-400/30 shadow-lg shadow-blue-500/20 mb-4">
            Expert Academic Support
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">Specialized</span>{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-blue-300 to-cyan-200 bg-clip-text text-transparent">Tutoring Services</span>
              <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full"></span>
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-blue-100/90 max-w-3xl mx-auto mb-10">
            Personalized academic support across multiple disciplines, designed to help you excel in your studies and achieve your educational goals.
          </p>
        </div>
        
        {/* Service Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {services.map((service) => (
            <div 
              key={service.id}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-600/80 to-blue-700/80 rounded-lg shadow-lg mr-4">
                  {getServiceIcon(service.id)}
                </div>
                <h3 className="text-xl font-bold text-white">{service.title}</h3>
              </div>
              
              <p className="text-blue-100/80 mb-6 line-clamp-3">
                {service.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {service.levels.map((level) => (
                  <span 
                    key={level} 
                    className="px-3 py-1 bg-blue-800/50 text-blue-100 rounded-full text-xs font-medium"
                  >
                    {level}
                  </span>
                ))}
              </div>
              
              <div className="mt-auto">
                <a 
                  href={`#${service.id}`} 
                  className="inline-flex items-center text-blue-200 font-medium hover:text-white transition-colors"
                >
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <a 
            href="#details" 
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors animate-bounce"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
