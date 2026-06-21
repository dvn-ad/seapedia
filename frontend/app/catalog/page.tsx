"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Product {
  id: number;
  store_id: number;
  store_name: string;
  name: string;
  price: number;
  description: string;
  stock: number;
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch((err) => console.error("Failed to load catalog:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/60 bg-white/80 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-2xl font-black tracking-wider text-indigo-650 dark:text-indigo-400">
            SEAPEDIA
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-semibold text-zinc-650 hover:text-indigo-600 dark:text-zinc-300">
              Home
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl px-6 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
          Marketplace Catalog
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-2xl">
          Browse items listed by sellers across SEAPEDIA. Guest accounts can view items but cannot perform checkout actions.
        </p>

        {loading ? (
          <div className="text-center py-12 text-zinc-500">Loading catalog products...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.length === 0 ? (
              <div className="col-span-full text-center py-12 text-zinc-400 border border-dashed border-zinc-200 rounded-2xl dark:border-zinc-800">
                No products are currently available in the marketplace.
              </div>
            ) : (
              products.map((prod) => (
                <div
                  key={prod.id}
                  className="flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-md transition-all dark:border-zinc-850 dark:bg-zinc-900"
                >
                  <div className="mb-2">
                    <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                      Product ID: #{prod.id}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-55 mb-2">
                    {prod.name}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 flex-grow mb-4">
                    {prod.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50">
                      Rp {prod.price.toLocaleString("id-ID")}
                    </span>
                    <Link
                      href={`/catalog/${prod.id}`}
                      className="rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-white hover:bg-zinc-850 transition-colors dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
