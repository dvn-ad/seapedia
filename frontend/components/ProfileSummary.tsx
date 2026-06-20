"use client";

import React from "react";
import { useAuth } from "../app/context/AuthContext";

export default function ProfileSummary() {
  const { roles, activeRole } = useAuth();

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-850 dark:bg-zinc-900 mb-8">
      <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
        Account Profile Summary
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Side: Roles Status */}
        <div>
          <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-2">
            My Registered Roles
          </h3>
          <div className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <span
                key={role}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  role === activeRole
                    ? "bg-indigo-650 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                }`}
              >
                {role} {role === activeRole ? "(Active)" : ""}
              </span>
            ))}
          </div>
        </div>

        {/* Right Side: Cross-Role Financial Summary Placeholder */}
        <div className="border-t pt-4 md:border-t-0 md:pt-0 md:border-l md:pl-6 border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3">
            Financial Balance Sheet (All Roles)
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <span className="block text-[10px] text-zinc-450 uppercase font-black">Buyer Wallet</span>
              <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Rp 0</span>
            </div>
            <div>
              <span className="block text-[10px] text-zinc-450 uppercase font-black">Seller Income</span>
              <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Rp 0</span>
            </div>
            <div>
              <span className="block text-[10px] text-zinc-450 uppercase font-black">Driver Payout</span>
              <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">Rp 0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
