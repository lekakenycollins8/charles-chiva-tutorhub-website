import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getResource, incrementDownloadCount } from "@/lib/actions/resource-actions";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Download, FileText, Calendar, HardDrive, Eye, Tag } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import DownloadButton from "@/components/resources/DownloadButton";
import { getActivePaymentProvider } from "@/lib/payment-config";
import { Metadata } from "next";
import { getCategoryGradient } from "@/lib/constants/resource-categories";

// Generate dynamic metadata for resource pages
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const { success, resource } = await getResource(id);
  
  if (!success || !resource) {
    return {
      title: 'Resource Not Found | Chiva TutorHub',
      description: 'The resource you are looking for could not be found.',
    };
  }

  const baseUrl = 'https://chivatutorhub.com';
  const resourceUrl = `${baseUrl}/resources/${resource.id}`;
  const priceTag = resource.isPaid ? `KSh ${resource.price?.toLocaleString() || '0'}` : 'Free';
  const description = `${resource.description} - ${priceTag} ${resource.fileType.toUpperCase()} resource for ${resource.category}.`;

  return {
    title: `${resource.title} | Chiva TutorHub Resources`,
    description: description.substring(0, 160),
    keywords: [resource.category, resource.fileType, priceTag, 'educational resource', 'study material'].join(', '),
    openGraph: {
      title: resource.title,
      description: description.substring(0, 160),
      url: resourceUrl,
      siteName: 'Chiva TutorHub',
      type: 'website',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary',
      title: resource.title,
      description: description.substring(0, 160),
    },
    alternates: {
      canonical: resourceUrl,
    },
  };
}

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/resources" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span>Back to Resources</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thumbnail / Hero Image */}
            {resource.thumbnailUrl && (
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={resource.thumbnailUrl}
                  alt={resource.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge
                    className={`text-white border-0 ${resource.isPaid ? 'bg-blue-600' : 'bg-green-600'}`}
                  >
                    {resource.isPaid ? `KSh ${resource.price?.toLocaleString() || '0'}` : 'Free'}
                  </Badge>
                </div>
              </div>
            )}

            {/* Title and Basic Info */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {resource.title}
                      </h1>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                        <Badge variant="outline" className="bg-white">
                          {resource.category}
                        </Badge>
                        <span>•</span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDistanceToNow(new Date(resource.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                <div>
                  <h2 className="text-lg font-semibold mb-3 text-gray-900">About this resource</h2>
                  <p className="text-gray-700 leading-relaxed">{resource.description}</p>
                </div>

                <Separator />

                {/* Resource Details */}
                <div>
                  <h2 className="text-lg font-semibold mb-4 text-gray-900">Resource Details</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center text-gray-500 mb-1">
                        <Tag className="h-4 w-4 mr-2" />
                        <span className="text-sm">Category</span>
                      </div>
                      <p className="font-medium text-gray-900">{resource.category}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center text-gray-500 mb-1">
                        <FileText className="h-4 w-4 mr-2" />
                        <span className="text-sm">Type</span>
                      </div>
                      <p className="font-medium text-gray-900">{resource.fileType}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center text-gray-500 mb-1">
                        <HardDrive className="h-4 w-4 mr-2" />
                        <span className="text-sm">Size</span>
                      </div>
                      <p className="font-medium text-gray-900">{formatFileSize(resource.fileSize)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center text-gray-500 mb-1">
                        <Eye className="h-4 w-4 mr-2" />
                        <span className="text-sm">Downloads</span>
                      </div>
                      <p className="font-medium text-gray-900">{resource.downloads || 0}</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Download Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
                  <DownloadButton
                    fileUrl={resource.fileUrl}
                    resourceId={resource.id}
                    isPaid={resource.isPaid}
                    price={resource.price}
                    activeProvider={getActivePaymentProvider()}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Preview Card */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Quick Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resource.thumbnailUrl ? (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={resource.thumbnailUrl}
                      alt={resource.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-16 w-16 text-blue-600" />
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">{resource.title}</p>
                  <p className="text-sm text-gray-600">{resource.fileType}</p>
                </div>
              </CardContent>
            </Card>

            {/* Category Card */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/resources?category=${encodeURIComponent(resource.category)}`}>
                  <div className={`rounded-lg p-4 bg-gradient-to-br ${getCategoryGradient(resource.category)} text-white cursor-pointer hover:opacity-90 transition-opacity`}>
                    <p className="font-semibold">{resource.category}</p>
                    <p className="text-sm text-white/80 mt-1">View more in this category</p>
                  </div>
                </Link>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="border-0 shadow-md bg-blue-50">
              <CardHeader>
                <CardTitle className="text-lg text-blue-900">Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-blue-800 space-y-2">
                <p>• Download and save the file to your device</p>
                <p>• Ensure you have the necessary software to open the file</p>
                <p>• Contact support if you encounter any issues</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
