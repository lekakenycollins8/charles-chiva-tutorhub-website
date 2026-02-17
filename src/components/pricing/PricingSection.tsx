"use client";
import { pricingPlans } from '@/data/pricing';
import { Check, BookOpen, GraduationCap, Trophy, Zap, Users, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import PricingCTA from './PricingCTA';
import IntaSendPricingButton from './IntaSendPricingButton';
import { motion } from 'framer-motion';

const icons = {
  BookOpen,
  GraduationCap,
  Trophy
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function PricingSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="relative z-10 container mx-auto max-w-7xl px-4 py-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Flexible Plans for Every Learner
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Choose Your Learning
            <span className="block text-3xl md:text-4xl mt-2 text-blue-600">Path to Success</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Unlock your potential with personalized tutoring plans designed to fit your schedule, budget, and learning style.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-blue-600">
                <Users className="w-6 h-6" />
                10K+
              </div>
              <div className="text-sm text-gray-600 mt-1">Students</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-green-600">
                <Star className="w-6 h-6" />
                4.9
              </div>
              <div className="text-sm text-gray-600 mt-1">Rating</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-3xl font-bold text-purple-600">
                <Zap className="w-6 h-6" />
                95%
              </div>
              <div className="text-sm text-gray-600 mt-1">Success Rate</div>
            </div>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20"
        >
          {pricingPlans.map((plan, index) => {
            const IconComponent = icons[plan.icon as keyof typeof icons];
            const isPopular = plan.popular;
            
            return (
              <motion.div
                key={plan.name}
                variants={itemVariants}
                className="relative"
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 text-sm font-semibold shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <Card className={`relative h-full transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                  isPopular 
                    ? 'border-2 border-purple-200 bg-gradient-to-b from-purple-50/50 to-white shadow-xl' 
                    : 'border border-gray-200 bg-white shadow-lg'
                }`}>
                  {/* Gradient Border Effect for Popular */}
                  {isPopular && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-400/20 to-blue-400/20 -z-10 blur-xl" />
                  )}
                  
                  <CardHeader className="text-center pt-8 pb-6">
                    <div className={`mx-auto p-4 rounded-2xl w-20 h-20 flex items-center justify-center mb-6 shadow-lg ${
                      isPopular ? 'bg-gradient-to-br from-purple-500 to-blue-500' : 'bg-gradient-to-br from-gray-100 to-gray-200'
                    }`}>
                      <IconComponent className={`w-10 h-10 ${isPopular ? 'text-white' : 'text-gray-700'}`} />
                    </div>
                    
                    <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                    
                    <div className="flex items-baseline justify-center gap-1 mb-4">
                      <span className="text-5xl font-extrabold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                        ${plan.priceValue}
                      </span>
                      <span className="text-xl text-gray-500">/{plan.priceUnit}</span>
                    </div>
                    
                    <CardDescription className="text-base text-gray-600 leading-relaxed">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="px-8">
                    <ul className="space-y-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                            <Check className="w-4 h-4 text-green-600" />
                          </div>
                          <p className="text-gray-700 leading-relaxed">{feature}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  
                  <CardFooter className="pt-6 pb-8 px-8">
                    <IntaSendPricingButton 
                      plan={plan}
                      className={`py-4 text-lg font-semibold transition-all duration-300 ${
                        isPopular 
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl' 
                          : ''
                      }`}
                    />
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
        
        <PricingCTA />
      </div>
    </section>
  );
}
