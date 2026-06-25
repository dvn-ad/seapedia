'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken, getUserRoles, setActiveRole } from '@/lib/api';
import Navbar from '@/components/Navbar';
import { Button, Card, CardContent, Typography, Container, Box } from '@mui/material';
import { Shield, ShoppingBag, ShoppingCart, Truck } from 'lucide-react';

export default function SelectRole() {
  const router = useRouter();
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      router.push('/login');
      return;
    }
    const userRoles = getUserRoles();
    setRoles(userRoles);
    if (userRoles.length === 1) {
      // If only one role, select it and redirect immediately
      setActiveRole(userRoles[0]);
      redirectToDashboard(userRoles[0]);
    }
  }, [router]);

  const redirectToDashboard = (role: string) => {
    if (role === 'Seller') {
      router.push('/dashboard/seller');
    } else if (role === 'Buyer') {
      router.push('/dashboard/buyer');
    } else if (role === 'Driver') {
      router.push('/dashboard/driver');
    } else if (role === 'Admin') {
      router.push('/dashboard/admin');
    } else {
      router.push('/');
    }
  };

  const handleSelectRole = (role: string) => {
    setActiveRole(role);
    redirectToDashboard(role);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Buyer':
        return <ShoppingCart size={28} className="text-[#0066CC]" />;
      case 'Seller':
        return <ShoppingBag size={28} className="text-[#0066CC]" />;
      case 'Driver':
        return <Truck size={28} className="text-[#0066CC]" />;
      case 'Admin':
        return <Shield size={28} className="text-[#0066CC]" />;
      default:
        return null;
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'Buyer':
        return 'Browse catalog, manage cart, and purchase items.';
      case 'Seller':
        return 'Create your store profile, list items, and manage products.';
      case 'Driver':
        return 'Find delivery jobs, deliver packages, and track earnings.';
      case 'Admin':
        return 'Monitor the SEAPEDIA platform operations.';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <Container maxWidth="sm" className="flex-1 flex flex-col justify-center py-12">
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 1, fontFamily: 'inherit' }}>
            Choose Active Role
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontFamily: 'inherit' }}>
            Select the role you want to use for this session.
          </Typography>
        </Box>

        <div className="flex flex-col gap-4">
          {roles.map((role) => (
            <Card 
              key={role} 
              onClick={() => handleSelectRole(role)}
              className="border border-gray-200 hover:border-[#0066CC] shadow-none rounded-none cursor-pointer transition-all hover:bg-gray-50/50"
            >
              <CardContent className="flex items-center gap-4 p-5">
                <div className="p-3 bg-gray-50 border border-gray-150">
                  {getRoleIcon(role)}
                </div>
                <div className="flex-1">
                  <Typography variant="h6" sx={{ fontWeight: 'bold', fontFamily: 'inherit', color: '#1a1a1a' }}>
                    {role}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'inherit' }}>
                    {getRoleDescription(role)}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
