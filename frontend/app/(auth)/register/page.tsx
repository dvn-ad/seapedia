"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Shield, User, Store, Ship } from "lucide-react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRoleToggle = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username and Password are required.");
      return;
    }
    if (selectedRoles.length === 0) {
      setError("Please select at least one role.");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
          roles: selectedRoles,
        }),
      });
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const rolesList = [
    { name: "Buyer", desc: "Buy products and manage wallet", icon: User },
    { name: "Seller", desc: "Open a store and sell products", icon: Store },
    { name: "Driver", desc: "Take and complete delivery jobs", icon: Ship },
    { name: "Admin", desc: "Supervise platform and manage codes", icon: Shield },
  ];

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-3xl font-black tracking-tight text-transparent">
              SEAPEDIA
            </span>
          </Link>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Or{" "}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        <Card className="shadow-xl">
          <form onSubmit={handleRegister}>
            <CardBody className="space-y-6">
              {error && (
                <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400">
                  {error}
                </div>
              )}

              <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. johndoe"
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />

              <div className="space-y-3">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Assign Roles (Choose all that apply)
                </label>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {rolesList.map(({ name, desc, icon: Icon }) => {
                    const isSelected = selectedRoles.includes(name);
                    return (
                      <button
                        type="button"
                        key={name}
                        onClick={() => handleRoleToggle(name)}
                        className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer
                          ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/10"
                              : "border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-900"
                          }`}
                      >
                        <div
                          className={`rounded-lg p-2 mt-0.5
                            ${
                              isSelected
                                ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400"
                                : "bg-zinc-100 text-zinc-500 dark:bg-zinc-900"
                            }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-zinc-900 dark:text-zinc-100">{name}</p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardBody>
            <CardFooter>
              <Button type="submit" loading={loading} className="w-full">
                Register
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
