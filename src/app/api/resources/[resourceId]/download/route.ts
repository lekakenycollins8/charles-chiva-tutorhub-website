import { NextResponse } from "next/server";
import { getResource } from "@/lib/actions/resource-actions";
import { verifyDownloadToken } from "@/lib/auth-utils";
import { cookies } from 'next/headers';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ resourceId: string }> }
) {
  try {
    const { resourceId } = await params;
    
    if (!resourceId) {
      return NextResponse.json(
        { error: "Resource ID is required" },
        { status: 400 }
      );
    }
    
    // Get resource to check if it's paid and get fileUrl
    const { success, resource } = await getResource(resourceId);
    
    if (!success || !resource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }
    
    // Check if resource is paid and verify token if it is
    if (resource.isPaid) {
      const url = new URL(request.url);
      const token = url.searchParams.get('token') || '';
      
      const { valid, resourceId: tokenResourceId } = await verifyDownloadToken(token);
      
      if (!valid || tokenResourceId !== resourceId) {
        return NextResponse.json(
          { error: "Valid download token required for paid resources" },
          { status: 403 }
        );
      }
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
