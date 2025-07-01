import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getResources } from "@/lib/actions/resource-actions";
import { ArrowRight, Download, FileText, Filter } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import type { Resource, ResourceResponse } from "@/types/resource";

// Loading component for Suspense
function ResourcesLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-blue-100 rounded-full mb-4"></div>
        <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 w-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

// Resources list component
async function ResourcesList({ category }: { category?: string }) {
  // Get resources from the database with optional category filter
  const { success, data: resources = [], error } = await getResources(
    category ? { category } : undefined
  ) as ResourceResponse;
  
  if (!success) {
    return (
      <div className="col-span-3 text-center py-12">
        <p className="text-red-500">{error || 'Failed to load resources'}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {resources.length > 0 ? (
        resources.map((resource: Resource) => (
          <Card key={resource.id} className="overflow-hidden transition-all hover:shadow-lg">
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
                  <span className="font-semibold text-blue-600">£{resource.price}</span>
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
        ))
      ) : (
        <div className="col-span-3 text-center py-12">
          <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-lg font-medium mb-1">No resources available</p>
          <p className="text-gray-500">
            {category 
              ? `No resources found in the ${category} category.` 
              : "Check back soon for educational resources."}
          </p>
        </div>
      )}
    </div>
  );
}

export default function ResourcesPage() {
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

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Educational Resources</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse our collection of high-quality educational materials to enhance your learning experience.
            From comprehensive study guides to practice exams, we've got you covered.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Card className="bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Link 
                    key={category} 
                    href={category === "All" ? "/resources" : `/resources?category=${category}`}
                  >
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      {category === "All" && <Filter className="h-3.5 w-3.5" />}
                      <span>{category}</span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resources list with Suspense for loading state */}
        <Suspense fallback={<ResourcesLoading />}>
          <ResourcesList />
        </Suspense>
      </div>
    </div>
  );
}
