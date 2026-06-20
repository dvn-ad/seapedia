"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface DummyProduct {
  id: number;
  name: string;
  price: number;
  store: string;
  description: string;
}

const DUMMY_PRODUCTS: DummyProduct[] = [
  {
    id: 1,
    name: "Submarine Anchor Heavy Duty",
    price: 1500000,
    store: "DeepSea Naval Works",
    description: "Premium forged steel anchor designed to withstand extreme deep sea pressures.",
  },
  {
    id: 2,
    name: "Neoprene Wet Suit 5mm",
    price: 850000,
    store: "Aquatic Gears Ltd",
    description: "High-insulation thermal wet suit ideal for cold reef exploration and scuba diving.",
  },
  {
    id: 3,
    name: "Titanium Diving Knife",
    price: 320000,
    store: "Aquatic Gears Ltd",
    description: "Corrosion-resistant titanium blade with a serrated edge and quick-release sheath.",
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const idStr = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const productId = parseInt(idStr || "1");

  const product = DUMMY_PRODUCTS.find((p) => p.id === productId) || DUMMY_PRODUCTS[0];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/60 bg-white/80 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-2xl font-black tracking-wider text-indigo-650 dark:text-indigo-400">
            SEAPEDIA
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/catalog" className="text-sm font-semibold text-zinc-650 hover:text-indigo-600 dark:text-zinc-300">
              Back to Catalog
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-md dark:border-zinc-850 dark:bg-zinc-900">
          <div className="mb-4">
            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              Sold by: {product.store}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
            {product.name}
          </h1>

          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mb-6">
            Rp {product.price.toLocaleString("id-ID")}
          </div>

          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200 mb-2">
              Product Description
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mt-8 rounded-xl bg-zinc-50 p-4 border border-zinc-200 text-center dark:bg-zinc-950 dark:border-zinc-850">
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-450">
              Guests cannot buy items. Please{" "}
              <Link href="/login" className="text-indigo-600 font-bold hover:underline">
                Sign In
              </Link>{" "}
              as a **Buyer** to add products to your cart.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
