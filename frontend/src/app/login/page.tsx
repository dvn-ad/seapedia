'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { authApi, setActiveRole } from '@/lib/api';
import { Container, Card, CardContent, TextField, Button, Typography, Alert } from '@mui/material';
import { KeyRound, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }

    try {
      setLoading(true);
      const data = await authApi.login(username, password);
      
      // If user has multiple roles, redirect to select role page
      if (data.roles.length > 1) {
        router.push('/select-role');
      } else if (data.roles.length === 1) {
        const role = data.roles[0];
        setActiveRole(role);
        router.push(`/dashboard/${role.toLowerCase()}`);
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col text-gray-900">
      <Navbar />
      <Container maxWidth="xs" className="flex-1 flex flex-col justify-center py-12">
        <Card className="border border-gray-200 shadow-none rounded-none p-4">
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <div className="p-3 bg-gray-50 border border-gray-150 mb-3 text-[#0066CC]">
                <KeyRound size={24} />
              </div>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, fontFamily: 'inherit' }}>
                Welcome Back
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'inherit' }}>
                Sign in to your SEAPEDIA account
              </Typography>
            </div>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 0 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Username</label>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  slotProps={{
                    input: { sx: { borderRadius: 0 } }
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Password</label>
                <TextField
                  fullWidth
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  slotProps={{
                    input: {
                      sx: { borderRadius: 0 },
                      endAdornment: (
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      ),
                    }
                  }}
                />
              </div>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disableElevation
                disabled={loading}
                sx={{
                  borderRadius: 0,
                  py: 1.5,
                  backgroundColor: '#0066CC',
                  '&:hover': {
                    backgroundColor: '#0052a3',
                  },
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-bold text-[#0066CC] hover:underline">
                Register here
              </Link>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
