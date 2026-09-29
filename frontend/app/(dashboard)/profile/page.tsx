'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  User as UserIcon,
  Flame,
  Star,
  CheckCircle2,
  BookOpen,
  Trophy,
  Calendar,
  Code2,
  Edit3,
  Check,
  Sparkles,
  Award,
  Layers,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { apiClient } from '@/lib/api-client';

export default function ProfilePage() {
  const { user, profile, refreshUserData } = useAuth();
  const [heatmapDays, setHeatmapDays] = useState<any[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [badges, setBadges] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [dailyGoalTarget, setDailyGoalTarget] = useState(5);
  const [preferredLanguage, setPreferredLanguage] = useState('python');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setHeadline(profile?.headline || 'Algorithmic Problem Solver');
      setBio(profile?.bio || 'Practicing algorithmic patterns and data structures on AlgoForge.');
      setDailyGoalTarget(profile?.dailyGoalTarget ?? 5);
      setPreferredLanguage(profile?.preferredLanguage || 'python');
    }
  }, [user, profile]);

  useEffect(() => {
    async function loadProfileData() {
      // 1. Heatmap
      try {
        const res = await apiClient.get('/progress/heatmap/');
        if (res.days) {
          setHeatmapDays(res.days);
        }
      } catch {
        const days = [];
        const today = new Date();
        for (let i = 364; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(d.getDate() - i);
          days.push({
            date: d.toISOString().split('T')[0],
            count: 0,
            level: 0,
          });
        }
        setHeatmapDays(days);
      }

      // 2. Real Topic Progress & Stats
      try {
        const statsRes = await apiClient.get('/progress/stats/');
        if (statsRes.topics) {
          setTopics(statsRes.topics.map((t: any) => ({
            name: t.tag,
            solved: t.solved,
            total: t.total,
            percentage: t.percentage
          })));
        }
      } catch {
        setTopics([]);
      }

      // 3. Real Achievements
      try {
        const achRes = await apiClient.get('/achievements/');
        if (Array.isArray(achRes)) {
          setBadges(achRes.map((a: any) => ({
            code: a.id,
            title: a.title,
            desc: a.description,
            xp: a.xp_bonus,
            unlocked: a.is_unlocked,
          })));
        }
      } catch {
        setBadges([]);
      }
    }
    loadProfileData();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiClient.patch('/auth/me/', {
        full_name: fullName,
        headline,
        bio,
        daily_goal_target: Number(dailyGoalTarget),
        preferred_language: preferredLanguage,
      });
      await refreshUserData();
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const totalXp = profile?.totalXp ?? 0;
  const currentStreak = profile?.currentStreak ?? 0;
  const longestStreak = profile?.longestStreak ?? 0;
  const problemsSolved = profile?.problemsSolvedCount ?? 0;
  const lessonsCompleted = profile?.lessonsCompletedCount ?? 0;
  const currentLevel = profile?.currentLevel ?? 1;

  // Group heatmap into 52 weeks
  const weeks: any[][] = [];
  let currentWeek: any[] = [];
  heatmapDays.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === heatmapDays.length - 1) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : (user?.username ? user.username.slice(0, 2).toUpperCase() : 'CO');

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Profile Header Card */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-indigo-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar Pill */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-1 shadow-xl shrink-0">
              <div className="w-full h-full rounded-[22px] bg-slate-950 flex items-center justify-center font-black text-2xl sm:text-3xl text-white">
                {initials}
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {user?.fullName || user?.username || 'Coder'}
                </h1>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Level {currentLevel} • Algorithm Practitioner
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 font-medium">
                @{user?.username || 'coder'} • {headline}
              </p>
              <p className="text-xs text-slate-500 max-w-xl">
                {bio}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all"
            >
              <Edit3 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Inline Edit Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-slate-800 space-y-4 animate-fade-in">
            <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Edit Preferences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Daily Goal (Problems)</label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={dailyGoalTarget}
                  onChange={(e) => setDailyGoalTarget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1 sm:col-span-2">
                <label className="text-[11px] font-semibold text-slate-400">Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Preferred Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="python">Python</option>
                  <option value="javascript">JavaScript</option>
                  <option value="cpp">C++</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {[
          { label: 'Total Experience', value: `${totalXp.toLocaleString()} XP`, icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          { label: 'Current Streak', value: `${currentStreak} Days`, icon: Flame, color: 'text-orange-400', bg: 'bg-orange-500/10' },
          { label: 'Problems Solved', value: `${problemsSolved}`, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Lessons Completed', value: `${lessonsCompleted}`, icon: BookOpen, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Longest Streak', value: `${longestStreak} Days`, icon: Trophy, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((m, i) => {
          const Icon = m.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400">{m.label}</span>
                <div className={`w-8 h-8 rounded-xl ${m.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${m.color}`} />
                </div>
              </div>
              <div className={`text-xl font-extrabold tracking-tight ${m.color}`}>{m.value}</div>
            </div>
          );
        })}
      </div>

      {/* 365-Day Activity Heatmap */}
      <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Activity Heatmap (Past 365 Days)</h2>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span>Less</span>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-sm bg-slate-800" />
              <span className="w-3 h-3 rounded-sm bg-emerald-950" />
              <span className="w-3 h-3 rounded-sm bg-emerald-700" />
              <span className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span className="w-3 h-3 rounded-sm bg-emerald-300" />
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
          <div className="flex gap-1 min-w-[750px]">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map((day, dIdx) => {
                  const levelClasses = [
                    'bg-slate-800/80 hover:border-slate-600',
                    'bg-emerald-950 border border-emerald-800/60',
                    'bg-emerald-700 border border-emerald-600',
                    'bg-emerald-500 border border-emerald-400',
                    'bg-emerald-300 border border-emerald-200 shadow-sm shadow-emerald-400/50',
                  ];
                  return (
                    <div
                      key={dIdx}
                      className={`w-3 h-3 rounded-sm transition-all cursor-pointer ${levelClasses[day.level || 0]}`}
                      title={`${day.date}: ${day.count} activities`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Topic Mastery & Achievements Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topic Mastery */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">Topic Mastery</h2>
            </div>
            <Link href="/problems" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">
              Practice Problems →
            </Link>
          </div>

          <div className="space-y-3 pt-2">
            {topics.length > 0 ? (
              topics.map((t, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold">{t.name}</span>
                    <span className="text-slate-400">
                      <span className="font-bold text-white">{t.solved}</span> / {t.total} Solved ({t.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/40">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${t.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center space-y-2 rounded-2xl bg-slate-950/40 border border-slate-800/60">
                <Code2 className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-300">No topic progress yet</p>
                <p className="text-[11px] text-slate-500">Solve problems in the practice catalog to build your mastery breakdown.</p>
              </div>
            )}
          </div>
        </div>

        {/* Achievements Showcase */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-400" />
              <h2 className="text-base font-bold text-white">Achievements & Badges</h2>
            </div>
            <span className="text-xs font-bold text-purple-400">
              {badges.filter((b) => b.unlocked).length} / {badges.length} Unlocked
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {badges.length > 0 ? (
              badges.map((b) => (
                <div
                  key={b.code}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    b.unlocked
                      ? 'bg-slate-950/80 border-purple-500/30 hover:border-purple-500/60 shadow-lg shadow-purple-500/5'
                      : 'bg-slate-950/30 border-slate-800/60 opacity-50 grayscale'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-500/20 to-indigo-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                      <Trophy className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-white truncate">{b.title}</h4>
                        <span className="text-[10px] font-bold text-amber-400">+{b.xp} XP</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate">{b.desc}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center space-y-2 rounded-2xl bg-slate-950/40 border border-slate-800/60">
                <Trophy className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-300">No achievements yet</p>
                <p className="text-[11px] text-slate-500">Complete your first challenge or module to unlock achievement badges.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
