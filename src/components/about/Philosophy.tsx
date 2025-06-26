"use client";
import { aboutContent } from '@/data/aboutData';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaQuoteRight, FaLightbulb, FaUserGraduate, FaChalkboardTeacher } from 'react-icons/fa';

const Philosophy = () => {
  const { philosophy } = aboutContent;
  
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header with decorative quotes */}
          <div className="relative text-center mb-16">
            <FaQuoteLeft className="absolute text-6xl text-blue-100 -top-10 left-0 md:left-10" />
            <FaQuoteRight className="absolute text-6xl text-blue-100 -bottom-10 right-0 md:right-10" />
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 relative z-10">
              {philosophy.title}
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          
          {/* Philosophy content */}
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-50 rounded-full opacity-70 blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-50 rounded-full opacity-70 blur-xl"></div>
            
            {/* Content */}
            <div className="relative z-10 bg-white border border-gray-100 rounded-3xl shadow-xl p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {/* Left column - Philosophy points */}
                <div className="md:col-span-2 space-y-6">
                  {philosophy.description.map((point, index) => (
                    <div key={index} className={index === 2 ? "font-semibold text-lg text-blue-800" : ""}>
                      {index === 2 ? (
                        <p className="mb-4">{point}</p>
                      ) : (
                        <p className="text-gray-700">{point}</p>
                      )}
                      
                      {/* If this is the techniques point, render the techniques as a special section */}
                      {index === 3 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                          {philosophy.description.slice(4, 8).map((technique, techIndex) => (
                            <div key={techIndex} className="bg-blue-50 rounded-xl p-4 flex items-start">
                              {techIndex === 0 && <FaChalkboardTeacher className="text-blue-600 text-xl mt-1 mr-3" />}
                              {techIndex === 1 && <FaLightbulb className="text-blue-600 text-xl mt-1 mr-3" />}
                              {techIndex === 2 && <FaUserGraduate className="text-blue-600 text-xl mt-1 mr-3" />}
                              {techIndex === 3 && <FaChalkboardTeacher className="text-blue-600 text-xl mt-1 mr-3" />}
                              <p className="text-gray-700">{technique}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Right column - Conclusion card */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-6 shadow-lg flex flex-col justify-center">
                  <FaQuoteLeft className="text-2xl text-blue-300 mb-4" />
                  <p className="italic mb-6">{philosophy.conclusion}</p>
                  <div className="mt-auto text-right">
                    <FaQuoteRight className="text-2xl text-blue-300 ml-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom section - Student testimonial */}
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <div className="italic text-gray-600 text-lg">
              "The way Charles breaks down complex concepts made all the difference in my understanding. His teaching philosophy truly works!"
            </div>
            <div className="mt-4 font-medium text-gray-800">— Sarah K., Chemistry Student</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;
