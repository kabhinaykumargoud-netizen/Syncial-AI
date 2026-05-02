import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium animate-fade-in"
      style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.1)', color: '#f87171' }}
    >
      <AlertCircle size={18} className="flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
}
