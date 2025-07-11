"use client";
import { aboutContent } from '@/data/aboutData';
import { motion } from 'framer-motion';
import { FaStar, FaUserGraduate, FaChartLine, FaClock } from 'react-icons/fa';

const WhyChooseUs = () => {
  const { whyChoose } = aboutContent;
  
  // Icons for each reason
  const icons = [
    FaStar,
    FaUserGraduate,
    FaChartLine,
    FaClock
  ];
  
  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {whyChoose.title}
            </h2>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              Choose CHIVA TutorHub for personalized, expert tutoring that delivers results and fits your schedule.
            </motion.p>
            <motion.div 
              className="w-24 h-1 bg-blue-600 mx-auto rounded-full mt-6"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
            ></motion.div>
          </motion.div>
          
          {/* Reasons grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {whyChoose.reasons.map((reason, index) => {
              const Icon = icons[index];
              
              return (
                <motion.div 
                  key={index} 
                  className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 transform hover:-translate-y-1 hover:shadow-xl"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + (index * 0.15) }}
                  whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
                >
                  <div className="flex items-start">
                    <motion.div 
                      className="bg-blue-100 rounded-2xl p-4 mr-5"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5 + (index * 0.15), type: "spring" }}
                      whileHover={{ rotate: [0, -10, 10, -5, 5, 0], transition: { duration: 0.6 } }}
                    >
                      <Icon className="text-2xl text-blue-600" />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + (index * 0.15) }}
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {reason.title}
                      </h3>
                      <p className="text-gray-600">
                        {reason.description}
                      </p>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
          
          {/* Stats section */}
          <motion.div 
            className="mt-20"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.div 
              className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.95 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, delay: 0.5 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4">
                {[
                  { value: "98%", label: "Student Satisfaction" },
                  { value: "A+", label: "Average Grade Improvement" },
                  { value: "24/7", label: "Support Available" },
                  { value: "100%", label: "Commitment to Excellence" }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className={`p-8 text-center ${index < 3 ? (index === 1 ? "md:border-r" : "border-r") : ""} ${index > 1 && index < 4 ? "border-t md:border-t-0" : ""} border-blue-500/30`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + (index * 0.1) }}
                  >
                    <motion.div 
                      className="text-4xl font-bold text-white mb-2"
                      initial={{ y: 20 }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", delay: 0.9 + (index * 0.1) }}
                    >
                      {stat.value}
                    </motion.div>
                    <motion.div 
                      className="text-blue-100"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.1 + (index * 0.1) }}
                    >
                      {stat.label}
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          {/* Call to action */}
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <motion.h3 
              className="text-2xl font-bold text-gray-900 mb-6"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", delay: 0.6 }}
            >
              Ready to transform your academic journey?
            </motion.h3>
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 }}
            >
              <motion.a 
                href="/contact"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition-all hover:-translate-y-0.5"
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                Book a Session
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
