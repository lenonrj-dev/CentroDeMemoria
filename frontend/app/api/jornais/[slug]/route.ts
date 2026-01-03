import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { JournalContent } from "../../../../lib/backend-types";

export const runtime = "nodejs";

type Params = { params: Promise<{ slug: string }> };

type BackendSuccess<T> = { success: true; data: T };

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;

  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000").replace(/\/+$/, "");

  const res = await fetch(`${base}/api/jornais/${encodeURIComponent(slug)}`, { cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json({ error: "not_found" }, { status: res.status });
  }

  const json = (await res.json()) as BackendSuccess<JournalContent>;
  const j = json.data;

  const payload = {
    slug: j.slug,
    title: j.title,
    date: j.issueDate?.slice(0, 10) ?? "s/d",
    number: j.edition || "",
    summary: j.description,
    cover: j.coverImageUrl,
    pages: (j.pages ?? []).map((p) => ({
      index: p.pageNumber,
      image: p.imageUrl,
      caption: `Página ${p.pageNumber}`,
    })),
  };

  return NextResponse.json(payload, { status: 200 });
}
