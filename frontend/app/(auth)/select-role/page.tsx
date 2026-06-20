"use client";

import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function SelectRolePage() {
  const { roles, selectRole, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    // If no token or roles available, go back to login
    if (roles.length === 0) {
      router.push("/login");
    }
  }, [roles, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900 border border-zinc-200/55 dark:border-zinc-800 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
          Choose Active Role
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
          Please select the role you want to use for this session.
        </p>

        <div className="space-y-3">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => selectRole(role)}
              className="w-full rounded-xl border border-zinc-200 bg-white py-4 text-base font-semibold text-zinc-800 shadow-sm hover:border-indigo-500 hover:text-indigo-650 transition-all dark:border-zinc-850 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-indigo-400 dark:hover:text-indigo-400 cursor-pointer"
            >
              {role}
            </button>
          ))}
        </div>

        <button
          onClick={logout}
          className="mt-6 text-sm font-semibold text-red-650 hover:underline cursor-pointer"
        >
          Sign Out & Exit
        </button>
      </div>
    </div>
  );
}
