'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  User,
  Sliders,
  Code2,
  Bell,
  Shield,
  Trash2,
  LogOut,
  Save,
  Check,
  AlertCircle,
  Sparkles,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { apiClient } from '@/lib/api-client';

type TabKey = 'account' | 'appearance' | 'learning' | 'editor' | 'notifications' | 'privacy' | 'danger';

export default function SettingsPage() {
  const router = useRouter();
  const { user, profile, logout, refreshUserData } = useAuth();

  const [activeTab, setActiveTab] = useState<TabKey>('account');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [accountForm, setAccountForm] = useState({
    fullName: '',
    headline: '',
    bio: '',
  });

  const [settingsForm, setSettingsForm] = useState({
    theme: 'dark',
    preferred_language: 'python',
    default_difficulty: 'Easy',
    daily_goal: 5,
    email_notifications: true,
    achievement_notifications: true,
    daily_reminders: true,
    weekly_progress_summary: true,
    profile_visibility: 'public',
    show_achievements: true,
    show_activity: true,
    editor_font_size: 14,
    editor_theme: 'vs-dark',
    tab_size: 4,
    word_wrap: true,
    auto_save: true,
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await apiClient.get<any>('/auth/settings/');
        if (res) {
          setSettingsForm({
            theme: res.theme ?? 'dark',
            preferred_language: res.preferred_language ?? 'python',
            default_difficulty: res.default_difficulty ?? 'Easy',
            daily_goal: res.daily_goal ?? 5,
            email_notifications: res.email_notifications ?? true,
            achievement_notifications: res.achievement_notifications ?? true,
            daily_reminders: res.daily_reminders ?? true,
            weekly_progress_summary: res.weekly_progress_summary ?? true,
            profile_visibility: res.profile_visibility ?? 'public',
            show_achievements: res.show_achievements ?? true,
            show_activity: res.show_activity ?? true,
            editor_font_size: res.editor_font_size ?? 14,
            editor_theme: res.editor_theme ?? 'vs-dark',
            tab_size: res.tab_size ?? 4,
            word_wrap: res.word_wrap ?? true,
            auto_save: res.auto_save ?? true,
          });
        }
      } catch (err: any) {
        console.warn('Failed to load settings from backend', err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      setAccountForm({
        fullName: user.fullName || '',
        headline: profile?.headline || 'Algorithmic Problem Solver',
        bio: profile?.bio || 'Practicing algorithmic thinking and patterns on AlgoForge.',
      });
      loadSettings();
    }
  }, [user, profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setError(null);

    try {
      // 1. Update Profile/Account
      await apiClient.patch('/auth/me/', {
        full_name: accountForm.fullName,
        headline: accountForm.headline,
        bio: accountForm.bio,
        daily_goal_target: Number(settingsForm.daily_goal),
        preferred_language: settingsForm.preferred_language,
      });

      // 2. Update Persisted UserSettings
      await apiClient.patch('/auth/settings/', {
        theme: settingsForm.theme,
        preferred_language: settingsForm.preferred_language,
        default_difficulty: settingsForm.default_difficulty,
        daily_goal: Number(settingsForm.daily_goal),
        email_notifications: settingsForm.email_notifications,
        achievement_notifications: settingsForm.achievement_notifications,
        daily_reminders: settingsForm.daily_reminders,
        weekly_progress_summary: settingsForm.weekly_progress_summary,
        profile_visibility: settingsForm.profile_visibility,
        show_achievements: settingsForm.show_achievements,
        show_activity: settingsForm.show_activity,
        editor_font_size: Number(settingsForm.editor_font_size),
        editor_theme: settingsForm.editor_theme,
        tab_size: Number(settingsForm.tab_size),
        word_wrap: settingsForm.word_wrap,
        auto_save: settingsForm.auto_save,
      });

      await refreshUserData();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: 'account', label: 'Account', icon: User },
    { key: 'appearance', label: 'Appearance', icon: Sun },
    { key: 'learning', label: 'Learning Preferences', icon: Sliders },
    { key: 'editor', label: 'Code Editor', icon: Code2 },
    { key: 'notifications', label: 'Notifications', icon: Bell },
    { key: 'privacy', label: 'Privacy', icon: Shield },
    { key: 'danger', label: 'Danger Zone', icon: Trash2 },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>Platform Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Preferences & Security</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your personal profile, editor settings, privacy, and learning goals.
          </p>
        </div>

        {saveSuccess && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Settings Layout: Left Nav + Right Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Tabs */}
        <div className="md:col-span-1 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <form onSubmit={handleSave} className="md:col-span-3 space-y-6">
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-md space-y-6">
            {/* 1. Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white">Account Information</h3>
                  <p className="text-xs text-slate-400">Update your public name and biographical summary.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Full Name</label>
                    <input
                      type="text"
                      value={accountForm.fullName}
                      onChange={(e) => setAccountForm({ ...accountForm, fullName: e.target.value })}
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={user?.email || ''}
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-500 cursor-not-allowed"
                    />
                    <span className="text-[10px] text-slate-500 mt-1 block">Email is managed by authentication provider.</span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Headline</label>
                    <input
                      type="text"
                      value={accountForm.headline}
                      onChange={(e) => setAccountForm({ ...accountForm, headline: e.target.value })}
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Bio</label>
                    <textarea
                      rows={3}
                      value={accountForm.bio}
                      onChange={(e) => setAccountForm({ ...accountForm, bio: e.target.value })}
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white">Appearance & Theme</h3>
                  <p className="text-xs text-slate-400">Choose your interface theme style.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Optimized for high-focus coding sessions' },
                    { key: 'light', label: 'Light Mode', icon: Sun, desc: 'Clean bright contrast style' },
                    { key: 'system', label: 'System Theme', icon: Laptop, desc: 'Match your operating system theme' },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSelected = settingsForm.theme === t.key;
                    return (
                      <div
                        key={t.key}
                        onClick={() => setSettingsForm({ ...settingsForm, theme: t.key })}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 shadow-md'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-2" />
                        <h4 className="text-xs font-bold text-white">{t.label}</h4>
                        <p className="text-[11px] text-slate-500 mt-1">{t.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Learning Preferences */}
            {activeTab === 'learning' && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white">Learning Preferences</h3>
                  <p className="text-xs text-slate-400">Set your default coding language and practice targets.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Preferred Language</label>
                    <select
                      value={settingsForm.preferred_language}
                      onChange={(e) => setSettingsForm({ ...settingsForm, preferred_language: e.target.value })}
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="python">Python 3.12</option>
                      <option value="javascript">JavaScript (Node.js)</option>
                      <option value="cpp">C++ (GCC 13)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Default Problem Difficulty</label>
                    <select
                      value={settingsForm.default_difficulty}
                      onChange={(e) => setSettingsForm({ ...settingsForm, default_difficulty: e.target.value })}
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="Easy">Easy (Fundamentals)</option>
                      <option value="Medium">Medium (Interview Standard)</option>
                      <option value="Hard">Hard (Advanced Competitions)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300">
                      Daily Practice Goal: <span className="text-cyan-400 font-bold">{settingsForm.daily_goal} Problems / day</span>
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      value={settingsForm.daily_goal}
                      onChange={(e) => setSettingsForm({ ...settingsForm, daily_goal: Number(e.target.value) })}
                      className="mt-2 w-full accent-cyan-400 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>1 Problem</span>
                      <span>5 Problems (Recommended)</span>
                      <span>20 Problems</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Code Editor Preferences */}
            {activeTab === 'editor' && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white">Monaco Code Editor</h3>
                  <p className="text-xs text-slate-400">Configure font size, tab spaces, and auto-save options.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Font Size (px)</label>
                    <input
                      type="number"
                      min="11"
                      max="24"
                      value={settingsForm.editor_font_size}
                      onChange={(e) => setSettingsForm({ ...settingsForm, editor_font_size: Number(e.target.value) })}
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Editor Theme</label>
                    <select
                      value={settingsForm.editor_theme}
                      onChange={(e) => setSettingsForm({ ...settingsForm, editor_theme: e.target.value })}
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="vs-dark">VS Dark (Default)</option>
                      <option value="vs-light">VS Light</option>
                      <option value="hc-black">High Contrast Black</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Tab Size (Spaces)</label>
                    <select
                      value={settingsForm.tab_size}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tab_size: Number(e.target.value) })}
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value={2}>2 spaces</option>
                      <option value={4}>4 spaces (Standard)</option>
                      <option value={8}>8 spaces</option>
                    </select>
                  </div>

                  <div className="flex flex-col justify-center space-y-3 pt-4 sm:pt-0">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={settingsForm.word_wrap}
                        onChange={(e) => setSettingsForm({ ...settingsForm, word_wrap: e.target.checked })}
                        className="rounded accent-cyan-400 w-4 h-4"
                      />
                      <span>Enable Word Wrap</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={settingsForm.auto_save}
                        onChange={(e) => setSettingsForm({ ...settingsForm, auto_save: e.target.checked })}
                        className="rounded accent-cyan-400 w-4 h-4"
                      />
                      <span>Auto-save solution draft</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Notifications */}
            {activeTab === 'notifications' && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white">Notification Alerts</h3>
                  <p className="text-xs text-slate-400">Control practice reminders and achievement notifications.</p>
                </div>

                <div className="space-y-3">
                  {[
                    { key: 'email_notifications', label: 'Email Notifications', desc: 'Receive periodic updates and feature announcements' },
                    { key: 'achievement_notifications', label: 'Achievement Alerts', desc: 'In-app notification popups when you unlock new badges' },
                    { key: 'daily_reminders', label: 'Daily Practice Reminders', desc: 'Gentle nudges to preserve your current practice streak' },
                    { key: 'weekly_progress_summary', label: 'Weekly Summary Digest', desc: 'Summary of problems solved, XP earned, and accuracy' },
                  ].map((n) => (
                    <label
                      key={n.key}
                      className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3 cursor-pointer hover:border-slate-700 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={(settingsForm as any)[n.key]}
                        onChange={(e) => setSettingsForm({ ...settingsForm, [n.key]: e.target.checked })}
                        className="rounded accent-cyan-400 w-4 h-4 mt-0.5"
                      />
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white block">{n.label}</span>
                        <span className="text-[11px] text-slate-400 block">{n.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Privacy */}
            {activeTab === 'privacy' && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white">Privacy & Visibility</h3>
                  <p className="text-xs text-slate-400">Manage who can see your statistics and leaderboard rank.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Profile Visibility</label>
                    <select
                      value={settingsForm.profile_visibility}
                      onChange={(e) => setSettingsForm({ ...settingsForm, profile_visibility: e.target.value })}
                      className="mt-1 w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="public">Public (Visible on Global Leaderboard)</option>
                      <option value="private">Private (Only visible to you)</option>
                    </select>
                  </div>

                  <div className="space-y-3 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={settingsForm.show_achievements}
                        onChange={(e) => setSettingsForm({ ...settingsForm, show_achievements: e.target.checked })}
                        className="rounded accent-cyan-400 w-4 h-4"
                      />
                      <span>Display badges on public profile</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                      <input
                        type="checkbox"
                        checked={settingsForm.show_activity}
                        onChange={(e) => setSettingsForm({ ...settingsForm, show_activity: e.target.checked })}
                        className="rounded accent-cyan-400 w-4 h-4"
                      />
                      <span>Display 365-day activity heatmap on profile</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Danger Zone */}
            {activeTab === 'danger' && (
              <div className="space-y-4 animate-fade-in">
                <div className="border-b border-rose-500/20 pb-3">
                  <h3 className="text-base font-bold text-rose-400">Danger Zone</h3>
                  <p className="text-xs text-slate-400">Actions here can end your session or permanently alter your profile.</p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-white">Log Out of All Devices</h4>
                    <p className="text-[11px] text-slate-400">Terminate your active JWT tokens and return to the login screen.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-400 font-bold text-xs border border-rose-500/30 transition-all shrink-0"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}

            {/* Save Buttons Row */}
            {activeTab !== 'danger' && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-[11px] text-slate-500">Settings are persisted securely in backend database.</span>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95 disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving Preferences...' : 'Save Settings'}</span>
                </button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
