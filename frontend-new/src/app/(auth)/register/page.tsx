"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Alert from "@mui/joy/Alert";
import Grid from "@mui/joy/Grid";
import { Shield, User, Store, Ship } from "lucide-react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRoleToggle = (role: string) => {
    if (selectedRoles.includes(role)) {
      setSelectedRoles(selectedRoles.filter((r) => r !== role));
    } else {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username and Password are required.");
      return;
    }
    if (selectedRoles.length === 0) {
      setError("Please select at least one role.");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
          roles: selectedRoles,
        }),
      });
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const rolesList = [
    { name: "Buyer", desc: "Buy products and manage wallet", icon: User },
    { name: "Seller", desc: "Open a store and sell products", icon: Store },
    { name: "Driver", desc: "Take and complete delivery jobs", icon: Ship },
    { name: "Admin", desc: "Supervise platform and manage codes", icon: Shield },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "85vh",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 6,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 500 }}>
        <Stack spacing={1} sx={{ textCenter: "center", mb: 4, textAlign: "center" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <Typography
              level="h3"
              sx={{
                fontWeight: "xl",
                background: "linear-gradient(to right, var(--joy-palette-primary-600), var(--joy-palette-primary-800))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              SEAPEDIA
            </Typography>
          </Link>
          <Typography level="h4" sx={{ fontWeight: "lg" }}>
            Create your account
          </Typography>
          <Typography level="body-sm" color="neutral">
            Or{" "}
            <Link href="/login" style={{ fontWeight: "bold", color: "var(--joy-palette-primary-500)" }}>
              sign in to your existing account
            </Link>
          </Typography>
        </Stack>

        <Card variant="outlined" sx={{ boxShadow: "lg" }}>
          <CardContent>
            <form onSubmit={handleRegister}>
              <Stack spacing={3}>
                {error && (
                  <Alert color="danger" variant="soft">
                    {error}
                  </Alert>
                )}

                <FormControl required>
                  <FormLabel>Username</FormLabel>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. johndoe"
                  />
                </FormControl>

                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel sx={{ mb: 1 }}>Assign Roles (Choose all that apply)</FormLabel>
                  <Grid container spacing={2}>
                    {rolesList.map(({ name, desc, icon: Icon }) => {
                      const isSelected = selectedRoles.includes(name);
                      return (
                        <Grid key={name} xs={12} sm={6}>
                          <Card
                            variant={isSelected ? "soft" : "outlined"}
                            color={isSelected ? "primary" : "neutral"}
                            onClick={() => handleRoleToggle(name)}
                            sx={{
                              p: 2,
                              cursor: "pointer",
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "start",
                              gap: 2,
                              textAlign: "left",
                              height: "100%",
                              "&:hover": {
                                borderColor: isSelected ? "primary.outlinedBorder" : "neutral.outlinedBorder",
                                bgcolor: isSelected ? "primary.softHoverBg" : "background.level1",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                p: 1,
                                borderRadius: "md",
                                bgcolor: isSelected ? "primary.solidBg" : "neutral.softBg",
                                color: isSelected ? "primary.solidColor" : "neutral.softColor",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Icon size={18} />
                            </Box>
                            <Box>
                              <Typography level="title-sm" sx={{ fontWeight: "bold" }}>
                                {name}
                              </Typography>
                              <Typography level="body-xs" color="neutral" sx={{ mt: 0.5 }}>
                                {desc}
                              </Typography>
                            </Box>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </FormControl>

                <Button type="submit" loading={loading} fullWidth sx={{ mt: 1 }}>
                  Register
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
