'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Send, Search, Bell, Settings, Plus } from 'lucide-react';

const CONVERSATIONS = [
  {
    id: '1',
    name: 'Sarah Chen',
    lastMessage: 'Sounds great! Let&apos;s meet up soon',
    timestamp: '2 min ago',
    unread: true,
  },
  {
    id: '2',
    name: 'James Wilson',
    lastMessage: 'Thanks for sharing that article!',
    timestamp: '1 hour ago',
    unread: false,
  },
  {
    id: '3',
    name: 'Alex Kumar',
    lastMessage: 'Did you see the new design updates?',
    timestamp: '3 hours ago',
    unread: false,
  },
  {
    id: '4',
    name: 'Maya Patel',
    lastMessage: 'Count me in for the meetup',
    timestamp: 'yesterday',
    unread: false,
  },
];

const MESSAGES = [
  {
    id: '1',
    sender: 'Sarah Chen',
    content: 'Hey! How are you doing?',
    timestamp: '10:30 AM',
    isOwn: false,
  },
  {
    id: '2',
    sender: 'You',
    content: 'Great! Just finished the project',
    timestamp: '10:31 AM',
    isOwn: true,
  },
  {
    id: '3',
    sender: 'Sarah Chen',
    content: 'That&apos;s awesome! Want to grab coffee later?',
    timestamp: '10:32 AM',
    isOwn: false,
  },
  {
    id: '4',
    sender: 'You',
    content: 'Sounds great! Let&apos;s meet up soon',
    timestamp: '10:33 AM',
    isOwn: true,
  },
];

export default function ChatPage() {
  return (
    <ProtectedRoute>
      <ChatContent />
    </ProtectedRoute>
  );
}

function ChatContent() {
  const [selectedConversation, setSelectedConversation] = useState(CONVERSATIONS[0]);
  const [messageText, setMessageText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim()) {
      setMessageText('');
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - Conversations */}
      <aside className="w-full md:w-80 border-r border-border bg-card flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Messages</h1>
            <button className="p-2 hover:bg-secondary rounded-full transition">
              <Plus size={20} />
            </button>
          </div>
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-3 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {CONVERSATIONS.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation)}
              className={`w-full text-left px-6 py-4 border-b border-border hover:bg-secondary transition ${
                selectedConversation.id === conversation.id ? 'bg-secondary' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`font-semibold ${
                    conversation.unread
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {conversation.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {conversation.timestamp}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate">
                {conversation.lastMessage}
              </p>
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <main className="hidden md:flex flex-1 flex-col">
        {/* Chat Header */}
        <div className="border-b border-border bg-card p-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {selectedConversation.name}
            </h2>
            <p className="text-sm text-muted-foreground">Active now</p>
          </div>
          <nav className="flex items-center gap-4">
            <button className="text-foreground hover:text-primary transition">
              <Bell size={20} />
            </button>
            <Link href="/settings" className="text-foreground hover:text-primary transition">
              <Settings size={20} />
            </Link>
          </nav>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {MESSAGES.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isOwn
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-secondary text-foreground rounded-bl-none'
                }`}
              >
                <p>{message.content}</p>
                <p className="text-xs mt-1 opacity-70">{message.timestamp}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <form
          onSubmit={handleSendMessage}
          className="border-t border-border bg-card p-6"
        >
          <div className="flex gap-4">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground p-3 rounded-lg hover:opacity-90 transition"
            >
              <Send size={20} />
            </button>
          </div>
        </form>
      </main>

      {/* Mobile Placeholder */}
      <div className="md:hidden flex-1 flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-center">
          Select a conversation to start messaging
        </p>
      </div>
    </div>
  );
}
