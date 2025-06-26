import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: 'url("/images/hero-bg.jpg")', 
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-600/70 z-10"></div>
      </div>
      
      {/* Animated shapes */}
      <div className="absolute inset-0 z-10 opacity-20">
        <div className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-blue-300 mix-blend-overlay animate-float"></div>
        <div className="absolute bottom-20 right-[15%] w-80 h-80 rounded-full bg-blue-400 mix-blend-overlay animate-float-delay"></div>
        <div className="absolute top-[40%] right-[25%] w-40 h-40 rounded-full bg-blue-200 mix-blend-overlay animate-pulse"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-white space-y-6">
            <div className="inline-block px-4 py-1 bg-blue-500/30 backdrop-blur-sm rounded-full text-sm font-medium mb-2">
              Expert Tutoring Services
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Unlock Your <span className="text-blue-300">Academic</span> Potential
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-lg">
              Personalized tutoring in Chemistry, Mathematics, Business Studies, and Accounting to help you excel in your academic journey.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8">
                <Link href="/contact">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 rounded-full px-8">
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
          
          <div className="relative hidden md:block">
            <div className="absolute -top-10 -left-10 w-full h-full bg-blue-300/20 rounded-3xl transform rotate-6 backdrop-blur-sm"></div>
            <div className="absolute -bottom-10 -right-10 w-full h-full bg-blue-400/20 rounded-3xl transform -rotate-6 backdrop-blur-sm"></div>
            <div className="relative bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-xl">
              <div className="text-white space-y-4">
                <h3 className="text-2xl font-bold">Why Choose Us?</h3>
                <ul className="space-y-3">
                  {[
                    'Personalized Learning Plans',
                    'Expert Subject Specialists',
                    'Flexible Scheduling',
                    'Proven Results',
                    'Comprehensive Study Resources'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-400 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
