'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Flame,
  Star,
  CheckCircle2,
  BookOpen,
  Trophy,
  Play,
  ArrowRight,
  Sparkles,
  Lock,
  Code2,
  Cpu,
  Clock,
  Compass,
  TrendingUp,
  Activity,
  Layers,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useAuth } from '@/features/auth/AuthContext';
import { apiClient } from '@/lib/api-client';

export default function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [activeChartMetric, setActiveChartMetric] = useState<'problems' | 'minutes' | 'xp' | 'lessons'>('problems');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const data = await apiClient.get('/progress/dashboard/');
        setDashboardData(data);
      } catch {
        // Fallback state if offline/unauthenticated
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  const displayName = user?.fullName || user?.username || 'Coder';

  const stats = [
    {
      label: 'Current Streak',
      value: `${dashboardData?.stats?.current_streak ?? 0} Days`,
      icon: Flame,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20'
    },
    {
      label: 'Total Points',
      value: `${(dashboardData?.stats?.total_xp ?? 0).toLocaleString()} XP`,
      icon: Star,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20'
    },
    {
      label: 'Problems Solved',
      value: `${dashboardData?.stats?.problems_solved ?? 0}`,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20'
    },
    {
      label: 'Lessons Completed',
      value: `${dashboardData?.stats?.lessons_completed ?? 0}`,
      icon: BookOpen,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      border: 'border-cyan-500/20'
    },
    {
      label: 'Achievements',
      value: `${dashboardData?.stats?.achievements_count ?? 0} Badges`,
      icon: Trophy,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20'
    },
  ];

  const continueLearning = dashboardData?.continue_learning || null;

  const dailyGoal = dashboardData?.daily_goal || {
    target: 5,
    solved: 0,
    percentage: 0,
  };

  const roadmapNodes = dashboardData?.roadmap_nodes || [];

  const weeklyChartData = dashboardData?.weekly_chart || [
    { day: 'Mon', problems: 0, minutes: 0, xp: 0, lessons: 0 },
    { day: 'Tue', problems: 0, minutes: 0, xp: 0, lessons: 0 },
    { day: 'Wed', problems: 0, minutes: 0, xp: 0, lessons: 0 },
    { day: 'Thu', problems: 0, minutes: 0, xp: 0, lessons: 0 },
    { day: 'Fri', problems: 0, minutes: 0, xp: 0, lessons: 0 },
    { day: 'Sat', problems: 0, minutes: 0, xp: 0, lessons: 0 },
    { day: 'Sun', problems: 0, minutes: 0, xp: 0, lessons: 0 },
  ];

  const recentActivities = dashboardData?.recent_activities || [];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-cyan-950/70 border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-32 -bottom-8 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Dashboard Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              Welcome back, {displayName} <span className="inline-block animate-wave">👋</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl">
              {(dashboardData?.stats?.current_streak ?? 0) > 0 ? (
                <>You are on a <span className="text-orange-400 font-bold">{dashboardData?.stats?.current_streak}-day streak</span>! Pick up where you left off or conquer today’s challenges.</>
              ) : (
                <>Pick up where you left off or conquer today’s challenges to start building your streak.</>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href={continueLearning?.slug ? `/lessons/${continueLearning.slug}` : '/courses'}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>{continueLearning ? 'Continue Learning' : 'Explore Courses'}</span>
            </Link>
            <Link
              href="/problems"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-800 transition-all hover:border-slate-700"
            >
              <Code2 className="w-4 h-4 text-indigo-400" />
              <span>Start Practice</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Gamification Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl bg-slate-900/60 border ${s.border} backdrop-blur-sm flex flex-col justify-between hover:bg-slate-900/90 transition-all`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400 truncate">{s.label}</span>
                <div className={`w-8 h-8 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-4 h-4 ${s.color}`} />
                </div>
              </div>
              <div className={`text-xl font-extrabold tracking-tight ${s.color}`}>{s.value}</div>
            </div>
          );
        })}
      </div>

      {/* Continue Learning + Daily Goal Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning Card */}
        {continueLearning ? (
          <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-md flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Continue Learning</span>
                <h2 className="text-xl font-bold text-white mt-1">{continueLearning.title}</h2>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                {continueLearning.module_title}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Progress</span>
                <span className="text-white font-bold">{continueLearning.progress_percentage}%</span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${continueLearning.progress_percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Next checkpoint in your path</span>
                <span>~8 mins remaining</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Resume exact checkpoint</span>
              </div>
              <Link
                href={`/lessons/${continueLearning.slug}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>Continue</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900/70 to-slate-900 border border-slate-800 backdrop-blur-md flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Your Learning Journey Starts Here</span>
              </div>
              <h2 className="text-xl font-bold text-white">Begin Practicing Data Structures & Algorithms</h2>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                You haven&apos;t started any courses or problems yet. Explore the structured 19-category roadmap, or solve your first practice problem to earn XP and unlock badges.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
              <Link
                href="/problems"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all active:scale-95"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Solve First Problem</span>
              </Link>
              <Link
                href="/roadmap"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all"
              >
                <Compass className="w-3.5 h-3.5 text-indigo-400" />
                <span>Explore Roadmap</span>
              </Link>
            </div>
          </div>
        )}

        {/* Daily Goal Card */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-md flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Daily Challenge</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                +50 XP
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">Today’s Goal</h3>
            <p className="text-xs text-slate-400 mt-1">Solve {dailyGoal.target} problems to maintain your streak.</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Progress</span>
              <span className="text-amber-400 font-extrabold text-sm">{dailyGoal.solved} / {dailyGoal.target} Problems</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${dailyGoal.percentage}%` }}
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80">
            <Link
              href="/problems"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-white font-semibold text-xs border border-slate-700 transition-all"
            >
              <span>Practice Next Problem</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </Link>
          </div>
        </div>
      </div>

      {/* Progress Chart & Recent Activity Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Progress Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Weekly Performance</span>
              <h2 className="text-lg font-bold text-white mt-0.5">Study & Practice Trends</h2>
            </div>

            {/* Metric Selector Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              {[
                { key: 'problems', label: 'Problems' },
                { key: 'minutes', label: 'Time (m)' },
                { key: 'xp', label: 'XP Earned' },
                { key: 'lessons', label: 'Lessons' },
              ].map((m) => (
                <button
                  key={m.key}
                  onClick={() => setActiveChartMetric(m.key as any)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    activeChartMetric === m.key
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  cursor={{ fill: 'rgba(51, 65, 85, 0.2)' }}
                />
                <Bar
                  dataKey={activeChartMetric}
                  fill="url(#barGradient)"
                  radius={[8, 8, 0, 0]}
                />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-md flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Activity Log</span>
              <Activity className="w-4 h-4 text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-white mt-1">Recent Activity</h3>
          </div>

          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((act: any) => (
                <div
                  key={act.id}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 hover:border-slate-700 transition-colors"
                >
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    {act.activity_type === 'problem_solved' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                    {act.activity_type === 'lesson_completed' && <BookOpen className="w-3.5 h-3.5 text-cyan-400" />}
                    {act.activity_type === 'achievement_unlocked' && <Trophy className="w-3.5 h-3.5 text-purple-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-white truncate">{act.title}</p>
                      <span className="text-[10px] text-slate-500 shrink-0">{act.time_ago || 'recent'}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{act.subtitle}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 px-4 text-center space-y-2 rounded-2xl bg-slate-950/40 border border-slate-800/60">
                <Activity className="w-6 h-6 text-slate-600 mx-auto" />
                <p className="text-xs font-semibold text-slate-300">No activity yet</p>
                <p className="text-[11px] text-slate-500">Solve your first practice problem to build your timeline.</p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <Link
              href="/profile"
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center justify-between"
            >
              <span>View full profile activity</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Roadmap Summary Overview */}
      <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-md space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Roadmap Checkpoints</h2>
          </div>
          <Link href="/roadmap" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300">
            Explore Full Roadmap →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {roadmapNodes.map((node: any, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3">
                {node.status === 'completed' && (
                  <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                {node.status === 'in-progress' && (
                  <div className="w-7 h-7 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  </div>
                )}
                {node.status === 'locked' && (
                  <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}
                <div>
                  <div className="text-xs font-bold text-slate-200">{node.name}</div>
                  <div className="text-[10px] text-slate-500">
                    {node.status === 'completed' ? 'Mastered' : node.status === 'in-progress' ? `${node.progress}% Completed` : 'Locked'}
                  </div>
                </div>
              </div>

              <div>
                {node.status === 'completed' && (
                  <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    Done
                  </span>
                )}
                {node.status === 'in-progress' && (
                  <span className="text-[10px] font-bold text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                    Active
                  </span>
                )}
                {node.status === 'locked' && (
                  <span className="text-[10px] font-semibold text-slate-500">Locked</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
