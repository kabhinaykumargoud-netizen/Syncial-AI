'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff, Loader2, Zap, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }
    toast.success('Account created! Check your email to verify.');
    router.push('/login');
  }

  async function handleGoogleSignup() {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      toast.error(error.message);
      setGoogleLoading(false);
    }
  }

  const inputStyle = {
    background: 'var(--surface-2)',
    borderColor: 'var(--border)',
    color: 'var(--foreground)',
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20" style={{ background: 'var(--accent)' }}>
              <Zap className="w-6 h-6 text-white fill-white/20" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight gradient-accent">Syncial</span>
          </div>
          <h1 className="text-4xl font-bold mb-3 tracking-tight text-white">Create your account</h1>
          <p className="text-zinc-400 font-medium">Start managing your social media in minutes</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl">
          <button
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            id="google-signup-btn"
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 border border-white/5 font-medium transition-all duration-300 hover:bg-white/5 hover:scale-[1.01] mb-8 disabled:opacity-60"
            style={{ color: 'var(--foreground)', background: 'rgba(255,255,255,0.03)', borderRadius: '9999px' }}
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            )}
            Continue with Google
          </button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" style={{ borderColor: 'var(--border)' }} />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 text-sm" style={{ background: 'var(--surface)', color: 'var(--muted)' }}>or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2.5 px-1" style={{ color: 'var(--muted)' }}>Full Name</label>
              <div 
                className="flex items-center w-full px-4 py-3.5 border transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border)', borderRadius: '16px' }}
              >
                <User className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: 'var(--muted)' }} />
                <input
                  id="signup-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
                  style={{ color: 'var(--foreground)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2.5 px-1" style={{ color: 'var(--muted)' }}>Email</label>
              <div 
                className="flex items-center w-full px-4 py-3.5 border transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border)', borderRadius: '16px' }}
              >
                <Mail className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: 'var(--muted)' }} />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
                  style={{ color: 'var(--foreground)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2.5 px-1" style={{ color: 'var(--muted)' }}>Password</label>
              <div 
                className="flex items-center w-full px-4 py-3.5 border transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500/50"
                style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'var(--border)', borderRadius: '16px' }}
              >
                <Lock className="w-5 h-5 mr-3 flex-shrink-0" style={{ color: 'var(--muted)' }} />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a strong password"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-600"
                  style={{ color: 'var(--foreground)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 flex-shrink-0 transition-colors hover:text-white"
                  style={{ color: 'var(--muted)' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength bar */}
              {password && (
                <div className="mt-2 flex gap-1">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{
                      background: password.length >= i * 2
                        ? i <= 1 ? 'var(--danger)' : i <= 2 ? 'var(--warning)' : i <= 3 ? '#84cc16' : 'var(--success)'
                        : 'var(--border)'
                    }} />
                  ))}
                </div>
              )}
            </div>

            <button
              id="signup-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-4 font-bold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/25 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-3 mt-4 shadow-lg shadow-indigo-500/10"
              style={{ background: 'var(--accent)', borderRadius: '9999px' }}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--muted)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-semibold hover:underline" style={{ color: 'var(--accent)' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
