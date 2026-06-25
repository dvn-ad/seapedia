"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Typography from "@mui/joy/Typography";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, activeRole, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (!activeRole) {
        router.push("/select-role");
      }
    }
  }, [isAuthenticated, activeRole, isLoading, router]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <Typography level="body-md" color="neutral" sx={{ className: "animate-pulse" }}>
          Validating dashboard session...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated || !activeRole) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1, py: 6 }}>
        <Container>
          {children}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
