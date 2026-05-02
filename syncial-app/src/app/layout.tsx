import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Syncial — Social Media Management Dashboard',
  description: 'Manage, schedule, and analyze your social media posts from one powerful dashboard.',
  keywords: 'social media, scheduling, analytics, twitter, instagram, linkedin',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased selection:bg-indigo-500/30`}>
        <div className="noise-overlay" />
        <div className="nebula-container">
          <div className="nebula-glow nebula-primary" />
          <div className="nebula-glow nebula-secondary" />
        </div>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--surface-2)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  );
}
