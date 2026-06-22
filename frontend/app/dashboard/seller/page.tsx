"use client";

import React, { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Plus, Edit, Trash2, Store, Package, RefreshCw, X, ShoppingBag } from "lucide-react";

interface StoreProfile {
  id: number;
  name: string;
  description: string;
}

interface Product {
  id: number;
  store_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function SellerDashboard() {
  const { user } = useAuth();
  
  // Store state
  const [store, setStore] = useState<StoreProfile | null>(null);
  const [checkingStore, setCheckingStore] = useState(true);
  const [storeName, setStoreName] = useState("");
  const [storeDesc, setStoreDesc] = useState("");
  const [storeError, setStoreError] = useState("");
  const [storeLoading, setStoreLoading] = useState(false);

  // Products state
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productName, setProductName] = useState("");
  const [productDesc, setProductDesc] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productStock, setProductStock] = useState("");
  const [productError, setProductError] = useState("");
  const [productLoading, setProductLoading] = useState(false);

  const fetchStore = async () => {
    setCheckingStore(true);
    setStoreError("");
    try {
      const data = await apiRequest("/seller/store");
      setStore(data);
      fetchProducts();
    } catch (err: any) {
      // If 404, the user does not have a store yet
      setStore(null);
    } finally {
      setCheckingStore(false);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const data = await apiRequest("/seller/products");
      setProducts(data || []);
    } catch (err) {
      console.error("Failed to load products:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchStore();
  }, []);

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setStoreError("");
    
    if (!storeName.trim()) {
      setStoreError("Store name is required.");
      return;
    }

    setStoreLoading(true);
    try {
      const data = await apiRequest("/seller/store", {
        method: "POST",
        body: JSON.stringify({
          name: storeName,
          description: storeDesc,
        }),
      });
      setStore(data);
      fetchProducts();
    } catch (err: any) {
      setStoreError(err.message || "Failed to create store. Name might already be taken.");
    } finally {
      setStoreLoading(false);
    }
  };

  const openAddProductModal = () => {
    setEditingProduct(null);
    setProductName("");
    setProductDesc("");
    setProductPrice("");
    setProductStock("");
    setProductError("");
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (prod: Product) => {
    setEditingProduct(prod);
    setProductName(prod.name);
    setProductDesc(prod.description);
    setProductPrice(prod.price.toString());
    setProductStock(prod.stock.toString());
    setProductError("");
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductError("");

    if (!productName.trim()) {
      setProductError("Product name is required.");
      return;
    }
    const priceNum = parseFloat(productPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      setProductError("Price must be a positive number.");
      return;
    }
    const stockNum = parseInt(productStock);
    if (isNaN(stockNum) || stockNum < 0) {
      setProductError("Stock must be a non-negative integer.");
      return;
    }

    setProductLoading(true);
    try {
      const url = editingProduct 
        ? `/seller/products/${editingProduct.id}` 
        : "/seller/products";
      const method = editingProduct ? "PUT" : "POST";
      
      await apiRequest(url, {
        method,
        body: JSON.stringify({
          name: productName,
          description: productDesc,
          price: priceNum,
          stock: stockNum,
        }),
      });

      setIsProductModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setProductError(err.message || "Failed to save product details.");
    } finally {
      setProductLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await apiRequest(`/seller/products/${id}`, {
        method: "DELETE",
      });
      fetchProducts();
    } catch (err: any) {
      alert(err.message || "Failed to delete product.");
    }
  };

  if (checkingStore) {
    return (
      <div className="py-20 text-center text-zinc-500">
        <RefreshCw className="animate-spin h-8 w-8 mx-auto text-indigo-500 mb-4" />
        <p className="animate-pulse">Loading seller store configuration...</p>
      </div>
    );
  }

  // CASE 1: Seller does not have a store yet -> Show creation form
  if (!store) {
    return (
      <div className="max-w-xl mx-auto py-10">
        <div className="text-center mb-8">
          <div className="inline-flex rounded-2xl bg-indigo-50 p-4 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 mb-4">
            <Store className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
            Open Your Store
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            To start selling on SEAPEDIA, you must configure a unique store profile.
          </p>
        </div>

        <Card className="shadow-lg border-zinc-200/80 dark:border-zinc-800">
          <CardBody className="p-6">
            <form onSubmit={handleCreateStore} className="space-y-6">
              {storeError && (
                <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400">
                  {storeError}
                </div>
              )}

              <Input
                label="Store Name (Must be unique)"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="e.g. Seafood Paradise"
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Store Description
                </label>
                <textarea
                  value={storeDesc}
                  onChange={(e) => setStoreDesc(e.target.value)}
                  placeholder="Describe your store and what products you offer..."
                  rows={4}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                />
              </div>

              <Button type="submit" loading={storeLoading} className="w-full">
                Create Store
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    );
  }

  // CASE 2: Seller already has a store -> Show dashboard
  return (
    <div className="space-y-8">
      {/* Header Profile Section */}
      <div className="md:flex md:items-center md:justify-between border-b border-zinc-100 pb-6 dark:border-zinc-900">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2.5 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400">
              <Store className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-50">
              {store.name}
            </h1>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-xl pl-11">
            {store.description || "No description provided."}
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex gap-3">
          <Button onClick={fetchProducts} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Products
          </Button>
          <Button onClick={openAddProductModal} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Main Catalog Lists */}
      <div>
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-indigo-600" />
          Product Catalog Management
        </h2>

        {loadingProducts ? (
          <div className="py-20 text-center text-zinc-500">
            <p className="animate-pulse">Loading store products...</p>
          </div>
        ) : products.length === 0 ? (
          <Card className="border-dashed border-zinc-200 dark:border-zinc-800 py-16">
            <CardBody className="text-center">
              <ShoppingBag className="mx-auto h-12 w-12 text-zinc-400" />
              <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                No products listed
              </h3>
              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto">
                Start listing products to display them in the SEAPEDIA public catalog.
              </p>
              <div className="mt-6">
                <Button onClick={openAddProductModal} size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add First Product
                </Button>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((prod) => (
              <Card key={prod.id} className="flex flex-col justify-between">
                <CardBody className="p-5 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="font-bold text-lg text-zinc-950 dark:text-zinc-50 line-clamp-1">
                      {prod.name}
                    </h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-2 leading-relaxed h-10">
                      {prod.description || "No description."}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                    <div className="flex justify-between items-baseline mb-4">
                      <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                        Rp {prod.price.toLocaleString("id-ID")}
                      </span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                        ${
                          prod.stock > 0
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : "bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400"
                        }`}>
                        Stock: {prod.stock}
                      </span>
                    </div>

                    <div className="flex gap-2.5">
                      <button
                        onClick={() => openEditProductModal(prod)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 px-3 py-2 text-xs font-bold text-zinc-700 transition-colors cursor-pointer dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
                      >
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(prod.id)}
                        className="flex items-center justify-center rounded-xl border border-red-200 hover:bg-red-50 p-2 text-xs font-bold text-red-600 transition-colors cursor-pointer dark:border-red-950/30 dark:text-red-400 dark:hover:bg-red-950/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* CRUD Product Modal Dialog */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            onClick={() => setIsProductModalOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog Body */}
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 max-h-[90vh] overflow-y-auto z-10">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-900">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-50 hover:text-zinc-700 cursor-pointer dark:hover:bg-zinc-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-6 space-y-5">
              {productError && (
                <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400">
                  {productError}
                </div>
              )}

              <Input
                label="Product Name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Fresh Red Snapper"
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Product Description
                </label>
                <textarea
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                  placeholder="Describe your product details..."
                  rows={3}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Price (Rp)"
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder="e.g. 75000"
                  required
                />
                <Input
                  label="Stock Quantity"
                  type="number"
                  value={productStock}
                  onChange={(e) => setProductStock(e.target.value)}
                  placeholder="e.g. 20"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsProductModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={productLoading}>
                  {editingProduct ? "Save Changes" : "Create Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
