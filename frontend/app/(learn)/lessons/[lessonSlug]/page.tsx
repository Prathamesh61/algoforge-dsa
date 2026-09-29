'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Star,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Sparkles,
  Share2,
} from 'lucide-react';
import { BlockRenderer } from '@/components/lessons/BlockRenderer';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/features/auth/AuthContext';

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { user, refreshUserData } = useAuth();
  const slug = params.lessonSlug as string;

  const [lesson, setLesson] = useState<any>(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    async function loadLesson() {
      try {
        const data = await apiClient.get(`/courses/lessons/${slug}/`);
        setLesson(data);
        setCompleted(data.is_completed);
      } catch {
        // Fallback rich Binary Search lesson
        setLesson({
          slug,
          title: 'Binary Search Algorithm',
          course_title: 'Searching & Binary Exploration',
          course_slug: 'searching-algorithms',
          module_title: '1. Classic Searching Paradigms',
          estimated_read_time: 10,
          xp_reward: 20,
          is_completed: false,
          next_lesson: { slug: 'linear-search', title: 'Linear Search' },
          prev_lesson: null,
          content_blocks: [
            {
              type: 'text',
              content: '## What is Binary Search?\n\nBinary Search is a classic **Divide and Conquer** algorithm that locates the position of a target value within a **sorted array**. By comparing the target with the middle element, it eliminates half of the remaining elements in each step, achieving optimal logarithmic time complexity.'
            },
            {
              type: 'animation',
              component: 'binary-search',
              config: {
                array: [1, 3, 5, 7, 9, 11, 15],
                target: 11
              }
            },
            {
              type: 'text',
              content: '### Key Steps in Binary Search:\n1. Initialize `low = 0` and `high = len(arr) - 1`.\n2. In each iteration, compute `mid = low + (high - low) // 2` to avoid integer overflow.\n3. If `arr[mid] == target`, return `mid`.\n4. If `arr[mid] < target`, discard left half by setting `low = mid + 1`.\n5. If `arr[mid] > target`, discard right half by setting `high = mid - 1`.\n6. Return `-1` if target was not found.'
            },
            {
              type: 'code',
              language: 'python',
              title: 'Standard Iterative Implementation',
              code: 'def binary_search(nums: list[int], target: int) -> int:\n    low, high = 0, len(nums) - 1\n    \n    while low <= high:\n        mid = low + (high - low) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n            \n    return -1'
            },
            {
              type: 'complexity',
              time: 'O(log n)',
              space: 'O(1) Auxiliary Space',
              explanation: 'The search space is cut in half every iteration, meaning for 1,000,000 items, at most 20 comparisons are needed.'
            },
            {
              type: 'video',
              youtubeId: 'fDKIpRe8GW4',
              title: 'Binary Search Algorithm in 100 Seconds',
              duration: '2:30'
            },
            {
              type: 'quiz',
              question: 'What prerequisite must be satisfied before Binary Search can be safely executed?',
              options: [
                'The array must only have even integers',
                'The elements in the array must be sorted in monotonic order',
                'The array must not have negative numbers',
                'The array size must be a power of two'
              ],
              correctIndex: 1,
              explanation: 'Binary Search depends on monotonic ordering so that comparing with the middle element guarantees which half cannot contain the target.'
            },
            {
              type: 'callout',
              variant: 'tip',
              title: 'Pro Tip',
              text: 'Always test edge cases: an empty array, a single-element array matching target, and a single-element array not matching target.'
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    }
    loadLesson();
  }, [slug]);

  const handleCompleteLesson = async () => {
    setCompleting(true);
    try {
      await apiClient.post(`/courses/lessons/${slug}/complete/`);
      setCompleted(true);
      await refreshUserData();
      // Celebrate with confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
      });
    } catch {
      setCompleted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
      });
    } finally {
      setCompleting(false);
    }
  };

  if (!lesson) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Navigation Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <Link
          href={`/courses/${lesson.course_slug || 'searching-algorithms'}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to {lesson.course_title || 'Course'}</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{lesson.estimated_read_time} min read</span>
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>+{lesson.xp_reward} XP</span>
          </span>
        </div>
      </div>

      {/* Lesson Title */}
      <div className="space-y-1.5">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
          {lesson.module_title}
        </span>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          {lesson.title}
        </h1>
      </div>

      {/* Data-Driven Content Blocks */}
      <div className="space-y-6 pt-2">
        {lesson.content_blocks?.map((block: any, idx: number) => (
          <BlockRenderer
            key={idx}
            block={block}
            lessonSlug={slug}
            blockIndex={idx}
          />
        ))}
      </div>

      {/* Completion CTA Section */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xl">
        <div>
          <h3 className="text-base font-bold text-white">Finished this lesson?</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Mark as complete to claim your +{lesson.xp_reward} XP and record your progress.
          </p>
        </div>

        <button
          onClick={handleCompleteLesson}
          disabled={completed || completing}
          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs transition-all shadow-lg active:scale-95 ${
            completed
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 cursor-default'
              : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/25'
          }`}
        >
          {completed ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Completed</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>{completing ? 'Saving...' : `Complete & Claim +${lesson.xp_reward} XP`}</span>
            </>
          )}
        </button>
      </div>

      {/* Next / Previous Lesson Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        {lesson.prev_lesson ? (
          <Link
            href={`/lessons/${lesson.prev_lesson.slug}`}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous: {lesson.prev_lesson.title}</span>
          </Link>
        ) : <div />}

        {lesson.next_lesson ? (
          <Link
            href={`/lessons/${lesson.next_lesson.slug}`}
            className="flex items-center gap-2 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Next: {lesson.next_lesson.title}</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : <div />}
      </div>
    </div>
  );
}
