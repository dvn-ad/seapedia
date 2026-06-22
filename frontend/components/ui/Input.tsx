import React from "react";
    
    interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
      label?: string;
    }
    
    export default function Input({ label, className = "", ...props }: InputProps) {
      return (
        <div className="w-full">
          {label && (
            <label className="block text-sm font-medium text-zinc-750 dark:text-zinc-300 mb-1">
              {label}
            </label>
          )}
          <input
            className={`w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50 dark:placeholder-zinc-500 ${className}`}
            {...props}
          />
        </div>
      );
    }