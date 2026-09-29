'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Cpu,
  Search,
  Shuffle,
  Sparkles,
  Layers,
  ArrowRight,
  Info,
  Clock,
  Database,
  ExternalLink,
} from 'lucide-react';
import { generateBinarySearchSteps } from '@/features/visualizer/searching/binarySearch';
import { generateLinearSearchSteps } from '@/features/visualizer/searching/linearSearch';
import { generateBubbleSortSteps } from '@/features/visualizer/sorting/bubbleSort';
import { generateSelectionSortSteps } from '@/features/visualizer/sorting/selectionSort';
import { generateInsertionSortSteps } from '@/features/visualizer/sorting/insertionSort';
import { generateMergeSortSteps } from '@/features/visualizer/sorting/mergeSort';
import { generateQuickSortSteps } from '@/features/visualizer/sorting/quickSort';
import { generateTwoPointerSteps } from '@/features/visualizer/arrays/twoPointer';
import { generateKadaneSteps } from '@/features/visualizer/arrays/kadane';

import { useVisualizerTimeline } from '@/hooks/useVisualizerTimeline';
import { ArrayVisualizer } from '@/components/visualizer/ArrayVisualizer';
import { TimelineControls } from '@/components/visualizer/TimelineControls';
import { PseudocodePanel } from '@/components/visualizer/PseudocodePanel';

type AlgorithmKey =
  | 'binary-search'
  | 'linear-search'
  | 'bubble-sort'
  | 'selection-sort'
  | 'insertion-sort'
  | 'merge-sort'
  | 'quick-sort'
  | 'two-pointer'
  | 'kadane';

