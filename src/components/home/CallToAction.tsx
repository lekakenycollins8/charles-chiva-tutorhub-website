import Link from 'next/link';
import { Button } from '@/components/ui/button';

const CallToAction = () => {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-700 to-blue-900 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated circles */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        
        {/* Geometric shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 border-4 border-blue-300 opacity-20 rotate-12"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border-4 border-blue-300 opacity-20 rotate-45 rounded-lg"></div>
        <div className="absolute top-1/2 right-20 w-16 h-16 border-4 border-blue-300 opacity-20 -rotate-12"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 border border-white/20 shadow-2xl transform hover:scale-[1.01] transition-all duration-300">
            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* Left content */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-block px-4 py-1 bg-blue-800 text-blue-200 rounded-full text-sm font-medium mb-4">
                  Start Your Journey
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  Ready to <span className="text-blue-300">Transform</span> Your Academic Journey?
                </h2>
                <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                  Book a session with our expert tutors and take the first step towards academic excellence. Our personalized approach ensures you get the support you need.
                </p>
                <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                  <Link href="/contact" passHref>
                    <Button variant="default" size="lg" className="bg-white text-blue-700 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 rounded-xl font-bold text-lg group">
                      <span>Book a Session</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </Button>
                  </Link>
                  <Link href="/pricing" passHref>
                    <Button size="lg" className="border-2 border-white text-white hover:bg-blue-800 transition-all duration-300 px-8 py-6 rounded-xl font-bold text-lg">
                      View Pricing
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Right content - Stats */}
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 text-center transform hover:-translate-y-1 transition-all duration-300">
                  <div className="text-4xl font-bold text-blue-300 mb-2">95%</div>
                  <p className="text-blue-100">Student Satisfaction</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 text-center transform hover:-translate-y-1 transition-all duration-300">
                  <div className="text-4xl font-bold text-blue-300 mb-2">500+</div>
                  <p className="text-blue-100">Students Helped</p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 text-center transform hover:-translate-y-1 transition-all duration-300">
                  <div className="text-4xl font-bold text-blue-300 mb-2">A*</div>
                  <p className="text-blue-100">Grade Improvements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 text-white">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>
  );
};

export default CallToAction;
