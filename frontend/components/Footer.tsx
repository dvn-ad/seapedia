import React from "react";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-850 py-8 bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        &copy; {new Date().getFullYear()} SEAPEDIA. All rights reserved.
      </div>
    </footer>
  );
}
