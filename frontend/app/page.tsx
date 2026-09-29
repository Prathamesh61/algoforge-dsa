'use client';

import React from 'react';
import Link from 'next/link';
import {
  Cpu,
  Sparkles,
  ArrowRight,
  Code2,
  Play,
  Layers,
  CheckCircle2,
  Flame,
  Star,
  Trophy,
  Compass,
  Zap,
  ShieldCheck,
  Terminal,
  ChevronRight,
  BarChart3,
  GitBranch,
  Search,
  BookOpen
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

export default function PublicLandingPage() {
  const { user } = useAuth();

  const roadmapSteps = [
    { name: 'Foundations & Complexity', desc: 'Big-O notation, space-time analysis, pointers' },
    { name: 'Arrays & Dynamic Sizing', desc: 'Sliding window, two pointers, prefix sums' },
    { name: 'Strings & Hashing', desc: 'Pattern matching, frequency maps, hashing' },
    { name: 'Searching & Binary Search', desc: 'Logarithmic search, bounds, search space' },
    { name: 'Sorting Algorithms', desc: 'Merge, Quick, Heap, Bubble, Insertion, Selection' },
    { name: 'Recursion & Backtracking', desc: 'Call stacks, pruning, decision trees' },
    { name: 'Linked Lists', desc: 'Singly, doubly, cycle detection, reordering' },
    { name: 'Stacks & Queues', desc: 'Monotonic stacks, circular buffers, deque' },
    { name: 'Binary Trees & BST', desc: 'DFS traversals, LCA, serialization, balanced trees' },
    { name: 'Heaps & Priority Queues', desc: 'Min/max heaps, top-K problems, task scheduling' },
    { name: 'Graphs & Traversals', desc: 'BFS, DFS, Dijkstra, Kahn’s topological sort, DSU' },
    { name: 'Greedy Algorithms', desc: 'Interval scheduling, activity selection, optimal choice' },
    { name: 'Dynamic Programming', desc: 'Memoization, tabulation, knapsack, LCS, LIS' },
  ];

  return (
    <div className="flex flex-col space-y-20 pb-20 animate-fade-in">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        {/* Glow ambient background lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Full-Stack DSA Platform & Execution Judge</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-none">
            Master Data Structures & Algorithms Through <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">Interactive Learning</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Learn DSA step by step, visualize algorithms in real-time, execute and trace code line-by-line, and understand exactly where and why your solution fails.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
                >
                  <span>Start Learning Free</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/visualizer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm border border-slate-800 transition-all hover:border-slate-700"
                >
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Explore Algorithm Lab</span>
                </Link>
              </>
            )}
          </div>

          {/* Value Highlights Pill Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 text-left">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <div className="text-xl font-black text-cyan-400">290+</div>
              <div className="text-xs text-slate-400 font-medium">Curated Problems</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <div className="text-xl font-black text-indigo-400">100%</div>
              <div className="text-xs text-slate-400 font-medium">Step Execution Trace</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <div className="text-xl font-black text-emerald-400">19</div>
              <div className="text-xs text-slate-400 font-medium">Core DSA Categories</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm">
              <div className="text-xl font-black text-amber-400">0 ms</div>
              <div className="text-xs text-slate-400 font-medium">Instant Test Feedback</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Feature Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Platform Capabilities</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Everything You Need to Crack Technical Interviews</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            A cohesive environment designed to take you from foundational syntax to advanced dynamic programming.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Learn */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-cyan-500/30 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Structured Courses & Lessons</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Step-by-step curriculum with complexity analysis, visual walkthroughs, intuition breakdowns, and practice checks for every topic.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Beginner → Advanced progression
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> In-depth time & space analysis
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Interactive code examples
              </li>
            </ul>
          </div>

          {/* Card 2: Visualize */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-indigo-500/30 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Live Algorithm & DS Visualizer</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Witness pointer shifts, comparisons, swaps, recursive call trees, and DP state transitions step-by-step in real-time.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Arrays, Lists, Stacks, Queues
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Trees, Graphs, BFS/DFS, Dijkstra
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Playback controls, step forward/backward
              </li>
            </ul>
          </div>

          {/* Card 3: Practice & Diagnostic Judge */}
          <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm hover:border-emerald-500/30 transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Online Judge & Failure Diagnostics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When your solution fails, don’t just get "Wrong Answer". Inspect the exact line of failure, variable values, and execution path.
            </p>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 290+ classic & modern problems
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Variable snapshots at failure line
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Public & hidden test case suites
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Section: Structured Roadmap */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Mastery Pathway</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Full-Stack DSA Roadmap</h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Follow a tested progression tier-by-tier with prerequisites and milestones.
            </p>
          </div>
          <Link
            href="/roadmap"
            className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>View Interactive Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {roadmapSteps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3.5 hover:border-slate-700 transition-all"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-black flex items-center justify-center shrink-0">
                {idx + 1}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">{step.name}</h4>
                <p className="text-[11px] text-slate-400 leading-snug">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Section: Gamification & Progress */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-cyan-950/60 border border-slate-800 p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                Track Real Growth
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">XP, Streaks, Levels, and Badges</h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Stay motivated with a gamified learning engine that records your daily coding minutes, tracks practice streaks, and awards achievements when you pass test cases.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Link
                href="/register"
                className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
              >
                Create Free Account
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-800 transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
