import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeMap = { sm: 16, md: 24, lg: 40 };
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2
        size={sizeMap[size]}
        className="animate-spin"
        style={{ color: 'var(--accent)' }}
      />
      {text && <p className="text-sm" style={{ color: 'var(--muted)' }}>{text}</p>}
    </div>
  );
}
