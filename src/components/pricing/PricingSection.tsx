import { pricingPlans } from '@/data/pricing';
import { Check, BookOpen, GraduationCap, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import PricingCTA from './PricingCTA';

const icons = {
  BookOpen,
  GraduationCap,
  Trophy
};

export default function PricingSection() {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-4">
            Flexible Tutoring Plans for Every Student
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that works best for your learning needs and schedule.
            All plans include personalized attention from our expert tutors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {pricingPlans.map((plan) => {
            const IconComponent = icons[plan.icon as keyof typeof icons];
            
            return (
              <Card 
                key={plan.name}
                className={`relative overflow-hidden border-2 ${plan.borderColor} transition-all duration-300 hover:shadow-lg ${plan.color}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <Badge className="bg-purple-500 text-white m-4 py-1 px-3">Most Popular</Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pt-8">
                  <div className="mx-auto bg-white p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4 shadow-sm">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4 flex items-baseline justify-center">
                    <span className="text-4xl font-extrabold tracking-tight">${plan.price}</span>
                  </div>
                  <CardDescription className="mt-4 text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mt-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <div className="flex-shrink-0">
                          <Check className="h-5 w-5 text-green-500" />
                        </div>
                        <p className="ml-3 text-base text-gray-700">{feature}</p>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                
                <CardFooter className="pt-4 pb-8 px-6">
                  <Button asChild className={`w-full py-6 text-white ${plan.buttonColor}`}>
                    <Link href="/contact">
                      Get Started
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        <PricingCTA />
      </div>
    </section>
  );
}
