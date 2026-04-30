'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Analytics, Platform } from '@/types';
import { PLATFORM_CONFIG } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorMessage from '@/components/ui/ErrorMessage';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { Heart, MessageCircle, Share2, Eye, TrendingUp } from 'lucide-react';

// Seed data to populate analytics if empty
const SEED_DATA = [
  { platform: 'twitter', likes: 142, comments: 38, shares: 62 },
  { platform: 'instagram', likes: 310, comments: 87, shares: 45 },
  { platform: 'linkedin', likes: 89, comments: 24, shares: 31 },
  { platform: 'facebook', likes: 56, comments: 12, shares: 18 },
  { platform: 'tiktok', likes: 520, comments: 130, shares: 210 },
];

const WEEK_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function generateWeeklyData() {
  return WEEK_LABELS.map((day) => ({
    day,
    likes: Math.floor(Math.random() * 200) + 50,
    comments: Math.floor(Math.random() * 80) + 10,
    shares: Math.floor(Math.random() * 60) + 5,
  }));
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="rounded-xl border p-3 text-sm shadow-xl" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
      <p className="font-semibold mb-2" style={{ color: 'var(--foreground)' }}>{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }}>
          {entry.name}: <span className="font-bold">{entry.value.toLocaleString()}</span>
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<(Analytics & { platform?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weeklyData] = useState(generateWeeklyData);
  const supabase = createClient();

  const fetchAnalytics = useCallback(async () => {
    try {
      const { data, error: err } = await supabase.from('analytics').select('*, posts!inner(platform)');
      if (err) throw err;
      
      const formatted = (data || []).map((item: any) => ({
        ...item,
        platform: item.posts.platform
      }));
      setAnalytics(formatted);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => { fetchAnalytics(); }, [fetchAnalytics]);

  // Merge real data with seed data for display
  const displayData = SEED_DATA.map((seed) => {
    const real = analytics.filter((a) => a.platform === seed.platform);
    if (real.length > 0) {
      return {
        ...seed,
        likes: real.reduce((s, a) => s + a.likes, 0),
        comments: real.reduce((s, a) => s + a.comments, 0),
        shares: real.reduce((s, a) => s + a.shares, 0),
      };
    }
    return seed;
  });

  const totals = displayData.reduce(
    (acc, d) => ({
      likes: acc.likes + d.likes,
      comments: acc.comments + d.comments,
      shares: acc.shares + d.shares,
    }),
    { likes: 0, comments: 0, shares: 0 }
  );

  const platformChartData = displayData.map((d) => ({
    name: PLATFORM_CONFIG[d.platform as Platform]?.label || d.platform,
    likes: d.likes,
    comments: d.comments,
    shares: d.shares,
  }));

  const statCards = [
    { label: 'Total Likes', value: totals.likes, icon: <Heart size={20} />, color: '#f43f5e' },
    { label: 'Comments', value: totals.comments, icon: <MessageCircle size={20} />, color: '#6c63ff' },
    { label: 'Shares', value: totals.shares, icon: <Share2 size={20} />, color: '#22c55e' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <TrendingUp size={28} style={{ color: 'var(--accent)' }} />
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Analytics</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Track your content performance across platforms</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}
      {loading ? (
        <LoadingSpinner text="Loading analytics…" />
      ) : (
        <>
          {/* Totals */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {statCards.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border p-5 flex items-start justify-between gap-4 transition-all hover:-translate-y-0.5"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                <div>
                  <p className="text-xs font-medium mb-1" style={{ color: 'var(--muted)' }}>{s.label}</p>
                  <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>{s.value.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.color + '20', color: s.color }}>
                  {s.icon}
                </div>
              </div>
            ))}
          </div>

          {/* Weekly Engagement Line Chart */}
          <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h2 className="text-base font-semibold mb-6" style={{ color: 'var(--foreground)' }}>Weekly Engagement</h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={weeklyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: 'var(--muted)', fontSize: '12px' }} />
                <Line type="monotone" dataKey="likes" stroke="#f43f5e" strokeWidth={2.5} dot={{ fill: '#f43f5e', r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="comments" stroke="#6c63ff" strokeWidth={2.5} dot={{ fill: '#6c63ff', r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="shares" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Breakdown Bar Chart */}
          <div className="rounded-2xl border p-6" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
            <h2 className="text-base font-semibold mb-6" style={{ color: 'var(--foreground)' }}>Platform Breakdown</h2>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={platformChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fill: 'var(--muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ color: 'var(--muted)', fontSize: '12px' }} />
                <Bar dataKey="likes" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="comments" fill="#6c63ff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="shares" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Per-platform cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {displayData.map((d) => {
              const cfg = PLATFORM_CONFIG[d.platform as Platform];
              if (!cfg) return null;
              return (
                <div key={d.platform} className="rounded-2xl border p-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
                  <div className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold border mb-4 ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                    {cfg.label}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Likes', value: d.likes, color: '#f43f5e' },
                      { label: 'Comments', value: d.comments, color: '#6c63ff' },
                      { label: 'Shares', value: d.shares, color: '#22c55e' },
                    ].map((m) => (
                      <div key={m.label} className="rounded-xl p-3" style={{ background: 'var(--surface-2)' }}>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>{m.label}</p>
                        <p className="text-lg font-bold mt-0.5" style={{ color: m.color }}>{m.value.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
