import { ReactNode } from 'react';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
}

// Note: The icons will be rendered in the component
export const services = [
  {
    id: 'chemistry',
    title: 'Chemistry Tutoring',
    description: 'Expert guidance in organic, inorganic, and physical chemistry concepts. From basic principles to advanced topics.',
    icon: 'chemistry'
  },
  {
    id: 'mathematics',
    title: 'Mathematics Help',
    description: 'Comprehensive support in algebra, calculus, statistics, and more. Clear explanations and problem-solving techniques.',
    icon: 'mathematics'
  },
  {
    id: 'business',
    title: 'Business Studies',
    description: 'Guidance on business concepts, management theories, marketing strategies, and financial analysis.',
    icon: 'business'
  },
  {
    id: 'accounting',
    title: 'Accounting Lessons',
    description: 'Expert instruction in accounting principles, financial statements, auditing, and tax accounting.',
    icon: 'accounting'
  }
];
