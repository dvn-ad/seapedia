import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  id,
  className = "",
  type = "text",
  ...props
}: InputProps) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        className={`w-full rounded-xl border px-4 py-3 text-base text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 transition-all duration-200 bg-white dark:bg-zinc-950 dark:text-zinc-50
          ${
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
              : "border-zinc-200 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-zinc-800 focus:dark:border-indigo-500 focus:dark:ring-indigo-500/30"
          }
          ${className}`}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-500 mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
}
