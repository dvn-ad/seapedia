"use client";

import React from "react";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";

export default function SellerDashboard() {
  const { activeRole, logout, roles } = useAuth();

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-xl font-black text-indigo-650 dark:text-indigo-400 mb-6">
          SEAPEDIA SELLER
        </h2>
        <nav className="space-y-2">
          {roles.length > 1 && (
            <Link href="/select-role" className="block rounded-lg px-4 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800">
              Switch Role
            </Link>
          )}
          <button
            onClick={logout}
            className="w-full text-left rounded-lg px-4 py-2.5 text-sm font-semibold text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Seller Dashboard
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Active Role: <span className="font-bold text-indigo-650 dark:text-indigo-400">{activeRole}</span>
          </p>
        </header>

        {/* Dashboard Panels Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900">
            <h3 className="text-lg font-bold mb-2">My Store Profile</h3>
            <p className="text-sm text-zinc-550 dark:text-zinc-400 mb-4">
              You haven't initialized your store name yet.
            </p>
            <span className="text-xs text-zinc-450 block">Store configuration forms will unlock in Level 2</span>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900">
            <h3 className="text-lg font-bold mb-2">Products Catalog</h3>
            <p className="text-sm text-zinc-550 dark:text-zinc-400 mb-4">
              No products found in your inventory.
            </p>
            <span className="text-xs text-zinc-450 block">Inventory management and CRUD will unlock in Level 2</span>
          </div>
        </div>
      </main>
    </div>
  );
}
