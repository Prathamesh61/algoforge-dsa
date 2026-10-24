'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Sparkles,
  Flame,
  Zap,
  Clock,
  Star,
  ArrowRight,
  ChevronRight,
  Trophy,
  Code2,
  Loader2,
  Calendar,
  Tag as TagIcon,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface DailyProblem {
  id: string;
  slug: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  xp_reward: number;
  xp_multiplier: number;
  description_markdown: string;
  tags: { id: string; name: string; slug: string }[];
  daily_date: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string;
}

const DIFFICULTY_STYLES = {
  Easy: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20',
    glow: 'shadow-emerald-500/20',
  },
  Medium: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20',
    glow: 'shadow-amber-500/20',
  },
  Hard: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/20',
    glow: 'shadow-rose-500/20',
  },
};

export default function DailyChallengePage() {
  const router = useRouter();
  const [problem, setProblem] = useState<DailyProblem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    async function loadDaily() {
      try {
        const data = await apiClient.get<DailyProblem>('/problems/daily/');
        setProblem(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load daily challenge.');
      } finally {
        setLoading(false);
      }
    }
    loadDaily();
  }, []);

  // Countdown to midnight (when the daily problem resets)
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
      );
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-slate-400">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
          <span className="text-sm font-semibold">Loading today's challenge...</span>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-center px-4">
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto">
            <Code2 className="w-8 h-8 text-rose-400" />
          </div>
          <h2 className="text-xl font-bold text-white">No daily challenge yet</h2>
          <p className="text-sm text-slate-400 max-w-xs">
            {error || 'No problems have been seeded yet. Run seed_all.py to get started.'}
          </p>
          <Link
            href="/problems"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all"
          >
            Browse All Problems
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const diff = DIFFICULTY_STYLES[problem.difficulty] ?? DIFFICULTY_STYLES.Easy;
  const dateStr = new Date(problem.daily_date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8 space-y-8 animate-fade-in">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/20 bg-gradient-to-br from-amber-950/50 via-orange-900/30 to-slate-950 p-6 lg:p-10 shadow-2xl">
        {/* Ambient glows */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3">
            {/* Label pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 animate-pulse" />
              Daily Challenge — XP ×2 Bonus
            </div>

            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight">
              {problem.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* Difficulty badge */}
              <span
                className={`px-3 py-1 rounded-full font-bold border ${diff.bg} ${diff.text} ${diff.border}`}
              >
                {problem.difficulty}
              </span>

              {/* XP reward */}
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold">
                <Star className="w-3.5 h-3.5" />
                {problem.xp_reward * (problem.xp_multiplier ?? 2)} XP (×2 Bonus)
              </span>

              {/* Date */}
              <span className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                {dateStr}
              </span>
            </div>
          </div>

          {/* Countdown */}
          <div className="shrink-0 flex flex-col items-center gap-2 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Resets in
            </span>
            <span className="text-3xl font-black text-amber-400 tabular-nums tracking-tight">
              {countdown}
            </span>
          </div>
        </div>
      </div>

      {/* Problem Preview Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Description */}
        <div className="lg:col-span-2 space-y-5">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
            <h2 className="font-bold text-white text-lg">Problem Description</h2>
            <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
              {problem.description_markdown}
            </p>
          </div>

          {/* Examples */}
          {problem.examples && problem.examples.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <h2 className="font-bold text-white text-lg">Examples</h2>
              {problem.examples.map((ex, i) => (
                <div key={i} className="space-y-2 bg-slate-950/60 rounded-xl p-4 border border-slate-800/80">
                  <p className="text-xs font-bold text-slate-400">Example {i + 1}</p>
                  <div className="font-mono text-xs text-slate-300 space-y-1">
                    <div>
                      <span className="text-slate-500">Input: </span>
                      <span className="text-cyan-300">{ex.input}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Output: </span>
                      <span className="text-emerald-300">{ex.output}</span>
                    </div>
                    {ex.explanation && (
                      <div className="text-slate-400 italic pt-1">{ex.explanation}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* CTA */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Double XP Active!</p>
                <p className="text-xs text-slate-400">Earn {problem.xp_reward * 2} XP on first solve</p>
              </div>
            </div>

            <button
              onClick={() => router.push(`/problems/${problem.slug}`)}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-amber-500/25"
            >
              <Zap className="w-4 h-4" />
              Start Challenge
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Tags */}
          {problem.tags && problem.tags.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <TagIcon className="w-3.5 h-3.5" />
                Topic Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {problem.tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/problems?tag=${tag.slug}`}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                  >
                    {tag.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Constraints */}
          {problem.constraints && (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Constraints</h3>
              <div className="font-mono text-xs text-slate-400 space-y-1">
                {problem.constraints.split('\n').map((c, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 mt-1.5 shrink-0" />
                    <span>{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Browse all */}
          <Link
            href="/problems"
            className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/40 border border-slate-800 hover:bg-slate-800/60 transition-colors group"
          >
            <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
              Browse all problems
            </span>
            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}
