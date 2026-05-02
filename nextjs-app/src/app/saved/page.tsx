'use client';

import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Bookmark, Search, Filter, ArrowLeft } from 'lucide-react';

const SAVED_ARTICLES = [
  {
    id: '1',
    title: 'The Future of Social Networks',
    author: 'Sarah Chen',
    category: 'Technology',
    excerpt:
      'Exploring how decentralized networks are changing the social media landscape.',
    timestamp: '2 days ago',
    readTime: '5 min read',
    image: 'https://via.placeholder.com/400x200?text=Technology',
  },
  {
    id: '2',
    title: 'Top 10 Web Development Trends',
    author: 'Alex Rivera',
    category: 'Development',
    excerpt:
      'Latest trends shaping the future of web development in 2026.',
    timestamp: '1 week ago',
    readTime: '8 min read',
    image: 'https://via.placeholder.com/400x200?text=Development',
  },
  {
    id: '3',
    title: 'Artificial Intelligence in Daily Life',
    author: 'Dr. James Park',
    category: 'AI',
    excerpt:
      'How AI is becoming an integral part of our everyday routines.',
    timestamp: '2 weeks ago',
    readTime: '6 min read',
    image: 'https://via.placeholder.com/400x200?text=AI',
  },
];

export default function SavedPage() {
  return (
    <ProtectedRoute>
      <SavedContent />
    </ProtectedRoute>
  );
}

function SavedContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container flex items-center justify-between py-4">
          <Link href="/dashboard" className="flex items-center gap-2 text-foreground hover:text-primary transition">
            <ArrowLeft size={20} />
            <span>Back</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Saved Items</h1>
          <div className="w-12" />
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Search and Filter */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <input
              type="text"
              placeholder="Search saved items..."
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="px-4 py-2 border border-border rounded-lg bg-card text-foreground hover:bg-secondary transition flex items-center gap-2">
            <Filter size={20} />
            Filter
          </button>
        </div>

        {/* Saved Items List */}
        <div className="space-y-4">
          {SAVED_ARTICLES.map((article) => (
            <article
              key={article.id}
              className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition flex gap-6"
            >
              {/* Image */}
              <div className="w-32 h-32 bg-secondary rounded-lg flex-shrink-0 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <button className="text-primary hover:bg-secondary rounded-lg p-2 transition">
                    <Bookmark size={20} fill="currentColor" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-muted-foreground mb-4 line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex gap-4">
                    <span>By {article.author}</span>
                    <span>{article.readTime}</span>
                  </div>
                  <span>{article.timestamp}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {SAVED_ARTICLES.length === 0 && (
          <div className="text-center py-12">
            <Bookmark size={48} className="text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              No Saved Items Yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Save articles and content to read later
            </p>
            <Link
              href="/news"
              className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
            >
              Browse News
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
