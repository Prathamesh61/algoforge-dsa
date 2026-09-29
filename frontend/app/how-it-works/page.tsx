'use client';

import React from 'react';
import Link from 'next/link';
import {
  Compass,
  Code2,
  Play,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Layers,
  Cpu,
  Trophy
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      step: '01',
      title: 'Pick a Roadmap Node or Topic',
      desc: 'Start at Foundations, or jump directly into Arrays, Trees, or Dynamic Programming depending on your skill level.',
      icon: Compass,
      color: 'text-cyan-400'
    },
    {
      step: '02',
      title: 'Learn the Concept Visually',
      desc: 'Understand algorithm intuition with step-by-step animations showing array swaps, pointer movements, and recursion trees.',
      icon: Cpu,
      color: 'text-indigo-400'
    },
    {
      step: '03',
      title: 'Write Code in the Monaco Studio',
      desc: 'Use our online compiler in Python, JavaScript, or C++ with starter templates, test case inputs, and syntax highlighting.',
      icon: Code2,
      color: 'text-amber-400'
    },
    {
      step: '04',
      title: 'Trace and Visualize Your Execution',
      desc: 'Click "Visualize" to watch your actual code run line-by-line, tracking variable states and call stack frames in real-time.',
      icon: Play,
      color: 'text-emerald-400'
    },
    {
      step: '05',
      title: 'Submit & Diagnose Failures',
      desc: 'Run against hidden test cases. If your code fails, inspect the failing line, input data, and variable snapshot to fix it instantly.',
      icon: CheckCircle2,
      color: 'text-rose-400'
    },
    {
      step: '06',
      title: 'Earn XP & Level Up',
      desc: 'Build streaks, unlock achievement badges, and climb the leaderboard as your problem solving skills accelerate.',
      icon: Trophy,
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16 animate-fade-in">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          Step-by-Step Workflow
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          How AlgoForge Accelerates Your Learning
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          From first intuition to debugging tricky edge cases, here is the proven pathway.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4 relative"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center ${s.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black text-slate-700">{s.step}</span>
              </div>
              <h3 className="text-base font-bold text-white">{s.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-8">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <span>Start Practicing Today</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
