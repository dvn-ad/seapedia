import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    variant?: "primary"|"secondary"|"danger"|"ghost";
    size?:"sm"|"md"|"lg";
}

export default function Button({
    children,
    variant="primary",
    size="md",
    className="",
    ...props
}:ButtonProps){
    const baseStyle="inline-flex items-center justify-center font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
    const variants={
        primary: "bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm",
        secondary: "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800",
        danger: "bg-red-600 text-white hover:bg-red-500 shadow-sm",
        ghost: "text-zinc-650 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800",
    };
    const sizes={
        sm: "px-3 py-1.5 text-xs",
        md: "px-4 py-2 text-sm",
        lg: "px-5 py-2.5 text-base",
    };
    return(
        <button
            className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}