'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LogOut, Home, Bell, Mail, Settings } from 'lucide-react';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

function DashboardContent() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold text-primary">RingID</div>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-foreground hover:text-primary transition">
              <Home size={20} />
            </Link>
            <button className="text-foreground hover:text-primary transition">
              <Bell size={20} />
            </button>
            <button className="text-foreground hover:text-primary transition">
              <Mail size={20} />
            </button>
            <Link href="/settings" className="text-foreground hover:text-primary transition">
              <Settings size={20} />
            </Link>
            <button
              onClick={logout}
              className="text-foreground hover:text-primary transition"
            >
              <LogOut size={20} />
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <aside className="md:col-span-1">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-accent rounded-full mx-auto mb-4" />
                <h2 className="text-xl font-bold text-foreground">
                  {user?.user_metadata?.full_name || 'User'}
                </h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>

              <div className="space-y-2">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition"
                >
                  My Profile
                </Link>
                <Link
                  href="/news"
                  className="block px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition"
                >
                  News Feed
                </Link>
                <Link
                  href="/chat"
                  className="block px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition"
                >
                  Messages
                </Link>
                <Link
                  href="/saved"
                  className="block px-4 py-2 text-foreground hover:bg-secondary rounded-lg transition"
                >
                  Saved Items
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Feed */}
          <section className="md:col-span-2">
            <div className="space-y-6">
              {/* Welcome Card */}
              <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-8 text-primary-foreground">
                <h1 className="text-3xl font-bold mb-2">Welcome back!</h1>
                <p>Start your day by connecting with your community</p>
              </div>

              {/* Feature Cards */}
              <div className="grid gap-4">
                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition">
                  <h3 className="text-lg font-bold text-foreground mb-2">Discover News</h3>
                  <p className="text-muted-foreground mb-4">
                    Explore curated articles and stories from creators you follow
                  </p>
                  <Link
                    href="/news"
                    className="text-primary font-semibold hover:underline"
                  >
                    Browse News →
                  </Link>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition">
                  <h3 className="text-lg font-bold text-foreground mb-2">Chat with Friends</h3>
                  <p className="text-muted-foreground mb-4">
                    Send messages and stay connected with your network in real-time
                  </p>
                  <Link
                    href="/chat"
                    className="text-primary font-semibold hover:underline"
                  >
                    Open Chat →
                  </Link>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition">
                  <h3 className="text-lg font-bold text-foreground mb-2">Update Profile</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete your profile to help others connect with you
                  </p>
                  <Link
                    href="/profile"
                    className="text-primary font-semibold hover:underline"
                  >
                    Edit Profile →
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
