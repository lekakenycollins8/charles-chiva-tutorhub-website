"use client";
import { aboutContent } from '@/data/aboutData';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaBook, FaChalkboardTeacher, FaUserTie } from 'react-icons/fa';

const TutorProfile = () => {
  const { intro } = aboutContent;
  
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Abstract tutor representation */}
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div 
                className="relative z-10 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50 via-white to-blue-100 p-8"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="aspect-[4/5] relative flex flex-col items-center justify-center">
                  {/* Abstract tutor representation */}
                  <div className="relative w-48 h-48 mb-8">
                    {/* Abstract head shape */}
                    <motion.div 
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
                    >
                      {/* Abstract face elements */}
                      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-blue-400 rounded-full opacity-70"></div>
                    </motion.div>
                    
                    {/* Abstract body */}
                    <motion.div 
                      className="absolute top-24 left-1/2 transform -translate-x-1/2 w-40 h-48 bg-gradient-to-b from-blue-600 to-blue-700 rounded-2xl shadow-lg"
                      animate={{ scale: [1, 1.02, 1] }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                    />
                  </div>
                  
                  {/* Education icons */}
                  <div className="grid grid-cols-2 gap-6 w-full max-w-xs mx-auto">
                    {[
                      { icon: <FaGraduationCap className="w-8 h-8" />, label: "PhD Qualified" },
                      { icon: <FaChalkboardTeacher className="w-8 h-8" />, label: "Expert Tutor" },
                      { icon: <FaBook className="w-8 h-8" />, label: "Curriculum Specialist" },
                      { icon: <FaUserTie className="w-8 h-8" />, label: "Industry Professional" }
                    ].map((item, index) => (
                      <motion.div 
                        key={index}
                        className="flex flex-col items-center text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + (index * 0.2) }}
                      >
                        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-2">
                          {item.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{item.label}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Experience badge */}
                <motion.div 
                  className="absolute top-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full font-medium shadow-lg"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  10+ Years Experience
                </motion.div>
              </motion.div>
              
              {/* Decorative elements */}
              <motion.div 
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100 rounded-full z-0"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
              />
              <motion.div 
                className="absolute -top-6 -right-6 w-24 h-24 bg-blue-50 rounded-full z-0"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
              />
              <motion.div 
                className="absolute top-1/2 -left-10 transform -translate-y-1/2 w-20 h-20 bg-blue-200 rounded-full z-0"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
              />
              
              {/* Pattern overlay */}
              <div className="absolute inset-0 bg-grid-pattern opacity-5 z-0"></div>
            </motion.div>
            
            {/* Right side - Text content */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.h2 
                className="inline-block text-sm font-semibold px-3 py-1 bg-blue-100 text-blue-800 rounded-full"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {intro.title}
              </motion.h2>
              
              <motion.h3 
                className="text-3xl md:text-4xl font-bold text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {intro.subtitle}
              </motion.h3>
              
              <div className="space-y-4">
                {intro.description.split('\n\n').map((paragraph, index) => (
                  <motion.p 
                    key={index} 
                    className="text-gray-700 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + (index * 0.2) }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>
              
              {/* Stats */}
              <motion.div 
                className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, type: "spring" }}
              >
                {[
                  { value: "10+", label: "Years Experience" },
                  { value: "500+", label: "Students Helped" },
                  { value: "80%", label: "Grade Improvement" },
                  { value: "4", label: "Subject Areas" }
                ].map((stat, index) => (
                  <motion.div 
                    key={index}
                    className="text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <motion.div 
                      className="text-3xl font-bold text-blue-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.6 + (index * 0.1) }}
                    >
                      {stat.value}
                    </motion.div>
                    <motion.div 
                      className="text-sm text-gray-600"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.7 + (index * 0.1) }}
                    >
                      {stat.label}
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* CTA */}
              <motion.div 
                className="pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, type: "spring" }}
              >
                <motion.button 
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition-all hover:-translate-y-0.5"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book a Free Consultation
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TutorProfile;
