'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { catalogApi, reviewsApi, AppReview, Product } from '@/lib/api';
import { Container, Card, CardContent, Button, TextField, Rating, Typography, Alert } from '@mui/material';
import { MessageSquare, ArrowRight, Star } from 'lucide-react';

export default function Home() {
  const [catalog, setCatalog] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<AppReview[]>([]);
  
  // Form State
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState<number | null>(5);
  const [comment, setComment] = useState('');
  
  // Status State
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingCatalog, setLoadingCatalog] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const data = await reviewsApi.getReviews();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const fetchCatalog = async () => {
    try {
      setLoadingCatalog(true);
      const data = await catalogApi.getCatalog();
      setCatalog(data.slice(0, 3)); // show first 3
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCatalog(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchCatalog();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (!reviewerName.trim() || !comment.trim() || !rating) {
      setSubmitError('All fields are required.');
      return;
    }

    try {
      await reviewsApi.submitReview(reviewerName, rating, comment);
      setSubmitSuccess(true);
      setReviewerName('');
      setComment('');
      setRating(5);
      // Refresh reviews list
      fetchReviews();
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to submit review');
    }
  };

  // Helper to resolve deterministic store names for display
  const getStoreName = (storeId: number) => {
    const storeNames = ["Ocean Bounty", "Deep Blue Shop", "Maritime Goods", "Coral Reef Sales", "Pacific Blue"];
    return storeNames[storeId % storeNames.length] || `Store #${storeId}`;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b border-gray-150 py-20 bg-white">
        <Container maxWidth="lg" className="px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 border border-gray-200 text-xs font-semibold tracking-wider text-gray-600 uppercase mb-6">
              Level 1 & 2 Completed
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
              A Minimalist Multi-Role <br />
              <span className="text-[#0066CC]">Marketplace Platform</span>.
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
              Experience SEAPEDIA. Log in to switch between Buyer, Seller, Driver, and Admin roles. View public reviews and manage your products with a flat, clean interface.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/catalog" 
                className="bg-[#0066CC] hover:bg-[#0052a3] text-white font-bold px-6 py-3 transition-colors flex items-center gap-2"
              >
                Browse Catalog <ArrowRight size={18} />
              </Link>
              <Link 
                href="/register" 
                className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 font-bold px-6 py-3 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 max-w-md border border-gray-200 p-8 bg-gray-50/50">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Star size={18} className="text-[#0066CC]" /> Role Overview
            </h3>
            <ul className="space-y-4 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="font-bold text-[#0066CC]">Guest</span>
                <span>Browses public products, details, and reviews.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[#0066CC]">Buyer</span>
                <span>Accesses balance dashboard simulation.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[#0066CC]">Seller</span>
                <span>Creates store and manages product listings.</span>
              </li>
              <li className="flex gap-3">
                <span className="font-bold text-[#0066CC]">Driver</span>
                <span>Accesses driver delivery summary shell.</span>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      {/* Catalog Preview */}
      <section className="py-20 border-b border-gray-150">
        <Container maxWidth="lg" className="px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight mb-2">Featured Products</h2>
              <p className="text-gray-500">Real items fetched dynamically from the database.</p>
            </div>
            <Link href="/catalog" className="text-sm font-semibold text-[#0066CC] hover:underline flex items-center gap-1">
              View All Products <ArrowRight size={16} />
            </Link>
          </div>

          {loadingCatalog ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 h-64 animate-pulse bg-gray-50"></div>
              ))}
            </div>
          ) : catalog.length === 0 ? (
            <div className="border border-gray-200 border-dashed p-12 text-center text-gray-500">
              No products found. Login as a Seller to create your store and add products.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {catalog.map((product) => (
                <Card key={product.id} className="border border-gray-200 shadow-none rounded-none bg-white flex flex-col justify-between">
                  <CardContent className="p-6">
                    <Typography className="text-xs font-semibold text-gray-400 mb-1 uppercase">
                      {getStoreName(product.store_id)}
                    </Typography>
                    <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 2, fontFamily: 'inherit', color: '#1a1a1a' }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" className="text-gray-600 mb-4 line-clamp-3">
                      {product.description || 'No description provided.'}
                    </Typography>
                  </CardContent>
                  <div className="px-6 pb-6 pt-0 flex justify-between items-center border-t border-gray-100 pt-4 bg-gray-50/50">
                    <div>
                      <span className="text-xs text-gray-500 block">Price</span>
                      <span className="font-bold text-gray-900">
                        Rp {product.price.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <Link 
                      href={`/catalog/${product.id}`} 
                      className="text-xs font-semibold text-[#0066CC] border border-[#0066CC] hover:bg-[#0066CC] hover:text-white px-3 py-1.5 transition-colors"
                    >
                      View Detail
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 bg-white">
        <Container maxWidth="lg" className="px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Reviews Form */}
            <div className="lg:col-span-5 border border-gray-200 p-8 bg-white">
              <h2 className="text-2xl font-bold mb-2">Submit App Feedback</h2>
              <p className="text-sm text-gray-500 mb-6">Let us know about your experience using the SEAPEDIA website.</p>
              
              {submitSuccess && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 0 }}>
                  Feedback submitted successfully!
                </Alert>
              )}
              {submitError && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 0 }}>
                  {submitError}
                </Alert>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Your Name</label>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="e.g. Jane Doe"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    slotProps={{
                      input: {
                        sx: { borderRadius: 0 }
                      }
                    }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Rating</label>
                  <div className="flex items-center gap-1">
                    <Rating 
                      name="rating" 
                      value={rating} 
                      onChange={(event, newValue) => setRating(newValue)} 
                      size="large"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Comment</label>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    placeholder="Write your review here..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    slotProps={{
                      input: {
                        sx: { borderRadius: 0 }
                      }
                    }}
                  />
                </div>

                <Button 
                  type="submit" 
                  fullWidth 
                  variant="contained" 
                  disableElevation
                  sx={{ 
                    borderRadius: 0, 
                    py: 1.5, 
                    backgroundColor: '#0066CC',
                    '&:hover': {
                      backgroundColor: '#0052a3'
                    }
                  }}
                >
                  Submit Review
                </Button>
              </form>
            </div>

            {/* Reviews List */}
            <div className="lg:col-span-7">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <MessageSquare size={22} className="text-[#0066CC]" /> App Reviews
              </h2>
              <p className="text-sm text-gray-500 mb-8">What our users say about the website experience.</p>

              {loadingReviews ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="border border-gray-100 p-6 animate-pulse bg-gray-50"></div>
                  ))}
                </div>
              ) : reviews.length === 0 ? (
                <div className="border border-gray-200 border-dashed p-8 text-center text-gray-400">
                  No reviews submitted yet. Be the first to write one!
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="border border-gray-200 p-6 bg-white transition-colors hover:bg-gray-50/50">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-gray-900">{rev.reviewer_name}</span>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={14} 
                              fill={i < rev.rating ? 'currentColor' : 'none'} 
                              className={i < rev.rating ? 'text-amber-400' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm whitespace-pre-line">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-gray-200 py-8 bg-gray-50">
        <Container maxWidth="lg" className="px-6 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} SEAPEDIA. All rights reserved.</p>
        </Container>
      </footer>
    </div>
  );
}
