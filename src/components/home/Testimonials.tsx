"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { testimonials } from '@/data/testimonials';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaGlobeAfrica, FaMapMarkerAlt } from 'react-icons/fa';

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  
  useEffect(() => {
    if (!autoplay) return;
    
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [autoplay]);
  
  const handleTestimonialClick = (index: number) => {
    setActiveIndex(index);
    setAutoplay(false);
  };
  
  const getCountryFlag = (location: string) => {
    if (location.includes('Nigeria')) return '🇳🇬';
    if (location.includes('Kenya')) return '🇰🇪';
    if (location.includes('India')) return '🇮🇳';
    if (location.includes('UK')) return '🇬🇧';
    return '🌍';
  };
  
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-br from-blue-950 to-indigo-900" id="testimonials">
      {/* World map background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-[url('/images/world-map.png')] bg-no-repeat bg-center bg-contain opacity-20"></div>
      </div>
      
      {/* Animated gradient circles */}
      <motion.div 
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.2, 0.15],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div 
        className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-500 to-cyan-400 opacity-15 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 7, repeat: Infinity, delay: 2 }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-block px-6 py-2 bg-indigo-700 text-indigo-100 rounded-full text-sm font-medium mb-4 border border-indigo-500/30"
          >
            <span className="flex items-center gap-2">
              <FaGlobeAfrica className="text-indigo-300" /> Global Success Stories
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 text-center leading-tight"
          >
            Transforming <span className="text-gradient bg-gradient-to-r from-blue-400 to-indigo-300">Education</span> Across Borders
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-gradient-to-r from-blue-400 to-indigo-300 rounded-full mb-6"
          />
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-lg text-blue-100 max-w-2xl text-center"
          >
            Our students from around the world share how ChivaTutorHub has helped them achieve academic excellence and transform their educational journey.
          </motion.p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
          {/* Main featured testimonial */}
          <motion.div 
            key={testimonials[activeIndex].id + "-featured"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 relative bg-gradient-to-br from-indigo-800/40 to-blue-900/40 p-8 md:p-12 rounded-3xl backdrop-blur-sm border border-indigo-500/20 shadow-xl"
          >
            <div className="absolute -top-5 -left-5 text-5xl text-indigo-400 opacity-80">
              <FaQuoteLeft />
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="relative w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden shadow-lg border-4 border-indigo-300/20">
                <Image 
                  src={testimonials[activeIndex].avatarUrl || '/images/default-avatar.jpg'}
                  alt={testimonials[activeIndex].name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-900/90 to-transparent p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getCountryFlag(testimonials[activeIndex].location)}</span>
                    <span className="text-white font-medium text-sm">{testimonials[activeIndex].location}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-1">
                <p className="text-blue-50 text-lg md:text-xl leading-relaxed mb-8 italic">
                  "{testimonials[activeIndex].content}"
                </p>
                
                <div className="flex items-center">
                  <div className="mr-4 w-1 h-12 bg-gradient-to-b from-blue-400 to-indigo-600"></div>
                  <div>
                    <h4 className="font-bold text-white text-xl">{testimonials[activeIndex].name}</h4>
                    <p className="text-blue-200 flex items-center gap-1">
                      <FaMapMarkerAlt className="text-blue-400" /> {testimonials[activeIndex].location}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-5 -right-5 text-5xl text-indigo-400 opacity-80 transform rotate-180">
              <FaQuoteLeft />
            </div>
          </motion.div>
          
          {/* Testimonial selection */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => handleTestimonialClick(index)}
                className={`cursor-pointer p-4 rounded-xl transition-all duration-300 flex items-center gap-4 ${activeIndex === index 
                  ? 'bg-gradient-to-r from-indigo-600/40 to-blue-600/40 border border-indigo-500/30 shadow-lg' 
                  : 'bg-indigo-900/20 hover:bg-indigo-800/30 border border-indigo-700/20'}`}
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-indigo-400/30 flex-shrink-0">
                  <Image 
                    src={testimonial.avatarUrl || '/images/default-avatar.jpg'}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <h4 className="font-semibold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-blue-200 flex items-center gap-1">
                    <span className="text-lg">{getCountryFlag(testimonial.location)}</span> 
                    {testimonial.location}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Pagination dots */}
        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => handleTestimonialClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${activeIndex === index 
                ? 'bg-blue-400 w-8' 
                : 'bg-blue-800 hover:bg-blue-700'}`}
              aria-label={`View testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Add global style for text gradient */}
      <style jsx global>{`
        .text-gradient {
          background-clip: text;
          -webkit-background-clip: text;
          color: transparent;
          display: inline-block;
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
