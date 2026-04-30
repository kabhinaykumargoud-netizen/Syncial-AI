'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  LayoutDashboard, FileText, Calendar, BarChart2,
  Settings, Zap, LogOut, Menu, X, Plus, ChevronRight,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/posts', label: 'Posts', icon: FileText },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  userEmail?: string;
  userName?: string;
}

export default function Sidebar({ userEmail, userName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success('Signed out');
    router.push('/login');
    router.refresh();
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--accent)' }}>
            <Zap className="w-4.5 h-4.5 text-white" size={18} />
          </div>
          <span className="text-xl font-bold gradient-text">Syncial</span>
        </Link>
      </div>

      {/* New Post quick action */}
      <div className="px-4 py-4">
        <Link
          href="/posts/create"
          onClick={() => setMobileOpen(false)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-[1.02] btn-glow"
          style={{ background: 'var(--accent)' }}
          id="sidebar-new-post"
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              id={`nav-${item.label.toLowerCase()}`}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                active
                  ? 'text-white'
                  : 'hover:text-white'
              )}
              style={{
                background: active ? 'var(--accent)' : 'transparent',
                color: active ? 'white' : 'var(--muted)',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'var(--surface-2)';
                  (e.currentTarget as HTMLElement).style.color = 'var(--foreground)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.color = 'var(--muted)';
                }
              }}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={14} className="opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-4 pb-4 pt-2 border-t mt-2" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2" style={{ background: 'var(--surface-2)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm text-white"
            style={{ background: 'linear-gradient(135deg, var(--accent), #ec4899)' }}>
            {(userName || userEmail || 'U')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: 'var(--foreground)' }}>
              {userName || 'User'}
            </p>
            <p className="text-xs truncate" style={{ color: 'var(--muted)' }}>{userEmail}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          id="logout-btn"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
          style={{ color: 'var(--muted)' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
            (e.currentTarget as HTMLElement).style.color = '#ef4444';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = 'var(--muted)';
          }}
        >
          <LogOut size={16} />
          {loggingOut ? 'Signing out…' : 'Sign Out'}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-64 h-screen sticky top-0 flex-shrink-0 border-r"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile header bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 border-b"
        style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
      >
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-bold gradient-text">Syncial</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--muted)' }}
          id="mobile-menu-btn"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="lg:hidden fixed left-0 top-0 bottom-0 z-40 w-72 border-r animate-slide-in"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}
