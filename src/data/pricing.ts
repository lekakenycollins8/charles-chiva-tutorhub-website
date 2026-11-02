export interface PricingPlan {
  id: string;
  name: string;
  priceDisplay: string;
  priceValue: number;
  priceUnit: 'hour' | 'week' | 'month';
  currencySymbol: string;
  features: string[];
  description: string;
  color: string;
  borderColor: string;
  buttonColor: string;
  icon: string;
  popular?: boolean;
  maxQuantity?: number;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'basic-hourly',
    name: 'Basic',
    priceDisplay: 'KSh 1,000/hr',
    priceValue: 1000,
    priceUnit: 'hour',
    currencySymbol: 'KSh',
    features: ['1-hour one-on-one session', 'Weekly homework review', 'Email support'],
    description: 'Perfect for students who need occasional help with specific topics',
    color: 'bg-blue-50',
    borderColor: 'border-blue-200',
    buttonColor: 'bg-blue-500 hover:bg-blue-600',
    icon: 'BookOpen',
    maxQuantity: 20, // Maximum 20 hours that can be purchased at once
  },
  {
    id: 'standard-weekly',
    name: 'Standard',
    priceDisplay: 'KSh 5,000/week',
    priceValue: 5000,
    priceUnit: 'week',
    currencySymbol: 'KSh',
    features: ['One-on-one session', 'Weekly homework review', 'Study materials', '24/7 email support'],
    description: 'Ideal for students who need regular assistance throughout the week',
    color: 'bg-purple-50',
    borderColor: 'border-purple-200',
    buttonColor: 'bg-purple-500 hover:bg-purple-600',
    popular: true,
    icon: 'GraduationCap',
    maxQuantity: 12, // Maximum 12 weeks that can be purchased at once
  },
  {
    id: 'premium-monthly',
    name: 'Premium',
    priceDisplay: 'KSh 10,000/month',
    priceValue: 10000,
    priceUnit: 'month',
    currencySymbol: 'KSh',
    features: ['Weekly progress report', 'Customized study plan', 'Practice exams', '24/7 phone and email support'],
    description: 'Comprehensive support for students aiming for academic excellence',
    color: 'bg-amber-50',
    borderColor: 'border-amber-200',
    buttonColor: 'bg-amber-500 hover:bg-amber-600',
    icon: 'Trophy',
    maxQuantity: 6, // Maximum 6 months that can be purchased at once
  },
];
