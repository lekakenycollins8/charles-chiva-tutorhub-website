import Hero from '@/components/home/Hero';
import ServicesOverview from '@/components/home/ServicesOverview';
import Testimonials from '@/components/home/Testimonials';
import FeaturedResources from '@/components/home/FeaturedResources';
import CallToAction from '@/components/home/CallToAction';
import ContactSection from '@/components/home/ContactSection';

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <FeaturedResources />
      <Testimonials />
      <CallToAction />
      <ContactSection />
    </>
  );
}
