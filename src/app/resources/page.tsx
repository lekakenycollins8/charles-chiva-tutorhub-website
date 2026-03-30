import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getResources } from "@/lib/actions/resource-actions";
import { ArrowRight, Download, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Resource } from "@/types/resource";
import { ResourceFilters } from "@/components/resources/ResourceFilters";
import { ResourceTabs } from "@/components/resources/ResourceTabs";

const ITEMS_PER_PAGE = 9;

// Resource card component
function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="pb-4">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-xl">{resource.title}</CardTitle>
        <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm mb-4">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {resource.category}
          </span>
          {resource.isPaid ? (
            <span className="font-semibold text-blue-600">${resource.price}</span>
          ) : (
            <span className="text-green-600 font-semibold">Free</span>
          )}
        </div>
        <div className="text-sm text-gray-500 flex items-center">
          <Download className="h-4 w-4 mr-1" />
          <span>{resource.downloads || 0} downloads</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between">
        <Button variant="outline" size="sm">
          Preview
        </Button>
        <Link href={`/resources/${resource.id}`}>
          <Button size="sm" className="flex items-center gap-1">
            <span>View Resource</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    category?: string;
    filter?: 'all' | 'paid' | 'free';
  }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const categoryFilter = params.category || 'all';
  const paidFilter = (params.filter || 'all') as 'all' | 'paid' | 'free';

  // Categories for filtering
  const categories = [
    "All",
    "Mathematics",
    "Chemistry",
    "Physics",
    "Biology",
    "Computer Science",
    "Business Studies",
    "Languages",
    "Other"
  ];

  // Fetch resources with counts in a single optimized query
  const filters = {
    category: categoryFilter === 'all' ? undefined : categoryFilter,
    isPaid: paidFilter === 'all' ? undefined : paidFilter === 'paid',
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    includeCounts: true
  };

  const { success, data, pagination, counts, error } = await getResources(filters);

  // Handle error state
  if (!success || error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          <div className="container mx-auto px-4 py-28 relative z-10">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 shadow-xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                  Educational Resources
                </h1>
                <p className="text-xl text-white/90 leading-relaxed">
                  Discover premium learning materials crafted by expert educators to accelerate your academic journey and deepen your understanding.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-16 bg-red-50 rounded-xl border border-red-200">
            <p className="text-xl text-red-600 mb-4">Unable to load resources</p>
            <p className="text-gray-600">{error || 'An error occurred while fetching resources. Please try again later.'}</p>
          </div>
        </div>
      </div>
    );
  }

  const resources = data || [];
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.total || 0;
  const allCount = counts?.all || 0;
  const freeCount = counts?.free || 0;
  const paidCount = counts?.paid || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        
        {/* Decorative elements */}
        <div className="absolute inset-0">
          {/* Abstract geometric shapes */}
          <div className="absolute top-20 left-10 w-40 h-40 bg-white opacity-10 rounded-lg transform rotate-12"></div>
          <div className="absolute bottom-10 right-20 w-60 h-60 bg-white opacity-10 rounded-full"></div>
          <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-white opacity-10 transform rotate-45"></div>
          
          {/* Animated dots pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        {/* Content */}
        <div className="container mx-auto px-4 py-28 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 shadow-xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                Educational Resources
              </h1>
              <p className="text-xl text-white/90 leading-relaxed">
                Discover premium learning materials crafted by expert educators to accelerate your academic journey and deepen your understanding.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-12">
        {/* Category Filters */}
        <div className="mb-8">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <ResourceFilters categories={categories} />
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Free/Paid filtering */}
        <div className="mb-8">
          <ResourceTabs allCount={allCount} freeCount={freeCount} paidCount={paidCount} />
        </div>

        {/* Content Display */}
        <div className="mt-8">
          {resources.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-lg font-medium mb-1">No resources available</p>
              <p className="text-gray-500">
                {categoryFilter !== 'all'
                  ? `No resources found in the ${categoryFilter} category.`
                  : paidFilter !== 'all'
                  ? `No ${paidFilter} resources available.`
                  : "Check back soon for educational resources."}
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {resources.map((resource) => (
                  <ResourceCard key={resource.id} resource={resource} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Card className="mt-8">
                  <CardFooter className="flex items-center justify-between px-6 py-4">
                    <div className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages} • {totalItems} total resources
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link 
                        href={(() => {
                          const params = new URLSearchParams();
                          if (categoryFilter !== 'all') params.set('category', categoryFilter);
                          if (paidFilter !== 'all') params.set('filter', paidFilter);
                          if (currentPage > 1) params.set('page', String(currentPage - 1));
                          return `/resources${params.toString() ? '?' + params.toString() : ''}`;
                        })()}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span className="ml-2">Previous</span>
                        </Button>
                      </Link>
                      <Link 
                        href={(() => {
                          const params = new URLSearchParams();
                          if (categoryFilter !== 'all') params.set('category', categoryFilter);
                          if (paidFilter !== 'all') params.set('filter', paidFilter);
                          params.set('page', String(currentPage + 1));
                          return `/resources?${params.toString()}`;
                        })()}
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={currentPage === totalPages}
                        >
                          <span className="mr-2">Next</span>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardFooter>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}