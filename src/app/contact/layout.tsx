import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Chiva TutorHub',
  description: 'Get in touch with Chiva TutorHub for personalized tutoring in Chemistry, Mathematics, Business Studies, and Accounting. We\'re here to help you succeed.',
  keywords: 'contact tutor, tutoring inquiry, chemistry tutor contact, math tutor Kenya, business studies tutor, accounting tutor',
  openGraph: {
    title: 'Contact Us | Chiva TutorHub',
    description: 'Get in touch with Chiva TutorHub for personalized tutoring services. Available for Chemistry, Mathematics, Business Studies, and Accounting.',
    url: 'https://chivatutorhub.com/contact',
    siteName: 'Chiva TutorHub',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Us | Chiva TutorHub',
    description: 'Get in touch with Chiva TutorHub for personalized tutoring services.',
  },
  alternates: {
    canonical: 'https://chivatutorhub.com/contact',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
