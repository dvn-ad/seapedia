"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../app/context/AuthContext";
import Button from "./ui/Button";

export default function Navbar() {
  const { token, activeRole, logout } = useAuth();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-zinc-200/60 bg-white/80 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/80"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-2xl font-black tracking-wider text-indigo-650 dark:text-indigo-400"
        >
          SEAPEDIA
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/catalog"
            className="text-sm font-semibold text-zinc-600 hover:text-indigo-650 dark:text-zinc-300 dark:hover:text-indigo-400"
          >
            Browse Products
          </Link>

          {token ? (
            <div className="flex items-center gap-4">
              {activeRole && (
                <Link
                  href={`/dashboard/${activeRole.toLowerCase()}`}
                  className="rounded-lg bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                >
                  Active: {activeRole}
                </Link>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-red-650 hover:bg-red-50"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-semibold text-zinc-650 hover:text-indigo-650 dark:text-zinc-300"
              >
                Sign In
              </Link>
              <Link href="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
