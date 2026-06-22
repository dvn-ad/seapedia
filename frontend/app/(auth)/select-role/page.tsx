"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Shield, User, Store, Ship } from "lucide-react";

export default function SelectRolePage() {
  const { roles, selectRole, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const roleMeta: Record<string, { icon: any; color: string; desc: string }> = {
    Buyer: {
      icon: User,
      color: "bg-teal-50 text-teal-600 border-teal-100 dark:bg-teal-950/20 dark:text-teal-400 dark:border-teal-900/50",
      desc: "Browse catalog, manage wallet, add items to cart, and check out.",
    },
    Seller: {
      icon: Store,
      color: "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900/50",
      desc: "Manage your store details, list products for sale, and pack orders.",
    },
    Driver: {
      icon: Ship,
      color: "bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-950/20 dark:text-sky-400 dark:border-sky-900/50",
      desc: "Find delivery jobs, claim orders to deliver, and track your earnings.",
    },
    Admin: {
      icon: Shield,
      color: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50",
      desc: "Oversee the platform metrics, generate voucher promo codes, and manage time.",
    },
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-zinc-500">Loading your profile roles...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="w-full max-w-2xl text-center">
        <h1 className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-4xl font-black tracking-tight text-transparent">
          Select Active Role
        </h1>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          You have multiple roles assigned to your account. Select the active role for this session.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {roles.map((role) => {
            const meta = roleMeta[role] || {
              icon: User,
              color: "bg-zinc-50 text-zinc-600 border-zinc-100 dark:bg-zinc-900/50",
              desc: "Access default system panel actions.",
            };
            const Icon = meta.icon;

            return (
              <Card
                key={role}
                hoverable
                className="flex flex-col text-left transition-all hover:border-indigo-500 dark:hover:border-indigo-400 border-zinc-200/80 dark:border-zinc-800"
              >
                <CardBody className="flex flex-col h-full justify-between p-6">
                  <div>
                    <div className={`inline-flex rounded-xl p-3 border ${meta.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">
                      {role}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      {meta.desc}
                    </p>
                  </div>
                  <div className="mt-6">
                    <Button
                      onClick={() => selectRole(role)}
                      className="w-full"
                      variant="outline"
                    >
                      Enter as {role}
                    </Button>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
