export interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  isFree: boolean;
  price?: number;
}

export const featuredResources: Resource[] = [
  {
    id: '1',
    title: 'Introduction to Organic Chemistry',
    description: 'A comprehensive guide to understanding the basics of organic chemistry, including molecular structures and reactions.',
    category: 'Chemistry',
    imageUrl: '/resources/chemistry-guide.jpg',
    isFree: true
  },
  {
    id: '2',
    title: 'Advanced Calculus Problem Solving',
    description: 'Step-by-step approaches to solving complex calculus problems, with practical examples and exercises.',
    category: 'Mathematics',
    imageUrl: '/resources/calculus-guide.jpg',
    isFree: false,
    price: 15.99
  },
  {
    id: '3',
    title: 'Business Strategy Fundamentals',
    description: 'Learn the core concepts of business strategy development, competitive analysis, and strategic planning.',
    category: 'Business Studies',
    imageUrl: '/resources/business-guide.jpg',
    isFree: true
  },
  {
    id: '4',
    title: 'Financial Accounting Mastery',
    description: 'Master the principles of financial accounting, financial statements, and accounting standards.',
    category: 'Accounting',
    imageUrl: '/resources/accounting-guide.jpg',
    isFree: false,
    price: 19.99
  }
];
