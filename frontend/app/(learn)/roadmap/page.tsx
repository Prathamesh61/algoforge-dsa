'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Map, 
  CheckCircle2, 
  Lock, 
  Play, 
  ArrowRight, 
  Clock, 
  Layers, 
  Sparkles, 
  BookOpen, 
  Code2, 
  ChevronRight, 
  X,
  Compass,
  Zap,
  Flame
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

interface RoadmapNode {
  id: string;
  slug: string;
  title: string;
  tier: number;
  category: string;
  description: string;
  icon: string;
  estimated_hours: number;
  display_order: number;
  linked_course_slug?: string;
  linked_lesson_slug?: string;
  linked_tag_slug?: string;
  prerequisite_slugs: string[];
  status: 'locked' | 'in_progress' | 'completed';
  progress_percentage: number;
}

interface RoadmapData {
  id: string;
  slug: string;
  title: string;
  description: string;
  nodes: RoadmapNode[];
  stats: {
    total_nodes: number;
    completed_nodes: number;
    in_progress_nodes: number;
    overall_percentage: number;
  };
}

const FALLBACK_ROADMAP: RoadmapData = {
  id: 'r1',
  slug: 'dsa-mastery',
  title: 'DSA Mastery Curriculum',
  description: 'A structured, progressive path taking you from algorithmic foundations to advanced dynamic programming and graph theory.',
  stats: {
    total_nodes: 14,
    completed_nodes: 4,
    in_progress_nodes: 2,
    overall_percentage: 28
  },
  nodes: [
    {
      id: 'n1',
      slug: 'time-space-complexity',
      title: 'Time & Space Complexity (Big-O)',
      tier: 1,
      category: 'Foundations',
      description: 'Analyze asymptotic behavior, Big-O, Big-Omega, Big-Theta notation, and memory footprints.',
      icon: 'Clock',
      estimated_hours: 3,
      display_order: 1,
      linked_course_slug: 'dsa-foundations',
      linked_lesson_slug: 'intro-to-big-o',
      linked_tag_slug: '',
      prerequisite_slugs: [],
      status: 'completed',
      progress_percentage: 100
    },
    {
      id: 'n2',
      slug: 'arrays-memory',
      title: 'Arrays & Memory Layout',
      tier: 1,
      category: 'Foundations',
      description: 'Contiguous memory allocation, random access indexing, dynamic resizing vectors.',
      icon: 'Layers',
      estimated_hours: 4,
      display_order: 2,
      linked_course_slug: 'dsa-foundations',
      linked_lesson_slug: 'arrays-memory-model',
      linked_tag_slug: 'array',
      prerequisite_slugs: [],
      status: 'completed',
      progress_percentage: 100
    },
    {
      id: 'n3',
      slug: 'two-pointers',
      title: 'Two-Pointer Technique',
      tier: 2,
      category: 'Core Techniques',
      description: 'Opposite-end and fast/slow pointer paradigms for linear and sorted array problems.',
      icon: 'SlidersHorizontal',
      estimated_hours: 5,
      display_order: 1,
      linked_course_slug: 'dsa-foundations',
      linked_lesson_slug: 'two-pointer-technique',
      linked_tag_slug: 'two-pointers',
      prerequisite_slugs: ['arrays-memory'],
      status: 'completed',
      progress_percentage: 100
    },
    {
      id: 'n4',
      slug: 'hash-maps',
      title: 'Hash Tables & Fast Lookup',
      tier: 2,
      category: 'Core Techniques',
      description: 'Hashing functions, collision resolution strategies, and O(1) average lookup patterns.',
      icon: 'Zap',
      estimated_hours: 4,
      display_order: 2,
      linked_course_slug: 'dsa-foundations',
      linked_lesson_slug: '',
      linked_tag_slug: 'hash-map',
      prerequisite_slugs: ['arrays-memory'],
      status: 'completed',
      progress_percentage: 100
    },
    {
      id: 'n5',
      slug: 'binary-search',
      title: 'Binary Search & Lower Bound',
      tier: 3,
      category: 'Search & Sort',
      description: 'Logarithmic search boundaries, predicate monotonic functions, and rotated array search.',
      icon: 'Search',
      estimated_hours: 6,
      display_order: 1,
      linked_course_slug: 'dsa-foundations',
      linked_lesson_slug: 'binary-search-masterclass',
      linked_tag_slug: 'binary-search',
      prerequisite_slugs: ['arrays-memory', 'two-pointers'],
      status: 'in_progress',
      progress_percentage: 75
    },
    {
      id: 'n6',
      slug: 'sorting-algorithms',
      title: 'Divide & Conquer Sorting',
      tier: 3,
      category: 'Search & Sort',
      description: 'Merge Sort, Quick Sort, stability properties, and comparative sorting limits.',
      icon: 'ArrowDownUp',
      estimated_hours: 6,
      display_order: 2,
      linked_course_slug: 'dsa-foundations',
      linked_lesson_slug: '',
      linked_tag_slug: 'sorting',
      prerequisite_slugs: ['time-space-complexity', 'arrays-memory'],
      status: 'in_progress',
      progress_percentage: 40
    },
    {
      id: 'n7',
      slug: 'linked-lists',
      title: 'Linked Lists & Pointers',
      tier: 4,
      category: 'Linear Structures',
      description: 'Singly and doubly linked lists, reversal in-place, and cycle detection.',
      icon: 'Link',
      estimated_hours: 5,
      display_order: 1,
      linked_course_slug: 'dsa-foundations',
      linked_lesson_slug: '',
      linked_tag_slug: '',
      prerequisite_slugs: ['arrays-memory'],
      status: 'locked',
      progress_percentage: 0
    },
    {
      id: 'n8',
      slug: 'stacks-queues',
      title: 'Stacks & Queues (Monotonic)',
      tier: 4,
      category: 'Linear Structures',
      description: 'LIFO/FIFO invariants, circular queues, and next greater element monotonic stacks.',
      icon: 'Layers',
      estimated_hours: 5,
      display_order: 2,
      linked_course_slug: 'dsa-foundations',
      linked_lesson_slug: '',
      linked_tag_slug: '',
      prerequisite_slugs: ['arrays-memory'],
      status: 'locked',
      progress_percentage: 0
    },
    {
      id: 'n9',
      slug: 'binary-trees',
      title: 'Binary Trees & BST Operations',
      tier: 5,
      category: 'Trees',
      description: 'Recursive tree traversals (Inorder, Preorder, Postorder), BST search and balance.',
      icon: 'GitFork',
      estimated_hours: 7,
      display_order: 1,
      linked_course_slug: 'trees-and-graphs',
      linked_lesson_slug: '',
      linked_tag_slug: '',
      prerequisite_slugs: ['linked-lists', 'stacks-queues'],
      status: 'locked',
      progress_percentage: 0
    },
    {
      id: 'n10',
      slug: 'heaps',
      title: 'Binary Heaps & Priority Queues',
      tier: 5,
      category: 'Trees',
      description: 'Min-heap and max-heap array representation, heapify, and Top-K elements.',
      icon: 'Award',
      estimated_hours: 5,
      display_order: 2,
      linked_course_slug: 'trees-and-graphs',
      linked_lesson_slug: '',
      linked_tag_slug: '',
      prerequisite_slugs: ['binary-trees', 'arrays-memory'],
      status: 'locked',
      progress_percentage: 0
    },
    {
      id: 'n11',
      slug: 'graphs-traversal',
      title: 'Graph Traversal (BFS & DFS)',
      tier: 6,
      category: 'Graphs',
      description: 'Adjacency lists/matrices, connected components, cycle detection, topological sort.',
      icon: 'Network',
      estimated_hours: 8,
      display_order: 1,
      linked_course_slug: 'trees-and-graphs',
      linked_lesson_slug: '',
      linked_tag_slug: '',
      prerequisite_slugs: ['binary-trees', 'stacks-queues'],
      status: 'locked',
      progress_percentage: 0
    },
    {
      id: 'n12',
      slug: 'shortest-paths',
      title: 'Shortest Paths (Dijkstra)',
      tier: 6,
      category: 'Graphs',
      description: 'Greedy shortest path on weighted graphs with priority queue optimization.',
      icon: 'Compass',
      estimated_hours: 7,
      display_order: 2,
      linked_course_slug: 'trees-and-graphs',
      linked_lesson_slug: '',
      linked_tag_slug: '',
      prerequisite_slugs: ['graphs-traversal', 'heaps'],
      status: 'locked',
      progress_percentage: 0
    },
    {
      id: 'n13',
      slug: 'dp-1d',
      title: '1D Dynamic Programming',
      tier: 7,
      category: 'Optimization',
      description: 'Overlapping subproblems, memoization vs tabulation, optimal substructure.',
      icon: 'Sparkles',
      estimated_hours: 8,
      display_order: 1,
      linked_course_slug: 'dynamic-programming',
      linked_lesson_slug: '',
      linked_tag_slug: 'dynamic-programming',
      prerequisite_slugs: ['binary-search', 'two-pointers'],
      status: 'locked',
      progress_percentage: 0
    },
    {
      id: 'n14',
      slug: 'dp-2d',
      title: '2D Grid & Knapsack DP',
      tier: 7,
      category: 'Optimization',
      description: '0/1 Knapsack, Longest Common Subsequence, matrix state transitions.',
      icon: 'Grid',
      estimated_hours: 10,
      display_order: 2,
      linked_course_slug: 'dynamic-programming',
      linked_lesson_slug: '',
      linked_tag_slug: 'dynamic-programming',
      prerequisite_slugs: ['dp-1d'],
      status: 'locked',
      progress_percentage: 0
    }
  ]
};

