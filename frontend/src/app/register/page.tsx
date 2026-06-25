'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { authApi } from '@/lib/api';
import { Container, Card, CardContent, TextField, Button, Checkbox, FormControlLabel, FormGroup, Typography, Alert, Box } from '@mui/material';
import { UserPlus, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roles, setRoles] = useState<Record<string, boolean>>({
    Buyer: true,
    Seller: false,
    Driver: false,
    Admin: false,
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (role: string) => {
    setRoles((prev) => ({
      ...prev,
      [role]: !prev[role],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const selectedRoles = Object.keys(roles).filter((role) => roles[role]);
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.');
      return;
    }
    if (selectedRoles.length === 0) {
      setError('Please choose at least one role.');
      return;
    }

    try {
      setLoading(true);
      await authApi.register(username, password, selectedRoles);
      setSuccess(true);
      setUsername('');
      setPassword('');
      // Redirect to login after 1.5 seconds
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
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
                <UserPlus size={24} />
              </div>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, fontFamily: 'inherit' }}>
                Create Account
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: 'inherit' }}>
                Join SEAPEDIA multi-role marketplace
              </Typography>
            </div>

            {success && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: 0 }}>
                Registration successful! Redirecting to login...
              </Alert>
            )}
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
                  placeholder="Choose a username"
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Select Roles</label>
                <FormGroup className="mt-2 bg-gray-50 p-3 border border-gray-150 space-y-1">
                  {Object.keys(roles).map((role) => (
                    <FormControlLabel
                      key={role}
                      control={
                        <Checkbox
                          checked={roles[role]}
                          onChange={() => handleRoleChange(role)}
                          sx={{
                            color: '#e5e7eb',
                            '&.Mui-checked': {
                              color: '#0066CC',
                            },
                          }}
                        />
                      }
                      label={
                        <span className="text-sm font-semibold text-gray-800">
                          {role}
                        </span>
                      }
                    />
                  ))}
                </FormGroup>
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
                {loading ? 'Creating Account...' : 'Register'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-[#0066CC] hover:underline">
                Login here
              </Link>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
