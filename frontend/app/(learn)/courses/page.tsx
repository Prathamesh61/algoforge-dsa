'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  BarChart,
  Award,
} from 'lucide-react';
import { Course } from '@/types';
import { apiClient } from '@/lib/api-client';

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await apiClient.get<Course[]>('/courses/');
        if (data && data.length > 0) {
          setCourses(data);
        } else {
          setCourses(fallbackCourses);
        }
      } catch {
        setCourses(fallbackCourses);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const fallbackCourses: Course[] = [
    {
      id: '1',
      slug: 'dsa-fundamentals',
      title: 'DSA Fundamentals',
      summary: 'Master the foundations of computer science: time and space complexity, Big-O notation, and elementary data structures.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516116211227-bbc3b3b4f620?auto=format&fit=crop&w=600&q=80',
      difficulty: 'Beginner',
      isPublished: true,
      completionPercentage: 42,
      moduleCount: 4,
      lessonCount: 16,
    },
    {
      id: '2',
      slug: 'searching-algorithms',
      title: 'Searching & Binary Exploration',
      summary: 'From linear scans to logarithmic divide-and-conquer binary search paradigms and rotated arrays.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
      difficulty: 'Beginner',
      isPublished: true,
      completionPercentage: 70,
      moduleCount: 3,
      lessonCount: 10,
    },
    {
      id: '3',
      slug: 'sorting-algorithms',
      title: 'Sorting Algorithms Lab',
      summary: 'Explore Bubble Sort, Selection Sort, Insertion Sort, Merge Sort, and Quick Sort with visual side-by-side execution.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
      difficulty: 'Intermediate',
      isPublished: true,
      completionPercentage: 0,
      moduleCount: 4,
      lessonCount: 14,
    },
    {
      id: '4',
      slug: 'trees-and-graphs',
      title: 'Trees, BST & Graph Traversal',
      summary: 'Master Binary Trees, BST properties, Breadth-First Search, and Depth-First Search with force-directed graphs.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80',
      difficulty: 'Intermediate',
      isPublished: true,
      completionPercentage: 0,
      moduleCount: 5,
      lessonCount: 22,
    },
    {
      id: '5',
      slug: 'dynamic-programming',
      title: 'Dynamic Programming Mastery',
      summary: 'Deconstruct recursion trees, identify optimal substructure, and construct memoization and 2D tabulation grids.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80',
      difficulty: 'Advanced',
      isPublished: true,
      completionPercentage: 0,
      moduleCount: 6,
      lessonCount: 28,
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Structured DSA Tracks</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          Comprehensive DSA Courses
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
          Step-by-step interactive tracks combining concept deep dives, visual step animations, embedded videos, and hands-on coding.
        </p>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => {
          const diffBadge = {
            Beginner: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            Intermediate: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
            Advanced: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          }[course.difficulty] || 'bg-slate-800 text-slate-300';

          const pct = course.completionPercentage ?? 0;

          return (
            <div
              key={course.slug}
              className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-xl backdrop-blur-xl flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div>
                {/* Thumbnail Image */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                  <img
                    src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1516116211227-bbc3b3b4f620?auto=format&fit=crop&w=600&q=80'}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${diffBadge}`}>
                      {course.difficulty}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {course.summary}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-800/80">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{course.moduleCount || 4} Modules</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{course.lessonCount || 12} Lessons</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress & CTA Footer */}
              <div className="p-6 pt-0 space-y-3">
                {pct > 0 ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Progress</span>
                      <span className="text-white font-bold">{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/40">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                ) : null}

                <Link
                  href={`/courses/${course.slug}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-white font-semibold text-xs transition-all shadow-md group-hover:bg-cyan-500 group-hover:text-slate-950"
                >
                  <span>{pct > 0 ? 'Continue Course' : 'View Syllabus'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
