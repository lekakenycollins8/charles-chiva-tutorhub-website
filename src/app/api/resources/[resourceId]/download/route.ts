import { NextResponse } from "next/server";
import { getResource } from "@/lib/actions/resource-actions";

export async function POST(
  request: Request,
  { params }: { params: { resourceId: string } }
) {
  try {
    const { resourceId } = params;
    
    if (!resourceId) {
      return NextResponse.json(
        { error: "Resource ID is required" },
        { status: 400 }
      );
    }
    
    // Get resource to access fileUrl
    const { success, resource } = await getResource(resourceId);
    
    if (!success || !resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      fileUrl: resource.fileUrl 
    });
  } catch (error: any) {
    console.error("Download tracking error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
