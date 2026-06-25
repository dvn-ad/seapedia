"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { apiRequest } from "@/lib/api";
import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";
import Typography from "@mui/joy/Typography";
import Grid from "@mui/joy/Grid";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Chip from "@mui/joy/Chip";
import { Search, Package, ShoppingBag, Eye } from "lucide-react";

interface Product {
  id: number;
  store_id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/catalog");
      setProducts(data || []);
    } catch (err) {
      console.error("Failed to load catalog products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((prod) =>
    prod.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1, py: 6 }}>
        <Container>
          {/* Header and Search Area */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
            spacing={2}
            sx={{ mb: 4 }}
          >
            <Box>
              <Typography level="h2" sx={{ fontWeight: "lg" }}>
                Product Catalog
              </Typography>
              <Typography level="body-sm" color="neutral">
                Explore items listed by sellers across SEAPEDIA
              </Typography>
            </Box>

            <Input
              startDecorator={<Search size={18} />}
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: { xs: "100%", md: 300 } }}
            />
          </Stack>

          {/* Loading state */}
          {loading ? (
            <Box sx={{ py: 10, textAlign: "center" }}>
              <Typography level="body-md" color="neutral" sx={{ className: "animate-pulse" }}>
                Loading catalog products...
              </Typography>
            </Box>
          ) : filteredProducts.length === 0 ? (
            /* Empty state */
            <Card variant="outlined" sx={{ py: 10, textAlign: "center", maxWidth: 400, mx: "auto", borderStyle: "dashed" }}>
              <CardContent>
                <Package size={48} style={{ margin: "0 auto", opacity: 0.5 }} />
                <Typography level="title-md" sx={{ mt: 2, fontWeight: "bold" }}>
                  No products found
                </Typography>
                <Typography level="body-sm" color="neutral" sx={{ mt: 1 }}>
                  {searchQuery
                    ? `We couldn't find matches for "${searchQuery}"`
                    : "Sellers haven't listed any products yet."}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            /* Products Grid */
            <Grid container spacing={3}>
              {filteredProducts.map((prod) => (
                <Grid key={prod.id} xs={12} sm={6} md={4} lg={3}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "md",
                        borderColor: "primary.outlinedBorder",
                      },
                    }}
                  >
                    <CardContent>
                      {/* Product Visual Area */}
                      <Box
                        sx={{
                          height: 140,
                          borderRadius: "md",
                          background: "linear-gradient(135deg, var(--joy-palette-primary-50), var(--joy-palette-neutral-100))",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "primary.solidBg",
                          mb: 2,
                        }}
                      >
                        <ShoppingBag size={40} style={{ opacity: 0.7 }} />
                      </Box>

                      {/* Product Meta */}
                      <Typography level="title-md" sx={{ fontWeight: "bold", mb: 0.5 }}>
                        {prod.name}
                      </Typography>
                      <Typography
                        level="body-xs"
                        color="neutral"
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          height: 36,
                          mb: 2,
                        }}
                      >
                        {prod.description || "No description provided."}
                      </Typography>
                    </CardContent>

                    <Box sx={{ p: 2, pt: 0 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Typography level="title-lg" sx={{ fontWeight: "xl", color: "primary.plainColor" }}>
                          Rp {prod.price.toLocaleString("id-ID")}
                        </Typography>
                        <Chip
                          size="sm"
                          color={prod.stock > 0 ? "success" : "danger"}
                          variant="soft"
                        >
                          {prod.stock > 0 ? `${prod.stock} left` : "Out of stock"}
                        </Chip>
                      </Stack>

                      <Link href={`/catalog/${prod.id}`} style={{ textDecoration: "none" }}>
                        <Button
                          fullWidth
                          variant="soft"
                          color="neutral"
                          startDecorator={<Eye size={16} />}
                        >
                          View Details
                        </Button>
                      </Link>
                    </Box>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}
