"use client";

import type { ElementType, ReactNode } from "react";
import { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border border-cyan-400/60 shadow-[0_10px_40px_-18px_rgba(34,211,238,0.8)] hover:shadow-[0_12px_50px_-18px_rgba(14,165,233,0.8)]",
  secondary: "bg-white/[0.04] text-gray-100 border border-white/15 hover:border-white/25 hover:bg-white/[0.07]",
  ghost: "text-gray-200 border border-transparent hover:border-white/10 hover:bg-white/5",
  destructive: "bg-gradient-to-r from-rose-500 to-orange-500 text-white border border-rose-400/60 hover:shadow-[0_12px_40px_-18px_rgba(248,113,113,0.9)]",
};

const SIZES = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-3.5 py-2",
  lg: "text-sm px-4 py-2.5",
};

type ButtonProps = {
  as?: ElementType;
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  loading?: boolean;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = forwardRef<HTMLElement, ButtonProps>(function Button(
  { as: Comp = "button", variant = "primary", size = "md", loading = false, icon: Icon, children, className = "", ...props },
  ref
) {
  const classes = [
    "relative inline-flex items-center justify-center gap-2 rounded-lg font-semibold tracking-tight transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed",
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.md,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Comp ref={ref} className={classes} {...props}>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {!loading && Icon ? <Icon className="h-4 w-4" aria-hidden /> : null}
      <span>{children}</span>
    </Comp>
  );
});

export default Button;
