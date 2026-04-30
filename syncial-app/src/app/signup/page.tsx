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
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: 'var(--background)' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'var(--accent)' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: '#06b6d4' }} />
      </div>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">Syncial</span>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Create your account</h1>
          <p style={{ color: 'var(--muted)' }}>Start managing your social media in minutes</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl">
          <button
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            id="google-signup-btn"
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border font-medium transition-all duration-200 hover:scale-[1.01] mb-6 disabled:opacity-60"
            style={{ borderColor: 'var(--border-hover)', color: 'var(--foreground)', background: 'var(--surface-2)' }}
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
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>Full Name</label>
              <div 
                className="flex items-center w-full px-3 py-3 rounded-xl border transition-all duration-200 focus-within:ring-2"
                style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
              >
                <User className="w-4 h-4 mr-3 flex-shrink-0" style={{ color: 'var(--muted)' }} />
                <input
                  id="signup-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder="John Doe"
                  className="w-full bg-transparent text-sm outline-none"
                  style={{ color: 'var(--foreground)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>Email</label>
              <div 
                className="flex items-center w-full px-3 py-3 rounded-xl border transition-all duration-200 focus-within:ring-2"
                style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
              >
                <Mail className="w-4 h-4 mr-3 flex-shrink-0" style={{ color: 'var(--muted)' }} />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm outline-none"
                  style={{ color: 'var(--foreground)' }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>Password</label>
              <div 
                className="flex items-center w-full px-3 py-3 rounded-xl border transition-all duration-200 focus-within:ring-2"
                style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}
              >
                <Lock className="w-4 h-4 mr-3 flex-shrink-0" style={{ color: 'var(--muted)' }} />
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Create a strong password"
                  className="w-full bg-transparent text-sm outline-none"
                  style={{ color: 'var(--foreground)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 flex-shrink-0 transition-colors"
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
              className="w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 btn-glow flex items-center justify-center gap-2"
              style={{ background: 'var(--accent)' }}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
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
