export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FileText, Clock, CheckCircle2, Users, Plus, ArrowRight, TrendingUp } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import PostCard from '@/components/dashboard/PostCard';
import { Post } from '@/types';

async function getDashboardData(userId: string) {
  const supabase = await createClient();

  const [postsResult, accountsResult, analyticsResult] = await Promise.all([
    supabase.from('posts').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(6),
    supabase.from('accounts').select('*').eq('user_id', userId),
    supabase.from('analytics').select('likes, comments, shares, posts!inner(user_id)').eq('posts.user_id', userId),
  ]);

  return {
    posts: (postsResult.data || []) as Post[],
    totalPosts: postsResult.data?.length || 0,
    pendingPosts: postsResult.data?.filter((p) => p.status === 'pending').length || 0,
    postedPosts: postsResult.data?.filter((p) => p.status === 'posted').length || 0,
    connectedAccounts: accountsResult.data?.length || 0,
    totalEngagement: (analyticsResult.data || []).reduce(
      (sum, a) => sum + (a.likes || 0) + (a.comments || 0) + (a.shares || 0), 0
    ),
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const data = await getDashboardData(user.id);
  const userName = (user.user_metadata?.full_name as string)?.split(' ')[0] || 'there';

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
            {greeting()}, {userName} 👋
          </h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            Here&apos;s what&apos;s happening with your social media today.
          </p>
        </div>
        <Link
          href="/posts/create"
          id="dashboard-new-post"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm text-white btn-glow transition-all duration-200 hover:scale-[1.02]"
          style={{ background: 'var(--accent)' }}
        >
          <Plus size={16} />
          New Post
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard title="Total Posts" value={data.totalPosts} icon={<FileText size={22} />} color="#6c63ff" />
        <StatsCard title="Scheduled" value={data.pendingPosts} icon={<Clock size={22} />} color="#f59e0b" />
        <StatsCard title="Published" value={data.postedPosts} icon={<CheckCircle2 size={22} />} color="#22c55e" />
        <StatsCard title="Total Engagement" value={data.totalEngagement.toLocaleString()} icon={<TrendingUp size={22} />} color="#ec4899" />
      </div>

      {/* Recent Posts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>Recent Posts</h2>
          <Link
            href="/posts"
            className="flex items-center gap-1 text-sm font-medium transition-colors hover:underline"
            style={{ color: 'var(--accent)' }}
          >
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {data.posts.length === 0 ? (
          <div
            className="rounded-2xl border border-dashed p-12 text-center"
            style={{ borderColor: 'var(--border)' }}
          >
            <FileText size={40} className="mx-auto mb-4 opacity-30" style={{ color: 'var(--muted)' }} />
            <p className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>No posts yet</p>
            <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>Create your first post to get started</p>
            <Link
              href="/posts/create"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white btn-glow"
              style={{ background: 'var(--accent)' }}
            >
              <Plus size={14} /> Create Post
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

      {/* Connected Accounts Banner */}
      {data.connectedAccounts === 0 && (
        <div
          className="rounded-2xl border p-5 flex items-center justify-between gap-4 flex-wrap"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(108,99,255,0.15)' }}>
              <Users size={20} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p className="font-semibold text-sm" style={{ color: 'var(--foreground)' }}>Connect your accounts</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Link your social profiles to start scheduling</p>
            </div>
          </div>
          <Link
            href="/settings"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 hover:scale-[1.02]"
            style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}
          >
            Connect <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
}
