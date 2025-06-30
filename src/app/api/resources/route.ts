import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";

const prisma = new PrismaClient();

// GET /api/resources - Get all resources
export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const isPaid = searchParams.get("isPaid");
    
    // Build filter object
    const filter: any = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (isPaid !== null) {
      filter.isPaid = isPaid === "true";
    }
    
    // Fetch resources with filters
    const resources = await prisma.resource.findMany({
      where: filter,
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json({ resources }, { status: 200 });
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

// POST /api/resources - Create a new resource
export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getSession();
    
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description || !body.fileUrl || !body.fileType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Create the resource
    const resource = await prisma.resource.create({
      data: {
        title: body.title,
        description: body.description,
        fileUrl: body.fileUrl,
        fileType: body.fileType,
        fileSize: body.fileSize || 0,
        isPaid: body.isPaid || false,
        price: body.isPaid ? body.price : null,
        category: body.category || "Other",
      },
    });
    
    return NextResponse.json({ resource }, { status: 201 });
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}
