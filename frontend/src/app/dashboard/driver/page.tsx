'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { getAuthToken, getActiveRole, authApi, UserProfile } from '@/lib/api';
import { Container, Card, CardContent, Typography, Alert, Button } from '@mui/material';
import { Truck, DollarSign, ListCollapse } from 'lucide-react';

export default function DriverDashboard() {
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
    if (activeRole !== 'Driver') {
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
            <Typography variant="body2" className="text-gray-400 font-medium">Loading Driver dashboard...</Typography>
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
          <h1 className="text-3xl font-extrabold tracking-tight">Driver Dashboard</h1>
          <p className="text-gray-500">Welcome, {profile?.username}. View your delivery parameters.</p>
        </div>

        <Alert severity="info" sx={{ mb: 4, borderRadius: 0 }}>
          <strong>Level 5 Constraint:</strong> Delivery jobs, order collections, delivery status updates, and driver earnings require Level 5 features. UI development is currently stopped at Level 2.
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Driver Earnings Placeholder */}
          <Card className="border border-gray-200 shadow-none rounded-none bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4 text-[#0066CC]">
                <DollarSign size={20} />
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Delivery Earnings
                </Typography>
              </div>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, fontFamily: 'inherit' }}>
                Rp 0
              </Typography>
              <Typography variant="body2" className="text-gray-400">
                Earnings calculated based on completed marketplace deliveries.
              </Typography>
            </CardContent>
          </Card>

          {/* Delivery Jobs Placeholder */}
          <Card className="border border-gray-200 shadow-none rounded-none bg-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4 text-[#0066CC]">
                <Truck size={20} />
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>
                  Delivery Jobs
                </Typography>
              </div>
              <Typography variant="body1" className="text-gray-700 font-semibold mb-1">
                No Active Jobs
              </Typography>
              <Typography variant="body2" className="text-gray-400 mb-4">
                Available jobs appear after Sellers process their packaging status.
              </Typography>
              <Button 
                variant="outlined" 
                disabled
                sx={{ borderRadius: 0, borderColor: '#0066CC', color: '#0066CC', textTransform: 'none' }}
              >
                Find Jobs (Locked)
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  );
}
