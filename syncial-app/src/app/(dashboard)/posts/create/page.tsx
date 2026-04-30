'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';
import { Platform } from '@/types';
import { PLATFORM_CONFIG } from '@/lib/utils';
import { ArrowLeft, Send, Clock, Eye, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

const PLATFORMS: Platform[] = ['twitter', 'instagram', 'linkedin', 'facebook', 'tiktok'];
const MAX_CHARS = 500;

export default function CreatePostPage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [scheduledAt, setScheduledAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const supabase = createClient();
  const charsLeft = MAX_CHARS - content.length;

  function togglePlatform(p: Platform) {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) { toast.error('Content cannot be empty'); return; }
    if (selectedPlatforms.length === 0) { toast.error('Select at least one platform'); return; }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const postsToInsert = selectedPlatforms.map(p => ({
        user_id: user.id,
        content: content.trim(),
        platform: p,
        status: 'pending',
        scheduled_time: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      }));

      const { error } = await supabase.from('posts').insert(postsToInsert);

      if (error) throw error;
      toast.success('Post scheduled successfully!');
      router.push('/posts');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to create post');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    background: 'var(--surface-2)',
    borderColor: 'var(--border)',
    color: 'var(--foreground)',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/posts"
          className="p-2 rounded-xl border transition-colors hover:scale-105"
          style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
        >
          <ArrowLeft size={18} style={{ color: 'var(--muted)' }} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>Create Post</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Schedule across multiple platforms at once</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Content */}
        <div className="rounded-2xl border p-5 space-y-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <label className="block text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Post Content</label>
          <div className="relative">
            <textarea
              id="post-content"
              value={content}
              onChange={(e) => setContent(e.target.value.slice(0, MAX_CHARS))}
              placeholder="What's on your mind? Write your post content here..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none transition-all leading-relaxed"
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
            />
            <span
              className="absolute bottom-3 right-3 text-xs font-medium"
              style={{ color: charsLeft < 50 ? 'var(--danger)' : charsLeft < 100 ? 'var(--warning)' : 'var(--muted)' }}
            >
              {charsLeft}
            </span>
          </div>

          {/* Preview toggle */}
          {content && (
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 text-xs font-medium transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              {showPreview ? <X size={12} /> : <Eye size={12} />}
              {showPreview ? 'Hide preview' : 'Preview'}
            </button>
          )}

          {/* Preview */}
          {showPreview && content && (
            <div className="rounded-xl border p-4 text-sm leading-relaxed whitespace-pre-wrap" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
              {content}
            </div>
          )}
        </div>

        {/* Platforms */}
        <div className="rounded-2xl border p-5 space-y-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Target Platforms</label>
            <span className="text-xs" style={{ color: 'var(--muted)' }}>
              {selectedPlatforms.length} selected
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {PLATFORMS.map((p) => {
              const cfg = PLATFORM_CONFIG[p];
              const active = selectedPlatforms.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  id={`platform-${p}`}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-center transition-all duration-200 hover:scale-[1.03] ${active ? `${cfg.color} ${cfg.bg} ${cfg.border}` : ''}`}
                  style={!active ? { background: 'var(--surface-2)', color: 'var(--muted)', borderColor: 'var(--border)' } : {}}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Schedule */}
        <div className="rounded-2xl border p-5 space-y-4" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <Clock size={16} style={{ color: 'var(--accent)' }} />
            <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>Schedule Date & Time</label>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}>Optional</span>
          </div>
          <input
            id="post-schedule"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
          {scheduledAt && (
            <p className="text-xs" style={{ color: 'var(--muted)' }}>
              Scheduled for: <span style={{ color: 'var(--foreground)' }}>{new Date(scheduledAt).toLocaleString()}</span>
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3">
          <Link
            href="/posts"
            className="flex-1 py-3 rounded-xl font-semibold text-sm text-center border transition-all duration-200 hover:scale-[1.01]"
            style={{ borderColor: 'var(--border)', color: 'var(--muted)', background: 'var(--surface)' }}
          >
            Cancel
          </Link>
          <button
            id="post-submit-btn"
            type="submit"
            disabled={loading || !content.trim() || selectedPlatforms.length === 0}
            className="flex-[2] py-3 rounded-xl font-semibold text-sm text-white btn-glow transition-all duration-200 hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: 'var(--accent)' }}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            {loading ? 'Scheduling…' : 'Schedule Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
