import clsx from "clsx";

export function Checkbox({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      type="checkbox"
      className={clsx(
        "h-4 w-4 rounded border border-slate-700 bg-slate-950 text-indigo-300 accent-indigo-400",
        className
      )}
    />
  );
}
