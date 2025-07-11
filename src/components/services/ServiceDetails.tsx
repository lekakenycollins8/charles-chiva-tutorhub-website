"use client";

import { useState } from 'react';
import Image from 'next/image';
import { services } from '@/data/services';
import { FaCheckCircle, FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';


const ServiceDetails = () => {
  const [activeTab, setActiveTab] = useState<string>(services[0].id);
  
  const currentService = services.find(service => service.id === activeTab) || services[0];

  return (
    <section id="details" className="py-16 md:py-24 bg-white relative">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-16">
          <div className="inline-block px-6 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            Curriculum Details
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-center">
            Comprehensive <span className="text-blue-600">Subject Coverage</span>
          </h2>
          <div className="w-24 h-1 bg-blue-600 rounded mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl text-center">
            Explore our detailed curriculum for each subject area, designed to build a strong foundation and advanced understanding.
          </p>
        </div>
        
        {/* Service Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {services.map((service) => (
            <button
              key={service.id}
              id={service.id}
              onClick={() => setActiveTab(service.id)}
              className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                activeTab === service.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {service.title}
            </button>
          ))}
        </div>
        
        {/* Service Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Left Column - Service Info */}
            <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100/50 border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="flex justify-center mb-6">
                <div className="relative w-32 h-32">
                  <Image
                    src={currentService.img}
                    alt={currentService.title}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                {currentService.title}
              </h3>
              
              <p className="text-gray-700 mb-6">
                {currentService.description}
              </p>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <FaGraduationCap className="mr-2 text-blue-600" />
                  Available For:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentService.levels.map((level) => (
                    <span 
                      key={level} 
                      className="px-4 py-2 bg-blue-600/10 text-blue-700 rounded-lg text-sm font-medium"
                    >
                      {level}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-blue-600/10 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Why Choose This Subject?</h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <FaCheckCircle className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Personalized learning approach</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Focus on practical applications</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Comprehensive curriculum coverage</span>
                  </li>
                  <li className="flex items-start">
                    <FaCheckCircle className="text-blue-600 mt-1 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">Expert guidance and support</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Right Column - Topics */}
            <div className="lg:col-span-2 p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Curriculum Topics
              </h3>
              
              <div className="space-y-8">
                {currentService.topics.map((topic, index) => (
                  <div key={topic.title} className="mb-8">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                        <span className="font-bold">{index + 1}</span>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800">{topic.title}</h4>
                    </div>
                    
                    <div className="ml-13 pl-6 border-l-2 border-blue-100">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {topic.details.map((detail, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-start p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors"
                          >
                            <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                              <span className="text-xs">{idx + 1}</span>
                            </div>
                            <p className="text-gray-700">{detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Ready to Get Started?</h4>
                <p className="text-gray-700 mb-4">
                  Book a session with our expert tutors and take the first step towards mastering {currentService.title}.
                </p>
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition-all"
                >
                  Book a Session
                </motion.a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceDetails;
