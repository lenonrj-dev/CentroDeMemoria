"use client";

import { useSearchParams } from "next/navigation";
import { FundosHeroSection } from "./sections/FundosHeroSection";
import { FundosSearchSection } from "./sections/FundosSearchSection";
import { FundosListSection } from "./sections/FundosListSection";
import { funds } from "./data";

export function FundosClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q")?.toLowerCase().trim() || "";
  const filtered = q
    ? funds.filter((f) => {
        const hay = `${f.name} ${f.summary} ${f.highlights.join(" ")}`.toLowerCase();
        return hay.includes(q);
      })
    : funds;

  return (
    <div className="bg-gradient-to-b from-[#0b0c10] via-[#0b0c10] to-[#090909] text-white">
      <FundosHeroSection />
      <FundosSearchSection query={q} />
      <FundosListSection funds={filtered} />
    </div>
  );
}
