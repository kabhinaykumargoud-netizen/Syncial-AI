'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { createClient } from '@/lib/supabase/client';
import { Post, Platform } from '@/types';
import { PLATFORM_CONFIG, PLATFORM_CALENDAR_COLORS, formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { X, Clock, CheckCircle2 } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  backgroundColor: string;
  extendedProps: { post: Post };
}

export default function CalendarPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const supabase = createClient();

  const fetchPosts = useCallback(async () => {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .not('scheduled_time', 'is', null)
      .order('scheduled_time', { ascending: true });
    setPosts(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const events: CalendarEvent[] = posts.map((post) => ({
    id: post.id,
    title: post.content.slice(0, 40) + (post.content.length > 40 ? '…' : ''),
    date: post.scheduled_time!,
    backgroundColor: PLATFORM_CALENDAR_COLORS[post.platform] || '#6c63ff',
    extendedProps: { post },
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Calendar</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
          {posts.length} scheduled post{posts.length !== 1 ? 's' : ''} — color-coded by platform
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {(Object.entries(PLATFORM_CONFIG) as [Platform, (typeof PLATFORM_CONFIG)[Platform]][]).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--muted)' }}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: PLATFORM_CALENDAR_COLORS[key] }} />
            {cfg.label}
          </div>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="Loading calendar…" />
      ) : (
        <div
          className="rounded-2xl border p-4 sm:p-6"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            eventClick={({ event }) => setSelectedPost(event.extendedProps.post as Post)}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek',
            }}
            height="auto"
            eventDisplay="block"
            dayMaxEvents={3}
          />
        </div>
      )}

      {/* Post detail panel */}
      {selectedPost && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedPost(null)}
          />
          <div
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm border-l p-6 overflow-y-auto animate-slide-in flex flex-col gap-5"
            style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg" style={{ color: 'var(--foreground)' }}>Post Details</h2>
              <button
                onClick={() => setSelectedPost(null)}
                className="p-2 rounded-lg transition-colors"
                style={{ color: 'var(--muted)' }}
                id="close-post-detail"
              >
                <X size={18} />
              </button>
            </div>

            {/* Platform */}
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${PLATFORM_CONFIG[selectedPost.platform]?.color} ${PLATFORM_CONFIG[selectedPost.platform]?.bg} ${PLATFORM_CONFIG[selectedPost.platform]?.border}`}>
                {PLATFORM_CONFIG[selectedPost.platform]?.label || selectedPost.platform}
              </span>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              {selectedPost.status === 'pending' ? (
                <><Clock size={14} style={{ color: 'var(--warning)' }} /><span className="text-sm" style={{ color: 'var(--warning)' }}>Scheduled</span></>
              ) : (
                <><CheckCircle2 size={14} className="text-green-400" /><span className="text-sm text-green-400">Published</span></>
              )}
            </div>

            {/* Content */}
            <div className="rounded-xl border p-4 text-sm leading-relaxed" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
              {selectedPost.content}
            </div>

            {/* Date */}
            {selectedPost.scheduled_time && (
              <div className="text-xs" style={{ color: 'var(--muted)' }}>
                <span className="font-semibold" style={{ color: 'var(--foreground)' }}>Scheduled: </span>
                {formatDate(selectedPost.scheduled_time)}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
