'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ArrowLeft, ToggleLeft, Bell, Lock, Eye, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}

function SettingsContent() {
  const router = useRouter();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-foreground hover:text-primary transition"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Account</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
                <button className="text-primary hover:underline text-sm font-semibold">
                  Change
                </button>
              </div>

              <div className="flex items-center justify-between py-4 border-b border-border">
                <div>
                  <p className="font-medium text-foreground">Password</p>
                  <p className="text-sm text-muted-foreground">
                    Last changed 3 months ago
                  </p>
                </div>
                <button className="text-primary hover:underline text-sm font-semibold">
                  Update
                </button>
              </div>

              <div className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Enhance account security
                  </p>
                </div>
                <button className="text-primary hover:underline text-sm font-semibold">
                  Enable
                </button>
              </div>
            </div>
          </div>

          {/* Privacy & Safety */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Privacy & Safety</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Eye size={20} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Profile Visibility</p>
                    <p className="text-sm text-muted-foreground">Public</p>
                  </div>
                </div>
                <ToggleLeft size={20} className="text-primary" />
              </div>

              <div className="flex items-center justify-between py-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Private Messages</p>
                    <p className="text-sm text-muted-foreground">Anyone can message you</p>
                  </div>
                </div>
                <ToggleLeft size={20} className="text-primary" />
              </div>

              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">Show Activity Status</p>
                    <p className="text-sm text-muted-foreground">
                      Let others see when you&apos;re online
                    </p>
                  </div>
                </div>
                <ToggleLeft size={20} className="text-primary" />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Notifications</h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 py-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-border"
                />
                <span className="text-foreground">Email notifications</span>
              </label>

              <label className="flex items-center gap-3 py-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-border"
                />
                <span className="text-foreground">Push notifications</span>
              </label>

              <label className="flex items-center gap-3 py-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-border"
                />
                <span className="text-foreground">Message notifications</span>
              </label>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-xl font-bold text-red-700 mb-6">Danger Zone</h2>

            <div className="space-y-4">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition">
                <Trash2 size={20} />
                <div className="text-left">
                  <p className="font-semibold">Delete Account</p>
                  <p className="text-sm">Permanently delete your account and all data</p>
                </div>
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-700 hover:bg-red-800 text-white rounded-lg font-semibold transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
