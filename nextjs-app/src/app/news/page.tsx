'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Bookmark, Home, Bell, Mail, Settings, Search, TrendingUp } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All News', count: 2543 },
  { id: 'tech', label: 'Technology', count: 456 },
  { id: 'business', label: 'Business', count: 389 },
  { id: 'science', label: 'Science', count: 267 },
  { id: 'health', label: 'Health', count: 198 },
];

const NEWS_ITEMS = [
  {
    id: '1',
    title: 'Next.js 16 Released with Major Performance Improvements',
    description:
      'The latest version introduces significant performance enhancements with improved build times and runtime optimization.',
    category: 'tech',
    author: 'Tech News Daily',
    timestamp: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=600&h=400&fit=crop',
    saved: false,
  },
  {
    id: '2',
    title: 'Global Tech Companies Report Record Q1 Earnings',
    description:
      'Major technology firms exceeded expectations with strong growth in cloud services and AI products.',
    category: 'business',
    author: 'Business Insider',
    timestamp: '4 hours ago',
    image: 'https://images.unsplash.com/photo-1579532537098-24ec42ed2a49?w=600&h=400&fit=crop',
    saved: false,
  },
  {
    id: '3',
    title: 'New AI Model Breakthrough Shows Promise for Medical Diagnosis',
    description:
      'Researchers announce a breakthrough in artificial intelligence that could revolutionize medical diagnostics.',
    category: 'science',
    author: 'Science Weekly',
    timestamp: '6 hours ago',
    image: 'https://images.unsplash.com/photo-1576091160550-112173f31c77?w=600&h=400&fit=crop',
    saved: false,
  },
  {
    id: '4',
    title: 'Mental Health Apps Show Increasing Adoption Among Millennials',
    description:
      'New study reveals rising trends in digital mental health tools, especially among younger demographics.',
    category: 'health',
    author: 'Health Today',
    timestamp: '8 hours ago',
    image: 'https://images.unsplash.com/photo-1576091160688-112136863adb?w=600&h=400&fit=crop',
    saved: false,
  },
];

export default function NewsPage() {
  return (
    <ProtectedRoute>
      <NewsContent />
    </ProtectedRoute>
  );
}

function NewsContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-primary">News</h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-secondary rounded-full px-4 py-2">
              <Search size={18} className="text-muted-foreground" />
              <input
                type="text"
                placeholder="Search news..."
                className="bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none w-48"
              />
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/feed" className="text-foreground hover:text-primary transition">
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
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <aside className="hidden lg:block">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="font-bold text-foreground mb-4">Categories</h2>
              <div className="space-y-2">
                {CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-secondary transition group"
                  >
                    <p className="font-medium text-foreground group-hover:text-primary transition">
                      {category.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{category.count} articles</p>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main News Feed */}
          <section className="lg:col-span-2">
            {/* Trending */}
            <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 mb-8 text-primary-foreground">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} />
                <span className="text-sm font-semibold">Trending Now</span>
              </div>
              <h2 className="text-2xl font-bold">Latest Technology News</h2>
              <p className="text-primary-foreground/80 mt-2">
                Stay updated with breaking news and innovations from the tech world
              </p>
            </div>

            {/* News Articles */}
            <div className="space-y-6">
              {NEWS_ITEMS.map((article) => (
                <article
                  key={article.id}
                  className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition group cursor-pointer"
                >
                  <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-48 md:h-48 flex-shrink-0 overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
                          {article.category.toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">{article.timestamp}</span>
                      </div>

                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition">
                        {article.title}
                      </h3>

                      <p className="text-muted-foreground text-sm mb-4 flex-1">
                        {article.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{article.author}</span>
                        <button className="text-muted-foreground hover:text-primary transition">
                          <Bookmark size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Right Sidebar */}
          <aside className="hidden lg:block">
            <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
              <h2 className="font-bold text-foreground mb-4">Saved Articles</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Bookmark articles to read them later
              </p>
              <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90 transition">
                View Saved
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
