"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "./context/AuthContext";

interface Review {
  id: number;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export default function Home() {
  const { token, activeRole, logout } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/reviews");
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("http://localhost:8080/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewer_name: reviewerName, rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setSuccess(true);
      setReviewerName("");
      setComment("");
      setRating(5);
      fetchReviews();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans transition-colors">
      {/* Premium Header Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-200/60 bg-white/80 backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/80">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="text-2xl font-black tracking-wider text-indigo-650 dark:text-indigo-400">
            SEAPEDIA
          </Link>
          
          <nav className="flex items-center gap-6">
            <Link href="/catalog" className="text-sm font-semibold text-zinc-600 hover:text-indigo-650 dark:text-zinc-300 dark:hover:text-indigo-400">
              Browse Products
            </Link>
            
            {token ? (
              <div className="flex items-center gap-4">
                {activeRole && (
                  <Link
                    href={`/dashboard/${activeRole.toLowerCase()}`}
                    className="rounded-lg bg-indigo-50 px-3.5 py-1.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                  >
                    Active: {activeRole} Dashboard
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="text-sm font-semibold text-red-650 hover:underline cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm font-semibold text-zinc-600 hover:text-indigo-650 dark:text-zinc-300 dark:hover:text-indigo-400">
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto w-full max-w-7xl px-6 py-20 text-center sm:py-32">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl max-w-3xl mx-auto leading-tight">
          The Modern Multi-Role E-Commerce Marketplace
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-650 dark:text-zinc-400">
          SEAPEDIA connects Buyers, Sellers, and Delivery Drivers in one premium platform. Register once, select your session role, and participate in the transaction network.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/catalog"
            className="rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow hover:bg-indigo-500 transition-colors"
          >
            Explore Catalog
          </Link>
          <Link href="/register" className="text-base font-semibold text-zinc-900 dark:text-zinc-300 hover:underline">
            Register Account &rarr;
          </Link>
        </div>
      </section>

      {/* Reviews and Feedback Grid */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 py-20">
        <div className="mx-auto max-w-7xl px-6 grid grid-cols-1 gap-12 lg:grid-cols-2">
          
          {/* List Section */}
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
              Application Feedback
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-8">
              Here is what early users think about the SEAPEDIA website and interface experience.
            </p>

            <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
              {reviews.length === 0 ? (
                <div className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-850 p-8 text-center text-zinc-455">
                  No reviews submitted yet. Be the first to leave one!
                </div>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-850 dark:bg-zinc-900"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-zinc-900 dark:text-zinc-50">
                        {rev.reviewer_name}
                      </h4>
                      <span className="text-yellow-500 font-bold">
                        {"★".repeat(rev.rating)}
                        {"☆".repeat(5 - rev.rating)}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-650 dark:text-zinc-450 whitespace-pre-line leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-8 dark:border-zinc-850 dark:bg-zinc-900/60 shadow-lg">
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">
              Submit Website Review
            </h3>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-650 dark:bg-red-950/50 dark:text-red-400">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-650 dark:bg-green-950/50 dark:text-green-400">
                Review submitted successfully! Thank you.
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-350 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-350 bg-white px-4 py-2 text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-750 dark:bg-zinc-800 dark:text-zinc-50"
                  placeholder="Reviewer Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-350 mb-2">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setRating(stars)}
                      className={`text-2xl cursor-pointer transition-transform hover:scale-110 ${
                        stars <= rating ? "text-yellow-500" : "text-zinc-300 dark:text-zinc-700"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-350 mb-1">
                  Comments
                </label>
                <textarea
                  required
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full rounded-lg border border-zinc-355 bg-white px-4 py-2 text-zinc-900 focus:border-indigo-500 focus:outline-none dark:border-zinc-750 dark:bg-zinc-800 dark:text-zinc-50"
                  placeholder="Tell us what you think of the app design..."
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none transition-colors cursor-pointer"
              >
                Submit Review
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-850 py-8 bg-white dark:bg-zinc-950">
        <div className="mx-auto max-w-7xl px-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
          &copy; {new Date().getFullYear()} SEAPEDIA. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
