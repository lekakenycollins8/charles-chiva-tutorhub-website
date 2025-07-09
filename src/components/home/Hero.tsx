"use client";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';

// Import the animation data
import tutoringAnimation from '../../../public/animations/tutoring-animation.json';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Function to handle smooth scrolling to contact section
  const scrollToContact = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const benefits = [
    { title: 'Personalized Learning', description: 'Customized plans tailored to your specific needs and learning style' },
    { title: 'Expert Tutors', description: 'Learn from specialists with proven academic and teaching excellence' },
    { title: 'Flexible Scheduling', description: 'Sessions that fit your busy life with 24/7 availability' },
    { title: 'Guaranteed Results', description: 'Measurable improvement in grades and confidence or your money back' },
  ];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Abstract geometric shapes */}
          <div className="absolute top-[10%] left-[5%] w-96 h-96 rounded-full bg-blue-400/10 blur-3xl animate-float"></div>
          <div className="absolute bottom-[15%] right-[10%] w-[40rem] h-[40rem] rounded-full bg-blue-300/10 blur-3xl animate-float-delay"></div>
          <div className="absolute top-[40%] right-[30%] w-80 h-80 rounded-full bg-cyan-300/10 blur-3xl animate-pulse"></div>
          
          {/* Light beams */}
          <div className="absolute top-0 left-1/4 w-1 h-[30vh] bg-gradient-to-b from-blue-400/0 via-blue-400/30 to-blue-400/0 rotate-[20deg] transform-gpu"></div>
          <div className="absolute top-0 right-1/3 w-1 h-[40vh] bg-gradient-to-b from-cyan-400/0 via-cyan-400/20 to-cyan-400/0 -rotate-[15deg] transform-gpu"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-[url('/images/grid-pattern.png')] bg-repeat opacity-5"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-20">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center">
          {/* Left content - Text and CTA */}
          <div className={`text-white space-y-6 max-w-2xl transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block px-5 py-2 bg-gradient-to-r from-blue-500/40 to-blue-400/40 backdrop-blur-md rounded-full text-sm font-medium border border-blue-400/30 shadow-lg shadow-blue-500/20">
              <span className="mr-2">✨</span> Transforming Education Through Expert Tutoring
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Unlock Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Academic</span> Potential
            </h1>
            
            <p className="text-base md:text-lg text-blue-100/90 leading-relaxed">
              Personalized tutoring in Chemistry, Mathematics, Business Studies, and Accounting with a proven methodology that delivers results.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-3">
              <Button 
                size="default" 
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-6 shadow-lg shadow-blue-500/30 transition-all hover:scale-105 group relative overflow-hidden"
                onClick={scrollToContact}
              >
                <span className="relative z-10 flex items-center">
                  Contact Us Now
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Button>
              
              <Button size="default" className="bg-white text-blue-600 hover:bg-blue-50 rounded-full px-6 shadow-lg transition-all hover:scale-105">
                <Link href="/contact">Start Your Journey</Link>
              </Button>
              
              <Button variant="outline" size="default" className="border border-white/30 text-white hover:bg-white/10 rounded-full px-6 backdrop-blur-sm transition-all hover:border-white/50">
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
          
          {/* Right content - Animation and Why Choose Us */}
          <div className={`relative flex-1 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative">
              {/* Animated glow effect behind animation */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 rounded-full blur-2xl animate-pulse-slow"></div>
              
              {/* Main animation container */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl p-5 rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-cyan-400/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>
                
                {/* Lottie Animation */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-56 h-56 lg:w-72 lg:h-72">
                    {/* Pulsing background circle */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 animate-pulse-slow"></div>
                    </div>
                    
                    {/* Rotating ring */}
                    <div className="absolute inset-0 flex items-center justify-center animate-spin-slow">
                      <div className="w-56 h-56 lg:w-72 lg:h-72 rounded-full border-2 border-dashed border-blue-400/30"></div>
                    </div>
                    
                    {/* Animation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lottie 
                        animationData={tutoringAnimation} 
                        loop={true} 
                        style={{ width: '100%', height: '100%' }}
                        className="drop-shadow-2xl"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Why Choose Us section */}
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-4 text-center bg-gradient-to-r from-blue-200 to-cyan-200 bg-clip-text text-transparent">
                    Why Students Choose Chiva TutorHub
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {benefits.map((benefit, index) => (
                      <div 
                        key={index} 
                        className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10 hover:border-blue-400/30 transition-all hover:bg-white/10"
                      >
                        <div className="flex items-start gap-2">
                          <span className="flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <div>
                            <h4 className="font-semibold text-base text-blue-100">{benefit.title}</h4>
                            <p className="text-blue-200/80 text-xs">{benefit.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce cursor-pointer"
        onClick={(e) => {
          e.preventDefault();
          const contactSection = document.getElementById('contact');
          if (contactSection) {
            contactSection.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