export default function VisualizerLabPage() {
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmKey>('binary-search');
  const [dataset, setDataset] = useState<number[]>([2, 5, 8, 12, 16, 23, 38, 45, 56, 72]);
  const [target, setTarget] = useState<number>(23);

  // Generate random data
  const handleRandomize = () => {
    const size = 10;
    if (selectedAlgo === 'kadane') {
      // Include negative numbers for Kadane
      const randoms = Array.from({ length: size }, () => Math.floor(Math.random() * 50) - 20);
      setDataset(randoms);
      return;
    }

    const randoms = Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 5);
    if (selectedAlgo === 'binary-search' || selectedAlgo === 'two-pointer') {
      const sorted = Array.from(new Set(randoms)).sort((a, b) => a - b);
      setDataset(sorted);
      if (selectedAlgo === 'binary-search') {
        setTarget(sorted[Math.floor(Math.random() * sorted.length)]);
      } else {
        // target sum of two random items
        const i1 = Math.floor(Math.random() * (sorted.length / 2));
        const i2 = Math.floor(Math.random() * (sorted.length / 2)) + Math.floor(sorted.length / 2);
        setTarget(sorted[i1] + sorted[i2]);
      }
    } else {
      setDataset(randoms);
      if (selectedAlgo === 'linear-search') {
        setTarget(randoms[Math.floor(Math.random() * randoms.length)]);
      }
    }
  };

  // Generate steps based on algorithm and dataset
  const steps = useMemo(() => {
    switch (selectedAlgo) {
      case 'binary-search':
        return generateBinarySearchSteps(dataset, target);
      case 'linear-search':
        return generateLinearSearchSteps(dataset, target);
      case 'bubble-sort':
        return generateBubbleSortSteps(dataset);
      case 'selection-sort':
        return generateSelectionSortSteps(dataset);
      case 'insertion-sort':
        return generateInsertionSortSteps(dataset);
      case 'merge-sort':
        return generateMergeSortSteps(dataset);
      case 'quick-sort':
        return generateQuickSortSteps(dataset);
      case 'two-pointer':
        return generateTwoPointerSteps(dataset, target);
      case 'kadane':
        return generateKadaneSteps(dataset);
      default:
        return [];
    }
  }, [selectedAlgo, dataset, target]);

  const timeline = useVisualizerTimeline({ steps, initialSpeed: 1 });

  const pseudocodes: Record<AlgorithmKey, string[]> = {
    'binary-search': [
      'low = 0, high = len(arr) - 1',
      'while low <= high:',
      '    mid = low + (high - low) // 2',
      '    if arr[mid] == target: return mid',
      '    elif arr[mid] < target: low = mid + 1',
      '    else: high = mid - 1',
      'return -1',
    ],
    'linear-search': [
      'for i from 0 to len(arr) - 1:',
      '    if arr[i] == target:',
      '        return i',
      'return -1',
    ],
    'bubble-sort': [
      'for i from 0 to n - 1:',
      '    swapped = false',
      '    for j from 0 to n - i - 2:',
      '        if arr[j] > arr[j + 1]:',
      '            swap(arr[j], arr[j + 1])',
      '            swapped = true',
      '    if not swapped: break',
    ],
    'selection-sort': [
      'for i from 0 to n - 2:',
      '    min_idx = i',
      '    for j from i + 1 to n - 1:',
      '        if arr[j] < arr[min_idx]: min_idx = j',
      '    if min_idx != i: swap(arr[i], arr[min_idx])',
    ],
    'insertion-sort': [
      'for i from 1 to n - 1:',
      '    key = arr[i], j = i - 1',
      '    while j >= 0 and arr[j] > key:',
      '        arr[j + 1] = arr[j], j -= 1',
      '    arr[j + 1] = key',
    ],
    'merge-sort': [
      'def merge_sort(arr, l, r):',
      '    if l >= r: return',
      '    m = (l + r) // 2',
      '    merge_sort(arr, l, m)',
      '    merge_sort(arr, m + 1, r)',
      '    merge(arr, l, m, r)',
    ],
    'quick-sort': [
      'def quick_sort(arr, low, high):',
      '    if low < high:',
      '        p = partition(arr, low, high)',
      '        quick_sort(arr, low, p - 1)',
      '        quick_sort(arr, p + 1, high)',
    ],
    'two-pointer': [
      'left = 0, right = len(arr) - 1',
      'while left < right:',
      '    sum = arr[left] + arr[right]',
      '    if sum == target: return (left, right)',
      '    elif sum < target: left += 1',
      '    else: right -= 1',
      'return -1',
    ],
    'kadane': [
      'current_sum = arr[0], max_sum = arr[0]',
      'for i from 1 to len(arr) - 1:',
      '    current_sum = max(arr[i], current_sum + arr[i])',
      '    max_sum = max(max_sum, current_sum)',
      'return max_sum',
    ],
  };

  const complexities: Record<AlgorithmKey, { best: string; avg: string; worst: string; space: string }> = {
    'binary-search': { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)', space: 'O(1)' },
    'linear-search': { best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    'bubble-sort': { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    'selection-sort': { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    'insertion-sort': { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)' },
    'merge-sort': { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)' },
    'quick-sort': { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)' },
    'two-pointer': { best: 'O(1)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' },
    'kadane': { best: 'O(n)', avg: 'O(n)', worst: 'O(n)', space: 'O(1)' },
  };

  const algoCategories = [
    {
      category: 'Searching',
      items: [
        { key: 'binary-search', label: 'Binary Search' },
        { key: 'linear-search', label: 'Linear Search' },
      ],
    },
    {
      category: 'Sorting',
      items: [
        { key: 'bubble-sort', label: 'Bubble Sort' },
        { key: 'selection-sort', label: 'Selection Sort' },
        { key: 'insertion-sort', label: 'Insertion Sort' },
        { key: 'merge-sort', label: 'Merge Sort' },
        { key: 'quick-sort', label: 'Quick Sort' },
      ],
    },
    {
      category: 'Arrays',
      items: [
        { key: 'two-pointer', label: 'Two Pointer' },
        { key: 'kadane', label: "Kadane's Algo" },
      ],
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive Visualizer Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Algorithm Lab & Visualizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Control playback timelines, inspect pointer movements, and watch algorithms execute step-by-step.
          </p>
        </div>

        <Link
          href={`/algorithms/${selectedAlgo}`}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 hover:text-cyan-300 font-bold text-xs border border-slate-800 transition-all self-start md:self-auto"
        >
          <span>View Complete Guide & Practice</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Categorized Selector Tabs */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Select Algorithm
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {algoCategories.map((group) => (
            <div key={group.category} className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 px-2 uppercase">{group.category}</span>
              {group.items.map((item) => (
                <button
                  key={item.key}
                  onClick={() => {
                    setSelectedAlgo(item.key as AlgorithmKey);
                    timeline.reset();
                    if (item.key === 'binary-search' || item.key === 'two-pointer') {
                      const sorted = [...dataset].sort((a, b) => a - b);
                      setDataset(sorted);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedAlgo === item.key
                      ? 'bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Dataset & Parameter Controls */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRandomize}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors shadow-sm"
          >
            <Shuffle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Randomize Array</span>
          </button>

          {(selectedAlgo === 'binary-search' || selectedAlgo === 'linear-search' || selectedAlgo === 'two-pointer') && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-400 font-medium">
                {selectedAlgo === 'two-pointer' ? 'Target Pair Sum:' : 'Search Target:'}
              </span>
              <input
                type="number"
                value={target}
                onChange={(e) => {
                  setTarget(Number(e.target.value));
                  timeline.reset();
                }}
                className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-0.5 text-cyan-300 font-bold text-center focus:outline-none focus:border-cyan-400"
              />
            </div>
          )}
        </div>

        {/* Complexity Summary */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Average:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono font-bold border border-cyan-500/20">
            {complexities[selectedAlgo].avg}
          </span>
          <span className="text-slate-500 ml-2">Worst:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono font-bold border border-amber-500/20">
            {complexities[selectedAlgo].worst}
          </span>
          <span className="text-slate-500 ml-2">Space:</span>
          <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-mono font-bold border border-indigo-500/20">
            {complexities[selectedAlgo].space}
          </span>
        </div>
      </div>

      {/* Visualizer Stage */}
      <div className="space-y-4">
        {/* Animated Array Bars Canvas */}
        <ArrayVisualizer step={timeline.currentStep} />

        {/* Step Explanation Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800/80 shadow-md flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Step Operation
              </span>
              <p className="text-xs sm:text-sm text-slate-200 font-medium">
                {timeline.currentStep.message}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
              {timeline.currentStep.type.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Timeline Playback Controls */}
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

      {/* Pseudocode & Step Explanation Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PseudocodePanel
          pseudocodeLines={pseudocodes[selectedAlgo]}
          activeLine={timeline.currentStep.pseudoCodeLine}
        />

        <div className="p-6 rounded-3xl bg-slate-900/50 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                How It Operates
              </h3>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed space-y-2">
              {selectedAlgo === 'selection-sort' && (
                <p>
                  Selection Sort segments the list into sorted and unsorted parts. On each pass, it finds the absolute minimum element from the unsorted section and swaps it into the next available sorted position.
                </p>
              )}
              {selectedAlgo === 'insertion-sort' && (
                <p>
                  Insertion Sort builds the final sorted array one item at a time. It consumes one input element per repetition and grows a sorted output list by inserting the element into its proper position.
                </p>
              )}
              {selectedAlgo === 'merge-sort' && (
                <p>
                  Merge Sort divides the input array into two halves, recursively sorts them, and then merges the two sorted halves back together in $O(n)$ time. It guarantees $O(n \log n)$ in all cases.
                </p>
              )}
              {selectedAlgo === 'quick-sort' && (
                <p>
                  Quick Sort selects a &apos;pivot&apos; element and partitions the other elements into two sub-arrays according to whether they are less than or greater than the pivot, then recursively sorts the sub-arrays.
                </p>
              )}
              {selectedAlgo === 'two-pointer' && (
                <p>
                  The Two-Pointer approach uses two pointers moving inward from both ends of a sorted array to locate a pair summing to a target in single-pass $O(n)$ time without nested loops.
                </p>
              )}
              {selectedAlgo === 'kadane' && (
                <p>
                  Kadane&apos;s algorithm solves the Maximum Subarray problem in linear $O(n)$ time by making an optimal choice at each position: either continue the existing subarray or restart a new subarray from the current element.
                </p>
              )}
              {selectedAlgo === 'binary-search' && (
                <p>
                  Binary Search repeatedly divides the search space in half. Comparing against the middle element allows discarding half of the remaining elements on every iteration.
                </p>
              )}
              {selectedAlgo === 'linear-search' && (
                <p>
                  Linear Search inspects every item sequentially from index 0 to $n-1$. It makes no assumptions regarding data ordering.
                </p>
              )}
              {selectedAlgo === 'bubble-sort' && (
                <p>
                  Bubble Sort repeatedly compares adjacent elements and swaps them if out of order, bubbling the largest value to the end on each pass.
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <Link
              href={`/algorithms/${selectedAlgo}`}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-cyan-400 transition-colors"
            >
              <span>Explore Full Theory, Pitfalls & Practice Problems</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
