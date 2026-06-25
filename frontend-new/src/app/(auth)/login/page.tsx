"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
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

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setSuccess("Account created successfully! Please sign in.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !password) {
      setError("Username and Password are required.");
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      // Pass token and roles array to context login handler
      login(data.token, data.roles || []);
    } catch (err: any) {
      setError(err.message || "Invalid credentials. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "80vh",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 6,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 400 }}>
        <Stack spacing={1} sx={{ textAlign: "center", mb: 4 }}>
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
            Sign in to your account
          </Typography>
          <Typography level="body-sm" color="neutral">
            Or{" "}
            <Link href="/register" style={{ fontWeight: "bold", color: "var(--joy-palette-primary-500)" }}>
              create a new multi-role account
            </Link>
          </Typography>
        </Stack>

        <Card variant="outlined" sx={{ boxShadow: "lg" }}>
          <CardContent>
            <form onSubmit={handleLogin}>
              <Stack spacing={2.5}>
                {error && (
                  <Alert color="danger" variant="soft">
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert color="success" variant="soft">
                    {success}
                  </Alert>
                )}

                <FormControl required>
                  <FormLabel>Username</FormLabel>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                  />
                </FormControl>

                <FormControl required>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                  />
                </FormControl>

                <Button type="submit" loading={loading} fullWidth sx={{ mt: 1 }}>
                  Sign In
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: "flex", minHeight: "80vh", alignItems: "center", justifyContent: "center" }}>
          <Typography level="body-sm" color="neutral">Loading form...</Typography>
        </Box>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
