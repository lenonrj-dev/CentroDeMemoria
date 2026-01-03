import clsx from "clsx";

const base =
  "w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 shadow-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-400/40 focus:border-indigo-400/40";

export function Input({
  className,
  invalid,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) {
  return (
    <input
      {...props}
      className={clsx(
        base,
        invalid ? "border-red-400/40 focus:ring-red-400/40 focus:border-red-400/40" : "",
        className
      )}
    />
  );
}
