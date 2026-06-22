"use client";

import React from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Map, Truck, DollarSign, ListTodo } from "lucide-react";

export default function DriverDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
          Driver Dashboard
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Review open shipping requests, manage active jobs, and track delivery earnings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-sky-100 bg-sky-50/10 dark:border-sky-950/20">
          <CardBody className="p-6 flex items-center gap-4">
            <div className="rounded-xl p-3 bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-semibold">Total Earnings</p>
              <h4 className="text-2xl font-black text-zinc-800 dark:text-zinc-200 mt-0.5">
                Rp 0
              </h4>
            </div>
          </CardBody>
        </Card>

        <Card className="border-indigo-100 bg-indigo-50/10 dark:border-indigo-950/20">
          <CardBody className="p-6 flex items-center gap-4">
            <div className="rounded-xl p-3 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-zinc-400 font-semibold">Jobs Completed</p>
              <h4 className="text-2xl font-black text-zinc-800 dark:text-zinc-200 mt-0.5">
                0
              </h4>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="border-dashed border-zinc-200 dark:border-zinc-800">
        <CardBody className="py-20 text-center max-w-sm mx-auto">
          <ListTodo className="h-12 w-12 text-indigo-500 mx-auto opacity-70" />
          <h3 className="text-lg font-bold text-zinc-950 dark:text-zinc-50 mt-4">
            Level 5 Preview
          </h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
            Searching for open delivery requests, locking jobs, tracking statuses, and mapping driver payments will be unlocked in Level 5.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
