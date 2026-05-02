import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  const sizeMap = { sm: 16, md: 24, lg: 40 };
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 animate-fade-in">
      <Loader2
        size={sizeMap[size]}
        className="animate-spin text-indigo-500"
      />
      {text && <p className="text-sm font-medium text-zinc-500">{text}</p>}
    </div>
  );
}
