import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-white to-blue-50 pt-16 pb-6 overflow-hidden">
      {/* Top wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden rotate-180">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 text-white">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-[5%] w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/3 left-[10%] w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative flex items-center justify-center w-10 h-10 bg-white rounded-full">
                  <span className="text-xl font-bold text-blue-600">C</span>
                </div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">Chiva</span>
                <span className="text-xl font-bold text-gray-800">TutorHub</span>
              </div>
            </Link>
            <p className="mt-6 text-gray-600 leading-relaxed">
              Professional tutoring services for Chemistry, Mathematics, Business Studies, and Accounting. We help students achieve academic excellence through personalized education.
            </p>
            
            {/* Social Media */}
            <div className="mt-6 flex space-x-4">
              {['facebook', 'instagram'].map((social) => (
                <a 
                  key={social}
                  href={social === 'facebook' ? 'https://www.facebook.com/profile.php?id=100095482243807' : 'https://www.instagram.com/chiva_tutorhub/profilecard/?igsh=eGRsaHhkN2Y4eDls'}
                  className="w-10 h-10 rounded-full shadow-sm flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-300 border border-blue-100"
                  aria-label={`${social} profile`}
                >
                  {social === 'facebook' ? <Facebook className="text-2xl" /> : <Instagram className="text-2xl" />}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', href: '/' },
                { name: 'About', href: '/about' },
                { name: 'Services', href: '/services' },
                { name: 'Pricing', href: '/pricing' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 flex items-center group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Resources</h3>
            <ul className="space-y-3">
              {[
                { name: 'Study Materials', href: '/resources' },
                { name: 'Blog', href: '/blog' },
                { name: 'Contact', href: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-300 flex items-center group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-400 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-1 md:col-span-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-5">Get In Touch</h3>
            <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-50">
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-blue-100 rounded-md p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <a href="mailto:info@chivatutorhub.com" className="text-sm text-blue-600 hover:underline">chivatutorhub@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider with gradient */}
        <div className="mt-16 mb-8">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600">
            &copy; {currentYear} <span className="text-blue-600 font-medium">Chiva TutorHub</span>. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
