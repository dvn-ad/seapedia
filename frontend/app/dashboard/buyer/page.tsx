"use client";

import React from "react";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Wallet, MapPin, ShoppingCart, Award } from "lucide-react";

export default function BuyerDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
          Buyer Dashboard
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your wallet, shipping addresses, and shopping cart.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-teal-100 bg-teal-50/10 dark:border-teal-950/20">
          <CardBody className="p-6 flex items-center gap-4">
            <div className="rounded-xl p-3 bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-semibold">Wallet Balance</p>
              <h4 className="text-2xl font-black text-zinc-800 dark:text-zinc-200 mt-0.5">
                Rp 0
              </h4>
            </div>
          </CardBody>
        </Card>

        <Card className="border-indigo-100 bg-indigo-50/10 dark:border-indigo-950/20">
          <CardBody className="p-6 flex items-center gap-4">
            <div className="rounded-xl p-3 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-semibold">Addresses Saved</p>
              <h4 className="text-2xl font-black text-zinc-800 dark:text-zinc-200 mt-0.5">
                0
              </h4>
            </div>
          </CardBody>
        </Card>

        <Card className="border-sky-100 bg-sky-50/10 dark:border-sky-950/20">
          <CardBody className="p-6 flex items-center gap-4">
            <div className="rounded-xl p-3 bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-semibold">Cart Items</p>
              <h4 className="text-2xl font-black text-zinc-800 dark:text-zinc-200 mt-0.5">
                Empty
              </h4>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="border-dashed border-zinc-200 dark:border-zinc-800">
        <CardBody className="py-20 text-center max-w-sm mx-auto">
          <Award className="h-12 w-12 text-indigo-500 mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 mt-4">
            Level 3 Preview
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Top-up flow, address updates, cart management, and single-store checkouts will be unlocked dynamically in Level 3.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
