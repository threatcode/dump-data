'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { FeedPost } from '@/components/FeedPost';
import { Search, Bell, Mail, Settings } from 'lucide-react';

const SAMPLE_POSTS = [
  {
    id: '1',
    author: {
      name: 'Sarah Chen',
      handle: 'sarahchen',
    },
    content:
      'Just launched our new product! Excited to share what we\'ve been working on for months.',
    timestamp: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    likes: 342,
    comments: 45,
    liked: false,
  },
  {
    id: '2',
    author: {
      name: 'James Wilson',
      handle: 'jameswilson',
    },
    content:
      'The future of web development is here. Modern frameworks are making it so much easier to build performant apps.',
    timestamp: '4 hours ago',
    image: undefined,
    likes: 256,
    comments: 32,
    liked: true,
  },
  {
    id: '3',
    author: {
      name: 'Alex Kumar',
      handle: 'alexkumar',
    },
    content:
      'Just finished learning TypeScript. The type safety is incredible and has already caught several bugs in my code!',
    timestamp: '6 hours ago',
    image: undefined,
    likes: 189,
    comments: 28,
    liked: false,
  },
];

export default function FeedPage() {
  return (
    <ProtectedRoute>
      <FeedContent />
    </ProtectedRoute>
  );
}

function FeedContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-primary">Feed</h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-secondary rounded-full px-4 py-2">
              <Search size={18} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none w-48"
              />
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/dashboard" className="text-foreground hover:text-primary transition">
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
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <aside className="hidden lg:block">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="font-bold text-foreground mb-4">What&apos;s happening</h2>
              <div className="space-y-4">
                <div className="p-3 hover:bg-secondary rounded-lg cursor-pointer transition">
                  <p className="text-sm text-muted-foreground">Trending Worldwide</p>
                  <p className="font-bold text-foreground">#ReactJS</p>
                  <p className="text-sm text-muted-foreground">245K posts</p>
                </div>
                <div className="p-3 hover:bg-secondary rounded-lg cursor-pointer transition">
                  <p className="text-sm text-muted-foreground">Technology Trending</p>
                  <p className="font-bold text-foreground">Web Development</p>
                  <p className="text-sm text-muted-foreground">189K posts</p>
                </div>
                <div className="p-3 hover:bg-secondary rounded-lg cursor-pointer transition">
                  <p className="text-sm text-muted-foreground">Entertainment Trending</p>
                  <p className="font-bold text-foreground">Next.js</p>
                  <p className="text-sm text-muted-foreground">156K posts</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Center Feed */}
          <section className="lg:col-span-2">
            {/* Compose Post */}
            <div className="bg-card border border-border rounded-xl p-6 mb-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <textarea
                    placeholder="What's on your mind?"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none h-24"
                  />
                  <div className="mt-4 flex justify-end">
                    <button className="bg-primary text-primary-foreground px-6 py-2 rounded-full font-semibold hover:opacity-90 transition">
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed Posts */}
            <div className="space-y-6">
              {SAMPLE_POSTS.map((post) => (
                <FeedPost key={post.id} {...post} />
              ))}
            </div>
          </section>

          {/* Right Sidebar */}
          <aside className="hidden lg:block">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="font-bold text-foreground mb-4">Suggested for you</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full" />
                    <div>
                      <p className="font-semibold text-sm text-foreground">Maya Patel</p>
                      <p className="text-xs text-muted-foreground">@mayapatel</p>
                    </div>
                  </div>
                  <button className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold hover:opacity-90 transition">
                    Follow
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-full" />
                    <div>
                      <p className="font-semibold text-sm text-foreground">David Lee</p>
                      <p className="text-xs text-muted-foreground">@davidlee</p>
                    </div>
                  </div>
                  <button className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold hover:opacity-90 transition">
                    Follow
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
