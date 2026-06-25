'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { sellerApi, getAuthToken, getActiveRole, Store, Product } from '@/lib/api';
import { Container, Card, CardContent, Button, TextField, Typography, Alert, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal } from '@mui/material';
import { Plus, Edit2, Trash2, Store as StoreIcon, Package, FileText, X } from 'lucide-react';

export default function SellerDashboard() {
  const router = useRouter();
  
  // App states
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  // Store profile form state
  const [storeName, setStoreName] = useState('');
  const [storeDesc, setStoreDesc] = useState('');
  const [storeLoading, setStoreLoading] = useState(false);
  const [storeError, setStoreError] = useState<string | null>(null);
  const [storeSuccess, setStoreSuccess] = useState(false);

  // Product CRUD states & modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodError, setProdError] = useState<string | null>(null);
  const [prodLoading, setProdLoading] = useState(false);

  useEffect(() => {
    const token = getAuthToken();
    const activeRole = getActiveRole();
    if (!token) {
      router.push('/login');
      return;
    }
    if (activeRole !== 'Seller') {
      router.push('/select-role');
      return;
    }

    loadSellerData();
  }, [router]);

  const loadSellerData = async () => {
    try {
      setLoading(true);
      setPageError(null);
      
      // Fetch store
      let sellerStore: Store | null = null;
      try {
        sellerStore = await sellerApi.getStore();
        setStore(sellerStore);
        setStoreName(sellerStore.name);
        setStoreDesc(sellerStore.description || '');
      } catch (err: any) {
        // Store not found is acceptable, it means the seller needs to create one.
        if (err.message !== 'Store not found') {
          throw err;
        }
      }

      // If store exists, fetch products
      if (sellerStore) {
        const sellerProducts = await sellerApi.getProducts();
        setProducts(sellerProducts);
      }
    } catch (err: any) {
      setPageError(err.message || 'Failed to load seller dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setStoreError(null);
    setStoreSuccess(false);

    if (!storeName.trim()) {
      setStoreError('Store Name is required');
      return;
    }

    try {
      setStoreLoading(true);
      const newStore = await sellerApi.createStore(storeName, storeDesc);
      setStore(newStore);
      setStoreSuccess(true);
      loadSellerData(); // reload dashboard
    } catch (err: any) {
      setStoreError(err.message || 'Failed to create store. The name may already be in use.');
    } finally {
      setStoreLoading(false);
    }
  };

  const handleOpenProductModal = (product: Product | null = null) => {
    setEditingProduct(product);
    if (product) {
      setProdName(product.name);
      setProdDesc(product.description || '');
      setProdPrice(product.price.toString());
      setProdStock(product.stock.toString());
    } else {
      setProdName('');
      setProdDesc('');
      setProdPrice('');
      setProdStock('');
    }
    setProdError(null);
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setProdError(null);

    const priceNum = parseFloat(prodPrice);
    const stockNum = parseInt(prodStock);

    if (!prodName.trim()) {
      setProdError('Product Name is required.');
      return;
    }
    if (isNaN(priceNum) || priceNum <= 0) {
      setProdError('Price must be a number greater than 0.');
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      setProdError('Stock must be a non-negative integer.');
      return;
    }

    try {
      setProdLoading(true);
      if (editingProduct) {
        await sellerApi.updateProduct(editingProduct.id, prodName, prodDesc, priceNum, stockNum);
      } else {
        await sellerApi.createProduct(prodName, prodDesc, priceNum, stockNum);
      }
      setModalOpen(false);
      loadSellerData(); // Refresh list
    } catch (err: any) {
      setProdError(err.message || 'Failed to save product');
    } finally {
      setProdLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await sellerApi.deleteProduct(id);
      loadSellerData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col text-gray-900">
        <Navbar />
        <Container maxWidth="lg" className="py-12 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-t-[#0066CC] border-gray-200 rounded-full animate-spin"></div>
            <Typography variant="body2" className="text-gray-400 font-medium">Loading Seller dashboard...</Typography>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col text-gray-900">
      <Navbar />

      <Container maxWidth="lg" className="py-12 flex-1 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight">Seller Dashboard</h1>
          <p className="text-gray-500">Manage your store registration and configure product listings.</p>
        </div>

        {pageError && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 0 }}>
            {pageError}
          </Alert>
        )}

        {!store ? (
          /* Create Store Screen */
          <div className="max-w-xl border border-gray-200 p-8 bg-white">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
              <StoreIcon size={20} className="text-[#0066CC]" /> Create Store Profile
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              You must register a store profile before you can list products on the marketplace. Your store name must be unique.
            </p>

            {storeError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 0 }}>
                {storeError}
              </Alert>
            )}

            <form onSubmit={handleCreateStore} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Store Name</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="e.g. Ocean Harvest Store"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  slotProps={{
                    input: { sx: { borderRadius: 0 } }
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Store Description</label>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  variant="outlined"
                  placeholder="Tell buyers about your store..."
                  value={storeDesc}
                  onChange={(e) => setStoreDesc(e.target.value)}
                  slotProps={{
                    input: { sx: { borderRadius: 0 } }
                  }}
                />
              </div>

              <Button
                type="submit"
                variant="contained"
                disableElevation
                disabled={storeLoading}
                sx={{
                  borderRadius: 0,
                  py: 1.25,
                  backgroundColor: '#0066CC',
                  '&:hover': {
                    backgroundColor: '#0052a3',
                  },
                }}
              >
                {storeLoading ? 'Creating Store...' : 'Create Store'}
              </Button>
            </form>
          </div>
        ) : (
          /* Store Management & Products CRUD Dashboard */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Store Profile Update Panel */}
            <div className="lg:col-span-4 border border-gray-200 p-6 bg-white space-y-6">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2 border-b border-gray-100 pb-2 mb-4">
                  <StoreIcon size={18} className="text-[#0066CC]" /> Store Settings
                </h3>
                {storeSuccess && (
                  <Alert severity="success" sx={{ mb: 2, borderRadius: 0 }}>
                    Store details saved!
                  </Alert>
                )}
                {storeError && (
                  <Alert severity="error" sx={{ mb: 2, borderRadius: 0 }}>
                    {storeError}
                  </Alert>
                )}

                <form onSubmit={handleCreateStore} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Store Name</label>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={storeName}
                      disabled // Store name cannot be modified to ensure uniqueness remains checked on POST
                      slotProps={{
                        input: { sx: { borderRadius: 0, fontSize: '0.875rem' } }
                      }}
                    />
                    <span className="text-[10px] text-gray-400 mt-1 block">Store names cannot be modified once created.</span>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Description</label>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      variant="outlined"
                      value={storeDesc}
                      onChange={(e) => setStoreDesc(e.target.value)}
                      slotProps={{
                        input: { sx: { borderRadius: 0, fontSize: '0.875rem' } }
                      }}
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="outlined"
                    size="small"
                    disabled={storeLoading}
                    sx={{
                      borderRadius: 0,
                      borderColor: '#0066CC',
                      color: '#0066CC',
                      fontWeight: 'bold',
                      '&:hover': {
                        borderColor: '#0052a3',
                        backgroundColor: 'rgba(0,102,204,0.04)',
                      },
                    }}
                  >
                    {storeLoading ? 'Saving...' : 'Update Profile'}
                  </Button>
                </form>
              </div>

              {/* Financial summary entry point placeholder (Level 1 req: balance summary placeholder) */}
              <div className="border-t border-gray-150 pt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Seller Financial Summary</h4>
                <div className="bg-gray-50 border border-gray-150 p-4">
                  <span className="text-xs text-gray-500 block">Total Earnings</span>
                  <span className="text-xl font-bold text-gray-900">Rp 0</span>
                  <span className="text-[10px] text-gray-400 block mt-1">Level 3 transaction features are pending.</span>
                </div>
              </div>
            </div>

            {/* Products Management List */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Package size={20} className="text-[#0066CC]" /> Store Products
                </h3>
                <Button
                  variant="contained"
                  disableElevation
                  startIcon={<Plus size={16} />}
                  onClick={() => handleOpenProductModal(null)}
                  sx={{
                    borderRadius: 0,
                    backgroundColor: '#0066CC',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#0052a3',
                    },
                  }}
                >
                  Add Product
                </Button>
              </div>

              {products.length === 0 ? (
                <div className="border border-dashed border-gray-200 py-16 text-center text-gray-500 bg-white">
                  <Package size={36} className="text-gray-300 mx-auto mb-2" />
                  <p className="font-bold">No products in your store</p>
                  <p className="text-xs text-gray-400 mt-1">Click &quot;Add Product&quot; to list your first item.</p>
                </div>
              ) : (
                <TableContainer className="border border-gray-200 rounded-none bg-white">
                  <Table sx={{ minWidth: 600 }}>
                    <TableHead sx={{ bgcolor: 'rgba(0, 0, 0, 0.02)' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>Product Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>Description</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>Price</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>Stock</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id} className="hover:bg-gray-50/50">
                          <TableCell sx={{ fontWeight: '600', fontFamily: 'inherit' }}>{product.name}</TableCell>
                          <TableCell sx={{ maxWidth: 200, fontFamily: 'inherit', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {product.description || '-'}
                          </TableCell>
                          <TableCell align="right" sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>
                            Rp {product.price.toLocaleString('id-ID')}
                          </TableCell>
                          <TableCell align="right" sx={{ fontFamily: 'inherit', color: product.stock > 0 ? 'inherit' : 'red' }}>
                            {product.stock}
                          </TableCell>
                          <TableCell align="center">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleOpenProductModal(product)}
                                className="p-1.5 border border-gray-200 hover:border-[#0066CC] hover:text-[#0066CC] transition-colors"
                                title="Edit Product"
                              >
                                <Edit2 size={14} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-1.5 border border-gray-200 hover:border-red-500 hover:text-red-500 transition-colors"
                                title="Delete Product"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </div>

          </div>
        )}
      </Container>

      {/* Add / Edit Product Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        className="flex items-center justify-center p-4"
      >
        <Box 
          sx={{ 
            bgcolor: 'background.paper',
            border: '1px solid #e5e7eb',
            maxWidth: 450,
            width: '100%',
            p: 4,
            outline: 'none'
          }}
        >
          <div className="flex justify-between items-center border-b border-gray-150 pb-3 mb-6">
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'inherit' }}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </Typography>
            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
              <X size={18} />
            </button>
          </div>

          {prodError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 0 }}>
              {prodError}
            </Alert>
          )}

          <form onSubmit={handleSaveProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Product Name</label>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Product Name"
                value={prodName}
                onChange={(e) => setProdName(e.target.value)}
                slotProps={{
                  input: { sx: { borderRadius: 0 } }
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Description</label>
              <TextField
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                placeholder="Product description"
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                slotProps={{
                  input: { sx: { borderRadius: 0 } }
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Price (Rp)</label>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  placeholder="Price"
                  value={prodPrice}
                  onChange={(e) => setProdPrice(e.target.value)}
                  slotProps={{
                    input: { sx: { borderRadius: 0 } }
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Stock Quantity</label>
                <TextField
                  fullWidth
                  type="number"
                  variant="outlined"
                  placeholder="Stock"
                  value={prodStock}
                  onChange={(e) => setProdStock(e.target.value)}
                  slotProps={{
                    input: { sx: { borderRadius: 0 } }
                  }}
                />
              </div>
            </div>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
              disabled={prodLoading}
              sx={{
                borderRadius: 0,
                py: 1.5,
                backgroundColor: '#0066CC',
                '&:hover': {
                  backgroundColor: '#0052a3',
                },
              }}
            >
              {prodLoading ? 'Saving...' : 'Save Product'}
            </Button>
          </form>
        </Box>
      </Modal>

    </div>
  );
}
