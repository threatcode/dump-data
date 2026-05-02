import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RingID - Modern Social Platform',
  description: 'Connect, share, and engage with your community',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
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
