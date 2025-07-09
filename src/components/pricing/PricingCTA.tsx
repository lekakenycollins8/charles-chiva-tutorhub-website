import React from 'react';
import { MessageCircle, Shield, Clock, Award, Sparkles, ArrowRight } from 'lucide-react';

const CustomTutoringSection: React.FC = () => {
  return (
    <div className="mt-20 space-y-16">
      {/* Custom Plan Section */}
      <div className="relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 opacity-90"></div>
        
        {/* Floating shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400/20 rounded-full blur-lg animate-bounce"></div>
        
        <div className="relative text-center p-12 text-white">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </div>
          
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Need a Custom Plan?
          </h2>
          
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Every student's journey is unique. Let's craft a personalized tutoring experience 
            that adapts to your learning style, schedule, and academic aspirations.
          </p>
          
          <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-600 bg-white rounded-full hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
            <span className="mr-2">Start Your Custom Journey</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Satisfaction Guarantee */}
        <div className="group relative bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100 hover:border-green-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
          <div className="absolute top-6 right-6 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-green-500 rounded-xl shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900">100% Satisfaction Guarantee</h3>
            
            <p className="text-gray-600 leading-relaxed">
              Your success is our priority. If you're not completely satisfied with your first session, 
              we'll find you the perfect tutor match or provide a full refund.
            </p>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </div>

        {/* Flexible Scheduling */}
        <div className="group relative bg-gradient-to-br from-orange-50 to-amber-50 p-8 rounded-2xl border border-orange-100 hover:border-orange-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
          <div className="absolute top-6 right-6 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
          
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-orange-500 rounded-xl shadow-lg">
              <Clock className="w-7 h-7 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900">Ultimate Flexibility</h3>
            
            <p className="text-gray-600 leading-relaxed">
              Life doesn't follow a 9-to-5 schedule, and neither do we. Book sessions that fit your lifestyle - 
              early mornings, late evenings, or weekends.
            </p>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-amber-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </div>

        {/* Expert Tutors */}
        <div className="group relative bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-2xl border border-purple-100 hover:border-purple-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
          <div className="absolute top-6 right-6 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Award className="w-6 h-6 text-purple-600" />
          </div>
          
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-500 rounded-xl shadow-lg">
              <Award className="w-7 h-7 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-900">World-Class Experts</h3>
            
            <p className="text-gray-600 leading-relaxed">
              Our tutors aren't just knowledgeable - they're passionate educators with proven track records 
              of transforming students' academic journeys.
            </p>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
        </div>
      </div>
    </div>
  );
};

export default CustomTutoringSection;