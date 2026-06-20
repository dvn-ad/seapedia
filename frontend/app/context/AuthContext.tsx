"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: number;
  username: string;
  roles: string[];
}

interface AuthContextType {
  token: string | null;
  roles: string[];
  activeRole: string | null;
  profile: UserProfile | null;
  login: (token: string, roles: string[]) => void;
  logout: () => void;
  selectRole: (role: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRoles = localStorage.getItem("roles");
    const storedActiveRole = localStorage.getItem("active_role");

    if (storedToken) setToken(storedToken);
    if (storedRoles) setRoles(JSON.parse(storedRoles));
    if (storedActiveRole) setActiveRole(storedActiveRole);
  }, []);

  const login = (newToken: string, newRoles: string[]) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("roles", JSON.stringify(newRoles));
    setToken(newToken);
    setRoles(newRoles);

    if (newRoles.length === 1) {
      selectRole(newRoles[0]);
    } else {
      router.push("/select-role");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("roles");
    localStorage.removeItem("active_role");
    setToken(null);
    setRoles([]);
    setActiveRole(null);
    setProfile(null);
    router.push("/login");
  };

  const selectRole = (role: string) => {
    localStorage.setItem("active_role", role);
    setActiveRole(role);
    router.push(`/dashboard/${role.toLowerCase()}`);
  };

  return (
    <AuthContext.Provider value={{ token, roles, activeRole, profile, login, logout, selectRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
