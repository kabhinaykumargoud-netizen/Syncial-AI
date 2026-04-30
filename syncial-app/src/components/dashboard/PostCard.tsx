import { Post } from '@/types';
import { PLATFORM_CONFIG, formatDate, formatRelative } from '@/lib/utils';
import { Clock, CheckCircle2, ImageIcon } from 'lucide-react';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const isPending = post.status === 'pending';

  return (
    <div
      className="rounded-2xl border p-5 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg group"
      style={{
        background: 'var(--surface)',
        borderColor: 'var(--border)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-hover)')}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
    >
      {/* Header: platform + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${PLATFORM_CONFIG[post.platform]?.color} ${PLATFORM_CONFIG[post.platform]?.bg} ${PLATFORM_CONFIG[post.platform]?.border}`}
          >
            {PLATFORM_CONFIG[post.platform]?.label || post.platform}
          </span>
        </div>
        <span
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
            isPending
              ? 'bg-amber-400/10 text-amber-400 border border-amber-400/30'
              : 'bg-green-400/10 text-green-400 border border-green-400/30'
          }`}
        >
          {isPending ? <Clock size={11} /> : <CheckCircle2 size={11} />}
          {isPending ? 'Pending' : 'Posted'}
        </span>
      </div>

      {/* Content */}
      <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--foreground)' }}>
        {post.content}
      </p>

      {/* Image indicator */}
      {post.image_url && (
        <div
          className="flex items-center gap-2 text-xs rounded-lg px-3 py-2"
          style={{ background: 'var(--surface-2)', color: 'var(--muted)' }}
        >
          <ImageIcon size={12} />
          <span>Image attached</span>
        </div>
      )}

      {/* Footer: dates */}
      <div className="flex items-center justify-between text-xs pt-1 border-t" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
        <span>Created {formatRelative(post.created_at)}</span>
        {post.scheduled_time && (
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {formatDate(post.scheduled_time)}
          </span>
        )}
      </div>
    </div>
  );
}
