import type { ReactNode } from "react";
import { FieldHelpTooltip, type FieldHelp } from "./FieldHelpTooltip";

type Props = {
  label: string;
  htmlFor?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  help?: FieldHelp;
  children: ReactNode;
};

const fallbackHelp = (label: string): FieldHelp => ({
  what: `Use este campo para informar ${label.toLowerCase()}.`,
  where: "Aparece nas listas do admin e na página pública do item quando publicado.",
  example: "Ex.: informação curta e objetiva.",
});

export function Field({ label, htmlFor, required, hint, error, help, children }: Props) {
  const tooltip = help ?? fallbackHelp(label);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <label htmlFor={htmlFor} className="text-sm font-medium text-slate-100">
          {label}
        </label>
        {required ? (
          <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[10px] text-amber-100">
            Obrigatório
          </span>
        ) : null}
        <FieldHelpTooltip help={tooltip} label={label} />
      </div>
      {children}
      {hint ? <div className="text-xs text-slate-400">{hint}</div> : null}
      {error ? <div className="text-xs text-red-300">{error}</div> : null}
    </div>
  );
}
