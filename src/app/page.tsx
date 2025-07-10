import Hero from '@/components/home/Hero';
import ServicesOverview from '@/components/home/ServicesOverview';
import Testimonials from '@/components/home/Testimonials';
import FeaturedResources from '@/components/home/FeaturedResources';
import CallToAction from '@/components/home/CallToAction';
import ContactSection from '@/components/home/ContactSection';
import VideoSection from '@/components/VideoSection';

export default function Home() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <FeaturedResources />
      <VideoSection />
      <Testimonials />
      <CallToAction />
      <ContactSection />
    </>
  );
}
