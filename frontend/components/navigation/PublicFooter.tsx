'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, Heart } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
                <Cpu className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">AlgoForge</span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              Full-stack platform to learn Data Structures & Algorithms with real-time code execution visualization, failure diagnostics, and 290+ curated problems.
            </p>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px] mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link href="/features" className="hover:text-cyan-400 transition-colors">Platform Features</Link></li>
              <li><Link href="/how-it-works" className="hover:text-cyan-400 transition-colors">How It Works</Link></li>
              <li><Link href="/problems" className="hover:text-cyan-400 transition-colors">Problem Library</Link></li>
              <li><Link href="/visualizer" className="hover:text-cyan-400 transition-colors">Algorithm Visualizer</Link></li>
              <li><Link href="/visualizer/ds" className="hover:text-cyan-400 transition-colors">Data Structure Lab</Link></li>
              <li><Link href="/roadmap" className="hover:text-cyan-400 transition-colors">DSA Roadmap</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px] mb-3">Learning Topics</h4>
            <ul className="space-y-2">
              <li><Link href="/problems?tag=array" className="hover:text-cyan-400 transition-colors">Arrays & Two Pointers</Link></li>
              <li><Link href="/problems?tag=binary-search" className="hover:text-cyan-400 transition-colors">Binary Search Patterns</Link></li>
              <li><Link href="/problems?tag=linked-list" className="hover:text-cyan-400 transition-colors">Linked Lists</Link></li>
              <li><Link href="/problems?tag=binary-tree" className="hover:text-cyan-400 transition-colors">Trees & Binary Search Trees</Link></li>
              <li><Link href="/problems?tag=graph" className="hover:text-cyan-400 transition-colors">Graphs & Shortest Paths</Link></li>
              <li><Link href="/problems?tag=dynamic-programming" className="hover:text-cyan-400 transition-colors">Dynamic Programming</Link></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div>
            <h4 className="text-slate-200 font-bold uppercase tracking-wider text-[11px] mb-3">Engine & Architecture</h4>
            <p className="text-xs text-slate-500 mb-3">
              Powered by Next.js 16 App Router, Django REST Framework, Monaco Code Editor, and PostgreSQL database.
            </p>
            <div className="flex items-center gap-3 text-slate-400">
              <Link href="/login" className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white">
                Sign In
              </Link>
              <Link href="/register" className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs font-semibold text-cyan-400 hover:bg-cyan-500/20">
                Register
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} AlgoForge DSA Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for mastery in algorithmic problem solving
          </p>
        </div>
      </div>
    </footer>
  );
}
