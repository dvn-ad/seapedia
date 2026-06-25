"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Button from "@mui/joy/Button";
import Grid from "@mui/joy/Grid";
import Stack from "@mui/joy/Stack";
import { Shield, User, Store, Ship } from "lucide-react";

export default function SelectRolePage() {
  const { roles, selectRole, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const roleMeta: Record<string, { icon: any; color: "teal" | "indigo" | "sky" | "warning"; desc: string }> = {
    Buyer: {
      icon: User,
      color: "teal",
      desc: "Browse catalog, manage wallet, add items to cart, and check out.",
    },
    Seller: {
      icon: Store,
      color: "indigo",
      desc: "Manage your store details, list products for sale, and pack orders.",
    },
    Driver: {
      icon: Ship,
      color: "sky",
      desc: "Find delivery jobs, claim orders to deliver, and track your earnings.",
    },
    Admin: {
      icon: Shield,
      color: "warning",
      desc: "Oversee the platform metrics, generate voucher promo codes, and manage time.",
    },
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center" }}>
        <Typography level="body-md" color="neutral">Loading your profile roles...</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.level1",
        px: 2,
        py: 6,
      }}
    >
      <Container maxWidth="sm" sx={{ textAlign: "center" }}>
        <Typography
          level="h2"
          sx={{
            fontWeight: "xl",
            background: "linear-gradient(to right, var(--joy-palette-primary-600), var(--joy-palette-primary-800))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1.5,
          }}
        >
          Select Active Role
        </Typography>
        <Typography level="body-sm" color="neutral" sx={{ mb: 5 }}>
          You have multiple roles assigned to your account. Select the active role for this session.
        </Typography>

        <Grid container spacing={3}>
          {roles.map((role) => {
            const meta = roleMeta[role] || {
              icon: User,
              color: "neutral",
              desc: "Access default system panel actions.",
            };
            const Icon = meta.icon;

            return (
              <Grid key={role} xs={12} sm={6}>
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    p: 3,
                    "&:hover": {
                      borderColor: "primary.outlinedBorder",
                      boxShadow: "md",
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <CardContent sx={{ textAlign: "left" }}>
                    <Box
                      sx={{
                        display: "inline-flex",
                        p: 1.5,
                        borderRadius: "lg",
                        bgcolor: "primary.softBg",
                        color: "primary.solidBg",
                        mb: 2,
                      }}
                    >
                      <Icon size={24} />
                    </Box>
                    <Typography level="title-md" sx={{ fontWeight: "bold", mb: 1 }}>
                      {role}
                    </Typography>
                    <Typography level="body-xs" color="neutral" sx={{ lineHeight: 1.5 }}>
                      {meta.desc}
                    </Typography>
                  </CardContent>

                  <Box sx={{ mt: 3 }}>
                    <Button
                      fullWidth
                      variant="soft"
                      onClick={() => selectRole(role)}
                    >
                      Enter as {role}
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}
