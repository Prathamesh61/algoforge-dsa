'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  Trophy, 
  Flame, 
  Zap, 
  Crown, 
  Shield, 
  BookOpen, 
  GraduationCap, 
  Code2, 
  CheckCircle2, 
  Lock,
  Sparkles,
  Search
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  badge_icon: string;
  xp_bonus: number;
  category: string;
  display_order: number;
  is_unlocked: boolean;
  unlocked_at?: string;
}

const FALLBACK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'a1',
    code: 'first_blood',
    title: 'First Blood',
    description: 'Solve your very first DSA coding problem',
    badge_icon: 'Trophy',
    xp_bonus: 50,
    category: 'problems',
    display_order: 1,
    is_unlocked: true,
    unlocked_at: '2026-09-28T14:20:00Z'
  },
  {
    id: 'a2',
    code: 'century_club',
    title: 'Century Club',
    description: 'Accumulate 100 total experience points',
    badge_icon: 'Zap',
    xp_bonus: 50,
    category: 'special',
    display_order: 2,
    is_unlocked: true,
    unlocked_at: '2026-09-28T16:45:00Z'
  },
  {
    id: 'a3',
    code: 'streak_3',
    title: 'Triple Fire',
    description: 'Maintain a continuous 3-day practice streak',
    badge_icon: 'Flame',
    xp_bonus: 75,
    category: 'streak',
    display_order: 3,
    is_unlocked: true,
    unlocked_at: '2026-09-29T10:00:00Z'
  },
  {
    id: 'a4',
    code: 'problem_crusher_5',
    title: 'Problem Crusher',
    description: 'Solve 5 distinct coding challenges',
    badge_icon: 'Award',
    xp_bonus: 100,
    category: 'problems',
    display_order: 4,
    is_unlocked: false
  },
  {
    id: 'a5',
    code: 'streak_7',
    title: 'Week Warrior',
    description: 'Maintain a 7-day uninterrupted practice streak',
    badge_icon: 'Flame',
    xp_bonus: 150,
    category: 'streak',
    display_order: 5,
    is_unlocked: false
  },
  {
    id: 'a6',
    code: 'scholar_first_step',
    title: 'Curious Mind',
    description: 'Complete your first interactive DSA lesson',
    badge_icon: 'BookOpen',
    xp_bonus: 40,
    category: 'courses',
    display_order: 6,
    is_unlocked: true,
    unlocked_at: '2026-09-27T11:30:00Z'
  },
  {
    id: 'a7',
    code: 'scholar_master_3',
    title: 'Theory Specialist',
    description: 'Complete 3 comprehensive concept modules',
    badge_icon: 'GraduationCap',
    xp_bonus: 100,
    category: 'courses',
    display_order: 7,
    is_unlocked: false
  },
  {
    id: 'a8',
    code: 'polyglot',
    title: 'Polyglot Engineer',
    description: 'Submit problem solutions in 2 or more distinct programming languages',
    badge_icon: 'Code2',
    xp_bonus: 120,
    category: 'compiler',
    display_order: 8,
    is_unlocked: false
  },
  {
    id: 'a9',
    code: 'high_roller_500',
    title: 'Grand Centurion',
    description: 'Amass 500 total XP on the AlgoForge platform',
    badge_icon: 'Crown',
    xp_bonus: 150,
    category: 'special',
    display_order: 9,
    is_unlocked: false
  },
  {
    id: 'a10',
    code: 'problem_master_10',
    title: 'Algorithm Knight',
    description: 'Tackle and conquer 10 challenging DSA problems',
    badge_icon: 'Shield',
    xp_bonus: 250,
    category: 'problems',
    display_order: 10,
    is_unlocked: false
  }
];

const ICON_MAP: Record<string, React.ReactNode> = {
  Trophy: <Trophy className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Flame: <Flame className="w-6 h-6" />,
  Award: <Award className="w-6 h-6" />,
  BookOpen: <BookOpen className="w-6 h-6" />,
  GraduationCap: <GraduationCap className="w-6 h-6" />,
  Code2: <Code2 className="w-6 h-6" />,
  Crown: <Crown className="w-6 h-6" />,
  Shield: <Shield className="w-6 h-6" />
};

