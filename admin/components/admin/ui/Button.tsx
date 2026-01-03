import clsx from "clsx";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md";

export const buttonClasses = (variant: Variant = "primary", size: Size = "md") =>
  clsx(
    "inline-flex items-center justify-center gap-2 rounded-xl border text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 disabled:opacity-60",
    size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2",
    variant === "primary" && "border-indigo-400/40 bg-indigo-500/20 text-white hover:bg-indigo-500/30",
    variant === "secondary" && "border-slate-700 bg-white/5 text-slate-100 hover:bg-white/10",
    variant === "ghost" && "border-transparent bg-transparent text-slate-200 hover:bg-white/5",
    variant === "danger" && "border-red-500/40 bg-red-500/15 text-red-50 hover:bg-red-500/25"
  );

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return <button {...props} className={clsx(buttonClasses(variant, size), className)} />;
}
