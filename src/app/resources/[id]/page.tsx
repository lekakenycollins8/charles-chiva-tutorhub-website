import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getResource, incrementDownloadCount } from "@/lib/actions/resource-actions";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Download, FileText } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import DownloadButton from "@/components/resources/DownloadButton";

export default async function ResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Link href="/resources" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Resources</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl">{resource.title}</CardTitle>
                    <CardDescription className="mt-2">
                      Added {formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}
                    </CardDescription>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${resource.isPaid ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                    {resource.isPaid ? `£${resource.price}` : 'Free'}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Description</h3>
                  <p className="text-gray-700">{resource.description}</p>
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
                    <h3 className="text-sm font-medium text-gray-500">Downloads</h3>
                    <p className="mt-1">{resource.downloads || 0}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-6">
                {resource.isPaid ? (
                  <form action="#" className="w-full">
                    <Button className="w-full flex items-center justify-center gap-2">
                      <span>Purchase for £{resource.price}</span>
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Button>
                    <p className="text-xs text-center mt-2 text-gray-500">
                      Secure payment via Stripe. You'll receive immediate access after purchase.
                    </p>
                  </form>
                ) : (
                  <form action={async () => {
                    "use server";
                    await incrementDownloadCount(id);
                  }} className="w-full">
                    <DownloadButton 
                      fileUrl={resource.fileUrl}
                      className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    />
                  </form>
                )}
              </CardFooter>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Resource Preview</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center py-6">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <FileText className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="font-medium text-center">{resource.title}</h3>
                <p className="text-sm text-gray-500 text-center mt-1">{resource.fileType}</p>
              </CardContent>
              {!resource.isPaid && (
                <CardFooter className="border-t pt-6">
                  <form action={async () => {
                    "use server";
                    await incrementDownloadCount(id);
                  }} className="w-full">
                    <DownloadButton 
                      fileUrl={resource.fileUrl}
                      className="w-full inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                    />
                  </form>
                </CardFooter>
              )}
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Related Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  Coming soon! Related resources will be displayed here.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
