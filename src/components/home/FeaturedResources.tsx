import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getResources } from "@/lib/actions/resource-actions";

const FeaturedResources = async () => {
  // Get featured resources from the database
  const { success, resources = [] } = await getResources();
  
  // Sort by downloads and take the first 3
  const featuredResources = resources
    .sort((a: any, b: any) => (b.downloads || 0) - (a.downloads || 0))
    .slice(0, 3);

  return (
    <section className="py-24 bg-gradient-to-tr from-blue-50 to-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-blue-200 to-blue-100 rounded-full blur-3xl opacity-30 translate-y-1/3 -translate-x-1/4"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center mb-16">
          <div className="inline-block px-6 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            Learning Materials
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 text-center">
            Featured <span className="text-blue-600">Study</span> Resources
          </h2>
          <div className="w-24 h-1 bg-blue-600 rounded mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl text-center">
            Access our carefully curated study materials to enhance your learning experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredResources.length > 0 ? (
            featuredResources.map((resource: any) => (
              <div 
                key={resource.id} 
                className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-50"
                style={{ animationDelay: `${featuredResources.indexOf(resource) * 150}ms` }}
              >
                <div className="relative h-52 w-full overflow-hidden">
                  {resource.imageUrl ? (
                    <Image 
                      src={resource.imageUrl} 
                      alt={resource.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center group-hover:from-blue-500 group-hover:to-blue-700 transition-colors duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                  <div className={`absolute top-0 right-0 ${resource.isPaid ? 'bg-blue-600' : 'bg-green-500'} text-white font-bold px-4 py-2 m-3 rounded-full shadow-md transform -rotate-2`}>
                    {resource.isPaid ? `£${resource.price}` : 'Free Access'}
                  </div>
                </div>
                
                <div className="p-6 relative">
                  {/* Category badge */}
                  <div className="inline-block text-sm font-semibold text-blue-800 bg-blue-100 px-3 py-1 rounded-full mb-3">
                    {resource.category}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {resource.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">{resource.description}</p>
                  
                  <div className="flex space-x-3">
                    <Link href={`/resources/${resource.id}`} passHref className="flex-1">
                      <Button variant="outline" className="w-full group-hover:bg-blue-50 transition-colors">
                        <span>Preview</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                      </Button>
                    </Link>
                    
                    <Link href={`/resources/${resource.id}`} passHref className="flex-1">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">
                        <span>{!resource.isPaid ? 'Access Now' : 'Purchase'}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-lg font-medium mb-1">No resources available</p>
              <p className="text-gray-500">Check back soon for educational resources.</p>
            </div>
          )}
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
