import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";
import { FileText, BookOpen, MessageSquare, Video } from "lucide-react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Initialize Prisma client
const prisma = new PrismaClient();

export default async function AdminDashboard() {
  // Check authentication using NextAuth
  try {
    const session = await getSession();
    
    // If no session or user, redirect to login
    if (!session || !session.user) {
      redirect("/admin/login?error=unauthorized");
    }
    
    // Check if the user has admin role
    if (session.user.role !== "admin") {
      redirect("/admin/login?error=forbidden");
    }
  } catch (error) {
    console.error("Authentication error:", error);
    redirect("/admin/login?error=authentication");
  }
  
  // Fetch counts from database with error handling
  let resourceCount = 0;
  let blogCount = 0;
  let messageCount = 0;
  let videoCount = 0;
  let hasDbError = false;
  
  try {
    // @ts-ignore - Prisma client dynamically creates properties based on schema
    resourceCount = await prisma.resource.count();
    // @ts-ignore - Prisma client dynamically creates properties based on schema
    blogCount = await prisma.blogPost.count();
    // @ts-ignore - Prisma client dynamically creates properties based on schema
    messageCount = await prisma.contactSubmission.count();
    // Check if video model exists before counting
    try {
      // @ts-ignore - Prisma client dynamically creates properties based on schema
      videoCount = await prisma.video.count();
    } catch (e) {
      // Video model doesn't exist, leave count at 0
      videoCount = 0;
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    hasDbError = true;
    // Continue with zeros, we'll show an error message
  }

  // Dashboard stats
  const stats = [
    {
      title: "Total Resources",
      value: resourceCount,
      icon: <FileText className="h-8 w-8 text-blue-500" />,
      description: "Study materials available",
    },
    {
      title: "Blog Posts",
      value: blogCount,
      icon: <BookOpen className="h-8 w-8 text-green-500" />,
      description: "Published and drafts",
    },
    {
      title: "Messages",
      value: messageCount,
      icon: <MessageSquare className="h-8 w-8 text-yellow-500" />,
      description: "Client inquiries",
    },
    {
      title: "Videos",
      value: videoCount,
      icon: <Video className="h-8 w-8 text-purple-500" />,
      description: "Uploaded videos",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Welcome to the Chiva TutorHub admin dashboard.</p>
      </div>
      
      {/* Error message if database fetch failed */}
      {hasDbError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Database Error</AlertTitle>
          <AlertDescription>
            There was an error fetching dashboard data. Some information may not be displayed correctly.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Message when no data exists yet */}
      {!hasDbError && resourceCount === 0 && blogCount === 0 && messageCount === 0 && videoCount === 0 && (
        <Alert className="mb-4">
          <AlertTitle>No Content Yet</AlertTitle>
          <AlertDescription>
            Your dashboard is empty. Start adding resources, blog posts, or videos using the quick actions below.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-gray-500">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 md:grid-cols-3">
          <a 
            href="/admin/dashboard/resources/new" 
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Add New Resource
          </a>
          <a 
            href="/admin/dashboard/blog/new" 
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            Create Blog Post
          </a>
          <a 
            href="/admin/dashboard/videos/new" 
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
          >
            Upload Video
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
