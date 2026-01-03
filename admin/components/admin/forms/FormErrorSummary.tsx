"use client";

import type { NormalizedApiError } from "../../../lib/api-errors";

type Props = {
  error: NormalizedApiError | null;
};

export function FormErrorSummary({ error }: Props) {
  if (!error) return null;
  const fields = error.fieldErrors ? Object.entries(error.fieldErrors) : [];

  return (
    <div className="rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100 shadow-sm">
      <div className="font-semibold text-red-50">{error.message}</div>
      {error.requestId ? <div className="mt-1 text-xs text-red-200">ID do erro: {error.requestId}</div> : null}
      {fields.length ? (
        <div className="mt-3 space-y-1 text-xs text-red-100">
          {fields.map(([key, value]) => (
            <div key={key}>
              <span className="font-semibold">{key}:</span> {value}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
