import { NextResponse } from "next/server";
import { getCurrentAdminSession } from "@/lib/auth";
import { isDatabaseConfigured } from "@/lib/db";
import { getSponsorshipInquiryById, getSponsorLogoBytes } from "@/lib/submissions";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ message: "Database not configured." }, { status: 501 });
  }

  // Already enforced by src/proxy.ts (any signed-in board member or admin
  // account), re-checked here since this route streams uploaded file
  // content and must never rely on the proxy alone.
  const session = await getCurrentAdminSession();
  if (!session) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  const { id } = await params;
  const inquiry = await getSponsorshipInquiryById(id);
  if (!inquiry || !inquiry.logo_blob_key) {
    return NextResponse.json({ message: "Logo not found." }, { status: 404 });
  }

  const bytes = await getSponsorLogoBytes(inquiry.logo_blob_key);
  if (!bytes) {
    return NextResponse.json({ message: "Logo file is missing." }, { status: 404 });
  }

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": inquiry.logo_content_type || "application/octet-stream",
      "Content-Disposition": `inline; filename="${(inquiry.logo_file_name || "logo").replace(/"/g, "")}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
