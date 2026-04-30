'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Search } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Post, Platform } from '@/types';
import PostCard from '@/components/dashboard/PostCard';
import PlatformFilter from '@/components/dashboard/PlatformFilter';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [platformFilter, setPlatformFilter] = useState<Platform | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'posted'>('all');
  const [search, setSearch] = useState('');

  const supabase = createClient();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase.from('posts').select('*').order('created_at', { ascending: false });
      if (platformFilter !== 'all') query = query.eq('platform', platformFilter);
      if (statusFilter !== 'all') query = query.eq('status', statusFilter);
      const { data, error: err } = await query;
      if (err) throw err;
      setPosts(data || []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  }, [platformFilter, statusFilter, supabase]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('posts-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, fetchPosts)
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [supabase, fetchPosts]);

  const filtered = posts.filter((p) =>
    p.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Posts</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            {posts.length} post{posts.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link
          href="/posts/create"
          id="posts-new-post-btn"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white btn-glow transition-all duration-200 hover:scale-[1.02]"
          style={{ background: 'var(--accent)' }}
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border p-4 space-y-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
          <input
            id="posts-search"
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
            style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* Status filter */}
        <div className="flex gap-2 flex-wrap">
          {(['all', 'pending', 'posted'] as const).map((s) => (
            <button
              key={s}
              id={`status-filter-${s}`}
              onClick={() => setStatusFilter(s)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold border capitalize transition-all duration-200"
              style={
                statusFilter === s
                  ? { background: 'var(--accent)', color: 'white', borderColor: 'transparent' }
                  : { background: 'var(--surface-2)', color: 'var(--muted)', borderColor: 'var(--border)' }
              }
            >
              {s === 'all' ? 'All Status' : s}
            </button>
          ))}
        </div>

        <PlatformFilter selected={platformFilter} onChange={setPlatformFilter} />
      </div>

      {/* Content */}
      {error && <ErrorMessage message={error} />}
      {loading ? (
        <LoadingSpinner text="Loading posts…" />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center" style={{ borderColor: 'var(--border)' }}>
          <p className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>No posts found</p>
          <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
            {search ? 'Try a different search term' : 'Create your first post'}
          </p>
          {!search && (
            <Link
              href="/posts/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'var(--accent)' }}
            >
              <Plus size={14} /> Create Post
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
