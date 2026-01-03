import { Suspense } from "react";
import { FundosClient } from "./FundosClient";

export default function FundosPage() {
  return (
    <Suspense fallback={<div className="py-10 text-center text-white/70">Carregando fundos...</div>}>
      <FundosClient />
    </Suspense>
  );
}