const TIER_NAMES: Record<number, string> = {
  1: 'Tier 1 • Foundations & Asymptotics',
  2: 'Tier 2 • Core Sequences & Pointers',
  3: 'Tier 3 • Classic Search & Sorting',
  4: 'Tier 4 • Linear Data Structures',
  5: 'Tier 5 • Hierarchical Trees & Heaps',
  6: 'Tier 6 • Graphs & Network Traversal',
  7: 'Tier 7 • Dynamic Programming & Optimization'
};

export default function RoadmapPage() {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<RoadmapData>(FALLBACK_ROADMAP);
  const [selectedNode, setSelectedNode] = useState<RoadmapNode | null>(null);

  useEffect(() => {
    async function loadRoadmap() {
      try {
        const token = localStorage.getItem('algoforge_access_token');
        const res = await fetch('http://127.0.0.1:8000/api/v1/roadmaps/dsa-mastery/', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.nodes && data.nodes.length > 0) {
            setRoadmap(data);
          }
        }
      } catch (err) {
        console.warn('Roadmap API offline, rendering seeded path.');
      }
    }
    loadRoadmap();
  }, []);

  // Group nodes by tier
  const tiers = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 lg:p-8 space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/40 via-teal-900/30 to-indigo-950/40 border border-emerald-500/20 p-6 lg:p-10 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              Learning Path
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              {roadmap.title}
            </h1>
            <p className="text-slate-400 max-w-2xl text-sm lg:text-base leading-relaxed">
              {roadmap.description}
            </p>
          </div>

          {/* Progress Overview */}
          <div className="px-6 py-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur shadow-lg min-w-[240px] space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400">Curriculum Mastery</span>
              <span className="text-emerald-400 font-bold">{roadmap.stats?.overall_percentage}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${roadmap.stats?.overall_percentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
              <span>{roadmap.stats?.completed_nodes} Completed</span>
              <span>{roadmap.stats?.in_progress_nodes} In Progress</span>
              <span>{roadmap.stats?.total_nodes} Total Nodes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tier-by-Tier Stage Map */}
      <div className="space-y-10 relative max-w-5xl mx-auto">
        {tiers.map((tierNum, tIdx) => {
          const tierNodes = roadmap.nodes.filter((n) => n.tier === tierNum);
          if (tierNodes.length === 0) return null;

          return (
            <div key={tierNum} className="space-y-4">
              {/* Tier Header */}
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 text-emerald-400 font-black flex items-center justify-center text-xs shadow-md">
                  {tierNum}
                </div>
                <h2 className="text-base font-bold text-slate-200 tracking-wide">
                  {TIER_NAMES[tierNum] || `Tier ${tierNum}`}
                </h2>
                <div className="flex-1 h-px bg-slate-800/80" />
              </div>

              {/* Tier Nodes Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tierNodes.map((node) => {
                  const isCompleted = node.status === 'completed';
                  const isInProgress = node.status === 'in_progress';
                  const isLocked = node.status === 'locked';

                  return (
                    <motion.div
                      key={node.id}
                      whileHover={{ scale: isLocked ? 1 : 1.015 }}
                      onClick={() => setSelectedNode(node)}
                      className={`cursor-pointer rounded-2xl p-5 border transition-all relative overflow-hidden shadow-lg ${
                        isCompleted
                          ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-500/70 shadow-emerald-500/5'
                          : isInProgress
                          ? 'bg-slate-900/90 border-blue-500/40 hover:border-blue-500/70 ring-1 ring-blue-500/20 shadow-blue-500/10'
                          : 'bg-slate-900/40 border-slate-800/80 opacity-65 hover:opacity-85'
                      }`}
                    >
                      {/* Node Status Badge */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                            isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            isInProgress ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                            'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}>
                            {node.category}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {node.estimated_hours}h
                          </span>
                        </div>

                        {isCompleted ? (
                          <div className="flex items-center gap-1 text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Done</span>
                          </div>
                        ) : isInProgress ? (
                          <div className="flex items-center gap-1 text-xs text-blue-400 font-bold bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20 animate-pulse">
                            <Play className="w-3 h-3 fill-blue-400" />
                            <span>{node.progress_percentage}%</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-xs text-slate-500 font-bold bg-slate-800 px-2 py-1 rounded-full border border-slate-700">
                            <Lock className="w-3 h-3" />
                            <span>Locked</span>
                          </div>
                        )}
                      </div>

                      {/* Title & Description */}
                      <h3 className="font-bold text-white text-base mb-1.5 flex items-center justify-between">
                        <span>{node.title}</span>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors" />
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {node.description}
                      </p>

                      {/* Progress Bar (if in-progress or completed) */}
                      {!isLocked && (
                        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                          <span className="text-[11px] text-slate-500 font-medium">Stage Progress</span>
                          <div className="w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden ml-3">
                            <div
                              className={`h-full rounded-full ${
                                isCompleted ? 'bg-emerald-400' : 'bg-blue-500'
                              }`}
                              style={{ width: `${node.progress_percentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Node Details Slide-Out Modal / Drawer */}
      <AnimatePresence>
        {selectedNode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl space-y-6"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedNode(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Tier {selectedNode.tier} • {selectedNode.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" /> {selectedNode.estimated_hours} Hours Estimated
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  {selectedNode.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {selectedNode.description}
                </p>
              </div>

              {/* Prerequisites check */}
              {selectedNode.prerequisite_slugs.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Prerequisites
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedNode.prerequisite_slugs.map((slug) => (
                      <span
                        key={slug}
                        className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        {slug}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions Grid */}
              <div className="space-y-3 pt-2">
                {selectedNode.linked_lesson_slug ? (
                  <Link
                    href={`/lessons/${selectedNode.linked_lesson_slug}`}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Study Theory Lesson</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    href="/courses"
                    className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all border border-slate-700"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Browse Concept Lessons</span>
                  </Link>
                )}

                {selectedNode.linked_tag_slug ? (
                  <Link
                    href={`/problems?tag=${selectedNode.linked_tag_slug}`}
                    className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-all border border-slate-700"
                  >
                    <Code2 className="w-4 h-4 text-amber-400" />
                    <span>Practice Problems for this Topic</span>
                  </Link>
                ) : (
                  <Link
                    href="/problems"
                    className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm flex items-center justify-center gap-2 transition-all border border-slate-700"
                  >
                    <Code2 className="w-4 h-4 text-amber-400" />
                    <span>Explore Practice Challenges</span>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
