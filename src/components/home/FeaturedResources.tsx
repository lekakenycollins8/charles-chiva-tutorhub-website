import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getResources } from '@/lib/actions/resource-actions';

interface Resource {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  isPaid: boolean;
  price: number | null;
  category: string;
  downloads: number;
  imageUrl?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

const FeaturedResources = async () => {
  // Fetch resources on the server side
  const { data: resources } = await getResources();
  
  // Sort by downloads and get top 3
  const featuredResources = resources 
    ? [...resources]
        .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
        .slice(0, 3)
    : [];

  // If no resources are found, don't render anything
  if (!featuredResources || featuredResources.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured <span className="text-blue-600">Study</span> Resources
          </h2>
          <div className="w-24 h-1 bg-blue-600 rounded mb-6 mx-auto"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Access our carefully curated study materials to enhance your learning experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredResources.map((resource) => (
            <div 
              key={resource.id} 
              className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-50 flex flex-col h-full"
            >
              <div className="relative h-52 w-full overflow-hidden bg-gray-100">
                {resource.imageUrl ? (
                  <Image 
                    src={resource.imageUrl} 
                    alt={resource.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                    <span className="text-4xl text-blue-400 font-bold">
                      {resource.title.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className={`absolute top-0 right-0 ${resource.isPaid ? 'bg-blue-600' : 'bg-green-500'} text-white font-bold px-4 py-2 m-3 rounded-full shadow-md transform -rotate-2`}>
                  {resource.isPaid ? `£${resource.price}` : 'Free Access'}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex-grow">
                  <div className="inline-block text-sm font-semibold text-blue-800 bg-blue-100 px-3 py-1 rounded-full mb-3">
                    {resource.category}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {resource.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    <span>{resource.downloads || 0} downloads</span>
                  </div>
                  <Link href={`/resources/${resource.id}`} className="inline-block">
                    <Button className="bg-blue-600 hover:bg-blue-700 transition-colors">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/resources" className="inline-block">
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              View All Resources
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedResources;
