import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/get-site-content";

export async function GET() {
  const siteContent = await getSiteContent();
  return NextResponse.json(siteContent);
}
