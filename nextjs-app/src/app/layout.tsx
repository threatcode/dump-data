import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'RingID - Connect, Share & Discover',
    template: '%s | RingID',
  },
  description:
    'RingID is a modern social platform for connecting with friends, sharing moments, and discovering news and trends.',
  keywords: [
    'social network',
    'messaging',
    'news feed',
    'community',
    'connection',
  ],
  authors: [{ name: 'RingID Team' }],
  creator: 'RingID',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ringid.app',
    title: 'RingID - Connect, Share & Discover',
    description:
      'Modern social platform for connecting and discovering content',
    siteName: 'RingID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RingID - Connect, Share & Discover',
    description:
      'Modern social platform for connecting and discovering content',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification-code',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#EF4444',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-background">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
