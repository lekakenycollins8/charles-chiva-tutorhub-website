"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { services } from '@/data/services';
import { FaFlask, FaCalculator, FaGlobe, FaChartLine } from 'react-icons/fa';

// Helper function to get the appropriate icon for each service
const getServiceIcon = (id: string) => {
  switch (id) {
    case 'chemistry':
      return <FaFlask className="h-6 w-6" />;
    case 'mathematics':
      return <FaCalculator className="h-6 w-6" />;
    case 'business':
      return <FaGlobe className="h-6 w-6" />;
    case 'accounting':
      return <FaChartLine className="h-6 w-6" />;
    default:
      return <FaFlask className="h-6 w-6" />;
  }
};

const ServicesOverview = () => {
  const [activeService, setActiveService] = useState(services[0].id);
  const [activeTopic, setActiveTopic] = useState(services[0].topics[0].title);
  
  // Find the currently active service
  const currentService = services.find(service => service.id === activeService) || services[0];
  // Find the currently active topic
  const currentTopic = currentService.topics.find(topic => topic.title === activeTopic) || currentService.topics[0];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-blue-100 to-transparent opacity-50"></div>
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-100 opacity-20"></div>
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-100 opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16">
          <div className="inline-block px-6 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            Expert Tutoring
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
            Specialized <span className="text-blue-600">Subject Areas</span>
          </h2>
          <div className="w-24 h-1 bg-blue-600 rounded mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl text-center">
            Comprehensive tutoring in key academic subjects with personalized instruction tailored to your learning needs.
          </p>
        </div>
        
        {/* Services Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => {
                setActiveService(service.id);
                setActiveTopic(service.topics[0].title);
              }}
              className={`px-6 py-3 rounded-full transition-all duration-300 flex items-center gap-3 ${
                activeService === service.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-300/50'
                  : 'bg-white text-gray-700 hover:bg-blue-50 shadow-md'
              }`}
            >
              <div className={`p-2 rounded-full ${
                activeService === service.id ? 'bg-blue-500' : 'bg-blue-100'
              }`}>
                {getServiceIcon(service.id)}
              </div>
              <span className="font-medium">{service.title}</span>
            </button>
          ))}
        </div>
        
        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left Column - Service Image & Description */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={currentService.img}
                  alt={currentService.title}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {currentService.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {currentService.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentService.levels.map((level) => (
                    <span 
                      key={level} 
                      className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {level}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Topics & Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full">
              <div className="border-b border-gray-100">
                <div className="flex overflow-x-auto scrollbar-hide py-2 px-4">
                  {currentService.topics.map((topic) => (
                    <button
                      key={topic.title}
                      onClick={() => setActiveTopic(topic.title)}
                      className={`px-4 py-2 whitespace-nowrap mx-1 rounded-lg transition-all ${
                        activeTopic === topic.title
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-blue-50 text-gray-700'
                      }`}
                    >
                      {topic.title}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 text-sm">
                    {currentService.topics.findIndex(t => t.title === activeTopic) + 1}
                  </span>
                  {activeTopic}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentTopic.details.map((detail, index) => (
                    <div 
                      key={index} 
                      className="flex items-start p-3 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                        <span className="text-xs">{index + 1}</span>
                      </div>
                      <p className="text-gray-700">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Excel in Your Studies?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Book a session with our expert tutors and take the first step towards academic success.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/contact" 
              className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              Book a Session
            </Link>
            <Link 
              href="/services" 
              className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              View All Services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesOverview;
