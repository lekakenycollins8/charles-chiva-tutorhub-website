export interface Testimonial {
  id: string;
  name: string;
  location: string;
  content: string;
  avatarUrl?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Maria K.',
    location: 'Nigeria',
    content: 'ChivaTutorHub helped me pass my IELTS on the first attempt! The lessons were simple, well-structured, and focused exactly on the areas I struggled with. Thanks to their guidance, I got my desired band score and can now pursue my studies abroad.',
    avatarUrl: '/images/maria.jpg'
  },
  {
    id: '2',
    name: 'Ahmed S.',
    location: 'Kenya',
    content: 'Before joining ChivaTutorHub, I was struggling to keep up with my assignments. The tutors are so patient and professional, they explained concepts in a way I could easily understand. Now, my grades have improved, and I feel confident in class!',
    avatarUrl: '/images/ahmed.jpg'
  },
  {
    id: '3',
    name: 'Priya D.',
    location: 'India',
    content: 'Moving to a new country for studies can be stressful, but ChivaTutorHub made the transition so much easier. They not only helped me academically but also guided me on how to adjust to the education system abroad. Their support is unmatched!',
    avatarUrl: '/images/priya.jpg'
  },
  {
    id: '4',
    name: 'James O.',
    location: 'Manchester, UK',
    content: 'Chiva Tutor Hub was a game-changer for me! As a university student in Manchester, I was struggling to keep up with Chemistry and Mathematics, especially with the fast-paced lectures. Their one-on-one tutoring simplified the tough concepts and helped me build confidence. I passed my exams with flying colors — I highly recommend them to any student looking to improve their grades.',
    avatarUrl: '/images/james.jpg'
  }
];
