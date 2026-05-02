'use client';

import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

interface FeedPostProps {
  id: string;
  author: {
    name: string;
    avatar?: string;
    handle: string;
  };
  content: string;
  timestamp: string;
  image?: string;
  likes: number;
  comments: number;
  liked?: boolean;
}

export function FeedPost({
  author,
  content,
  timestamp,
  image,
  likes,
  comments,
  liked = false,
}: FeedPostProps) {
  return (
    <article className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {author.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{author.name}</h3>
            <p className="text-sm text-muted-foreground">@{author.handle}</p>
          </div>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition">
          <MoreHorizontal size={20} />
        </button>
      </div>

      {/* Content */}
      <p className="text-foreground mb-4 leading-relaxed">{content}</p>

      {/* Image */}
      {image && (
        <div className="mb-4 rounded-lg overflow-hidden bg-secondary">
          <img
            src={image}
            alt="Post"
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Timestamp */}
      <p className="text-xs text-muted-foreground mb-4">{timestamp}</p>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition group">
          <div className="p-2 group-hover:bg-secondary rounded-full transition">
            <MessageCircle size={18} />
          </div>
          <span className="text-sm">{comments}</span>
        </button>

        <button
          className={`flex items-center gap-2 transition group ${
            liked
              ? 'text-red-500'
              : 'text-muted-foreground hover:text-red-500'
          }`}
        >
          <div className="p-2 group-hover:bg-red-50 rounded-full transition">
            <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
          </div>
          <span className="text-sm">{likes}</span>
        </button>

        <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition group">
          <div className="p-2 group-hover:bg-secondary rounded-full transition">
            <Share2 size={18} />
          </div>
        </button>
      </div>
    </article>
  );
}
