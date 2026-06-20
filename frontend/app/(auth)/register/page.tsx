"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRoleToggle = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (selectedRoles.length === 0) {
      setError("Please select at least one role.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, roles: selectedRoles }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-zinc-900 border border-zinc-200/55 dark:border-zinc-800">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 text-center mb-6">
          Create SEAPEDIA Account
        </h2>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-600 dark:bg-green-950/50 dark:text-green-400">
            Account created successfully! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Password (min. 6 characters)
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Select Your Roles (Choose multiple if needed)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {["Buyer", "Seller", "Driver"].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleToggle(role)}
                  className={`flex items-center justify-center rounded-lg border py-3.5 text-sm font-semibold transition-all ${
                    selectedRoles.includes(role)
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-950/50 dark:text-indigo-400"
                      : "border-zinc-200 bg-white text-zinc-700 dark:border-zinc-800 dark:bg-zinc-850 dark:text-zinc-300"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors cursor-pointer"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-zinc-650 dark:text-zinc-400">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
