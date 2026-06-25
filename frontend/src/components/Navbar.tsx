'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { getActiveRole, getAuthToken, getUserRoles, setActiveRole, clearAuth } from '@/lib/api';
import { User, LogOut, ArrowLeftRight, ChevronDown } from 'lucide-react';
import { Menu, MenuItem, Button } from '@mui/material';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [activeRole, setActiveRoleState] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    setIsClient(true);
    setToken(getAuthToken());
    setRoles(getUserRoles());
    setActiveRoleState(getActiveRole());
  }, [pathname]);

  const handleLogout = () => {
    clearAuth();
    setToken(null);
    setRoles([]);
    setActiveRoleState(null);
    router.push('/');
  };

  const handleRoleChange = (role: string) => {
    setActiveRole(role);
    setActiveRoleState(role);
    setAnchorEl(null);
    
    // Redirect to appropriate dashboard
    if (role === 'Seller') {
      router.push('/dashboard/seller');
    } else if (role === 'Buyer') {
      router.push('/dashboard/buyer');
    } else if (role === 'Driver') {
      router.push('/dashboard/driver');
    } else if (role === 'Admin') {
      router.push('/dashboard/admin');
    }
  };

  if (!isClient) return null;

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#0066CC] inline-block"></span>
            SEAPEDIA
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/catalog" 
              className={`text-sm font-medium transition-colors ${
                pathname === '/catalog' ? 'text-[#0066CC]' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Catalog
            </Link>
            <Link 
              href="/#reviews" 
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              Reviews
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {token ? (
            <div className="flex items-center gap-4">
              {/* Dashboard Link based on active role */}
              {activeRole && (
                <Link 
                  href={`/dashboard/${activeRole.toLowerCase()}`}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1 border border-gray-200 hover:border-gray-900 transition-colors"
                >
                  Dashboard
                </Link>
              )}

              {/* Role Switcher */}
              {roles.length > 0 && (
                <div>
                  <button
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 border border-gray-200 text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors"
                  >
                    <ArrowLeftRight size={14} className="text-[#0066CC]" />
                    Role: <span className="font-bold text-[#0066CC]">{activeRole}</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    elevation={0}
                    slotProps={{
                      paper: {
                        sx: {
                          border: '1px solid #e5e7eb',
                          borderRadius: 0,
                          mt: 0.5,
                        }
                      }
                    }}
                  >
                    {roles.map((role) => (
                      <MenuItem 
                        key={role} 
                        onClick={() => handleRoleChange(role)}
                        selected={activeRole === role}
                        sx={{
                          fontSize: '0.875rem',
                          fontFamily: 'inherit',
                          '&.Mui-selected': {
                            backgroundColor: '#f3f4f6',
                            color: '#0066CC',
                            fontWeight: 'bold',
                          }
                        }}
                      >
                        {role}
                      </MenuItem>
                    ))}
                  </Menu>
                </div>
              )}

              <button 
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-900 p-1 transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                href="/login" 
                className="text-sm font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 transition-colors"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="text-sm font-medium bg-[#0066CC] text-white hover:bg-[#0052a3] px-3.5 py-1.5 transition-colors font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
