"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";

interface UserProfile {
  id: number;
  username: string;
  roles: string[];
  active_role?: string;
}

interface AuthContextType {
  token: string | null;
  roles: string[];
  activeRole: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, roles: string[]) => void;
  selectRole: (role: string) => void;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Initial load from localStorage
    const savedToken = localStorage.getItem("token");
    const savedActiveRole = localStorage.getItem("active_role");
    const savedRoles = localStorage.getItem("roles");

    if (savedToken) {
      setToken(savedToken);
      if (savedRoles) {
        try {
          setRoles(JSON.parse(savedRoles));
        } catch {
          setRoles([]);
        }
      }
      if (savedActiveRole) {
        setActiveRole(savedActiveRole);
      }
    }
    setIsLoading(false);
  }, []);

  const refreshProfile = async () => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) return;

    try {
      const profile = await apiRequest("/auth/profile", {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });
      setUser(profile);
      if (profile.roles) {
        setRoles(profile.roles);
        localStorage.setItem("roles", JSON.stringify(profile.roles));
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      // If unauthorized, log out
      logout();
    }
  };

  // Run profile fetch once token is loaded/changed
  useEffect(() => {
    if (token) {
      refreshProfile();
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (newToken: string, newRoles: string[]) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("roles", JSON.stringify(newRoles));
    setToken(newToken);
    setRoles(newRoles);

    // After login, decide routing:
    if (newRoles.includes("Admin")) {
      // Admin is special
      localStorage.setItem("active_role", "Admin");
      setActiveRole("Admin");
      router.push("/dashboard/admin");
    } else if (newRoles.length > 1) {
      // Show role selection screen
      localStorage.removeItem("active_role");
      setActiveRole(null);
      router.push("/select-role");
    } else if (newRoles.length === 1) {
      // Set active role immediately and go to dashboard
      const singleRole = newRoles[0];
      localStorage.setItem("active_role", singleRole);
      setActiveRole(singleRole);
      router.push(`/dashboard/${singleRole.toLowerCase()}`);
    } else {
      // No roles (should not happen), redirect to catalog
      router.push("/catalog");
    }
  };

  const selectRole = (role: string) => {
    if (!roles.includes(role)) {
      console.error("User does not own the role:", role);
      return;
    }
    localStorage.setItem("active_role", role);
    setActiveRole(role);
    router.push(`/dashboard/${role.toLowerCase()}`);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("active_role");
    localStorage.removeItem("roles");
    setToken(null);
    setRoles([]);
    setActiveRole(null);
    setUser(null);
    router.push("/login");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        roles,
        activeRole,
        user,
        isAuthenticated,
        isLoading,
        login,
        selectRole,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
