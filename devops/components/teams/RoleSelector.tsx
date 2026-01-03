// file: components/teams/RoleSelector.tsx
"use client";

/**
 * RoleSelector
 * Componente acessível e controlado para seleção de papéis.
 *
 * Props:
 * - value (string): valor atual (Owner | Admin | Dev | Viewer)
 * - onChange (fn): callback (novoValor: string) => void
 * - id (string, opcional): id para associar com label
 * - name (string, opcional): nome do campo (forms)
 * - label (string, opcional): rótulo visível
 * - srLabel (string, opcional): rótulo somente para leitores de tela
 * - help (string, opcional): texto auxiliar
 * - error (string, opcional): texto de erro (marca aria-invalid)
 * - required (boolean, opcional): campo obrigatório
 * - disabled (boolean, opcional): desabilita o select
 * - className (string, opcional): classes extras
 * - options (string[], opcional): lista de papéis (default: Owner, Admin, Dev, Viewer)
 */
export default function RoleSelector({
  value,
  onChange,
  id,
  name,
  label,
  srLabel,
  help,
  error,
  required = false,
  disabled = false,
  className = "",
  options = ["Owner", "Admin", "Dev", "Viewer"],
}) {
  const selectId = id || "role-selector";
  const helpId = help ? `${selectId}-help` : undefined;
  const errId = error ? `${selectId}-error` : undefined;
  const describedBy = [helpId, errId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`flex flex-col gap-1 ${disabled ? "opacity-70" : ""}`}>
      {label ? (
        <label htmlFor={selectId} className="text-xs text-gray-300">
          {label} {required && <span className="text-rose-300">*</span>}
        </label>
      ) : srLabel ? (
        <label htmlFor={selectId} className="sr-only">
          {srLabel}
        </label>
      ) : null}

      <select
        id={selectId}
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        aria-label={!label && !srLabel ? "Selecionar papel" : undefined}
        className={`bg-[#0e141b] border rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-cyan-500/40
        ${error ? "border-rose-500/40" : "border-white/10"} ${className}`}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {help && !error && (
        <p id={helpId} className="text-[11px] text-gray-400">
          {help}
        </p>
      )}
      {error && (
        <p id={errId} className="text-[11px] text-rose-300">
          {error}
        </p>
      )}
    </div>
  );
}
