"use client";
import { aboutContent } from '@/data/aboutData';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBriefcase, FaAward } from 'react-icons/fa';

const Qualifications = () => {
  const { qualifications } = aboutContent;
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {qualifications.title}
            </h2>
            <motion.div 
              className="w-24 h-1 bg-blue-600 mx-auto rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            ></motion.div>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Education */}
            <motion.div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-1 hover:shadow-2xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              whileHover={{ y: -8 }}
            >
              <div className="bg-blue-600 p-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Education</h3>
                <motion.div
                  initial={{ rotate: -10, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <FaGraduationCap className="text-3xl text-white opacity-80" />
                </motion.div>
              </div>
              
              <div className="p-6 space-y-6">
                {qualifications.education.map((edu, index) => (
                  <motion.div 
                    key={index} 
                    className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.7 + (index * 0.2) }}
                  >
                    <h4 className="font-semibold text-lg text-gray-900 mb-1">{edu.name}</h4>
                    <p className="text-gray-600">{edu.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Experience */}
            <motion.div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-1 hover:shadow-2xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.4 }}
              whileHover={{ y: -8 }}
            >
              <div className="bg-blue-700 p-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Experience</h3>
                <motion.div
                  initial={{ rotate: -10, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <FaBriefcase className="text-3xl text-white opacity-80" />
                </motion.div>
              </div>
              
              <div className="p-6 space-y-4">
                {qualifications.experience.map((exp, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.8 + (index * 0.15) }}
                  >
                    <motion.div 
                      className="bg-blue-100 rounded-full p-1 mr-3 mt-1"
                      whileHover={{ scale: 1.2 }}
                    >
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </motion.div>
                    <p className="text-gray-700">{exp}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Specializations */}
            <motion.div 
              className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:-translate-y-1 hover:shadow-2xl"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.6 }}
              whileHover={{ y: -8 }}
            >
              <div className="bg-blue-800 p-6 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">Specializations</h3>
                <motion.div
                  initial={{ rotate: -10, scale: 0.9 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                >
                  <FaAward className="text-3xl text-white opacity-80" />
                </motion.div>
              </div>
              
              <div className="p-6 space-y-6">
                {qualifications.specializations.map((spec, index) => (
                  <motion.div 
                    key={index} 
                    className="border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.9 + (index * 0.2) }}
                  >
                    <h4 className="font-semibold text-lg text-gray-900 mb-1">{spec.title}</h4>
                    <p className="text-gray-600">{spec.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              With extensive qualifications and experience across multiple subjects, I'm equipped to help you excel in your academic journey.
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-lg transition-all hover:-translate-y-0.5">
              Start Learning Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Qualifications;
