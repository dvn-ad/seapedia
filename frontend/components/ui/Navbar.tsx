"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { Menu, X, ChevronDown, LogOut, User, Store, Shield, UserCheck } from "lucide-react";
import { Button } from "./Button";

export function Navbar() {
  const { user, activeRole, logout, selectRole, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const nonAdminRoles = user?.roles.filter((r) => r !== "Admin") || [];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-zinc-100 bg-white/80 backdrop-blur-md dark:border-zinc-900 dark:bg-black/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent group-hover:opacity-90">
                SEAPEDIA
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/catalog"
                className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Catalog
              </Link>
              <Link
                href="/#reviews"
                className="text-sm font-semibold text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              >
                Reviews
              </Link>
            </div>
          </div>

          {/* Right-side Auth & Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* Active Role Badge */}
                {activeRole && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300">
                    <UserCheck className="h-3 w-3" />
                    {activeRole} Role
                  </span>
                )}

                {/* Dashboard Shortcut */}
                {activeRole && (
                  <Link
                    href={`/dashboard/${activeRole.toLowerCase()}`}
                    className="text-sm font-semibold text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50 border-r border-zinc-200 dark:border-zinc-800 pr-4"
                  >
                    Dashboard
                  </Link>
                )}

                {/* Role Switcher (for multi-role users) */}
                {nonAdminRoles.length > 1 && (
                  <div className="relative">
                    <button
                      onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                      className="flex items-center gap-1.5 rounded-xl border border-zinc-200 px-3.5 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-950 cursor-pointer"
                    >
                      Switch Role
                      <ChevronDown className="h-4 w-4" />
                    </button>

                    {roleDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 rounded-xl border border-zinc-100 bg-white p-1.5 shadow-lg dark:border-zinc-900 dark:bg-zinc-950">
                        {nonAdminRoles.map((role) => (
                          <button
                            key={role}
                            onClick={() => {
                              selectRole(role);
                              setRoleDropdownOpen(false);
                            }}
                            className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors cursor-pointer
                              ${
                                activeRole === role
                                  ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400"
                                  : "text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900"
                              }`}
                          >
                            {role}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Profile User Info & Logout */}
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                      {user?.username}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout} className="gap-2">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2.5 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-950 dark:hover:bg-zinc-950 dark:hover:text-zinc-50 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-zinc-100 bg-white py-4 dark:border-zinc-900 dark:bg-black md:hidden px-4">
          <div className="flex flex-col gap-3">
            <Link
              href="/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-4 py-2.5 text-base font-semibold text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-950"
            >
              Catalog
            </Link>
            <Link
              href="/#reviews"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-4 py-2.5 text-base font-semibold text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-950"
            >
              Reviews
            </Link>

            <hr className="border-zinc-100 dark:border-zinc-900" />

            {isAuthenticated ? (
              <div className="flex flex-col gap-3.5 pt-2">
                <div className="px-4">
                  <p className="text-xs text-zinc-400 font-medium">Logged in as</p>
                  <p className="text-base font-bold text-zinc-800 dark:text-zinc-200">
                    {user?.username}
                  </p>
                  {activeRole && (
                    <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300">
                      Active: {activeRole}
                    </span>
                  )}
                </div>

                {activeRole && (
                  <Link
                    href={`/dashboard/${activeRole.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl px-4 py-2.5 text-base font-semibold text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
                  >
                    Go to Dashboard
                  </Link>
                )}

                {/* Role Switch options directly in list */}
                {nonAdminRoles.length > 1 && (
                  <div className="px-4">
                    <p className="text-xs text-zinc-400 font-medium mb-1.5">Switch Active Role:</p>
                    <div className="flex flex-wrap gap-2">
                      {nonAdminRoles.map((role) => (
                        <button
                          key={role}
                          onClick={() => {
                            selectRole(role);
                            setMobileMenuOpen(false);
                          }}
                          className={`rounded-xl border px-3 py-1.5 text-xs font-semibold cursor-pointer
                            ${
                              activeRole === role
                                ? "border-indigo-600 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400"
                                : "border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
                            }`}
                        >
                          {role}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
