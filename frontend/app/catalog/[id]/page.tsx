"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Product {
  id: number;
  store_id: number;
  store_name: string;
  name: string;
  price: number;
  description: string;
  stock: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const idStr = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const productId = parseInt(idStr || "1");

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (productId) {
      fetch(`http://localhost:8080/api/catalog/${productId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Product not found");
          return res.json();
        })
        .then((data) => setProduct(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [productId]);

  if (loading) return <div className="text-center py-20 text-zinc-500">Loading product details...</div>;
  if (error || !product) {
    return (
      <div className="text-center py-20 text-red-500">
        <p className="mb-4">{error || "Product not found"}</p>
        <Link href="/catalog" className="text-indigo-650 hover:underline font-semibold">Back to Catalog</Link>
      </div>
    );
  }

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
          <div className="mb-4 flex gap-2">
            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
              Sold by: {product.store_name || `Store #${product.store_id}`}
            </span>
            <span className="inline-flex items-center rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
              Stock: {product.stock} items left
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
              {product.description || "No description provided by the seller."}
            </p>
          </div>

          <div className="mt-8 rounded-xl bg-zinc-50 p-4 border border-zinc-200 text-center dark:bg-zinc-950 dark:border-zinc-850">
            <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-455">
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
