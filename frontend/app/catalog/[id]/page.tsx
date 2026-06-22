"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { ArrowLeft, ShoppingBag, Store, Info, ShieldAlert } from "lucide-react";

interface Product {
  id: number;
  store_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { activeRole, isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiRequest(`/catalog/${id}`);
        setProduct(data);
      } catch (err: any) {
        setError(err.message || "Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <Link href="/catalog" className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-50">
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-zinc-500">
            <p className="animate-pulse">Loading product details...</p>
          </div>
        ) : error || !product ? (
          <Card className="border-red-100 bg-red-50/20 dark:border-red-950/30">
            <CardBody className="py-12 text-center">
              <ShieldAlert className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-4 text-lg font-bold text-red-700 dark:text-red-400">
                Product Not Found
              </h3>
              <p className="mt-2 text-sm text-red-500 max-w-xs mx-auto">
                {error || "The product you are trying to view does not exist."}
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Product Image Representation */}
            <div className="h-80 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/20 dark:to-zinc-950 flex items-center justify-center border border-zinc-100 dark:border-zinc-900 text-indigo-500">
              <ShoppingBag className="h-20 w-20 opacity-70" />
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
                  {product.name}
                </h1>
                <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-2">
                  Rp {product.price.toLocaleString("id-ID")}
                </p>
              </div>

              <div className="py-4 border-t border-b border-zinc-100 dark:border-zinc-900 space-y-4">
                <div className="flex items-center gap-3">
                  <Store className="h-5 w-5 text-zinc-400" />
                  <div>
                    <p className="text-xs text-zinc-400 font-medium">Store Owner ID</p>
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                      Store #{product.store_id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-xs font-bold text-zinc-500">
                    S
                  </div>
                  <div>
                    <p className="text-xs text-zinc-400 font-medium">Stock Available</p>
                    <p className={`text-sm font-bold ${product.stock > 0 ? "text-zinc-800 dark:text-zinc-200" : "text-red-500"}`}>
                      {product.stock > 0 ? `${product.stock} units` : "Out of stock"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Description
                </h3>
                <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {product.description || "No description provided by the seller."}
                </p>
              </div>

              {/* Guest / Non-buyer warnings */}
              {(!isAuthenticated || activeRole !== "Buyer") ? (
                <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 dark:border-amber-950/20 dark:bg-amber-950/10">
                  <div className="flex gap-3">
                    <Info className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-amber-800 dark:text-amber-400">
                        Purchase Restricted
                      </h4>
                      <p className="mt-1 text-xs text-amber-700 dark:text-amber-550 leading-relaxed">
                        {!isAuthenticated
                          ? "You are currently browsing as a guest. Please sign in to purchase."
                          : `Your current active role is "${activeRole}". Please switch to the "Buyer" role to purchase products.`}
                      </p>
                      <div className="mt-3">
                        {!isAuthenticated ? (
                          <Link href="/login">
                            <Button size="sm" className="bg-amber-600 hover:bg-amber-500">
                              Go to Login
                            </Button>
                          </Link>
                        ) : (
                          <Link href="/select-role">
                            <Button size="sm" className="bg-amber-600 hover:bg-amber-500">
                              Switch Active Role
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-950/20 dark:bg-indigo-950/10">
                  <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
                    🛒 <strong>Buyer Mode Active</strong>: Adding items to the shopping cart and checkout processes will be unlocked in Level 3.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
