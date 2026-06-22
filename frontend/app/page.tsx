"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";
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
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-32 bg-slate-50 dark:bg-zinc-950">
          {/* Decorative Gradients */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 opacity-30 blur-3xl pointer-events-none">
            <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400" />
            <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-400" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-700 dark:bg-indigo-950/30 dark:border-indigo-900/50 dark:text-indigo-400 mb-6">
              <Sparkles className="h-4 w-4" />
              Introducing SEAPEDIA
            </div>
            <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl max-w-3xl mx-auto leading-tight">
              The Next-Gen Multi-Role{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Marketplace
              </span>
            </h1>
            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              SEAPEDIA seamlessly connects Buyers, Sellers, and Delivery Drivers on a single unified platform. 
              Open a store, purchase goods, or earn as a courier—all with one account.
            </p>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="/catalog">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore Products
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link href="/register">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    Join Platform
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Multi-Role Explanation */}
        <section className="py-20 bg-white dark:bg-black">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                One Account, Multiple Perspectives
              </h2>
              <p className="mt-4 text-zinc-600 dark:text-zinc-400">
                You do not need separate accounts. Simply log in and switch your active role dynamically depending on what you want to achieve.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {/* Buyer role details */}
              <Card hoverable className="border-zinc-100 dark:border-zinc-900">
                <CardBody className="p-8">
                  <div className="rounded-2xl bg-teal-50 dark:bg-teal-950/20 p-4 w-fit text-teal-600 dark:text-teal-400">
                    <Users className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mt-6 text-zinc-900 dark:text-zinc-100">
                    Buyer Experience
                  </h3>
                  <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Manage your personal wallet, save delivery addresses, structure a single-store shopping cart, and follow live order lifecycles.
                  </p>
                </CardBody>
              </Card>

              {/* Seller role details */}
              <Card hoverable className="border-zinc-100 dark:border-zinc-900">
                <CardBody className="p-8">
                  <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 p-4 w-fit text-indigo-600 dark:text-indigo-400">
                    <Activity className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mt-6 text-zinc-900 dark:text-zinc-100">
                    Seller Dashboard
                  </h3>
                  <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Create a unique store page, list inventory details, set product prices, track stock levels, and process incoming orders securely.
                  </p>
                </CardBody>
              </Card>

              {/* Driver role details */}
              <Card hoverable className="border-zinc-100 dark:border-zinc-900">
                <CardBody className="p-8">
                  <div className="rounded-2xl bg-sky-50 dark:bg-sky-950/20 p-4 w-fit text-sky-600 dark:text-sky-400">
                    <Shield className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mt-6 text-zinc-900 dark:text-zinc-100">
                    Driver Delivery
                  </h3>
                  <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Access local shipping requests, lock in jobs to avoid race conditions, coordinate delivery routes, and track driver payouts.
                  </p>
                </CardBody>
              </Card>
            </div>
          </div>
        </section>

        {/* Feedback Section */}
        <section id="reviews" className="py-20 bg-slate-50 dark:bg-zinc-950/40 border-t border-b border-zinc-100 dark:border-zinc-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              
              {/* Feedback Form */}
              <div>
                <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
                  We Value Your Feedback
                </h2>
                <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-md">
                  Have feedback about the SEAPEDIA website or application experience? Let us know below. No transaction history is required.
                </p>

                <form onSubmit={handleSubmitReview} className="mt-8 space-y-6 max-w-md">
                  {formError && (
                    <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400">
                      {formError}
                    </div>
                  )}
                  {formSuccess && (
                    <div className="rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                      {formSuccess}
                    </div>
                  )}

                  <Input
                    label="Your Name"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Guest or Username"
                    disabled={isAuthenticated}
                    required
                  />

                  <div>
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Rating (1 - 5 Stars)
                    </label>
                    <div className="mt-2 flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 text-amber-400 transition-colors cursor-pointer"
                        >
                          <Star
                            className={`h-7 w-7 ${
                              star <= rating ? "fill-amber-400" : "text-zinc-300 dark:text-zinc-700"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      Comment / Feedback
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Share your thoughts about the app..."
                      rows={4}
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50"
                      required
                    />
                  </div>

                  <Button type="submit" loading={submitLoading} className="w-full gap-2">
                    <Send className="h-4 w-4" />
                    Submit Review
                  </Button>
                </form>
              </div>

              {/* Feed Display */}
              <div>
                <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
                  <MessageSquare className="h-6 w-6 text-indigo-600" />
                  What Our Users Are Saying
                </h3>

                <div className="space-y-6 max-h-[500px] overflow-y-auto pr-2">
                  {reviews.length === 0 ? (
                    <Card className="border-dashed border-zinc-200 dark:border-zinc-800">
                      <CardBody className="py-12 text-center text-zinc-500">
                        No application reviews submitted yet. Be the first to submit!
                      </CardBody>
                    </Card>
                  ) : (
                    reviews.map((rev) => (
                      <Card key={rev.id} className="border-zinc-100 dark:border-zinc-900">
                        <CardBody className="p-6">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              {/* Safe render: username is bound to react text variable preventing HTML injection */}
                              <h4 className="font-bold text-zinc-800 dark:text-zinc-200">
                                {rev.reviewer_name}
                              </h4>
                              <div className="flex items-center gap-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`h-4 w-4 ${
                                      s <= rev.rating
                                        ? "fill-amber-400 text-amber-400"
                                        : "text-zinc-200 dark:text-zinc-800"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-zinc-400">
                              {new Date(rev.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          {/* Safe render: comment is standard react text content preventing inline scripts from executing */}
                          <p className="mt-4 text-zinc-600 dark:text-zinc-350 text-sm leading-relaxed whitespace-pre-wrap">
                            {rev.comment}
                          </p>
                        </CardBody>
                      </Card>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
