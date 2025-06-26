export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatarUrl?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Chemistry Student',
    content: 'The chemistry tutoring at Chiva TutorHub completely transformed my understanding of organic chemistry. My grades improved from a C to an A within just one semester!',
    avatarUrl: '/avatars/student1.jpg'
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Mathematics Student',
    content: 'I was struggling with calculus until I found Chiva TutorHub. The personalized approach and clear explanations made all the difference in my understanding.',
    avatarUrl: '/avatars/student2.jpg'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Business Studies Student',
    content: 'The business studies tutoring helped me not only with my coursework but also with practical applications. I now feel confident applying business concepts in real-world scenarios.',
    avatarUrl: '/avatars/student3.jpg'
  },
  {
    id: '4',
    name: 'David Thompson',
    role: 'Accounting Student',
    content: "As someone who struggled with accounting principles, I can confidently say that Chiva TutorHub's approach made complex concepts accessible and easy to understand.",
    avatarUrl: '/avatars/student4.jpg'
  }
];
