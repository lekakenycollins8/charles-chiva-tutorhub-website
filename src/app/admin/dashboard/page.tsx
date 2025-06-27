import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrismaClient } from "@prisma/client";
import { FileText, BookOpen, MessageSquare, Video } from "lucide-react";

// Initialize Prisma client
const prisma = new PrismaClient();

export default async function AdminDashboard() {
  // Fetch counts from database
  const resourceCount = await prisma.resource.count();
  const blogCount = await prisma.blog.count();
  const messageCount = await prisma.message.count();
  const videoCount = await prisma.video.count();

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

      {/* Recent Activity Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              No resources added recently. Add new resources from the Resources section.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              No new messages. Check the Messages section for client inquiries.
            </p>
          </CardContent>
        </Card>
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
