import React from "react";
    
    interface CardProps {
      children: React.ReactNode;
      className?: string;
    }
    
    export function Card({ children, className = "" }: CardProps) {
      return (
        <div className={`rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 ${className}`}>
          {children}
        </div>
      );
    }
    
    export function CardHeader({ children, className = "" }: CardProps) {
      return <div className={`mb-4 ${className}`}>{children}</div>;
    }
    
    export function CardTitle({ children, className = "" }: CardProps) {
      return <h3 className={`text-lg font-bold text-zinc-900 dark:text-zinc-50 ${className}`}>{children}</h3>;
    }
    
    export function CardContent({ children, className = "" }: CardProps) {
      return <div className={`${className}`}>{children}</div>;
    }