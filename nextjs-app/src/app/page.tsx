'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Users, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <div className="text-2xl font-bold text-primary">RingID</div>
          <div className="flex gap-6">
            <Link
              href="/signin"
              className="text-foreground hover:text-primary transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
              Connect with your community
            </h1>
            <p className="text-xl text-muted-foreground">
              Share moments, discover stories, and engage with people who matter.
              Built for the modern web.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
            >
              Start for Free <ArrowRight size={20} />
            </Link>
            <Link
              href="/signin"
              className="inline-flex items-center gap-2 border border-border bg-background text-foreground px-8 py-3 rounded-lg font-semibold hover:bg-secondary transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition">
            <Sparkles className="text-primary mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Discover Content</h3>
            <p className="text-muted-foreground">
              Explore a curated feed of stories, news, and insights from
              creators you follow.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition">
            <Users className="text-primary mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Connect Socially</h3>
            <p className="text-muted-foreground">
              Build meaningful connections through real-time messaging and
              community features.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition">
            <Zap className="text-primary mb-4" size={32} />
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Experience blazing-fast performance on any device with modern web
              technology.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12 mt-20">
        <div className="container text-center text-muted-foreground">
          <p>&copy; 2026 RingID. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
