import React from "react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-100 bg-white py-8 dark:border-zinc-900 dark:bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center sm:flex sm:items-center sm:justify-between">
        <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-xl font-extrabold tracking-tight text-transparent">
          SEAPEDIA
        </span>
        <p className="mt-4 text-sm text-zinc-500 sm:mt-0 dark:text-zinc-400">
          &copy; {new Date().getFullYear()} SEAPEDIA. Built for Level 1 & Level 2 Technical Challenge. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
