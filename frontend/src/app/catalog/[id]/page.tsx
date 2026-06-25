'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { catalogApi, getActiveRole, getAuthToken, Product } from '@/lib/api';
import { Container, Card, CardContent, Typography, Button, Alert, Breadcrumbs } from '@mui/material';
import { ArrowLeft, ShoppingCart, Store, ArrowRight } from 'lucide-react';

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params.id);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (isNaN(productId)) {
        setError('Invalid Product ID');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await catalogApi.getProductDetail(productId);
        setProduct(data);
      } catch (err: any) {
        setError(err.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [productId]);

  const handleAddToCart = () => {
    const token = getAuthToken();
    const activeRole = getActiveRole();

    if (!token) {
      setActionAlert('Please login or register to use cart features.');
      return;
    }

    if (activeRole !== 'Buyer') {
      setActionAlert(`Your current active role is "${activeRole}". Switch your role to "Buyer" in the top navbar to use the shopping cart.`);
      return;
    }

    // Buyer action (Level 3+)
    setActionAlert('Cart checkout requires Level 3 features (implementation stopped at Level 2).');
  };

  const getStoreName = (storeId: number) => {
    const storeNames = ["Ocean Bounty", "Deep Blue Shop", "Maritime Goods", "Coral Reef Sales", "Pacific Blue"];
    return storeNames[storeId % storeNames.length] || `Store #${storeId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col text-gray-900">
        <Navbar />
        <Container maxWidth="md" className="py-12 flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-t-[#0066CC] border-gray-200 rounded-full animate-spin"></div>
            <Typography variant="body2" className="text-gray-400 font-medium">Loading product detail...</Typography>
          </div>
        </Container>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col text-gray-900">
        <Navbar />
        <Container maxWidth="md" className="py-12 flex-1 flex flex-col justify-center items-center">
          <Alert severity="error" sx={{ borderRadius: 0, mb: 4, width: '100%' }}>
            {error || 'Product not found'}
          </Alert>
          <Link href="/catalog" className="text-sm font-bold text-[#0066CC] hover:underline flex items-center gap-1.5">
            <ArrowLeft size={16} /> Back to Catalog
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col text-gray-900">
      <Navbar />

      <Container maxWidth="md" className="py-12 flex-1">
        {/* Breadcrumbs */}
        <Breadcrumbs aria-label="breadcrumb" className="mb-8" sx={{ fontSize: '0.875rem' }}>
          <Link href="/catalog" className="text-gray-500 hover:text-gray-900 transition-colors">
            Catalog
          </Link>
          <Typography color="text.primary" sx={{ fontSize: 'inherit', fontWeight: 'bold' }}>
            {product.name}
          </Typography>
        </Breadcrumbs>

        {actionAlert && (
          <Alert 
            severity="info" 
            onClose={() => setActionAlert(null)}
            sx={{ mb: 4, borderRadius: 0 }}
          >
            {actionAlert}
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Info */}
          <div className="md:col-span-8 space-y-6">
            <div className="border border-gray-200 p-8 bg-white">
              <h1 className="text-3xl font-extrabold tracking-tight mb-4">{product.name}</h1>
              
              <div className="border-t border-b border-gray-100 py-4 my-6 flex justify-between items-center">
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-bold tracking-wider">Price</span>
                  <span className="text-2xl font-bold text-[#0066CC]">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs text-gray-400 block uppercase font-bold tracking-wider">Availability</span>
                  <span className={`text-sm font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.stock > 0 ? `${product.stock} items in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Description</h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {product.description || 'No description provided for this product.'}
                </p>
              </div>
            </div>
          </div>

          {/* Store & Actions Panel */}
          <div className="md:col-span-4 space-y-6">
            {/* Store Card */}
            <Card className="border border-gray-200 shadow-none rounded-none bg-gray-50/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Store size={18} className="text-[#0066CC]" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'uppercase', tracking: 'wide' }}>
                    Seller Information
                  </Typography>
                </div>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, fontFamily: 'inherit', color: '#1a1a1a' }}>
                  {getStoreName(product.store_id)}
                </Typography>
                <Typography variant="caption" className="text-gray-400 block">
                  Store Owner ID: User #{product.store_id}
                </Typography>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="border border-gray-200 p-6 space-y-4">
              <Button
                fullWidth
                variant="contained"
                disableElevation
                startIcon={<ShoppingCart size={18} />}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                sx={{
                  borderRadius: 0,
                  py: 1.5,
                  backgroundColor: '#0066CC',
                  '&:hover': {
                    backgroundColor: '#0052a3',
                  },
                }}
              >
                Add to Cart
              </Button>

              <Link
                href="/catalog"
                className="block text-center text-xs font-bold text-gray-500 hover:text-gray-900 border border-gray-200 py-2.5 transition-colors"
              >
                Back to Catalog
              </Link>
            </div>
          </div>

        </div>
      </Container>
    </div>
  );
}
