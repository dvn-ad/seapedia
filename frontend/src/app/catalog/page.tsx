'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { catalogApi, Product } from '@/lib/api';
import { Container, Card, CardContent, Typography, TextField, InputAdornment, Button } from '@mui/material';
import { Search, ShoppingBag } from 'lucide-react';

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        setLoading(true);
        const data = await catalogApi.getCatalog();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, []);

  const getStoreName = (storeId: number) => {
    const storeNames = ["Ocean Bounty", "Deep Blue Shop", "Maritime Goods", "Coral Reef Sales", "Pacific Blue"];
    return storeNames[storeId % storeNames.length] || `Store #${storeId}`;
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white flex flex-col text-gray-900">
      <Navbar />

      <Container maxWidth="lg" className="px-6 py-12 flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2">Product Catalog</h1>
            <p className="text-gray-500">Explore authentic products offered by our marketplace sellers.</p>
          </div>

          <TextField
            variant="outlined"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80"
            slotProps={{
              input: {
                sx: { borderRadius: 0 },
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} className="text-gray-400" />
                  </InputAdornment>
                ),
              }
            }}
          />
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 flex-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border border-gray-200 h-72 animate-pulse bg-gray-50"></div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-gray-200 py-20">
            <ShoppingBag size={48} className="text-gray-300 mb-4" />
            <Typography variant="h6" className="text-gray-500 font-bold mb-1">No products found</Typography>
            <Typography variant="body2" className="text-gray-400">Try adjusting your search terms or check back later.</Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="border border-gray-200 shadow-none rounded-none bg-white flex flex-col justify-between hover:border-gray-400 transition-colors"
              >
                <CardContent className="p-5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#0066CC] bg-blue-50 px-2 py-0.5 border border-blue-100">
                    {getStoreName(product.store_id)}
                  </span>
                  <h3 className="font-bold text-gray-900 mt-3 text-lg line-clamp-1">{product.name}</h3>
                  <p className="text-xs text-gray-500 mt-2 line-clamp-3 min-h-[48px]">{product.description || 'No description provided.'}</p>
                </CardContent>

                <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">Price</span>
                    <span className="font-bold text-sm text-gray-900">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider text-right">Stock</span>
                    <span className={`text-xs font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {product.stock > 0 ? `${product.stock} items` : 'Out of stock'}
                    </span>
                  </div>
                </div>
                
                <div className="px-5 pb-5">
                  <Link
                    href={`/catalog/${product.id}`}
                    className="block text-center text-xs font-bold bg-[#0066CC] hover:bg-[#0052a3] text-white py-2 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
