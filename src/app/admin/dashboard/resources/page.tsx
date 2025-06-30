import { Button } from "@/components/ui/button";
import { PrismaClient } from "@prisma/client";
import { FileText, Plus, Filter, Download } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { getResources } from "@/lib/actions/resource-actions";

export default async function ResourcesPage() {
  // Fetch resources using the action
  const { success, resources = [], message } = await getResources();
  const hasError = !success;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
          <p className="text-gray-500">Manage your educational resources and materials.</p>
        </div>
        <Link href="/admin/dashboard/resources/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Resource</span>
          </Button>
        </Link>
      </div>

      {/* Filters and search - to be implemented */}
      <Card className="bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Filter className="h-3.5 w-3.5" />
              <span>All</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <span>Free</span>
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <span>Paid</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error message if database fetch failed */}
      {hasError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {message || "There was an error fetching resources. Please try again later."}</span>
        </div>
      )}

      {/* Resources list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {resources.length > 0 ? (
            resources.map((resource: any) => (
              <li key={resource.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-blue-600">{resource.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-md">{resource.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${resource.isPaid ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {resource.isPaid ? `£${resource.price}` : 'Free'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Download className="h-3 w-3 mr-1" />
                        {resource.downloads}
                      </span>
                      <div className="ml-2 flex-shrink-0 flex">
                        <Link href={`/admin/dashboard/resources/${resource.id}`}>
                          <Button variant="outline" size="sm">View</Button>
                        </Link>
                        <Link href={`/admin/dashboard/resources/${resource.id}/edit`} className="ml-2">
                          <Button variant="outline" size="sm">Edit</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : !hasError ? (
            <li className="px-4 py-8 sm:px-6 text-center text-gray-500">
              <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-lg font-medium mb-1">No resources found</p>
              <p className="mb-4">Get started by adding your first educational resource.</p>
              <Link href="/admin/dashboard/resources/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Resource
                </Button>
              </Link>
            </li>
          ) : null}
        </ul>
      </div>
    </div>
  );
}
