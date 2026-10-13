'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Editor, { OnMount } from '@monaco-editor/react';
import confetti from 'canvas-confetti';
import { 
  Play, 
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw, 
  Send, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Zap, 
  ChevronLeft, 
  FileText, 
  History, 
  Lightbulb, 
  Copy, 
  Check, 
  Terminal, 
  Code,
  Sparkles,
  Layers,
  Activity,
  Bug,
  HelpCircle,
  Gauge
} from 'lucide-react';
import { ProblemDetail, ProblemDifficulty } from '@/types';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/features/auth/AuthContext';

const DIFFICULTY_BADGES: Record<ProblemDifficulty, string> = {
  Easy: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Hard: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
};

const FALLBACK_PROBLEM_MAP: Record<string, ProblemDetail> = {
  'two-sum': {
    id: '1',
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    xp_reward: 20,
    tags: [
      { id: '1', name: 'Array', slug: 'array' },
      { id: '2', name: 'Hash Map', slug: 'hash-map' }
    ],
    description_markdown: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.`,
    input_format: 'Line 1: Space-separated integers representing the array nums\nLine 2: Single integer representing target',
    output_format: 'Space-separated indices i j',
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9\nOnly one valid answer exists.',
    examples: [
      {
        input: '2 7 11 15\n9',
        output: '0 1',
        explanation: 'Because nums[0] + nums[1] == 9, we return 0 1.'
      },
      {
        input: '3 2 4\n6',
        output: '1 2',
        explanation: 'Because nums[1] + nums[2] == 6, we return 1 2.'
      }
    ],
    time_limit_ms: 2000,
    memory_limit_mb: 256,
    starter_templates: {
      python: `import sys\n\ndef two_sum(nums, target):\n    # Write your solution here\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen:\n            return f"{seen[comp]} {i}"\n        seen[num] = i\n    return ""\n\nif __name__ == '__main__':\n    lines = [l.strip() for l in sys.stdin.read().strip().split('\\n') if l.strip()]\n    if len(lines) >= 2:\n        nums = list(map(int, lines[0].split()))\n        target = int(lines[1])\n        print(two_sum(nums, target))\n`,
      javascript: `const fs = require('fs');\n\nfunction twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const comp = target - nums[i];\n        if (map.has(comp)) return \`\${map.get(comp)} \${i}\`;\n        map.set(nums[i], i);\n    }\n    return '';\n}\n\nconst input = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nif (input.length >= 2) {\n    const nums = input[0].trim().split(/\\s+/).map(Number);\n    const target = Number(input[1].trim());\n    console.log(twoSum(nums, target));\n}\n`,
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\n#include <sstream>\n\nusing namespace std;\n\nint main() {\n    string line1, line2;\n    if (getline(cin, line1) && getline(cin, line2)) {\n        stringstream ss(line1);\n        vector<int> nums;\n        int val;\n        while (ss >> val) nums.push_back(val);\n        int target = stoi(line2);\n        unordered_map<int, int> mp;\n        for (int i = 0; i < nums.size(); i++) {\n            int comp = target - nums[i];\n            if (mp.count(comp)) {\n                cout << mp[comp] << " " << i << endl;\n                return 0;\n            }\n            mp[nums[i]] = i;\n        }\n    }\n    return 0;\n}\n`
    },
    public_test_cases: [
      {
        id: 'tc-1',
        input_data: '2 7 11 15\n9',
        expected_output: '0 1',
        is_hidden: false,
        display_order: 1
      },
      {
        id: 'tc-2',
        input_data: '3 2 4\n6',
        expected_output: '1 2',
        is_hidden: false,
        display_order: 2
      }
    ],
    is_solved: false
  },
  'binary-search': {
    id: '2',
    slug: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    xp_reward: 20,
    tags: [
      { id: '1', name: 'Array', slug: 'array' },
      { id: '3', name: 'Binary Search', slug: 'binary-search' }
    ],
    description_markdown: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`. If \`target\` exists, then return its index. Otherwise, return \`-1\`.\n\nYou must write an algorithm with \`O(log n)\` runtime complexity.`,
    input_format: 'Line 1: Space-separated sorted integers representing nums\nLine 2: Single integer representing target',
    output_format: 'Single integer representing the index of target or -1',
    constraints: '1 <= nums.length <= 10^4\n-10^4 < nums[i], target < 10^4\nAll the integers in nums are unique.\nnums is sorted in ascending order.',
    examples: [
      {
        input: '-1 0 3 5 9 12\n9',
        output: '4',
        explanation: '9 exists in nums and its index is 4'
      },
      {
        input: '-1 0 3 5 9 12\n2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1'
      }
    ],
    time_limit_ms: 2000,
    memory_limit_mb: 256,
    starter_templates: {
      python: `import sys\n\ndef binary_search(nums, target):\n    low, high = 0, len(nums) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n\nif __name__ == '__main__':\n    lines = [l.strip() for l in sys.stdin.read().strip().split('\\n') if l.strip()]\n    if len(lines) >= 2:\n        nums = list(map(int, lines[0].split()))\n        target = int(lines[1])\n        print(binary_search(nums, target))\n`,
      javascript: `const fs = require('fs');\n\nfunction binarySearch(nums, target) {\n    let low = 0, high = nums.length - 1;\n    while (low <= high) {\n        const mid = Math.floor((low + high) / 2);\n        if (nums[mid] === target) return mid;\n        if (nums[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}\n\nconst input = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nif (input.length >= 2) {\n    const nums = input[0].trim().split(/\\s+/).map(Number);\n    const target = Number(input[1].trim());\n    console.log(binarySearch(nums, target));\n}\n`,
      cpp: `#include <iostream>\n#include <vector>\n#include <sstream>\n\nusing namespace std;\n\nint main() {\n    string line1, line2;\n    if (getline(cin, line1) && getline(cin, line2)) {\n        stringstream ss(line1);\n        vector<int> nums;\n        int val;\n        while (ss >> val) nums.push_back(val);\n        int target = stoi(line2);\n        int low = 0, high = nums.size() - 1;\n        int ans = -1;\n        while (low <= high) {\n            int mid = low + (high - low) / 2;\n            if (nums[mid] == target) { ans = mid; break; }\n            if (nums[mid] < target) low = mid + 1;\n            else high = mid - 1;\n        }\n        cout << ans << endl;\n    }\n    return 0;\n}\n`
    },
    public_test_cases: [
      {
        id: 'tc-1',
        input_data: '-1 0 3 5 9 12\n9',
        expected_output: '4',
        is_hidden: false,
        display_order: 1
      },
      {
        id: 'tc-2',
        input_data: '-1 0 3 5 9 12\n2',
        expected_output: '-1',
        is_hidden: false,
        display_order: 2
      }
    ],
    is_solved: false
  }
};

