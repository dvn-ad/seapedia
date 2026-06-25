'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { getAuthToken, getActiveRole, authApi, UserProfile } from '@/lib/api';
import { Container, Card, CardContent, Typography, Alert, Button, Box } from '@mui/material';
import { Wallet, MapPin, ShoppingCart, Compass } from 'lucide-react';

export default function BuyerDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAuthToken();
    const activeRole = getActiveRole();
    if (!token) {
      router.push('/login');
      return;
    }
    if (activeRole !== 'Buyer') {
      router.push('/select-role');
      return;
    }

    const loadProfile = async () => {
      try {
        const data = await authApi.getProfile();
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col text-gray-900">
        <Navbar />
        <Container maxWidth="lg" className="py-12 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-t-[#0066CC] border-gray-200 rounded-full animate-spin"></div>
            <Typography variant="body2" className="text-gray-400 font-medium">Loading Buyer dashboard...</Typography>
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
          <h1 className="text-3xl font-extrabold tracking-tight">Buyer Dashboard</h1>
          <p className="text-gray-500">Welcome, {profile?.username}. View your balance and profile details.</p>
        </div>

        <Alert severity="info" sx={{ mb: 4, borderRadius: 0 }}>
          <strong>Level 3 Constraint:</strong> Full wallet top-ups, delivery address configurations, and shopping carts require Level 3 features. UI development is currently stopped at Level 2.
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wallet Balance Placeholder */}
          <Card className="border border-gray-200 shadow-none rounded-none bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4 text-[#0066CC]">
                <Wallet size={20} />
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Wallet Balance
                </Typography>
              </div>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontFamily: 'inherit' }}>
                Rp 0
              </Typography>
              <Typography variant="body2" className="text-gray-400 mb-4">
                No active balance found.
              </Typography>
              <Button 
                variant="contained" 
                disableElevation
                disabled
                sx={{ borderRadius: 0, backgroundColor: '#0066CC', textTransform: 'none' }}
              >
                Top Up (Locked)
              </Button>
            </CardContent>
          </Card>

          {/* Delivery Address Placeholder */}
          <Card className="border border-gray-200 shadow-none rounded-none bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4 text-[#0066CC]">
                <MapPin size={20} />
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Delivery Address
                </Typography>
              </div>
              <Typography variant="body1" className="text-gray-700 font-semibold mb-1">
                No Address Saved
              </Typography>
              <Typography variant="body2" className="text-gray-400 mb-4">
                Please add a delivery address to enable checkout.
              </Typography>
              <Button 
                variant="outlined" 
                disabled
                sx={{ borderRadius: 0, borderColor: '#0066CC', color: '#0066CC', textTransform: 'none' }}
              >
                Add Address (Locked)
              </Button>
            </CardContent>
          </Card>

          {/* Cart Status Placeholder */}
          <Card className="border border-gray-200 shadow-none rounded-none bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4 text-[#0066CC]">
                <ShoppingCart size={20} />
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Shopping Cart
                </Typography>
              </div>
              <Typography variant="body1" className="text-gray-700 font-semibold mb-1">
                0 Items in Cart
              </Typography>
              <Typography variant="body2" className="text-gray-400 mb-4">
                Products from only one store can be checked out at a time.
              </Typography>
              <Button 
                variant="contained"
                disableElevation
                onClick={() => router.push('/catalog')}
                sx={{ 
                  borderRadius: 0, 
                  backgroundColor: '#0066CC', 
                  textTransform: 'none',
                  '&:hover': { backgroundColor: '#0052a3' } 
                }}
              >
                Browse Marketplace
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
