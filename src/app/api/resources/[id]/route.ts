import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@/lib/auth";

const prisma = new PrismaClient();

// GET /api/resources/[id] - Get a specific resource
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Fetch the resource
    const resource = await prisma.resource.findUnique({
      where: { id },
    });
    
    if (!resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ resource }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching resource ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch resource" },
      { status: 500 }
    );
  }
}

// PUT /api/resources/[id] - Update a resource
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getSession();
    
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id },
    });
    
    if (!existingResource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    
    // Update the resource
    const updatedResource = await prisma.resource.update({
      where: { id },
      data: {
        title: body.title || existingResource.title,
        description: body.description || existingResource.description,
        fileUrl: body.fileUrl || existingResource.fileUrl,
        fileType: body.fileType || existingResource.fileType,
        fileSize: body.fileSize || existingResource.fileSize,
        isPaid: body.isPaid !== undefined ? body.isPaid : existingResource.isPaid,
        price: body.isPaid ? body.price : null,
        category: body.category || existingResource.category,
      },
    });
    
    return NextResponse.json({ resource: updatedResource }, { status: 200 });
  } catch (error) {
    console.error(`Error updating resource ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    );
  }
}

// DELETE /api/resources/[id] - Delete a resource
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is authenticated and is an admin
    const session = await getSession();
    
    if (!session || !session.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    // Check if resource exists
    const existingResource = await prisma.resource.findUnique({
      where: { id },
    });
    
    if (!existingResource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }
    
    // Delete the resource
    await prisma.resource.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting resource ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}
