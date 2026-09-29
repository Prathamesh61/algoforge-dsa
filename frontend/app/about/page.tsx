'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, ArrowRight, ShieldCheck, Heart, Layers, Terminal } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12 animate-fade-in">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20">
          <Cpu className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          About AlgoForge
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Bridging the gap between reading algorithmic theory and building true implementation confidence.
        </p>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-6 text-slate-300 text-sm leading-relaxed">
        <h2 className="text-xl font-bold text-white">Our Mission</h2>
        <p>
          Data Structures and Algorithms are commonly taught either purely theoretically in academia, or tested through rigid online judges that merely report "Wrong Answer" on hidden test case 47.
        </p>
        <p>
          We created AlgoForge to solve this frustration. When learners write code, they deserve to see what their code is doing: which pointers moved, which variables held unexpected values, and on which exact line of code the invariants broke.
        </p>

        <h3 className="text-lg font-bold text-white pt-4">Full-Stack Technology Stack</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <li className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="font-bold text-cyan-400">Next.js 16 App Router:</span> High performance frontend with server and client components.
          </li>
          <li className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="font-bold text-cyan-400">Django REST Framework:</span> Robust, modular backend engine with JWT authentication.
          </li>
          <li className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="font-bold text-cyan-400">Monaco Code Editor:</span> Industry standard VS Code editor embedded with multi-language support.
          </li>
          <li className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
            <span className="font-bold text-cyan-400">Sandboxed Execution Judge:</span> Isolated subprocess runtime with line tracer and resource limits.
          </li>
        </ul>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/register"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-xl shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <span>Get Started Free</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
