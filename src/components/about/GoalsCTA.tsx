"use client";

import { aboutContent } from '@/data/aboutData';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar, FaGraduationCap, FaRocket } from 'react-icons/fa';

const GoalsCTA = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 z-0">
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '24px 24px'
        }}></div>
      </div>
      
      {/* Decorative elements */}
      <motion.div 
        className="absolute top-0 right-0 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Content card with glass effect */}
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 shadow-2xl border border-white/20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              {/* Left side - Text content */}
              <div className="lg:col-span-3 space-y-6">
                <motion.div 
                  className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                >
                  <FaStar className="text-yellow-300 mr-2" />
                  <span className="text-sm font-medium text-white">Academic Excellence</span>
                </motion.div>
                
                <motion.h2 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  {aboutContent.goals.title}
                </motion.h2>
                
                <motion.p 
                  className="text-xl text-blue-100 leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 }}
                >
                  {aboutContent.goals.description}
                </motion.p>
                
                {/* Goal points */}
                <motion.div 
                  className="space-y-4 mt-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.9 }}
                >
                  {[
                    "Personalized learning plans tailored to your needs",
                    "Continuous progress tracking and feedback",
                    "Focus on building confidence and independence"
                  ].map((point, index) => (
                    <motion.div 
                      key={index}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1 + (index * 0.2) }}
                    >
                      <div className="bg-blue-400/30 p-2 rounded-lg mr-4 flex-shrink-0">
                        <FaGraduationCap className="text-white" />
                      </div>
                      <p className="text-blue-50">{point}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
              
              {/* Right side - CTA card */}
              <motion.div 
                className="lg:col-span-2 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-xl"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 1.2, type: "spring" }}
              >
                <div className="text-center space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/50 backdrop-blur-sm rounded-full mx-auto">
                    <FaRocket className="text-white text-2xl" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white">Start Your Journey Today</h3>
                  
                  <p className="text-blue-100">
                    Take the first step toward academic success with personalized tutoring sessions.
                  </p>
                  
                  <div className="space-y-3">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link 
                        href="/contact" 
                        className="block w-full px-8 py-4 bg-white hover:bg-blue-50 text-blue-600 font-medium rounded-xl shadow-lg transition-all"
                      >
                        Book a Free Consultation
                      </Link>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link 
                        href="/services" 
                        className="block w-full px-8 py-4 bg-blue-700/50 hover:bg-blue-700/70 text-white font-medium rounded-xl shadow-lg border border-white/20 transition-all"
                      >
                        Explore Services
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          {/* Floating badges */}
          <motion.div 
            className="absolute -top-6 left-1/4 bg-gradient-to-r from-blue-400 to-blue-500 px-4 py-2 rounded-lg shadow-lg text-white font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.5 }}
            animate={{ y: [0, -8, 0] }}
            // Using animationTransition instead of duplicate transition
            style={{ transition: 'all 4s infinite reverse' }}
          >
            500+ Students Helped
          </motion.div>
          
          <motion.div 
            className="absolute -bottom-6 right-1/4 bg-gradient-to-r from-blue-400 to-blue-500 px-4 py-2 rounded-lg shadow-lg text-white font-medium"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.7 }}
            animate={{ y: [0, 8, 0] }}
            // Using animationTransition instead of duplicate transition
            style={{ transition: 'all 5s infinite reverse' }}
          >
            80% Grade Improvement
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GoalsCTA;
