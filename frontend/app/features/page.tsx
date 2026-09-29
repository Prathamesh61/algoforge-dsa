'use client';

import React from 'react';
import Link from 'next/link';
import {
  Cpu,
  Terminal,
  Play,
  Layers,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Code2,
  Database,
  BarChart3,
  Flame,
  ShieldCheck
} from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      title: 'Interactive Code Execution Visualizer',
      desc: 'Step forward and backward through your algorithm execution. View current active lines highlighted in Monaco editor and live snapshots of local variables.',
      icon: Terminal,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10'
    },
    {
      title: 'Actionable Failure Diagnostics',
      desc: 'Never get stuck on "Wrong Answer" again. Inspect the exact line where your logic diverged from expected output, along with input and variable states.',
      icon: ShieldCheck,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10'
    },
    {
      title: '290+ High-Variety Problem Library',
      desc: 'Carefully curated problems covering all 19 major DSA paradigms: arrays, sliding window, two pointers, trees, graphs, heaps, and dynamic programming.',
      icon: Code2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      title: 'Algorithm & Data Structure Lab',
      desc: 'Simulate sorting, searching, linked lists, stacks, queues, trees, BFS/DFS, and dynamic programming grids with speed and pause controls.',
      icon: Cpu,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10'
    },
    {
      title: 'Gamified Progress & Streaks',
      desc: 'Earn XP, level up, unlock achievements, and maintain your practice streak with genuine backend persistence.',
      icon: Flame,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10'
    },
    {
      title: 'Unified Global Search (⌘K)',
      desc: 'Instantly find problems, algorithms, lessons, courses, and roadmap milestones with fast keyboard-driven search.',
      icon: Sparkles,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 animate-fade-in">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
          Platform Capabilities
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Engineered for Deep Algorithmic Mastery
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          AlgoForge combines a real sandbox compiler judge, line-by-line variable tracers, and interactive simulations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4 hover:border-slate-700 transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center ${f.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-8">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <span>Get Started with AlgoForge</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