export default function AchievementsPage() {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>(FALLBACK_ACHIEVEMENTS);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function loadAchievements() {
      try {
        const token = localStorage.getItem('algoforge_access_token');
        const res = await fetch('http://127.0.0.1:8000/api/v1/achievements/', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setAchievements(data);
          }
        }
      } catch (e) {
        console.warn('Achievements endpoint offline, showing seeded achievements.');
      }
    }
    loadAchievements();
  }, []);

  const unlockedCount = achievements.filter((a) => a.is_unlocked).length;
  const totalBonusXp = achievements
    .filter((a) => a.is_unlocked)
    .reduce((acc, a) => acc + a.xp_bonus, 0);

  const filtered = achievements.filter((a) => {
    const matchesCategory = categoryFilter === 'all' || a.category === categoryFilter;
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/40 via-indigo-900/30 to-blue-950/40 border border-purple-500/20 p-6 lg:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Gamification Badges
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Trophies & Milestones
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm lg:text-base leading-relaxed">
              Unlock exclusive badges by reaching algorithmic milestones, conquering tough problems, maintaining continuous streaks, and experimenting with multiple programming languages.
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex items-center gap-4">
            <div className="px-5 py-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur text-center shadow-lg">
              <div className="text-2xl font-black text-purple-400">
                {unlockedCount} / {achievements.length}
              </div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Unlocked</div>
            </div>
            <div className="px-5 py-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur text-center shadow-lg">
              <div className="text-2xl font-black text-amber-400">+{totalBonusXp}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Bonus XP</div>
            </div>
            <div className="px-5 py-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur text-center shadow-lg">
              <div className="text-2xl font-black text-emerald-400">
                {achievements.length > 0
                  ? Math.round((unlockedCount / achievements.length) * 100)
                  : 0}
                %
              </div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Completion</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search achievements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { label: 'All Badges', val: 'all' },
            { label: 'Streaks', val: 'streak' },
            { label: 'Problems', val: 'problems' },
            { label: 'Learning', val: 'courses' },
            { label: 'Languages', val: 'compiler' },
            { label: 'Special', val: 'special' }
          ].map((cat) => (
            <button
              key={cat.val}
              onClick={() => setCategoryFilter(cat.val)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                categoryFilter === cat.val
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25 ring-1 ring-purple-400'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Achievements Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ach, idx) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04 }}
            className={`relative rounded-2xl p-6 transition-all duration-300 border ${
              ach.is_unlocked
                ? 'bg-slate-900/90 border-purple-500/30 shadow-xl shadow-purple-500/5'
                : 'bg-slate-900/40 border-slate-800/80 opacity-75'
            }`}
          >
            {/* Top Row: Icon + XP pill */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform ${
                  ach.is_unlocked
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white ring-2 ring-purple-400/40 shadow-purple-500/30'
                    : 'bg-slate-800 text-slate-600 border border-slate-700'
                }`}
              >
                {ICON_MAP[ach.badge_icon] || <Award className="w-6 h-6" />}
              </div>

              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg">
                  <Zap className="w-3 h-3 fill-amber-400" />
                  +{ach.xp_bonus} XP
                </span>
                {ach.is_unlocked ? (
                  <span className="p-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="p-1 rounded-full bg-slate-800 text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                )}
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-1.5">
              <h3 className="font-bold text-white text-base tracking-tight">{ach.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                {ach.description}
              </p>
            </div>

            {/* Footer status */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 uppercase tracking-wider font-semibold">
                {ach.category}
              </span>
              {ach.is_unlocked ? (
                <span className="text-emerald-400 font-medium">Unlocked</span>
              ) : (
                <span className="text-slate-500 font-medium">In Progress</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
