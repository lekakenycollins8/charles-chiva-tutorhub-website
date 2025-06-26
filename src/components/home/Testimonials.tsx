import Image from 'next/image';
import { testimonials } from '@/data/testimonials';

const Testimonials = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-900 to-blue-700 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-64 bg-white opacity-5"></div>
        <div className="absolute -top-10 right-20 w-40 h-40 rounded-full bg-blue-300 opacity-20"></div>
        <div className="absolute bottom-20 left-10 w-60 h-60 rounded-full bg-blue-400 opacity-10"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-blue-200 opacity-5 blur-3xl"></div>
      </div>
      
      {/* Quote marks */}
      <div className="absolute top-10 left-10 text-9xl text-blue-400 opacity-20 font-serif">"</div>
      <div className="absolute bottom-10 right-10 text-9xl text-blue-400 opacity-20 font-serif">"</div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center mb-16">
          <div className="inline-block px-6 py-2 bg-blue-800 text-blue-200 rounded-full text-sm font-medium mb-4">
            Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">
            What Our <span className="text-blue-300">Students</span> Say
          </h2>
          <div className="w-24 h-1 bg-blue-300 rounded mb-6"></div>
          <p className="text-lg text-blue-100 max-w-2xl text-center">
            Hear from students who have transformed their academic journey with our tutoring services.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="group bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative mb-6">
                <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-blue-50 italic leading-relaxed mb-4">"{testimonial.content}"</p>
              </div>
              
              <div className="flex items-center">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-blue-600 mr-4 border-2 border-blue-300">
                  {testimonial.avatarUrl ? (
                    <Image 
                      src={testimonial.avatarUrl} 
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-blue-100 font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-white group-hover:text-blue-300 transition-colors">{testimonial.name}</h4>
                  <p className="text-sm text-blue-200">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center mt-12">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-colors flex items-center gap-2 group">
            <span>View More Testimonials</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
