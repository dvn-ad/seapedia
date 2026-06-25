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
import Button from "@mui/joy/Button";
import Stack from "@mui/joy/Stack";
import Grid from "@mui/joy/Grid";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Input from "@mui/joy/Input";
import Textarea from "@mui/joy/Textarea";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Alert from "@mui/joy/Alert";
import { Star, MessageSquare, Shield, Send, Users, Activity, Sparkles } from "lucide-react";

interface AppReview {
  id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function LandingPage() {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState<AppReview[]>([]);
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  // Set default reviewer name if user is logged in
  useEffect(() => {
    if (user?.username) {
      setReviewerName(user.username);
    } else {
      setReviewerName("");
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      const data = await apiRequest("/reviews");
      setReviews(data || []);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!reviewerName.trim()) {
      setFormError("Reviewer name is required.");
      return;
    }
    if (!comment.trim()) {
      setFormError("Feedback comment is required.");
      return;
    }

    setSubmitLoading(true);
    try {
      await apiRequest("/reviews", {
        method: "POST",
        body: JSON.stringify({
          reviewer_name: reviewerName,
          rating,
          comment,
        }),
      });

      setFormSuccess("Thank you for your feedback! Your review has been submitted.");
      setComment("");
      if (!user) setReviewerName("");
      fetchReviews();
    } catch (err: any) {
      setFormError(err.message || "Failed to submit review. Try again.");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            position: "relative",
            overflow: "hidden",
            bgcolor: "background.level1",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          {/* Background Gradient Ornaments */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: "100%",
              maxWidth: 1200,
              height: 400,
              opacity: 0.15,
              filter: "blur(80px)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 40,
                left: 40,
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: "linear-gradient(to bottom right, var(--joy-palette-primary-500), var(--joy-palette-success-400))",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                top: 80,
                right: 40,
                width: 300,
                height: 300,
                borderRadius: "50%",
                background: "linear-gradient(to bottom right, var(--joy-palette-warning-500), var(--joy-palette-danger-400))",
              }}
            />
          </Box>

          <Container sx={{ position: "relative", zIndex: 1, textAlign: "center" }}>
            <Chip
              variant="soft"
              color="primary"
              size="md"
              startDecorator={<Sparkles size={16} />}
              sx={{ mb: 3 }}
            >
              Introducing SEAPEDIA
            </Chip>

            <Typography
              level="h1"
              sx={{
                fontSize: { xs: "3xl", sm: "4xl", md: "5xl" },
                fontWeight: "xl",
                maxWidth: 800,
                mx: "auto",
                lineHeight: 1.25,
              }}
            >
              The Next-Gen Multi-Role{" "}
              <Box component="span" sx={{ color: "primary.plainColor" }}>
                Marketplace
              </Box>
            </Typography>

            <Typography
              level="body-lg"
              color="neutral"
              sx={{ maxWidth: 600, mx: "auto", mt: 2.5, mb: 4 }}
            >
              SEAPEDIA seamlessly connects Buyers, Sellers, and Delivery Drivers on a single unified platform.
              Open a store, purchase goods, or earn as a courier—all with one account.
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center">
              <Link href="/catalog" style={{ textDecoration: "none" }}>
                <Button size="lg" endDecorator={<MessageSquare size={18} />}>
                  Explore Products
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link href="/register" style={{ textDecoration: "none" }}>
                  <Button size="lg" variant="outlined" color="neutral">
                    Join Platform
                  </Button>
                </Link>
              )}
            </Stack>
          </Container>
        </Box>

        {/* Roles Cards Section */}
        <Container sx={{ py: 8 }}>
          <Stack alignItems="center" spacing={1} sx={{ mb: 6, textAlign: "center" }}>
            <Typography level="h2" sx={{ fontWeight: "lg" }}>
              One Account, Multiple Perspectives
            </Typography>
            <Typography level="body-md" color="neutral" sx={{ maxWidth: 500 }}>
              You do not need separate accounts. Simply log in and switch your active role dynamically depending on what you want to achieve.
            </Typography>
          </Stack>

          <Grid container spacing={4} sx={{ flexGrow: 1 }}>
            <Grid xs={12} md={4}>
              <Card variant="outlined" sx={{ height: "100%", boxShadow: "sm" }}>
                <CardContent>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "md",
                      bgcolor: "success.softBg",
                      color: "success.softColor",
                      width: "fit-content",
                      mb: 2,
                    }}
                  >
                    <Users size={28} />
                  </Box>
                  <Typography level="title-lg" sx={{ mb: 1 }}>
                    Buyer Experience
                  </Typography>
                  <Typography level="body-sm" color="neutral">
                    Manage your personal wallet, save delivery addresses, structure a single-store shopping cart, and follow live order lifecycles.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid xs={12} md={4}>
              <Card variant="outlined" sx={{ height: "100%", boxShadow: "sm" }}>
                <CardContent>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "md",
                      bgcolor: "primary.softBg",
                      color: "primary.softColor",
                      width: "fit-content",
                      mb: 2,
                    }}
                  >
                    <Activity size={28} />
                  </Box>
                  <Typography level="title-lg" sx={{ mb: 1 }}>
                    Seller Dashboard
                  </Typography>
                  <Typography level="body-sm" color="neutral">
                    Create a unique store page, list inventory details, set product prices, track stock levels, and process incoming orders securely.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid xs={12} md={4}>
              <Card variant="outlined" sx={{ height: "100%", boxShadow: "sm" }}>
                <CardContent>
                  <Box
                    sx={{
                      p: 1.5,
                      borderRadius: "md",
                      bgcolor: "warning.softBg",
                      color: "warning.softColor",
                      width: "fit-content",
                      mb: 2,
                    }}
                  >
                    <Shield size={28} />
                  </Box>
                  <Typography level="title-lg" sx={{ mb: 1 }}>
                    Driver Delivery
                  </Typography>
                  <Typography level="body-sm" color="neutral">
                    Access local shipping requests, lock in jobs to avoid race conditions, coordinate delivery routes, and track driver payouts.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>

        {/* Feedback Section */}
        <Box
          id="reviews"
          sx={{
            py: 8,
            bgcolor: "background.level2",
            borderTop: "1px solid",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Container>
            <Grid container spacing={6}>
              {/* Submission Form */}
              <Grid xs={12} md={5}>
                <Stack spacing={3}>
                  <Box>
                    <Typography level="h3" sx={{ fontWeight: "lg" }}>
                      We Value Your Feedback
                    </Typography>
                    <Typography level="body-sm" color="neutral" sx={{ mt: 1 }}>
                      Have feedback about the SEAPEDIA website or application experience? Let us know below. No transaction history is required.
                    </Typography>
                  </Box>

                  {formError && (
                    <Alert color="danger" variant="soft">
                      {formError}
                    </Alert>
                  )}
                  {formSuccess && (
                    <Alert color="success" variant="soft">
                      {formSuccess}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmitReview} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <FormControl required>
                      <FormLabel>Your Name</FormLabel>
                      <Input
                        value={reviewerName}
                        onChange={(e) => setReviewerName(e.target.value)}
                        placeholder="Guest or Username"
                        disabled={isAuthenticated}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Rating (1 - 5 Stars)</FormLabel>
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "4px",
                            }}
                          >
                            <Star
                              size={28}
                              fill={star <= rating ? "var(--joy-palette-warning-400)" : "none"}
                              color={star <= rating ? "var(--joy-palette-warning-400)" : "var(--joy-palette-neutral-400)"}
                            />
                          </button>
                        ))}
                      </Stack>
                    </FormControl>

                    <FormControl required>
                      <FormLabel>Comment / Feedback</FormLabel>
                      <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about the app..."
                        minRows={4}
                      />
                    </FormControl>

                    <Button type="submit" loading={submitLoading} startDecorator={<Send size={16} />}>
                      Submit Review
                    </Button>
                  </Box>
                </Stack>
              </Grid>

              {/* Reviews Listing */}
              <Grid xs={12} md={7}>
                <Stack spacing={3}>
                  <Typography level="h3" startDecorator={<MessageSquare size={24} />} sx={{ fontWeight: "lg" }}>
                    What Our Users Are Saying
                  </Typography>

                  <Stack spacing={2} sx={{ maxHeight: 500, overflowY: "auto", pr: 1 }}>
                    {reviews.length === 0 ? (
                      <Card variant="outlined" sx={{ py: 6, textAlign: "center", borderStyle: "dashed" }}>
                        <Typography level="body-sm" color="neutral">
                          No application reviews submitted yet. Be the first to submit!
                        </Typography>
                      </Card>
                    ) : (
                      reviews.map((rev) => (
                        <Card key={rev.id} variant="outlined" sx={{ boxShadow: "xs" }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="start">
                            <Box>
                              <Typography level="title-md" sx={{ fontWeight: "bold" }}>
                                {rev.reviewer_name}
                              </Typography>
                              <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    size={16}
                                    fill={s <= rev.rating ? "var(--joy-palette-warning-400)" : "none"}
                                    color={s <= rev.rating ? "var(--joy-palette-warning-400)" : "var(--joy-palette-neutral-200)"}
                                  />
                                ))}
                              </Stack>
                            </Box>
                            <Typography level="body-xs" color="neutral">
                              {new Date(rev.created_at).toLocaleDateString()}
                            </Typography>
                          </Stack>
                          <Typography level="body-sm" sx={{ mt: 2, whiteSpace: "pre-wrap" }}>
                            {rev.comment}
                          </Typography>
                        </Card>
                      ))
                    )}
                  </Stack>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>

      <Footer />
    </Box>
  );
}

// Simple Chip placeholder since Chip isn't directly imported on the same line.
function Chip({ children, variant, color, size, startDecorator, sx }: any) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 1.5,
        py: 0.5,
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: "bold",
        bgcolor: color === "primary" ? "primary.softBg" : "neutral.softBg",
        color: color === "primary" ? "primary.softColor" : "neutral.softColor",
        border: "1px solid",
        borderColor: color === "primary" ? "primary.softBorder" : "neutral.softBorder",
        ...sx,
      }}
    >
      {startDecorator}
      {children}
    </Box>
  );
}
