import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getFeaturedResources } from '@/lib/actions/resource-actions';

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
  // Fetch featured resources on the server side
  const { data: featuredResources, success } = await getFeaturedResources(3);
  
  // If no resources are found or there was an error, don't render anything
  if (!success || !featuredResources || featuredResources.length === 0) {
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
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                  <span className="text-4xl text-blue-400 font-bold">
                    {resource.title.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div
                  className={`absolute top-0 right-0 ${
                    resource.isPaid ? 'bg-blue-600' : 'bg-green-500'
                  } text-white font-bold px-4 py-2 m-3 rounded-full shadow-md transform -rotate-2`}
                >
                  {resource.isPaid ? `$${resource.price}` : 'Free Access'}
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
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v1a3 3 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                      />
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
        
        <div className="mt-16 text-center">
          <Link href="/resources" passHref>
            <Button className="px-8 py-6 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl group">
              <span>Explore All Resources</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedResources;
