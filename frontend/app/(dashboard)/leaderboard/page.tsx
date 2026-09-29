'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Crown, 
  Flame, 
  Zap, 
  Search,
  Sparkles,
  Users,
  Code2
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { apiClient } from '@/lib/api-client';

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  total_xp: number;
  current_level: number;
  current_streak: number;
  problems_solved: number;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null);
  const [currentUserXp, setCurrentUserXp] = useState<number>(0);
  const [timeFilter, setTimeFilter] = useState<'all' | 'weekly'>('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboard() {
      setIsLoading(true);
      try {
        const data = await apiClient.get<{
          leaderboard?: LeaderboardEntry[];
          current_user_rank?: number | null;
          current_user_xp?: number;
        }>('/progress/leaderboard/');
        
        if (data && data.leaderboard) {
          setEntries(data.leaderboard);
          if (data.current_user_rank !== undefined) setCurrentUserRank(data.current_user_rank);
          if (data.current_user_xp !== undefined) setCurrentUserXp(data.current_user_xp);
        }
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadLeaderboard();
  }, []);

  const filtered = entries.filter((e) =>
    e.username.toLowerCase().includes(search.toLowerCase()) ||
    e.full_name.toLowerCase().includes(search.toLowerCase())
  );

  const topThree = filtered.slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950/40 via-yellow-900/30 to-purple-950/40 border border-amber-500/20 p-6 lg:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              Global Rankings
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              AlgoForge Hall of Fame
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm lg:text-base leading-relaxed">
              Compete with top algorithmic engineers worldwide. Solve challenges, maintain daily streaks, and climb the ranks to achieve Grandmaster tier.
            </p>
          </div>

          {/* Time Filter Pills */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl shrink-0">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                timeFilter === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All-Time Legends
            </button>
            <button
              onClick={() => setTimeFilter('weekly')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                timeFilter === 'weekly'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Weekly Sprint
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4 pb-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
            ))}
          </div>
          <div className="h-96 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
        </div>
      )}

      {/* Top 3 Podium Cards */}
      {!isLoading && topThree.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-4 pb-2">
          {/* Rank 2 (Silver) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="order-2 md:order-1 relative rounded-2xl bg-slate-900/80 border border-slate-700/60 p-6 flex flex-col items-center text-center shadow-xl backdrop-blur-sm"
          >
            <div className="absolute -top-4 w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black flex items-center justify-center text-sm shadow-lg ring-4 ring-slate-950">
              2
            </div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-2xl font-black text-white shadow-lg mb-3 mt-2">
              {topThree[1].full_name ? topThree[1].full_name.charAt(0) : topThree[1].username.charAt(0)}
            </div>
            <h3 className="font-bold text-white text-base">{topThree[1].full_name || topThree[1].username}</h3>
            <p className="text-xs text-slate-400 font-mono">@{topThree[1].username}</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                <Zap className="w-3 h-3 fill-amber-400" />
                {topThree[1].total_xp.toLocaleString()} XP
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/20">
                <Flame className="w-3 h-3 fill-orange-400" />
                {topThree[1].current_streak}d
              </span>
            </div>
          </motion.div>

          {/* Rank 1 (Gold) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="order-1 md:order-2 relative rounded-3xl bg-gradient-to-b from-amber-950/60 via-slate-900/90 to-slate-900 border-2 border-amber-500/40 p-8 flex flex-col items-center text-center shadow-2xl shadow-amber-500/10 backdrop-blur-sm md:-translate-y-4"
          >
            <div className="absolute -top-5 w-10 h-10 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-black flex items-center justify-center text-base shadow-xl ring-4 ring-slate-950">
              <Crown className="w-5 h-5 fill-slate-950" />
            </div>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center text-3xl font-black text-slate-950 shadow-2xl ring-4 ring-amber-500/40 mb-4 mt-2">
              {topThree[0].full_name ? topThree[0].full_name.charAt(0) : topThree[0].username.charAt(0)}
            </div>
            <h3 className="font-extrabold text-white text-lg tracking-tight">{topThree[0].full_name || topThree[0].username}</h3>
            <p className="text-xs text-amber-400 font-mono">@{topThree[0].username}</p>
            <div className="mt-5 flex items-center gap-3">
              <span className="flex items-center gap-1 text-sm font-extrabold text-amber-300 bg-amber-500/20 px-3 py-1.5 rounded-xl border border-amber-500/40 shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-amber-300" />
                {topThree[0].total_xp.toLocaleString()} XP
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1.5 rounded-xl border border-orange-500/20">
                <Flame className="w-3.5 h-3.5 fill-orange-400" />
                {topThree[0].current_streak}d Streak
              </span>
            </div>
          </motion.div>

          {/* Rank 3 (Bronze) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="order-3 relative rounded-2xl bg-slate-900/80 border border-slate-700/60 p-6 flex flex-col items-center text-center shadow-xl backdrop-blur-sm"
          >
            <div className="absolute -top-4 w-8 h-8 rounded-full bg-amber-700 text-white font-black flex items-center justify-center text-sm shadow-lg ring-4 ring-slate-950">
              3
            </div>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-700 to-amber-900 flex items-center justify-center text-2xl font-black text-white shadow-lg mb-3 mt-2">
              {topThree[2].full_name ? topThree[2].full_name.charAt(0) : topThree[2].username.charAt(0)}
            </div>
            <h3 className="font-bold text-white text-base">{topThree[2].full_name || topThree[2].username}</h3>
            <p className="text-xs text-slate-400 font-mono">@{topThree[2].username}</p>
            <div className="mt-4 flex items-center gap-3">
              <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                <Zap className="w-3 h-3 fill-amber-400" />
                {topThree[2].total_xp.toLocaleString()} XP
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-500/10 px-2.5 py-1 rounded-lg border border-orange-500/20">
                <Flame className="w-3 h-3 fill-orange-400" />
                {topThree[2].current_streak}d
              </span>
            </div>
          </motion.div>
        </div>
      )}

      {/* Search Input */}
      {!isLoading && entries.length > 0 && (
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search coder by name or handle..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all shadow-inner"
          />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && entries.length === 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No leaderboard entries yet</h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Solve your first problem or complete a course lesson to earn XP and claim the #1 spot on the leaderboard!
          </p>
          <div className="pt-2">
            <Link
              href="/problems"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 hover:opacity-95 transition-opacity"
            >
              <Code2 className="w-4 h-4" />
              Start Solving Problems
            </Link>
          </div>
        </div>
      )}

      {/* Search No Results State */}
      {!isLoading && entries.length > 0 && filtered.length === 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-10 text-center space-y-3">
          <Users className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className="text-lg font-semibold text-white">No coders found matching &quot;{search}&quot;</h3>
          <p className="text-slate-400 text-sm">Try searching for a different handle or name.</p>
        </div>
      )}

      {/* Global Rankings Table */}
      {!isLoading && filtered.length > 0 && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-medium">
            <div className="flex items-center gap-6">
              <span className="w-8 text-center">Rank</span>
              <span>Engineer</span>
            </div>
            <div className="flex items-center gap-8 pr-4">
              <span className="w-20 text-center">Level</span>
              <span className="w-20 text-center">Streak</span>
              <span className="w-24 text-center">Solved</span>
              <span className="w-24 text-right">Total XP</span>
            </div>
          </div>

          <div className="divide-y divide-slate-800/60">
            {filtered.map((entry) => {
              const isCurrentUser = user && (entry.username === user.username || entry.user_id === user.id);
              return (
                <div
                  key={entry.user_id}
                  className={`px-6 py-4 flex items-center justify-between transition-colors ${
                    isCurrentUser
                      ? 'bg-amber-500/10 border-l-4 border-amber-500'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  {/* Rank + User */}
                  <div className="flex items-center gap-6 flex-1">
                    <span className={`w-8 text-center font-bold text-sm ${
                      entry.rank === 1 ? 'text-amber-400' :
                      entry.rank === 2 ? 'text-slate-300' :
                      entry.rank === 3 ? 'text-amber-600' : 'text-slate-500'
                    }`}>
                      #{entry.rank}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-sm text-slate-200">
                        {entry.full_name ? entry.full_name.charAt(0) : entry.username.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200 text-sm flex items-center gap-2">
                          <span>{entry.full_name || entry.username}</span>
                          {isCurrentUser && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 font-mono">@{entry.username}</span>
                      </div>
                    </div>
                  </div>

                  {/* Level + Streak + Solved + XP */}
                  <div className="flex items-center gap-8 pr-4">
                    <span className="w-20 text-center text-xs font-semibold px-2 py-1 rounded-md bg-slate-800 text-blue-400 border border-slate-700">
                      Lvl {entry.current_level}
                    </span>
                    <span className="w-20 flex items-center justify-center gap-1 text-xs font-bold text-orange-400">
                      <Flame className="w-3.5 h-3.5 fill-orange-400" />
                      {entry.current_streak}d
                    </span>
                    <span className="w-24 text-center text-xs font-medium text-slate-300">
                      {entry.problems_solved} solved
                    </span>
                    <span className="w-24 text-right text-xs font-black text-amber-400 font-mono">
                      {entry.total_xp.toLocaleString()} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
