'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, 
  Search, 
  CheckCircle2, 
  Circle, 
  Zap, 
  Tag as TagIcon, 
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  Flame,
  ArrowRight
} from 'lucide-react';
import { ProblemListItem, ProblemDifficulty, ProblemTag } from '@/types';

// Fallback seed data in case backend server is unreachable
const FALLBACK_PROBLEMS: ProblemListItem[] = [
  {
    id: '1',
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    xp_reward: 20,
    tags: ['Array', 'Hash Map'],
    is_solved: false
  },
  {
    id: '2',
    slug: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    xp_reward: 20,
    tags: ['Array', 'Binary Search'],
    is_solved: false
  },
  {
    id: '3',
    slug: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    xp_reward: 20,
    tags: ['String', 'Two Pointers'],
    is_solved: false
  },
  {
    id: '4',
    slug: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    xp_reward: 35,
    tags: ['Array', 'Dynamic Programming'],
    is_solved: false
  },
  {
    id: '5',
    slug: 'search-in-rotated-sorted-array',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    xp_reward: 40,
    tags: ['Array', 'Binary Search'],
    is_solved: false
  },
  {
    id: '6',
    slug: 'median-of-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'Hard',
    xp_reward: 60,
    tags: ['Array', 'Binary Search'],
    is_solved: false
  }
];

const DIFFICULTY_COLORS: Record<ProblemDifficulty, { bg: string; text: string; border: string }> = {
  Easy: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/20'
  },
  Medium: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20'
  },
  Hard: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    border: 'border-rose-500/20'
  }
};

