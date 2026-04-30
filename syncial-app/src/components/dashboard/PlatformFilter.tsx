import { Platform } from '@/types';
import { PLATFORM_CONFIG } from '@/lib/utils';
import { cn } from '@/lib/utils';

const ALL_PLATFORMS: Platform[] = ['twitter', 'instagram', 'linkedin', 'facebook', 'tiktok'];

interface PlatformFilterProps {
  selected: Platform | 'all';
  onChange: (value: Platform | 'all') => void;
}

export default function PlatformFilter({ selected, onChange }: PlatformFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange('all')}
        id="filter-all"
        className={cn(
          'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200',
          selected === 'all' ? 'text-white border-transparent' : 'border-transparent'
        )}
        style={
          selected === 'all'
            ? { background: 'var(--accent)', color: 'white' }
            : { background: 'var(--surface-2)', color: 'var(--muted)', borderColor: 'var(--border)' }
        }
      >
        All Platforms
      </button>
      {ALL_PLATFORMS.map((p) => {
        const cfg = PLATFORM_CONFIG[p];
        const active = selected === p;
        return (
          <button
            key={p}
            onClick={() => onChange(p)}
            id={`filter-${p}`}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200',
              active ? `${cfg.color} ${cfg.bg} ${cfg.border}` : ''
            )}
            style={
              !active
                ? { background: 'var(--surface-2)', color: 'var(--muted)', borderColor: 'var(--border)' }
                : {}
            }
          >
            {cfg.label}
          </button>
        );
      })}
    </div>
  );
}
