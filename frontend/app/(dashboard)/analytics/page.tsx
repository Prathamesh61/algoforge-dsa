'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Code2, 
  Activity, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Users, 
  Terminal, 
  Sparkles,
  PieChart as PieIcon,
  Flame,
  ArrowRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useAuth } from '@/features/auth/AuthContext';
import { apiClient } from '@/lib/api-client';

interface PlatformAnalytics {
  overview: {
    total_users: number;
    total_problems: number;
    total_lessons: number;
    total_submissions: number;
    accepted_submissions: number;
    acceptance_rate: number;
  };
  languages: { language: string; count: number; percentage: number }[];
  trends: { date: string; submissions: number }[];
}

interface UserAnalytics {
  total_submissions: number;
  accepted_submissions: number;
  accuracy_rate: number;
  average_runtime_ms: number;
  weekly_minutes: number;
  study_chart: { day: string; minutes: number }[];
  streak: number;
  total_xp: number;
  current_level: number;
}

const DEFAULT_PLATFORM: PlatformAnalytics = {
  overview: {
    total_users: 0,
    total_problems: 0,
    total_lessons: 0,
    total_submissions: 0,
    accepted_submissions: 0,
    acceptance_rate: 0
  },
  languages: [],
  trends: []
};

const DEFAULT_USER: UserAnalytics = {
  total_submissions: 0,
  accepted_submissions: 0,
  accuracy_rate: 0,
  average_runtime_ms: 0,
  weekly_minutes: 0,
  study_chart: [],
  streak: 0,
  total_xp: 0,
  current_level: 1
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export default function AnalyticsPage() {
  const { user } = useAuth();
  const [platform, setPlatform] = useState<PlatformAnalytics>(DEFAULT_PLATFORM);
  const [userStats, setUserStats] = useState<UserAnalytics>(DEFAULT_USER);
  const [viewMode, setViewMode] = useState<'platform' | 'personal'>('personal');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadAnalytics() {
      setIsLoading(true);
      try {
        const [pData, uData] = await Promise.all([
          apiClient.get<PlatformAnalytics>('/analytics/platform/').catch(() => null),
          apiClient.get<UserAnalytics>('/analytics/user/').catch(() => null)
        ]);

        if (pData && pData.overview) {
          setPlatform(pData);
        }
        if (uData) {
          setUserStats(uData);
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/40 via-indigo-900/30 to-cyan-950/40 border border-blue-500/20 p-6 lg:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5" />
              Intelligence & Metrics
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Platform & Practice Analytics
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm lg:text-base leading-relaxed">
              Real-time submission throughput, language preferences, execution performance, and personal coding consistency.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl shrink-0">
            <button
              onClick={() => setViewMode('personal')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'personal'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              My Performance
            </button>
            <button
              onClick={() => setViewMode('platform')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'platform'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Global Platform
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-80 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
            <div className="h-80 rounded-2xl bg-slate-900/60 border border-slate-800 animate-pulse" />
          </div>
        </div>
      ) : (
        <>
          {/* Key Metric Cards */}
          {viewMode === 'personal' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Solution Accuracy</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-400">
                  {userStats.accuracy_rate}%
                </div>
                <p className="text-[11px] text-slate-500">
                  {userStats.accepted_submissions} accepted of {userStats.total_submissions} attempts
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Avg Execution Speed</span>
                  <Clock className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-3xl font-extrabold text-cyan-400">
                  {userStats.average_runtime_ms} <span className="text-base font-normal">ms</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Fast sandbox runtimes across test cases
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Weekly Practice Time</span>
                  <Activity className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-amber-400">
                  {userStats.weekly_minutes} <span className="text-base font-normal">mins</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Active problem solving & visualizer runs
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Active Streak</span>
                  <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                </div>
                <div className="text-3xl font-extrabold text-orange-400">
                  {userStats.streak} <span className="text-base font-normal">days</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Continuous daily learning streak
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Total Submissions</span>
                  <Terminal className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-3xl font-extrabold text-white">
                  {platform.overview.total_submissions.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500">Code runs across all languages</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Acceptance Rate</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-extrabold text-emerald-400">
                  {platform.overview.acceptance_rate}%
                </div>
                <p className="text-[11px] text-slate-500">
                  {platform.overview.accepted_submissions.toLocaleString()} accepted
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Engineers Registered</span>
                  <Users className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-3xl font-extrabold text-purple-400">
                  {platform.overview.total_users.toLocaleString()}
                </div>
                <p className="text-[11px] text-slate-500">Active learners worldwide</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur space-y-2 shadow-lg">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span>Curated Challenges</span>
                  <Code2 className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-extrabold text-amber-400">
                  {platform.overview.total_problems}
                </div>
                <p className="text-[11px] text-slate-500">
                  {platform.overview.total_lessons} theory modules
                </p>
              </div>
            </div>
          )}

          {/* Empty state for personal mode when no submissions */}
          {viewMode === 'personal' && userStats.total_submissions === 0 && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center space-y-3">
              <Code2 className="w-8 h-8 text-blue-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">No submission telemetry yet</h3>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Submit your first algorithm solution in the Practice Arena to populate real-time accuracy graphs, runtime distribution, and weekly coding minutes.
              </p>
              <div className="pt-2">
                <Link
                  href="/problems"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
                >
                  Start Practicing <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}

          {/* Main Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Chart: Trends / Activity */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur space-y-4 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white">
                  {viewMode === 'personal' ? 'Weekly Coding Minutes' : '14-Day Submission Volume'}
                </h3>
                <p className="text-xs text-slate-400">
                  {viewMode === 'personal'
                    ? 'Time spent solving challenges and experimenting with algorithms'
                    : 'Daily throughput of solutions tested through the compiler sandbox'}
                </p>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  {viewMode === 'personal' ? (
                    <BarChart data={userStats.study_chart}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '0.75rem',
                          fontSize: '12px',
                          color: '#f8fafc'
                        }}
                      />
                      <Bar dataKey="minutes" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  ) : (
                    <AreaChart data={platform.trends}>
                      <defs>
                        <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '0.75rem',
                          fontSize: '12px',
                          color: '#f8fafc'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="submissions"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorSubmissions)"
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Chart: Language Breakdown */}
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur space-y-4 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white">Language Share</h3>
                <p className="text-xs text-slate-400">Distribution of solutions submitted</p>
              </div>

              {platform.languages.length === 0 ? (
                <div className="h-56 flex flex-col items-center justify-center text-center p-4 text-slate-500 text-xs">
                  <Terminal className="w-8 h-8 mb-2 opacity-50" />
                  No code runs recorded yet
                </div>
              ) : (
                <>
                  <div className="h-56 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={platform.languages}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="count"
                        >
                          {platform.languages.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: '#334155',
                            borderRadius: '0.75rem',
                            fontSize: '12px',
                            color: '#f8fafc'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Language Legend */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    {platform.languages.map((l, idx) => (
                      <div key={l.language} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          />
                          <span className="font-semibold text-slate-300">{l.language}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-500 font-mono">{l.count} runs</span>
                          <span className="font-bold text-slate-200">{l.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
