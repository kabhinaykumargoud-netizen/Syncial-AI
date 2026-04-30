import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Platform } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PLATFORM_CONFIG: Record<Platform, { label: string; color: string; bg: string; border: string }> = {
  twitter: {
    label: 'X / Twitter',
    color: 'text-sky-400',
    bg: 'bg-sky-400/10',
    border: 'border-sky-400/30',
  },
  instagram: {
    label: 'Instagram',
    color: 'text-pink-400',
    bg: 'bg-pink-400/10',
    border: 'border-pink-400/30',
  },
  linkedin: {
    label: 'LinkedIn',
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/30',
  },
  facebook: {
    label: 'Facebook',
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10',
    border: 'border-indigo-400/30',
  },
  tiktok: {
    label: 'TikTok',
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/30',
  },
};

export const PLATFORM_CALENDAR_COLORS: Record<Platform, string> = {
  twitter: '#38bdf8',
  instagram: '#f472b6',
  linkedin: '#60a5fa',
  facebook: '#818cf8',
  tiktok: '#c084fc',
};

export function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelative(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
