"use client";

import type { ElementType, ReactNode } from "react";

type InputFieldProps = {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  rightSlot?: ReactNode;
  as?: ElementType;
  children?: ReactNode;
  className?: string;
} & React.ComponentPropsWithoutRef<"input"> &
  React.ComponentPropsWithoutRef<"select"> &
  React.ComponentPropsWithoutRef<"textarea">;

export default function InputField({
  label,
  description,
  error,
  required,
  rightSlot,
  as = "input",
  children,
  className = "",
  ...props
}: InputFieldProps) {
  const Comp = as as ElementType;
  return (
    <label className="block space-y-1.5 text-sm">
      {label ? (
        <div className="flex items-center justify-between text-gray-200">
          <span className="font-medium">
            {label}
            {required ? <span className="ml-1 text-rose-300">*</span> : null}
          </span>
          {rightSlot}
        </div>
      ) : null}
      {description ? <p className="text-xs text-gray-400">{description}</p> : null}
      <Comp
        className={`w-full rounded-lg border border-white/10 bg-[#0c1118] px-3 py-2.5 text-gray-100 placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-cyan-500/40 disabled:opacity-60 ${className}`}
        {...props}
      >
        {children}
      </Comp>
      {error ? <p className="text-xs text-rose-300">{error}</p> : null}
    </label>
  );
}
