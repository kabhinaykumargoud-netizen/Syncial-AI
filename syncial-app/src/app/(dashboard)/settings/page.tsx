'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Account, Platform } from '@/types';
import { PLATFORM_CONFIG } from '@/lib/utils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  User, Mail, Link2, Plus, Trash2, Settings as SettingsIcon,
  Shield, Bell, Palette, Loader2,
} from 'lucide-react';

const PLATFORM_ICONS: Record<Platform, string> = {
  twitter: '𝕏',
  instagram: '📷',
  linkedin: 'in',
  facebook: '𝓕',
  tiktok: '♪',
};

export default function SettingsPage() {
  const [user, setUser] = useState<{ email: string; full_name: string; avatar_url: string } | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState('');
  const [addingPlatform, setAddingPlatform] = useState<Platform | null>(null);
  const [newToken, setNewToken] = useState('');

  const supabase = createClient();

  const fetchData = useCallback(async () => {
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) return;
    setUser({
      email: u.email || '',
      full_name: u.user_metadata?.full_name || '',
      avatar_url: u.user_metadata?.avatar_url || '',
    });
    setFullName(u.user_metadata?.full_name || '');

    const { data: accs } = await supabase.from('accounts').select('*').eq('user_id', u.id);
    setAccounts(accs || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });
    if (error) toast.error(error.message);
    else toast.success('Profile updated!');
    setSaving(false);
  }

  async function handleAddAccount() {
    if (!addingPlatform || !newToken.trim()) return;
    const { data: { user: u } } = await supabase.auth.getUser();
    if (!u) return;

    const { error } = await supabase.from('accounts').insert({
      user_id: u.id,
      platform: addingPlatform,
      access_token: newToken.trim(),
    });
    if (error) toast.error(error.message);
    else {
      toast.success(`${PLATFORM_CONFIG[addingPlatform].label} connected!`);
      setAddingPlatform(null);
      setNewToken('');
      fetchData();
    }
  }

  async function handleRemoveAccount(id: string, platform: string) {
    const { error } = await supabase.from('accounts').delete().eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success(`${platform} disconnected`);
      setAccounts((prev) => prev.filter((a) => a.id !== id));
    }
  }

  const inputStyle = {
    background: 'var(--surface-2)',
    borderColor: 'var(--border)',
    color: 'var(--foreground)',
  };

  const sectionCard = (children: React.ReactNode) => (
    <div className="rounded-2xl border p-6 space-y-5" style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}>
      {children}
    </div>
  );

  if (loading) return <LoadingSpinner text="Loading settings…" />;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <SettingsIcon size={26} style={{ color: 'var(--accent)' }} />
        <div>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>Settings</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Manage your account and preferences</p>
        </div>
      </div>

      {/* Profile */}
      {sectionCard(
        <>
          <div className="flex items-center gap-3 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <User size={16} style={{ color: 'var(--accent)' }} />
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Profile</h2>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, var(--accent), #ec4899)' }}
            >
              {(fullName || user?.email || 'U')[0].toUpperCase()}
            </div>
            <div>
              <p className="font-semibold" style={{ color: 'var(--foreground)' }}>{fullName || 'Your Name'}</p>
              <p className="text-sm flex items-center gap-1.5" style={{ color: 'var(--muted)' }}>
                <Mail size={12} /> {user?.email}
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>Display Name</label>
              <input
                id="settings-name"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2.5 rounded-xl border text-sm opacity-50 cursor-not-allowed"
                style={inputStyle}
              />
            </div>
            <button
              id="save-profile-btn"
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-white btn-glow transition-all hover:scale-[1.02] disabled:opacity-60"
              style={{ background: 'var(--accent)' }}
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </form>
        </>
      )}

      {/* Connected Accounts */}
      {sectionCard(
        <>
          <div className="flex items-center gap-3 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <Link2 size={16} style={{ color: 'var(--accent)' }} />
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Connected Accounts</h2>
          </div>

          <div className="space-y-3">
            {accounts.length === 0 && !addingPlatform && (
              <p className="text-sm py-4 text-center" style={{ color: 'var(--muted)' }}>No accounts connected yet</p>
            )}
            {accounts.map((acc) => {
              const cfg = PLATFORM_CONFIG[acc.platform as Platform];
              return (
                <div
                  key={acc.id}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: 'var(--surface-2)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold ${cfg?.color || ''} ${cfg?.bg || ''}`}>
                      {PLATFORM_ICONS[acc.platform as Platform] || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{cfg?.label || acc.platform}</p>
                      <p className="text-xs truncate max-w-[150px]" style={{ color: 'var(--muted)' }}>Token: {acc.access_token}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveAccount(acc.id, cfg?.label || acc.platform)}
                    className="p-2 rounded-lg transition-all hover:scale-110"
                    style={{ color: 'var(--danger)' }}
                    id={`disconnect-${acc.platform}`}
                    title="Disconnect"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              );
            })}

            {/* Add account form */}
            {addingPlatform ? (
              <div className="p-4 rounded-xl border space-y-3" style={{ background: 'var(--surface-2)', borderColor: 'var(--border)' }}>
                <p className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                  Connect {PLATFORM_CONFIG[addingPlatform]?.label}
                </p>
                <input
                  id="new-account-token"
                  type="text"
                  placeholder="Access Token (mock)"
                  value={newToken}
                  onChange={(e) => setNewToken(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddAccount()}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => { setAddingPlatform(null); setNewToken(''); }}
                    className="flex-1 py-2 rounded-xl text-sm font-medium border"
                    style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddAccount}
                    id="confirm-add-account"
                    className="flex-1 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: 'var(--accent)' }}
                  >
                    Connect
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                {(['twitter', 'instagram', 'linkedin', 'facebook', 'tiktok'] as Platform[]).map((p) => {
                  const cfg = PLATFORM_CONFIG[p];
                  const connected = accounts.some((a) => a.platform === p);
                  return (
                    <button
                      key={p}
                      id={`add-${p}`}
                      onClick={() => !connected && setAddingPlatform(p)}
                      disabled={connected}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all duration-200 ${connected ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.03]'} ${cfg.color} ${cfg.bg} ${cfg.border}`}
                    >
                      <Plus size={12} />
                      {cfg.label}
                      {connected && <span className="ml-auto text-green-400">✓</span>}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Preferences */}
      {sectionCard(
        <>
          <div className="flex items-center gap-3 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <Palette size={16} style={{ color: 'var(--accent)' }} />
            <h2 className="font-semibold" style={{ color: 'var(--foreground)' }}>Preferences</h2>
          </div>
          {[
            { icon: <Bell size={16} />, label: 'Email notifications', desc: 'Get notified when posts are published', id: 'notif-email' },
            { icon: <Shield size={16} />, label: 'Two-factor authentication', desc: 'Add an extra layer of security', id: 'notif-2fa' },
          ].map((pref) => (
            <div key={pref.id} className="flex items-center justify-between gap-4 py-1">
              <div className="flex items-center gap-3">
                <div style={{ color: 'var(--muted)' }}>{pref.icon}</div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>{pref.label}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>{pref.desc}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer" id={pref.id}>
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:w-5 after:h-5 after:rounded-full after:transition-all"
                  style={{
                    background: 'var(--surface-2)',
                  }}
                />
                <style>{`
                  label[id="${pref.id}"] div {
                    background: var(--surface-2);
                  }
                  label[id="${pref.id}"] input:checked + div {
                    background: var(--accent);
                  }
                  label[id="${pref.id}"] div::after {
                    background: white;
                  }
                `}</style>
              </label>
            </div>
          ))}
        </>
      )}

      {/* Danger Zone */}
      {sectionCard(
        <>
          <div className="flex items-center gap-3 pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <Shield size={16} style={{ color: 'var(--danger)' }} />
            <h2 className="font-semibold" style={{ color: 'var(--danger)' }}>Danger Zone</h2>
          </div>
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--foreground)' }}>Delete Account</p>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Permanently remove your account and all data</p>
            </div>
            <button
              id="delete-account-btn"
              className="px-4 py-2 rounded-xl text-sm font-semibold border transition-all hover:scale-[1.02]"
              style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
              onClick={() => toast.error('Contact support to delete your account')}
            >
              Delete Account
            </button>
          </div>
        </>
      )}
    </div>
  );
}
