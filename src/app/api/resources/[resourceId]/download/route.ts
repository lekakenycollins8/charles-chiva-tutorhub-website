import { NextResponse } from "next/server";
import { incrementDownloadCount } from "@/lib/actions/resource-actions";

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
    
    // Increment download count
    const { success } = await incrementDownloadCount(resourceId);
    
    if (!success) {
      return NextResponse.json(
        { error: "Failed to increment download count" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Download tracking error:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
