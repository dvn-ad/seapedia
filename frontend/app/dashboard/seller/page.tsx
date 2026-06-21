"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../../lib/api";
import Link from "next/link";
import ProfileSummary from "../../../components/ProfileSummary";

export default function SellerDashboard() {
  const { activeRole, logout, roles } = useAuth();
  const [store, setStore] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Store creation states
  const [storeName, setStoreName] = useState("");
  const [storeDesc, setStoreDesc] = useState("");

  // Product input states
  const [prodName, setProdName] = useState("");
  const [prodDesc, setProdDesc] = useState("");
  const [prodPrice, setProdPrice] = useState(0);
  const [prodStock, setProdStock] = useState(0);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const loadSellerData = async () => {
    try {
      const prodData = await apiRequest("/seller/products");
      setProducts(prodData);
      setStore(true);
    } catch (err: any) {
      if (err.message && err.message.includes("store profile first")) {
        setStore(null);
      } else {
        setStore(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellerData();
  }, []);

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await apiRequest("/seller/store", {
        method: "POST",
        body: JSON.stringify({ name: storeName, description: storeDesc }),
      });
      setStore(data);
      loadSellerData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/seller/products", {
        method: "POST",
        body: JSON.stringify({
          name: prodName,
          description: prodDesc,
          price: Number(prodPrice),
          stock: Number(prodStock),
        }),
      });
      setShowAddForm(false);
      resetProductForm();
      loadSellerData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest(`/seller/products/${editingProduct.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: prodName,
          description: prodDesc,
          price: Number(prodPrice),
          stock: Number(prodStock),
        }),
      });
      setEditingProduct(null);
      resetProductForm();
      loadSellerData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await apiRequest(`/seller/products/${id}`, { method: "DELETE" });
      loadSellerData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const startEdit = (product: any) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdDesc(product.description);
    setProdPrice(product.price);
    setProdStock(product.stock);
  };

  const resetProductForm = () => {
    setProdName("");
    setProdDesc("");
    setProdPrice(0);
    setProdStock(0);
  };

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="text-xl font-black text-indigo-650 dark:text-indigo-400 mb-6">
          SEAPEDIA SELLER
        </h2>
        <nav className="space-y-2">
          {roles.length > 1 && (
            <Link href="/select-role" className="block rounded-lg px-4 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800">
              Switch Role
            </Link>
          )}
          <button
            onClick={logout}
            className="w-full text-left rounded-lg px-4 py-2.5 text-sm font-semibold text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20"
          >
            Sign Out
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Seller Dashboard
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Active Role: <span className="font-bold text-indigo-650 dark:text-indigo-400">{activeRole}</span>
          </p>
        </header>

        {/* Global profile summary block */}
        <ProfileSummary />

        {/* 1. If Seller has NO Store Profile */}
        {store === null ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 max-w-lg dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-xl font-bold mb-4">Initialize Your Store Profile</h3>
            <form onSubmit={handleCreateStore} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Store Name (Must be unique)</label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 focus:outline-none focus:border-indigo-500 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
                  placeholder="e.g. Ocean Outfitters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={storeDesc}
                  onChange={(e) => setStoreDesc(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 focus:outline-none focus:border-indigo-500 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
                  placeholder="Tell buyers about your shop..."
                />
              </div>
              <button type="submit" className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 cursor-pointer">
                Create Store
              </button>
            </form>
          </div>
        ) : (
          /* 2. If Store Exists - Show Products Inventory Management */
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">My Store Products</h2>
              <button
                onClick={() => {
                  setShowAddForm(!showAddForm);
                  setEditingProduct(null);
                  resetProductForm();
                }}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 cursor-pointer"
              >
                {showAddForm ? "Cancel" : "Add Product"}
              </button>
            </div>

            {/* Add or Edit Product Form */}
            {(showAddForm || editingProduct) && (
              <div className="mb-8 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <h3 className="text-lg font-bold mb-4">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h3>
                <form
                  onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">Product Name</label>
                    <input
                      type="text"
                      required
                      value={prodName}
                      onChange={(e) => setProdName(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price (Rp)</label>
                    <input
                      type="number"
                      required
                      value={prodPrice}
                      onChange={(e) => setProdPrice(Number(e.target.value))}
                      className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Stock</label>
                    <input
                      type="number"
                      required
                      value={prodStock}
                      onChange={(e) => setProdStock(Number(e.target.value))}
                      className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <input
                      type="text"
                      value={prodDesc}
                      onChange={(e) => setProdDesc(e.target.value)}
                      className="w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 dark:bg-zinc-800 dark:text-white dark:border-zinc-700"
                    />
                  </div>
                  <div className="md:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 mr-2 cursor-pointer"
                    >
                      {editingProduct ? "Save Changes" : "Save Product"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Inventory List Table */}
            <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 dark:bg-zinc-800 dark:border-zinc-700 text-sm font-semibold">
                    <th className="p-4">Name</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-zinc-400">
                        No products added yet.
                      </td>
                    </tr>
                  ) : (
                    products.map((prod) => (
                      <tr key={prod.id}>
                        <td className="p-4 font-bold">{prod.name}</td>
                        <td className="p-4">Rp {prod.price.toLocaleString("id-ID")}</td>
                        <td className="p-4">{prod.stock} items</td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            onClick={() => startEdit(prod)}
                            className="rounded bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 text-xs font-semibold dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="rounded bg-red-50 hover:bg-red-100 text-red-650 px-2.5 py-1 text-xs font-semibold dark:bg-red-950/20 dark:hover:bg-red-950/40 cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
