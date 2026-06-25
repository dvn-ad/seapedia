"use client";

import React, { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Input from "@mui/joy/Input";
import Textarea from "@mui/joy/Textarea";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Stack from "@mui/joy/Stack";
import Grid from "@mui/joy/Grid";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Alert from "@mui/joy/Alert";
import CircularProgress from "@mui/joy/CircularProgress";
import Chip from "@mui/joy/Chip";
import { Plus, Edit, Trash2, Store, Package, RefreshCw, ShoppingBag } from "lucide-react";

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
      <Box sx={{ py: 10, textAlign: "center" }}>
        <CircularProgress size="md" sx={{ mx: "auto", mb: 2 }} />
        <Typography level="body-md" color="neutral" sx={{ className: "animate-pulse" }}>
          Loading seller store configuration...
        </Typography>
      </Box>
    );
  }

  // CASE 1: Seller does not have a store yet -> Show creation form
  if (!store) {
    return (
      <Box sx={{ maxWidth: 500, mx: "auto", py: 4 }}>
        <Stack spacing={1} sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              display: "inline-flex",
              mx: "auto",
              p: 2,
              borderRadius: "xl",
              bgcolor: "primary.softBg",
              color: "primary.solidBg",
              mb: 1,
            }}
          >
            <Store size={36} />
          </Box>
          <Typography level="h2" sx={{ fontWeight: "lg" }}>
            Open Your Store
          </Typography>
          <Typography level="body-sm" color="neutral">
            To start selling on SEAPEDIA, you must configure a unique store profile.
          </Typography>
        </Stack>

        <Card variant="outlined" sx={{ boxShadow: "lg" }}>
          <CardContent>
            <form onSubmit={handleCreateStore}>
              <Stack spacing={2.5}>
                {storeError && (
                  <Alert color="danger" variant="soft">
                    {storeError}
                  </Alert>
                )}

                <FormControl required>
                  <FormLabel>Store Name (Must be unique)</FormLabel>
                  <Input
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="e.g. Seafood Paradise"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Store Description</FormLabel>
                  <Textarea
                    value={storeDesc}
                    onChange={(e) => setStoreDesc(e.target.value)}
                    placeholder="Describe your store and what products you offer..."
                    minRows={4}
                  />
                </FormControl>

                <Button type="submit" loading={storeLoading} fullWidth>
                  Create Store
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // CASE 2: Seller already has a store -> Show dashboard
  return (
    <Box>
      {/* Header Profile Section */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "stretch", sm: "start" }}
        spacing={2}
        sx={{
          borderBottom: "1px solid",
          borderColor: "divider",
          pb: 4,
          mb: 4,
        }}
      >
        <Stack direction="row" spacing={2} alignItems="start">
          <Box
            sx={{
              p: 1.5,
              borderRadius: "lg",
              bgcolor: "primary.softBg",
              color: "primary.solidBg",
              display: "flex",
            }}
          >
            <Store size={24} />
          </Box>
          <Box>
            <Typography level="h2" sx={{ fontWeight: "lg" }}>
              {store.name}
            </Typography>
            <Typography level="body-sm" color="neutral" sx={{ mt: 0.5, maxWidth: 500 }}>
              {store.description || "No description provided."}
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            color="neutral"
            size="sm"
            onClick={fetchProducts}
            startDecorator={<RefreshCw size={14} />}
          >
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={openAddProductModal}
            startDecorator={<Plus size={14} />}
          >
            Add Product
          </Button>
        </Stack>
      </Stack>

      {/* Product List */}
      <Box>
        <Typography
          level="h3"
          startDecorator={<Package size={20} />}
          sx={{ fontWeight: "md", mb: 3 }}
        >
          Product Catalog Management
        </Typography>

        {loadingProducts ? (
          <Box sx={{ py: 10, textAlign: "center" }}>
            <CircularProgress size="sm" sx={{ mb: 2 }} />
            <Typography level="body-sm" color="neutral">Loading products...</Typography>
          </Box>
        ) : products.length === 0 ? (
          <Card variant="outlined" sx={{ py: 8, textAlign: "center", maxWidth: 400, mx: "auto", borderStyle: "dashed" }}>
            <CardContent>
              <ShoppingBag size={48} style={{ margin: "0 auto", opacity: 0.5 }} />
              <Typography level="title-md" sx={{ mt: 2, fontWeight: "bold" }}>
                No products listed
              </Typography>
              <Typography level="body-sm" color="neutral" sx={{ mt: 1, mb: 3 }}>
                Start listing products to display them in the SEAPEDIA public catalog.
              </Typography>
              <Button onClick={openAddProductModal} size="sm" startDecorator={<Plus size={14} />}>
                Add First Product
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {products.map((prod) => (
              <Grid key={prod.id} xs={12} sm={6} md={4} lg={3}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <CardContent>
                    <Typography level="title-md" sx={{ fontWeight: "bold", mb: 0.5 }}>
                      {prod.name}
                    </Typography>
                    <Typography
                      level="body-xs"
                      color="neutral"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        height: 36,
                        mb: 2,
                      }}
                    >
                      {prod.description || "No description."}
                    </Typography>
                  </CardContent>

                  <Box sx={{ p: 2, pt: 0 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography level="title-md" sx={{ fontWeight: "bold", color: "primary.plainColor" }}>
                        Rp {prod.price.toLocaleString("id-ID")}
                      </Typography>
                      <Chip
                        size="sm"
                        color={prod.stock > 0 ? "success" : "danger"}
                        variant="soft"
                      >
                        Stock: {prod.stock}
                      </Chip>
                    </Stack>

                    <Stack direction="row" spacing={1.5}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="neutral"
                        size="sm"
                        onClick={() => openEditProductModal(prod)}
                        startDecorator={<Edit size={14} />}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="danger"
                        size="sm"
                        onClick={() => handleDeleteProduct(prod.id)}
                      >
                        <Trash2 size={14} />
                      </Button>
                    </Stack>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* CRUD Product Modal Dialog */}
      <Modal open={isProductModalOpen} onClose={() => setIsProductModalOpen(false)}>
        <ModalDialog sx={{ maxWidth: 450, width: "100%" }}>
          <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSaveProduct}>
              <Stack spacing={2.5}>
                {productError && (
                  <Alert color="danger" variant="soft">
                    {productError}
                  </Alert>
                )}

                <FormControl required>
                  <FormLabel>Product Name</FormLabel>
                  <Input
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="e.g. Fresh Red Snapper"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Product Description</FormLabel>
                  <Textarea
                    value={productDesc}
                    onChange={(e) => setProductDesc(e.target.value)}
                    placeholder="Describe your product details..."
                    minRows={3}
                  />
                </FormControl>

                <Grid container spacing={2}>
                  <Grid xs={6}>
                    <FormControl required>
                      <FormLabel>Price (Rp)</FormLabel>
                      <Input
                        type="number"
                        value={productPrice}
                        onChange={(e) => setProductPrice(e.target.value)}
                        placeholder="e.g. 75000"
                      />
                    </FormControl>
                  </Grid>
                  <Grid xs={6}>
                    <FormControl required>
                      <FormLabel>Stock Quantity</FormLabel>
                      <Input
                        type="number"
                        value={productStock}
                        onChange={(e) => setProductStock(e.target.value)}
                        placeholder="e.g. 20"
                      />
                    </FormControl>
                  </Grid>
                </Grid>

                <Stack direction="row" spacing={1.5} justifyContent="end" sx={{ mt: 2 }}>
                  <Button
                    variant="plain"
                    color="neutral"
                    onClick={() => setIsProductModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" loading={productLoading}>
                    {editingProduct ? "Save Changes" : "Create Product"}
                  </Button>
                </Stack>
              </Stack>
            </form>
          </DialogContent>
        </ModalDialog>
      </Modal>
    </Box>
  );
}