export default function ProblemWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const { user, refreshUserData } = useAuth();
  const rawSlug = (params?.problemSlug as string) || 'two-sum';
  const isDaily = rawSlug === 'daily';
  const slug = isDaily ? 'two-sum' : rawSlug;

  const [problem, setProblem] = useState<ProblemDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // Studio State
  const [language, setLanguage] = useState<'python' | 'javascript' | 'cpp'>('python');
  const [code, setCode] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'description' | 'submissions' | 'hints'>('description');
  const [selectedTestCaseIndex, setSelectedTestCaseIndex] = useState<number>(0);
  const [customInput, setCustomInput] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [bottomTab, setBottomTab] = useState<'testcases' | 'visualizer'>('testcases');

  // Execution & Trace State
  const [isRunning, setIsRunning] = useState(false);
  const [isTracing, setIsTracing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [runResult, setRunResult] = useState<{
    status: 'idle' | 'success' | 'failed' | 'error';
    actualOutput: string;
    expectedOutput?: string;
    executionTimeMs?: number;
    message?: string;
  }>({ status: 'idle', actualOutput: '' });

  // Visualizer Stepper State
  const [traceData, setTraceData] = useState<any>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');
  const [testCaseStatuses, setTestCaseStatuses] = useState<Record<number, 'passed' | 'failed' | 'idle'>>({});

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Monaco Editor References
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);
  const playTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  };

  // Fetch problem details from backend
  useEffect(() => {
    async function fetchProblem() {
      try {
        setLoading(true);
        const endpoint = isDaily ? '/problems/daily/' : `/problems/${slug}/`;
        const data = await apiClient.get<ProblemDetail>(endpoint).catch(() => null);
        const resolved = data || FALLBACK_PROBLEM_MAP[slug] || null;
        if (resolved) {
          setProblem(resolved);
          const initialLang = 'python';
          setCode(resolved.starter_templates?.[initialLang] || '# Write code here');
          if (resolved.public_test_cases?.length > 0) {
            setCustomInput(resolved.public_test_cases[0].input_data);
          }
        } else {
          setProblem(null);
        }
      } catch (e) {
        console.error('Failed to fetch problem from backend', e);
        if (FALLBACK_PROBLEM_MAP[slug]) {
          const fallback = FALLBACK_PROBLEM_MAP[slug];
          setProblem(fallback);
          setCode(fallback.starter_templates?.['python'] || '# Write code here');
          if (fallback.public_test_cases?.length > 0) {
            setCustomInput(fallback.public_test_cases[0].input_data);
          }
        } else {
          setProblem(null);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProblem();
  }, [slug, isDaily]);

  // Handle language switch
  const handleLanguageChange = (newLang: 'python' | 'javascript' | 'cpp') => {
    setLanguage(newLang);
    if (problem?.starter_templates?.[newLang]) {
      setCode(problem.starter_templates[newLang]);
    }
  };

  // Reset to starter template
  const handleResetCode = () => {
    if (problem?.starter_templates?.[language]) {
      setCode(problem.starter_templates[language]);
      setRunResult({ status: 'idle', actualOutput: '' });
      setTraceData(null);
      setCurrentStepIndex(0);
      setIsPlaying(false);
      clearMonacoHighlights();
    }
  };

  const clearMonacoHighlights = () => {
    if (editorRef.current && monacoRef.current && decorationsRef.current.length > 0) {
      decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, []);
    }
  };

  // Highlight active execution line in Monaco Editor
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current || !traceData || !traceData.steps) return;
    const currentStep = traceData.steps[currentStepIndex];
    if (!currentStep || !currentStep.line) {
      clearMonacoHighlights();
      return;
    }

    const line = currentStep.line;
    editorRef.current.revealLineInCenter(line);
    const monaco = monacoRef.current;

    decorationsRef.current = editorRef.current.deltaDecorations(decorationsRef.current, [
      {
        range: new monaco.Range(line, 1, line, 1),
        options: {
          isWholeLine: true,
          className: 'bg-cyan-500/25 border-l-4 border-cyan-400',
          glyphMarginClassName: 'bg-cyan-400',
        }
      }
    ]);
  }, [currentStepIndex, traceData]);

  // Auto-stepping player
  useEffect(() => {
    if (!isPlaying || !traceData || !traceData.steps) {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
      return;
    }

    const delays = { slow: 1200, normal: 600, fast: 200 };
    const delay = delays[playbackSpeed];

    playTimerRef.current = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev + 1 >= traceData.steps.length) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, delay);

    return () => {
      if (playTimerRef.current) clearInterval(playTimerRef.current);
    };
  }, [isPlaying, traceData, playbackSpeed]);

  // Copy example input
  const copyExample = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // Run Code against active test case
  const handleRunCode = async () => {
    setIsRunning(true);
    setRunResult({ status: 'idle', actualOutput: '' });

    const activeInput = isCustomMode
      ? customInput
      : problem?.public_test_cases?.[selectedTestCaseIndex]?.input_data || customInput;

    const expectedOutput = isCustomMode
      ? undefined
      : problem?.public_test_cases?.[selectedTestCaseIndex]?.expected_output;

    try {
      const res = await apiClient.post<any>('/compiler/execute/', {
        language,
        source_code: code,
        stdin: activeInput,
      });

      if (res) {
        const actual = res.stdout ? res.stdout.trim() : '';
        const expected = expectedOutput ? expectedOutput.trim() : null;
        const isMatch = expected !== null ? actual === expected : true;

        setRunResult({
          status: isMatch ? 'success' : 'failed',
          actualOutput: actual || res.stderr || 'No output produced',
          expectedOutput,
          executionTimeMs: res.execution_time_ms || 25,
          message: isMatch ? 'Test Case Passed ✓' : 'Output Mismatch ✗',
        });

        if (!isCustomMode) {
          setTestCaseStatuses((prev) => ({
            ...prev,
            [selectedTestCaseIndex]: isMatch ? 'passed' : 'failed',
          }));
        }
      }
    } catch (err: any) {
      setRunResult({
        status: 'error',
        actualOutput: err.message || 'Execution error',
        message: 'Compilation / Execution Error',
      });
    } finally {
      setIsRunning(false);
    }
  };

  // Visualize Code Execution with Variable Tracing
  const handleVisualize = async (overrideInput?: string, overrideExpected?: string) => {
    setIsTracing(true);
    setIsPlaying(false);

    const activeInput = overrideInput !== undefined
      ? overrideInput
      : (isCustomMode ? customInput : problem?.public_test_cases?.[selectedTestCaseIndex]?.input_data || customInput);

    const expectedOutput = overrideExpected !== undefined
      ? overrideExpected
      : (isCustomMode ? undefined : problem?.public_test_cases?.[selectedTestCaseIndex]?.expected_output);

    try {
      const res = await apiClient.post<any>('/compiler/trace/', {
        language,
        source_code: code,
        stdin: activeInput,
        expected_output: expectedOutput,
      });

      if (res && res.steps) {
        setTraceData(res);
        setCurrentStepIndex(0);
        setBottomTab('visualizer');
        setIsPlaying(true);

        const isMatch = res.failure_analysis ? !res.failure_analysis.is_failed : true;
        if (!isCustomMode) {
          setTestCaseStatuses((prev) => ({
            ...prev,
            [selectedTestCaseIndex]: isMatch ? 'passed' : 'failed',
          }));
        }
      }
    } catch (err: any) {
      console.error('Visualization tracer error', err);
    } finally {
      setIsTracing(false);
    }
  };

  // Submit Solution to Online Judge
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setRunResult({ status: 'idle', actualOutput: '' });

    try {
      const isDailyChallengeSolve = isDaily || (problem as any)?.is_daily_challenge;
      const res = await apiClient.post<any>('/submissions/', {
        problem_slug: problem?.slug || slug,
        language,
        source_code: code,
        is_daily_challenge: isDailyChallengeSolve,
      });

      if (res && (res.status === 'Accepted' || res.verdict === 'Accepted')) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });

        const xpAwarded = isDailyChallengeSolve ? ((problem?.xp_reward || 20) * 2) : (problem?.xp_reward || 20);
        const acceptedMsg = isDailyChallengeSolve
          ? `Daily Challenge Conquered! +${xpAwarded} XP Awarded (2x Bonus!).`
          : `Accepted! +${xpAwarded} XP Awarded.`;

        setRunResult({
          status: 'success',
          actualOutput: 'All test cases passed successfully!',
          executionTimeMs: res.execution_time_ms || 42,
          message: acceptedMsg,
        });

        // Mark all public test cases as passed
        if (problem?.public_test_cases) {
          const updated: Record<number, 'passed' | 'failed'> = {};
          problem.public_test_cases.forEach((_, idx) => {
            updated[idx] = 'passed';
          });
          setTestCaseStatuses(updated);
        }

        // Instantly refresh user profile & broadcast progress update across the app
        try {
          await refreshUserData();
        } catch {}
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('algoforge:progress-updated'));
        }
      } else {
        const failMsg = res.error_message || res.status || 'Wrong Answer';
        setRunResult({
          status: 'failed',
          actualOutput: res.stdout || res.error_message || 'Solution failed hidden test cases.',
          message: failMsg,
        });
      }
    } catch (e: any) {
      setRunResult({
        status: 'error',
        actualOutput: e.message || 'Submission verification failed.',
        message: 'Evaluation Error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading problem studio...</span>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-6 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shadow-xl">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2 max-w-md">
          <h2 className="text-2xl font-black text-white">Problem Not Found</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            The coding problem &quot;{slug}&quot; could not be found or loaded. Explore our 290+ DSA problems catalog or start solving Two Sum.
          </p>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <Link
            href="/problems"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            Browse All Problems
          </Link>
          <Link
            href="/problems/two-sum"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-semibold text-xs transition-colors"
          >
            Open Two Sum
          </Link>
        </div>
      </div>
    );
  }

  const diffBadge = DIFFICULTY_BADGES[problem.difficulty] || DIFFICULTY_BADGES.Easy;
  const currentStep = traceData?.steps?.[currentStepIndex] || null;
  const isFailed = traceData?.failure_analysis?.is_failed || false;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      {/* Top Workspace Header Bar */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/problems"
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Back to Problem List"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2.5">
            <h1 className="font-bold text-white text-sm sm:text-base tracking-tight truncate max-w-[200px] sm:max-w-md">
              {problem.title}
            </h1>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${diffBadge}`}>
              {problem.difficulty}
            </span>
            {isDaily || (problem as any)?.is_daily_challenge ? (
              <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 px-2.5 py-0.5 rounded-full shadow-sm shadow-amber-500/10">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Daily Challenge • +{(problem.xp_reward || 20) * 2} XP (2x Active)
              </span>
            ) : (
              <span className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                <Zap className="w-3 h-3 fill-amber-400" />
                +{problem.xp_reward} XP
              </span>
            )}
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Visualize Execution Button */}
          <button
            onClick={() => handleVisualize()}
            disabled={isRunning || isSubmitting || isTracing}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            title="Trace execution step-by-step with variable inspection"
          >
            {isTracing ? (
              <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span>Visualize</span>
          </button>

          {/* Run Code Button */}
          <button
            onClick={handleRunCode}
            disabled={isRunning || isSubmitting || isTracing}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 shadow-sm"
          >
            {isRunning ? (
              <div className="w-3.5 h-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
            )}
            <span className="hidden sm:inline">Run</span>
          </button>

          {/* Submit Solution Button */}
          <button
            onClick={handleSubmit}
            disabled={isRunning || isSubmitting || isTracing}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/30 hover:shadow-emerald-500/50 disabled:opacity-50 active:scale-95"
          >
            {isSubmitting ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            <span>Submit</span>
          </button>
        </div>
      </header>

      {/* Main Split-Screen Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel: Problem Context (Markdown, Examples, Constraints) */}
        <div className="lg:w-1/2 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-800 bg-slate-900/30 overflow-hidden">
          {/* Left Tabs Bar */}
          <div className="h-11 border-b border-slate-800 bg-slate-900/80 px-4 flex items-center gap-4 text-xs font-semibold text-slate-400 shrink-0">
            <button
              onClick={() => setActiveTab('description')}
              className={`flex items-center gap-1.5 pb-2.5 pt-3 transition-colors border-b-2 ${
                activeTab === 'description'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Description</span>
            </button>

            <button
              onClick={() => setActiveTab('hints')}
              className={`flex items-center gap-1.5 pb-2.5 pt-3 transition-colors border-b-2 ${
                activeTab === 'hints'
                  ? 'border-cyan-400 text-cyan-400'
                  : 'border-transparent hover:text-slate-200'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Hints</span>
            </button>
          </div>

          {/* Left Scrollable Content Area */}
          <div className="flex-1 p-5 overflow-y-auto space-y-6 text-slate-300 leading-relaxed text-sm">
            {activeTab === 'description' && (
              <>
                {/* Description Markdown */}
                <div className="prose prose-invert prose-sm max-w-none space-y-3">
                  <p className="whitespace-pre-line text-xs sm:text-sm text-slate-300">
                    {problem.description_markdown}
                  </p>
                </div>

                {/* Examples */}
                {problem.examples && problem.examples.length > 0 && (
                  <div className="space-y-4 pt-2">
                    <h3 className="font-semibold text-slate-100 text-sm tracking-wide">Examples</h3>
                    {problem.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2 relative group"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                          <span>Example {idx + 1}</span>
                          <button
                            onClick={() => copyExample(ex.input, idx)}
                            className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1 text-[11px]"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-xs text-slate-300 border border-slate-800/80">
                          <span className="text-slate-500 select-none">Input: </span>
                          <span className="text-cyan-300 whitespace-pre">{ex.input}</span>
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-lg font-mono text-xs text-slate-300 border border-slate-800/80">
                          <span className="text-slate-500 select-none">Output: </span>
                          <span className="text-emerald-300 whitespace-pre">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <p className="text-xs text-slate-400 pt-1 leading-normal italic">
                            {ex.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Constraints */}
                {problem.constraints && (
                  <div className="space-y-2 pt-2">
                    <h3 className="font-semibold text-slate-100 text-sm tracking-wide">Constraints</h3>
                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-400 space-y-1">
                      {problem.constraints.split('\n').map((c, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/70" />
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'hints' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 leading-relaxed">
                  <p className="font-semibold mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Algorithmic Tip
                  </p>
                  Think about whether a brute-force approach can be optimized to linear or logarithmic time using a hash map, two-pointer boundary search, or dynamic programming state.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Code Studio & Execution/Visualizer Output */}
        <div className="lg:w-1/2 flex flex-col bg-slate-950 overflow-hidden">
          {/* Code Studio Header */}
          <div className="h-11 border-b border-slate-800 bg-slate-900/80 px-4 flex items-center justify-between text-xs shrink-0">
            {/* Language Selector */}
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium flex items-center gap-1">
                <Code className="w-3.5 h-3.5" /> Language:
              </span>
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as any)}
                className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none focus:border-cyan-500"
              >
                <option value="python">Python 3 (Full Tracer Support)</option>
                <option value="javascript">JavaScript (Node.js)</option>
                <option value="cpp">C++ (GCC)</option>
              </select>
            </div>

            {/* Reset Code Button */}
            <button
              onClick={handleResetCode}
              title="Reset code to initial template"
              className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Monaco Editor Container */}
          <div className="flex-1 min-h-[300px] relative">
            <Editor
              height="100%"
              language={language === 'cpp' ? 'cpp' : language}
              value={code}
              theme="vs-dark"
              onMount={handleEditorMount}
              onChange={(val) => setCode(val || '')}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                wordWrap: 'on',
                smoothScrolling: true,
                padding: { top: 12, bottom: 12 }
              }}
            />
          </div>

          {/* Bottom Drawer: Test Cases OR Step Visualizer */}
          <div className="h-72 border-t border-slate-800 bg-slate-900/90 flex flex-col shrink-0">
            {/* Drawer Tab Switcher Header */}
            <div className="h-10 border-b border-slate-800/80 px-4 flex items-center justify-between text-xs font-semibold shrink-0">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setBottomTab('testcases')}
                  className={`flex items-center gap-1.5 pb-2 pt-2 border-b-2 transition-colors ${
                    bottomTab === 'testcases'
                      ? 'border-cyan-400 text-cyan-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Test Cases</span>
                </button>

                <button
                  onClick={() => {
                    setBottomTab('visualizer');
                    if (!traceData) handleVisualize();
                  }}
                  className={`flex items-center gap-1.5 pb-2 pt-2 border-b-2 transition-colors ${
                    bottomTab === 'visualizer'
                      ? 'border-cyan-400 text-cyan-400 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Execution Visualizer</span>
                  {traceData && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                      {traceData.total_steps} steps
                    </span>
                  )}
                </button>
              </div>

              {/* Status Indicator */}
              {runResult.status !== 'idle' && (
                <div className="flex items-center gap-2 text-xs">
                  {runResult.status === 'success' ? (
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {runResult.message || 'Passed'}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-rose-400 font-bold">
                      <XCircle className="w-3.5 h-3.5" />
                      {runResult.message || 'Failed'}
                    </span>
                  )}
                  {runResult.executionTimeMs && (
                    <span className="text-slate-500 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {runResult.executionTimeMs} ms
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* TAB 1: Test Cases View */}
            {bottomTab === 'testcases' && (
              <div className="flex-1 p-3 overflow-y-auto font-mono text-xs space-y-2">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-800/60">
                  {problem.public_test_cases?.map((tc, idx) => {
                    const st = testCaseStatuses[idx];
                    return (
                      <button
                        key={tc.id}
                        onClick={() => {
                          setIsCustomMode(false);
                          setSelectedTestCaseIndex(idx);
                        }}
                        className={`px-3 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all ${
                          !isCustomMode && selectedTestCaseIndex === idx
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {st === 'passed' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {st === 'failed' && <XCircle className="w-3 h-3 text-rose-400" />}
                        <span>Case {idx + 1}</span>
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setIsCustomMode(true)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      isCustomMode
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Custom Input
                  </button>
                </div>

                {isCustomMode ? (
                  <div>
                    <div className="text-slate-500 text-[11px] mb-1">Standard Input:</div>
                    <textarea
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      rows={3}
                      placeholder="Enter custom input values..."
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-300 focus:outline-none focus:border-cyan-500 font-mono text-xs resize-none"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-slate-500 mb-1">Input:</span>
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80 text-slate-300 overflow-auto whitespace-pre max-h-24">
                        {problem.public_test_cases?.[selectedTestCaseIndex]?.input_data || 'No input'}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] text-slate-500 mb-1">Expected Output:</span>
                      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80 text-emerald-400/90 overflow-auto whitespace-pre max-h-24">
                        {problem.public_test_cases?.[selectedTestCaseIndex]?.expected_output || 'No output'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Console Output when available */}
                {runResult.actualOutput && (
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[11px] text-slate-500 mb-1 block">Output stdout:</span>
                    <div
                      className={`p-2 rounded-lg border text-xs whitespace-pre-wrap ${
                        runResult.status === 'success'
                          ? 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
                          : 'bg-rose-950/20 border-rose-500/20 text-rose-300'
                      }`}
                    >
                      {runResult.actualOutput}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Execution Visualizer View */}
            {bottomTab === 'visualizer' && (
              <div className="flex-1 flex flex-col overflow-hidden text-xs">
                {traceData && traceData.steps?.length > 0 ? (
                  <div className="flex-1 flex flex-col overflow-hidden p-3 space-y-2">
                    {/* Stepper Controls Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800">
                      {/* Navigation Buttons */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setIsPlaying(false);
                            setCurrentStepIndex(0);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          title="Restart (Step 1)"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setIsPlaying(false);
                            setCurrentStepIndex((prev) => Math.max(0, prev - 1));
                          }}
                          disabled={currentStepIndex === 0}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
                          title="Previous Step"
                        >
                          <SkipBack className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setIsPlaying(!isPlaying)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold flex items-center gap-1"
                          title={isPlaying ? 'Pause' : 'Play'}
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-slate-950" />}
                          <span>{isPlaying ? 'Pause' : 'Play'}</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsPlaying(false);
                            setCurrentStepIndex((prev) => Math.min(traceData.steps.length - 1, prev + 1));
                          }}
                          disabled={currentStepIndex >= traceData.steps.length - 1}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
                          title="Next Step"
                        >
                          <SkipForward className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Step Indicator */}
                      <div className="flex items-center gap-2 text-slate-400 font-mono">
                        <span className="text-white font-bold">Step {currentStepIndex + 1}</span>
                        <span>/</span>
                        <span>{traceData.steps.length}</span>
                        {currentStep && (
                          <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px]">
                            Line {currentStep.line}
                          </span>
                        )}
                      </div>

                      {/* Speed Control */}
                      <div className="flex items-center gap-1">
                        {(['slow', 'normal', 'fast'] as const).map((spd) => (
                          <button
                            key={spd}
                            onClick={() => setPlaybackSpeed(spd)}
                            className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                              playbackSpeed === spd
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {spd}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Failure Diagnostic Alert Banner (Requirement 12) */}
                    {isFailed && currentStepIndex === traceData.steps.length - 1 && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 space-y-1 animate-shake">
                        <div className="flex items-center gap-2 font-bold text-xs text-rose-400">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>Failure Detected at Line {traceData.failure_analysis?.failing_line || 'End'}</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-snug">
                          {traceData.failure_analysis?.explanation}
                        </p>
                      </div>
                    )}

                    {/* Variables Table & Execution Info */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto">
                      {/* Active Line Snippet */}
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Executing Statement:</span>
                          <span className="text-cyan-400 font-mono">Line {currentStep?.line}</span>
                        </div>
                        <div className="font-mono text-xs text-cyan-300 bg-slate-900 p-2 rounded border border-slate-800/80 overflow-x-auto whitespace-pre">
                          {currentStep?.code || '// Finished'}
                        </div>
                        <div className="text-[10px] text-slate-500 pt-1">
                          Stack: {currentStep?.call_stack?.join(' → ') || '<module>'}
                        </div>
                      </div>

                      {/* Live Variable Snapshot */}
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1 overflow-y-auto">
                        <span className="text-[11px] text-slate-500 block">Variable State:</span>
                        {currentStep && Object.keys(currentStep.variables || {}).length > 0 ? (
                          <div className="space-y-1 font-mono text-[11px]">
                            {Object.entries(currentStep.variables).map(([k, v]) => (
                              <div key={k} className="flex items-center justify-between p-1 rounded bg-slate-900/60 border border-slate-800/60">
                                <span className="text-slate-400">{k}:</span>
                                <span className="text-amber-300 font-bold truncate max-w-[180px]">
                                  {typeof v === 'object' ? JSON.stringify(v) : String(v)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-slate-500 text-[11px] italic py-2">No active local variables in this frame</div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-2">
                    <Sparkles className="w-8 h-8 text-cyan-400 animate-pulse" />
                    <h4 className="text-sm font-bold text-white">Visualizer Ready</h4>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Click the &ldquo;Visualize&rdquo; button above to generate a line-by-line trace with active variable inspections.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
