'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Cpu,
  Code2,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  XCircle,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { ArrayVisualizer } from '@/components/visualizer/ArrayVisualizer';
import { TimelineControls } from '@/components/visualizer/TimelineControls';
import { useVisualizerTimeline } from '@/hooks/useVisualizerTimeline';
import { generateBinarySearchSteps } from '@/features/visualizer/searching/binarySearch';
import { generateLinearSearchSteps } from '@/features/visualizer/searching/linearSearch';
import { generateBubbleSortSteps } from '@/features/visualizer/sorting/bubbleSort';
import { generateSelectionSortSteps } from '@/features/visualizer/sorting/selectionSort';
import { generateInsertionSortSteps } from '@/features/visualizer/sorting/insertionSort';
import { generateMergeSortSteps } from '@/features/visualizer/sorting/mergeSort';
import { generateQuickSortSteps } from '@/features/visualizer/sorting/quickSort';
import { generateTwoPointerSteps } from '@/features/visualizer/arrays/twoPointer';
import { generateKadaneSteps } from '@/features/visualizer/arrays/kadane';

export default function AlgorithmDetailPage() {
  const params = useParams();
  const slug = params.algoSlug as string;

  const [algo, setAlgo] = useState<any>(null);
  const [activeLang, setActiveLang] = useState<'python' | 'javascript' | 'cpp'>('python');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlgo() {
      try {
        const data = await apiClient.get(`/algorithms/${slug}/`);
        setAlgo(data);
      } catch {
        // Fallback detail
        setAlgo({
          slug,
          name: slug === 'binary-search' ? 'Binary Search' : slug.replace('-', ' ').toUpperCase(),
          category: slug.includes('search') ? 'Searching' : 'Sorting',
          description: 'A classic computer science algorithm for rapid computation and optimal runtime efficiency.',
          time_complexity_best: 'O(1)',
          time_complexity_avg: 'O(log n)',
          time_complexity_worst: 'O(log n)',
          space_complexity: 'O(1)',
          default_dataset: [1, 3, 5, 7, 9, 11, 15, 18, 21, 25],
          implementation_code: {
            python: 'def solve(nums, target):\n    # Python solution\n    pass',
            javascript: 'function solve(nums, target) {\n    // JavaScript solution\n}',
            cpp: 'int solve(const vector<int>& nums, int target) {\n    // C++ solution\n    return -1;\n}'
          },
          advantages: ['High operational speed', 'Scalable memory footprint'],
          limitations: ['Requires specific data order constraints'],
          when_to_use: 'When data is ordered and rapid lookup is required.',
          when_not_to_use: 'When data is unsorted and accessed infrequently.',
          common_mistakes: ['Integer overflow on calculation', 'Off-by-one boundary checks'],
        });
      } finally {
        setLoading(false);
      }
    }
    loadAlgo();
  }, [slug]);

  const defaultArray = useMemo(() => {
    return algo?.default_dataset || [2, 5, 8, 12, 16, 23, 38, 45, 56, 72];
  }, [algo]);

  const steps = useMemo(() => {
    switch (slug) {
      case 'binary-search':
        return generateBinarySearchSteps(defaultArray, 23);
      case 'linear-search':
        return generateLinearSearchSteps(defaultArray, 16);
      case 'bubble-sort':
        return generateBubbleSortSteps(defaultArray);
      case 'selection-sort':
        return generateSelectionSortSteps(defaultArray);
      case 'insertion-sort':
        return generateInsertionSortSteps(defaultArray);
      case 'merge-sort':
        return generateMergeSortSteps(defaultArray);
      case 'quick-sort':
        return generateQuickSortSteps(defaultArray);
      case 'two-pointer':
        return generateTwoPointerSteps(defaultArray, 35);
      case 'kadane':
        return generateKadaneSteps([-2, 1, -3, 4, -1, 2, 1, -5, 4]);
      default:
        return generateBinarySearchSteps(defaultArray, 23);
    }
  }, [slug, defaultArray]);

  const timeline = useVisualizerTimeline({ steps, initialSpeed: 1 });

  const handleCopyCode = () => {
    const code = algo?.implementation_code?.[activeLang] || '';
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!algo) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Back button */}
      <div>
        <Link
          href="/visualizer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Algorithm Lab</span>
        </Link>
      </div>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
              <Cpu className="w-3.5 h-3.5" />
              <span>{algo.category} Algorithm</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
              {algo.name}
            </h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              {algo.description}
            </p>
          </div>

          <Link
            href="/problems"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/25 active:scale-95 shrink-0"
          >
            <span>Practice Problems</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Complexity Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500">Best Time</span>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{algo.time_complexity_best}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500">Average Time</span>
            <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">{algo.time_complexity_avg}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500">Worst Time</span>
            <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">{algo.time_complexity_worst}</div>
          </div>
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-500">Space Complexity</span>
            <div className="text-sm font-bold text-indigo-400 font-mono mt-0.5">{algo.space_complexity}</div>
          </div>
        </div>
      </div>

      {/* Embedded Live Visualization */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Interactive Live Simulation</span>
          </h2>
          <span className="text-xs text-slate-400">Step {timeline.currentStepIndex + 1} of {timeline.totalSteps}</span>
        </div>

        <ArrayVisualizer step={timeline.currentStep} />

        <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-200">
          <span className="font-bold text-cyan-400 mr-2">Operation:</span>
          {timeline.currentStep.message}
        </div>

        <TimelineControls
          currentStepIndex={timeline.currentStepIndex}
          totalSteps={timeline.totalSteps}
          isPlaying={timeline.isPlaying}
          speed={timeline.speed}
          onPlay={timeline.play}
          onPause={timeline.pause}
          onStepForward={timeline.stepForward}
          onStepBackward={timeline.stepBackward}
          onReset={timeline.reset}
          onSeek={timeline.goToStep}
          onSpeedChange={timeline.setSpeed}
        />
      </div>

      {/* Multi-Language Implementation Code Viewer */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 overflow-hidden shadow-2xl space-y-0">
        <div className="flex items-center justify-between px-6 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white">Algorithm Implementation</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switch Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800">
              {(['python', 'javascript', 'cpp'] as const).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold uppercase transition-all ${
                    activeLang === lang
                      ? 'bg-cyan-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'cpp' ? 'C++' : lang}
                </button>
              ))}
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <pre className="p-6 text-xs sm:text-sm font-mono text-cyan-200 overflow-x-auto leading-relaxed bg-slate-950/80">
          <code>{algo.implementation_code?.[activeLang] || '# Code implementation preview'}</code>
        </pre>
      </div>

      {/* Guide: Advantages, Limitations, When to Use & Common Pitfalls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Advantages & Strengths */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Key Advantages</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {algo.advantages?.map((adv: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">•</span>
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Limitations */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-rose-400">
            <XCircle className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Limitations</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {algo.limitations?.map((lim: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>{lim}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* When to use */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400">
            <Lightbulb className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">When to Use</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {algo.when_to_use}
          </p>
        </div>

        {/* Common Mistakes */}
        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Common Mistakes & Pitfalls</h3>
          </div>
          <ul className="space-y-2 text-xs text-slate-300">
            {algo.common_mistakes?.map((mis: string, i: number) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <span>{mis}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
