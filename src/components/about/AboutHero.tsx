import { aboutContent } from '@/data/about';

const AboutHero = () => {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            About Chiva TutorHub
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Dedicated to academic excellence through personalized tutoring and educational support.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutHero;
