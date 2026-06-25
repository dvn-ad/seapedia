"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Grid from "@mui/joy/Grid";
import Alert from "@mui/joy/Alert";
import { ArrowLeft, ShoppingBag, Store, Info, ShieldAlert } from "lucide-react";

interface Product {
  id: number;
  store_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const { activeRole, isAuthenticated } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await apiRequest(`/catalog/${id}`);
        setProduct(data);
      } catch (err: any) {
        setError(err.message || "Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1, py: 6 }}>
        <Container maxWidth="md">
          {/* Back Navigation */}
          <Box sx={{ mb: 4 }}>
            <Link href="/catalog" style={{ textDecoration: "none" }}>
              <Button
                variant="plain"
                color="neutral"
                startDecorator={<ArrowLeft size={16} />}
                size="sm"
              >
                Back to Catalog
              </Button>
            </Link>
          </Box>

          {loading ? (
            <Box sx={{ py: 10, textAlign: "center" }}>
              <Typography level="body-md" color="neutral" sx={{ className: "animate-pulse" }}>
                Loading product details...
              </Typography>
            </Box>
          ) : error || !product ? (
            <Card color="danger" variant="soft" sx={{ textAlign: "center", py: 6 }}>
              <CardContent>
                <ShieldAlert size={48} style={{ margin: "0 auto", color: "var(--joy-palette-danger-500)" }} />
                <Typography level="title-md" color="danger" sx={{ mt: 2, fontWeight: "bold" }}>
                  Product Not Found
                </Typography>
                <Typography level="body-sm" sx={{ mt: 1 }}>
                  {error || "The product you are trying to view does not exist."}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={4} alignItems="start">
              {/* Product Visual */}
              <Grid xs={12} md={6}>
                <Box
                  sx={{
                    height: 320,
                    borderRadius: "lg",
                    background: "linear-gradient(135deg, var(--joy-palette-primary-50), var(--joy-palette-neutral-100))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid",
                    borderColor: "divider",
                    color: "primary.solidBg",
                  }}
                >
                  <ShoppingBag size={80} style={{ opacity: 0.7 }} />
                </Box>
              </Grid>

              {/* Product Info */}
              <Grid xs={12} md={6}>
                <Stack spacing={3}>
                  <Box>
                    <Typography level="h1" sx={{ fontWeight: "lg" }}>
                      {product.name}
                    </Typography>
                    <Typography level="h3" sx={{ fontWeight: "xl", color: "primary.plainColor", mt: 1 }}>
                      Rp {product.price.toLocaleString("id-ID")}
                    </Typography>
                  </Box>

                  {/* Store and Stock details */}
                  <Card variant="outlined" sx={{ py: 1.5, px: 2 }}>
                    <Stack spacing={1.5}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Store size={18} style={{ opacity: 0.6 }} />
                        <Box>
                          <Typography level="body-xs" color="neutral">Store Owner ID</Typography>
                          <Typography level="body-sm" sx={{ fontWeight: "bold" }}>
                            Store #{product.store_id}
                          </Typography>
                        </Box>
                      </Stack>

                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            bgcolor: product.stock > 0 ? "success.softBg" : "danger.softBg",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                            fontWeight: "bold",
                            color: product.stock > 0 ? "success.softColor" : "danger.softColor",
                          }}
                        >
                          S
                        </Box>
                        <Box>
                          <Typography level="body-xs" color="neutral">Stock Available</Typography>
                          <Typography level="body-sm" sx={{ fontWeight: "bold" }}>
                            {product.stock > 0 ? `${product.stock} units` : "Out of stock"}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Card>

                  {/* Description */}
                  <Box>
                    <Typography level="title-sm" sx={{ fontWeight: "bold", mb: 1 }}>
                      Description
                    </Typography>
                    <Typography level="body-sm" color="neutral" sx={{ lineHeight: 1.6 }}>
                      {product.description || "No description provided by the seller."}
                    </Typography>
                  </Box>

                  {/* Role Restriction Alerts */}
                  {!isAuthenticated || activeRole !== "Buyer" ? (
                    <Alert
                      color="warning"
                      variant="soft"
                      startDecorator={<Info size={20} />}
                      sx={{ alignItems: "start" }}
                    >
                      <Box>
                        <Typography level="title-sm" sx={{ fontWeight: "bold" }}>
                          Purchase Restricted
                        </Typography>
                        <Typography level="body-xs" sx={{ mt: 0.5, mb: 2 }}>
                          {!isAuthenticated
                            ? "You are currently browsing as a guest. Please sign in to purchase."
                            : `Your current active role is "${activeRole}". Please switch to the "Buyer" role to purchase products.`}
                        </Typography>
                        {!isAuthenticated ? (
                          <Link href="/login" style={{ textDecoration: "none" }}>
                            <Button size="sm" color="warning">
                              Go to Login
                            </Button>
                          </Link>
                        ) : (
                          <Link href="/select-role" style={{ textDecoration: "none" }}>
                            <Button size="sm" color="warning">
                              Switch Active Role
                            </Button>
                          </Link>
                        )}
                      </Box>
                    </Alert>
                  ) : (
                    <Alert color="primary" variant="soft">
                      🛒 <strong>Buyer Mode Active</strong>: Adding items to the shopping cart and checkout processes will be unlocked in Level 3.
                    </Alert>
                  )}
                </Stack>
              </Grid>
            </Grid>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
