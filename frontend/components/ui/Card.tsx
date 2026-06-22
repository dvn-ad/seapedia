import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  glass?: boolean;
}

export function Card({
  children,
  hoverable = false,
  glass = false,
  className = "",
  ...props
}: CardProps) {
  const baseStyles = "rounded-2xl border transition-all duration-200 overflow-hidden";
  const colors = glass
    ? "bg-white/70 backdrop-blur-md border-white/20 shadow-xl shadow-zinc-100/50 dark:bg-zinc-950/70 dark:border-zinc-800/50 dark:shadow-none"
    : "bg-white border-zinc-100 shadow-sm shadow-zinc-100/40 dark:bg-zinc-950 dark:border-zinc-900 dark:shadow-none";

  const hovers = hoverable
    ? "hover:-translate-y-1 hover:shadow-md hover:border-zinc-200 dark:hover:border-zinc-800"
    : "";

  return (
    <div
      className={`${baseStyles} ${colors} ${hovers} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`px-6 py-5 border-b border-zinc-100 dark:border-zinc-900 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardBody({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`px-6 py-4 bg-zinc-50/50 border-t border-zinc-100 dark:bg-zinc-950/20 dark:border-zinc-900 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
