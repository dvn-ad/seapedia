"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Card, CardBody } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { apiRequest } from "@/lib/api";
import { Search, Package, ShoppingBag, Eye } from "lucide-react";

interface Product {
  id: number;
  store_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/catalog");
      setProducts(data || []);
    } catch (err) {
      console.error("Failed to load catalog products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((prod) =>
    prod.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="md:flex md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
              Product Catalog
            </h1>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Explore items listed by sellers across SEAPEDIA
            </p>
          </div>

          <div className="mt-4 md:mt-0 max-w-xs w-full relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 py-2.5"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-zinc-500">
            <p className="animate-pulse">Loading catalog products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="border-dashed border-zinc-200 dark:border-zinc-800 py-20">
            <CardBody className="text-center">
              <Package className="mx-auto h-12 w-12 text-zinc-400" />
              <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                No products found
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                {searchQuery ? `We couldn't find matches for "${searchQuery}"` : "Sellers haven't listed any products yet."}
              </p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((prod) => (
              <Card key={prod.id} hoverable className="flex flex-col h-full justify-between">
                <CardBody className="p-5 flex flex-col h-full justify-between">
                  <div>
                    {/* Placeholder image representation with gradients */}
                    <div className="h-40 rounded-xl bg-gradient-to-br from-indigo-100 to-violet-50 dark:from-indigo-950/20 dark:to-zinc-950 mb-4 flex items-center justify-center text-indigo-500">
                      <ShoppingBag className="h-10 w-10 opacity-70" />
                    </div>

                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 line-clamp-1">
                      {prod.name}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-2 leading-relaxed h-10">
                      {prod.description || "No description provided."}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                    <div className="flex items-baseline justify-between mb-4">
                      <span className="text-xl font-extrabold text-indigo-600 dark:text-indigo-400">
                        Rp {prod.price.toLocaleString("id-ID")}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                        ${
                          prod.stock > 0
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                        }`}>
                        {prod.stock > 0 ? `${prod.stock} in stock` : "Out of stock"}
                      </span>
                    </div>

                    <Link href={`/catalog/${prod.id}`}>
                      <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-white transition-all cursor-pointer dark:bg-zinc-800 dark:hover:bg-zinc-700">
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                    </Link>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
