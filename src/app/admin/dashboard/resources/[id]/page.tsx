import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getResource } from "@/lib/actions/resource-actions";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Download, Edit, FileText, Trash } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import DeleteResourceButton from "@/components/admin/resources/DeleteResourceButton";

export default async function ResourcePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { success, resource, message } = await getResource(id);
  
  if (!success || !resource) {
    notFound();
  }
  
  // Format the file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/admin/dashboard/resources">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">{resource.title}</h1>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/admin/dashboard/resources/${id}/edit`}>
            <Button variant="outline" className="flex items-center space-x-2">
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          </Link>
          <DeleteResourceButton id={id} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Resource Details</CardTitle>
            <CardDescription>
              View the details of this educational resource.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1">{resource.description}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="mt-1">{resource.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">File Type</h3>
                <p className="mt-1">{resource.fileType}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">File Size</h3>
                <p className="mt-1">{formatFileSize(resource.fileSize)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Pricing</h3>
                <p className="mt-1">
                  {resource.isPaid ? (
                    <span className="font-semibold text-blue-600">£{resource.price}</span>
                  ) : (
                    <span className="text-green-600 font-semibold">Free</span>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6 flex justify-between">
            <div className="text-sm text-gray-500">
              Created {formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Download className="h-4 w-4 mr-1" />
              <span>{resource.downloads || 0} downloads</span>
            </div>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Resource Preview</CardTitle>
            <CardDescription>
              Preview of the resource file.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="font-medium text-center">{resource.title}</h3>
            <p className="text-sm text-gray-500 text-center mt-1">{resource.fileType}</p>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <a 
              href={resource.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              <Download className="h-4 w-4 mr-2" />
              Download File
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
