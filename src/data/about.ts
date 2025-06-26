export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
}

export const teamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Charles Chiva',
    role: 'Founder & Lead Tutor',
    bio: 'With over 15 years of teaching experience, Charles founded Chiva TutorHub with a vision to make quality education accessible to all students. He specializes in Chemistry and Business Studies.',
    imageUrl: '/team/charles-chiva.jpg'
  },
  {
    id: '2',
    name: 'Emma Wilson',
    role: 'Mathematics Tutor',
    bio: 'Emma has a Ph.D. in Applied Mathematics and has been teaching for 8 years. She is passionate about making complex mathematical concepts easy to understand for students of all levels.',
    imageUrl: '/team/emma-wilson.jpg'
  },
  {
    id: '3',
    name: 'Robert Chen',
    role: 'Accounting Specialist',
    bio: 'Robert is a certified accountant with 10 years of industry experience. He brings real-world examples into his tutoring sessions to help students apply accounting principles to practical scenarios.',
    imageUrl: '/team/robert-chen.jpg'
  },
  {
    id: '4',
    name: 'Sophia Martinez',
    role: 'Chemistry Tutor',
    bio: 'Sophia holds a Master\'s degree in Chemistry and specializes in organic chemistry. Her interactive teaching approach has helped numerous students improve their grades significantly.',
    imageUrl: '/team/sophia-martinez.jpg'
  }
];

export const aboutContent = {
  mission: {
    title: "Our Mission",
    content: "At Chiva TutorHub, our mission is to empower students through personalized education that builds confidence, fosters understanding, and promotes academic excellence. We believe that every student has the potential to succeed with the right guidance and support."
  },
  vision: {
    title: "Our Vision",
    content: "We envision a world where quality education is accessible to all students, regardless of their background or learning style. Through innovative teaching methods and personalized attention, we aim to transform the educational experience and help students achieve their full potential."
  },
  values: [
    {
      title: "Excellence",
      description: "We are committed to delivering the highest quality tutoring services, constantly improving our methods and materials to ensure optimal learning outcomes."
    },
    {
      title: "Personalization",
      description: "We recognize that each student has unique learning needs and styles. Our approach is tailored to meet individual requirements for maximum effectiveness."
    },
    {
      title: "Integrity",
      description: "We uphold the highest ethical standards in all our interactions, fostering trust and respect in our relationships with students and parents."
    },
    {
      title: "Innovation",
      description: "We continuously explore new teaching techniques and technologies to enhance the learning experience and keep our students engaged."
    }
  ],
  history: {
    title: "Our Story",
    content: "Chiva TutorHub was founded in 2015 by Charles Chiva, an experienced educator who recognized the need for personalized tutoring services that address individual learning styles. What began as a small tutoring service has grown into a comprehensive educational platform serving students across various academic disciplines. Throughout our journey, we have remained committed to our core values of excellence, personalization, integrity, and innovation."
  }
};
