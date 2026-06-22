"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, activeRole, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (!activeRole) {
        router.push("/select-role");
      }
    }
  }, [isAuthenticated, activeRole, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center">
          <p className="text-zinc-500 animate-pulse font-semibold">Validating dashboard session...</p>
        </div>
      </div>
    );
  }

  // Double check authorization to prevent rendering flash
  if (!isAuthenticated || !activeRole) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/50 dark:bg-zinc-950/20">
      <Navbar />

      <div className="flex-grow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          {children}
        </div>
      </div>

      <Footer />
    </div>
  );
}