export default function ProblemsPage() {
  const [problems, setProblems] = useState<ProblemListItem[]>(FALLBACK_PROBLEMS);
  const [tags, setTags] = useState<ProblemTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  useEffect(() => {
    async function loadData() {
      try {
        const [probRes, tagRes] = await Promise.all([
          fetch('http://127.0.0.1:8000/api/v1/problems/'),
          fetch('http://127.0.0.1:8000/api/v1/problems/tags/')
        ]);
        if (probRes.ok) {
          const pData = await probRes.json();
          if (Array.isArray(pData) && pData.length > 0) {
            setProblems(pData);
          }
        }
        if (tagRes.ok) {
          const tData = await tagRes.json();
          if (Array.isArray(tData)) {
            setTags(tData);
          }
        }
      } catch (err) {
        console.warn('Backend unavailable, rendering seeded problem set.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProblems = problems.filter((prob) => {
    const matchesSearch =
      prob.title.toLowerCase().includes(search.toLowerCase()) ||
      prob.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesDifficulty =
      selectedDifficulty === 'all' ||
      prob.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

    const matchesTag =
      selectedTag === 'all' ||
      prob.tags.some(
        (t) =>
          t.toLowerCase().replace(/\\s+/g, '-') ===
          selectedTag.toLowerCase().replace(/\\s+/g, '-')
      );

    return matchesSearch && matchesDifficulty && matchesTag;
  });

  const totalXp = problems.reduce((acc, p) => acc + (p.xp_reward || 0), 0);
  const solvedCount = problems.filter((p) => p.is_solved).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-purple-900/40 border border-blue-500/20 p-6 lg:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              Practice Arena
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Data Structure & Algorithm Problems
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm lg:text-base leading-relaxed">
              Curated coding problems with multi-language execution, automated test cases, and instant feedback. Solve challenges to earn XP and level up your mastery.
            </p>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex items-center gap-4">
            <div className="px-5 py-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur text-center shadow-lg">
              <div className="text-2xl font-black text-blue-400">{problems.length}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Problems</div>
            </div>
            <div className="px-5 py-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur text-center shadow-lg">
              <div className="text-2xl font-black text-amber-400">+{totalXp}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Total XP</div>
            </div>
            <div className="px-5 py-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur text-center shadow-lg">
              <div className="text-2xl font-black text-emerald-400">{solvedCount}</div>
              <div className="text-xs text-slate-400 font-medium mt-0.5">Solved</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search problems by name or tag..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-inner"
            />
          </div>

          {/* Difficulty Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {['all', 'Easy', 'Medium', 'Hard'].map((diff) => {
              const active = selectedDifficulty === diff.toLowerCase();
              return (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff.toLowerCase())}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-400'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tags Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className="text-slate-500 flex items-center gap-1 font-medium pl-1 pr-2">
            <TagIcon className="w-3.5 h-3.5" /> Topics:
          </span>
          <button
            onClick={() => setSelectedTag('all')}
            className={`px-3 py-1 rounded-md transition-all whitespace-nowrap ${
              selectedTag === 'all'
                ? 'bg-slate-800 text-blue-400 font-semibold border border-blue-500/30'
                : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            All Topics
          </button>
          {['Array', 'String', 'Binary Search', 'Two Pointers', 'Dynamic Programming', 'Hash Map', 'Sorting'].map(
            (tag) => {
              const tagSlug = tag.toLowerCase().replace(/\\s+/g, '-');
              const active = selectedTag === tagSlug;
              return (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tagSlug)}
                  className={`px-3 py-1 rounded-md transition-all whitespace-nowrap ${
                    active
                      ? 'bg-blue-900/40 text-blue-300 font-semibold border border-blue-500/40 shadow-sm'
                      : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {tag}
                </button>
              );
            }
          )}
        </div>
      </div>

      {/* Problem Table / Grid */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm">
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-medium">
          <div className="flex items-center gap-6">
            <span className="w-6">Status</span>
            <span>Title & Concepts</span>
          </div>
          <div className="flex items-center gap-8 pr-4">
            <span className="w-20 text-center">Difficulty</span>
            <span className="w-16 text-center">Reward</span>
            <span className="w-24 text-right">Action</span>
          </div>
        </div>

        <div className="divide-y divide-slate-800/60">
          <AnimatePresence>
            {filteredProblems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center space-y-3"
              >
                <Code2 className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-slate-400 font-medium">No problems match your current filter.</p>
                <button
                  onClick={() => {
                    setSearch('');
                    setSelectedDifficulty('all');
                    setSelectedTag('all');
                  }}
                  className="text-xs text-blue-400 hover:underline"
                >
                  Reset filters
                </button>
              </motion.div>
            ) : (
              filteredProblems.map((prob, index) => {
                const diffColor =
                  DIFFICULTY_COLORS[prob.difficulty] || DIFFICULTY_COLORS.Easy;
                return (
                  <motion.div
                    key={prob.id || prob.slug}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="group hover:bg-slate-800/40 transition-colors px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Left: Status + Title + Tags */}
                    <div className="flex items-start md:items-center gap-4 flex-1">
                      <div className="mt-1 md:mt-0 text-slate-600">
                        {prob.is_solved ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-700 group-hover:text-slate-500 transition-colors" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <Link
                          href={`/problems/${prob.slug}`}
                          className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors text-base flex items-center gap-2"
                        >
                          {prob.title}
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-400" />
                        </Link>
                        <div className="flex flex-wrap gap-1.5 items-center">
                          {prob.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[11px] px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700/50"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Difficulty + XP + Button */}
                    <div className="flex items-center justify-between md:justify-end gap-6 pt-2 md:pt-0 border-t border-slate-800/40 md:border-0">
                      {/* Difficulty Badge */}
                      <span
                        className={`w-20 text-center text-xs font-semibold px-2.5 py-1 rounded-full border ${diffColor.bg} ${diffColor.text} ${diffColor.border}`}
                      >
                        {prob.difficulty}
                      </span>

                      {/* XP Pill */}
                      <span className="w-16 flex items-center justify-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
                        <Zap className="w-3 h-3 fill-amber-400" />
                        +{prob.xp_reward || 20}
                      </span>

                      {/* Solve Challenge Button */}
                      <Link
                        href={`/problems/${prob.slug}`}
                        className="w-28 text-center px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 inline-flex items-center justify-center gap-1 group/btn"
                      >
                        <span>Solve</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
