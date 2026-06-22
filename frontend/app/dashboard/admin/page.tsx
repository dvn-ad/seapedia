"use client";

import React from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { BarChart3, ShieldAlert, Award } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
          Admin Control Center
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Monitor marketplace operations, track metrics, and manage promotional codes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-amber-100 bg-amber-50/10 dark:border-amber-950/20">
          <CardBody className="p-6 flex items-center gap-4">
            <div className="rounded-xl p-3 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-semibold">Total Revenue</p>
              <h4 className="text-2xl font-black text-zinc-800 dark:text-zinc-200 mt-0.5">
                Rp 0
              </h4>
            </div>
          </CardBody>
        </Card>

        <Card className="border-red-100 bg-red-50/10 dark:border-red-950/20">
          <CardBody className="p-6 flex items-center gap-4">
            <div className="rounded-xl p-3 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-semibold">Overdue Orders</p>
              <h4 className="text-2xl font-black text-zinc-800 dark:text-zinc-200 mt-0.5">
                0
              </h4>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="border-dashed border-zinc-200 dark:border-zinc-800">
        <CardBody className="py-20 text-center max-w-sm mx-auto">
          <Award className="h-12 w-12 text-indigo-500 mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 mt-4">
            Level 6 & 7 Preview
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Voucher & promo management builders, dashboard metrics monitoring, SLA time simulation, and automated refunds will be enabled in Level 6.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
