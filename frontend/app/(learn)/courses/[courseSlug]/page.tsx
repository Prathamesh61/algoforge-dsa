'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  Play,
  Clock,
  Sparkles,
  Layers,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Award,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/features/auth/AuthContext';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const slug = params.courseSlug as string;

  const [course, setCourse] = useState<any>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourse() {
      try {
        const data = await apiClient.get(`/courses/${slug}/`);
        setCourse(data);
        setEnrolled(data.is_enrolled);
      } catch {
        // Fallback mock course syllabus
        setCourse({
          slug,
          title: slug === 'searching-algorithms' ? 'Searching & Binary Exploration' : 'DSA Fundamentals',
          summary: 'Master the foundations of computer science: time and space complexity, Big-O notation, and elementary data structures.',
          difficulty: 'Beginner',
          completion_percentage: 42,
          modules: [
            {
              id: 'm1',
              title: '1. Complexity Analysis & Big-O',
              lessons: [
                { slug: 'intro-to-dsa', title: '1. Introduction to DSA', estimated_read_time: 6, xp_reward: 10, is_completed: true, is_locked: false },
                { slug: 'big-o-notation', title: '2. Big O Notation', estimated_read_time: 8, xp_reward: 15, is_completed: true, is_locked: false },
                { slug: 'time-complexity', title: '3. Time Complexity', estimated_read_time: 10, xp_reward: 15, is_completed: false, is_locked: false },
                { slug: 'space-complexity', title: '4. Space Complexity', estimated_read_time: 7, xp_reward: 10, is_completed: false, is_locked: false },
              ]
            },
            {
              id: 'm2',
              title: '2. Searching Paradigms',
              lessons: [
                { slug: 'linear-search', title: '5. Linear Search', estimated_read_time: 5, xp_reward: 10, is_completed: true, is_locked: false },
                { slug: 'binary-search', title: '6. Binary Search', estimated_read_time: 10, xp_reward: 20, is_completed: false, is_locked: false },
              ]
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [slug]);

  const handleEnroll = async () => {
    try {
      await apiClient.post(`/courses/${slug}/enroll/`);
      setEnrolled(true);
    } catch {
      setEnrolled(true);
    }
  };

  if (!course) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Back button */}
      <div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Courses</span>
        </Link>
      </div>

      {/* Course Hero Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <span>{course.difficulty} Track</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {course.title}
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              {course.summary}
            </p>
          </div>

          <div>
            {!enrolled ? (
              <button
                onClick={handleEnroll}
                className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
              >
                Enroll in Course
              </button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Enrolled</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Curriculum Completion</span>
            <span className="text-cyan-400 font-bold">{course.completion_percentage || 0}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${course.completion_percentage || 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Modules & Lessons Syllabus List */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Layers className="w-5 h-5 text-indigo-400" />
          <span>Curriculum Syllabus</span>
        </h2>

        <div className="space-y-4">
          {course.modules?.map((mod: any, mIdx: number) => (
            <div
              key={mod.id || mIdx}
              className="rounded-3xl bg-slate-900/50 border border-slate-800 overflow-hidden shadow-xl"
            >
              <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">{mod.title}</h3>
                <span className="text-xs text-slate-500">
                  {mod.lessons?.length || 0} Lessons
                </span>
              </div>

              <div className="p-3 space-y-1.5">
                {mod.lessons?.map((les: any) => {
                  return (
                    <Link
                      key={les.slug}
                      href={`/lessons/${les.slug}`}
                      className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-800/50 transition-all group border border-transparent hover:border-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        {les.is_completed ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        ) : les.is_locked ? (
                          <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center shrink-0">
                            <Lock className="w-3.5 h-3.5" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
                            <Play className="w-3 h-3 fill-current ml-0.5" />
                          </div>
                        )}

                        <div>
                          <div className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                            {les.title}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{les.estimated_read_time} mins</span>
                            </span>
                            <span>•</span>
                            <span className="text-amber-400/90 font-semibold">+{les.xp_reward} XP</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {les.is_completed && (
                          <span className="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                            Completed
                          </span>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
