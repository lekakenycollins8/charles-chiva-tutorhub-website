'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getResources } from "@/lib/actions/resource-actions";
import { ArrowRight, Download, FileText, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import type { Resource, ResourceResponse } from "@/types/resource";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

const ITEMS_PER_PAGE = 9;

// Loading skeleton component
function ResourcesLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-4">
            <Skeleton className="h-12 w-12 rounded-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-16" />
            </div>
            <Skeleton className="h-4 w-32" />
          </CardContent>
          <CardFooter className="pt-0 flex justify-between">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-32" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

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

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [paidFilter, setPaidFilter] = useState<'all' | 'paid' | 'free'>('all');
  const [allResources, setAllResources] = useState<Resource[]>([]);

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

  // Fetch resources
  const fetchResources = async () => {
    try {
      setLoading(true);
      const filters: any = {
        category: categoryFilter === 'all' ? undefined : categoryFilter,
        isPaid: paidFilter === 'all' ? undefined : paidFilter === 'paid',
        page: currentPage,
        limit: ITEMS_PER_PAGE
      };

      const { success, data, pagination, error } = await getResources(filters) as ResourceResponse;
      
      if (success && data) {
        setResources(data);
        setTotalPages(pagination?.totalPages || 1);
        setTotalItems(pagination?.total || 0);
        setError(null);
      } else {
        setError(error || 'Failed to fetch resources');
      }
    } catch (err) {
      setError('An error occurred while fetching resources');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all resources for tab counts
  const fetchAllResources = async () => {
    try {
      const { success, data } = await getResources({ limit: 1000 }) as ResourceResponse;
      if (success && data) {
        setAllResources(data);
      }
    } catch (err) {
      console.error('Error fetching all resources:', err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAllResources();
  }, []);

  // Fetch when filters change
  useEffect(() => {
    fetchResources();
  }, [currentPage, categoryFilter, paidFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, paidFilter]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Calculate counts for tabs
  const freeCount = allResources.filter(r => !r.isPaid).length;
  const paidCount = allResources.filter(r => r.isPaid).length;

  // Render resources content with pagination
  const renderResourcesContent = () => {
    if (error) {
      return (
        <div className="col-span-3 text-center py-12">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    if (loading) {
      return <ResourcesLoading />;
    }

    if (resources.length === 0) {
      return (
        <div className="col-span-3 text-center py-12">
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
      );
    }

    return (
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="ml-2">Previous</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                >
                  <span className="mr-2">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}
      </>
    );
  };

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
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={categoryFilter === (category === "All" ? "all" : category) ? "default" : "outline"}
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => setCategoryFilter(category === "All" ? "all" : category)}
                  >
                    {category === "All" && <Filter className="h-3.5 w-3.5" />}
                    <span>{category}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Free/Paid filtering */}
        <Tabs value={paidFilter} onValueChange={(value) => setPaidFilter(value as 'all' | 'paid' | 'free')} className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="all">All ({allResources.length})</TabsTrigger>
            <TabsTrigger value="free">Free ({freeCount})</TabsTrigger>
            <TabsTrigger value="paid">Paid ({paidCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-8">
            {renderResourcesContent()}
          </TabsContent>

          <TabsContent value="free" className="mt-8">
            {renderResourcesContent()}
          </TabsContent>

          <TabsContent value="paid" className="mt-8">
            {renderResourcesContent()}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}