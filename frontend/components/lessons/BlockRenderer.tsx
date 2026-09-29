'use client';

import React, { useState } from 'react';
import {
  Code2,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Info,
  AlertTriangle,
  Lightbulb,
  Copy,
  Check,
  Play,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { LessonBlock } from '@/types';
import { apiClient } from '@/lib/api-client';

interface BlockRendererProps {
  block: LessonBlock;
  lessonSlug: string;
  blockIndex: number;
}

export function BlockRenderer({ block, lessonSlug, blockIndex }: BlockRendererProps) {
  switch (block.type) {
    case 'text':
      return <TextBlock content={block.content} />;
    case 'code':
      return <CodeBlock code={block.code} language={block.language} title={block.title} />;
    case 'animation':
      return <AnimationBlock component={block.component} config={block.config} />;
    case 'video':
      return <VideoBlock youtubeId={block.youtubeId} title={block.title} duration={block.duration} />;
    case 'quiz':
      return (
        <QuizBlock
          question={block.question}
          options={block.options}
          correctIndex={block.correctIndex}
          explanation={block.explanation}
          lessonSlug={lessonSlug}
          blockIndex={blockIndex}
        />
      );
    case 'complexity':
      return <ComplexityBlock time={block.time} space={block.space} explanation={block.explanation} />;
    case 'callout':
      return <CalloutBlock variant={block.variant} title={block.title} text={block.text} />;
    default:
      return null;
  }
}

// 1. Text Block
function TextBlock({ content }: { content: string }) {
  // Simple markdown-like line processor
  const lines = content.split('\n');
  return (
    <div className="space-y-3 text-slate-300 leading-relaxed text-sm sm:text-base">
      {lines.map((line, idx) => {
        if (line.startsWith('## ')) {
          return (
            <h2 key={idx} className="text-xl sm:text-2xl font-bold text-white pt-4 pb-1 tracking-tight">
              {line.replace('## ', '')}
            </h2>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h3 key={idx} className="text-lg font-bold text-white pt-3 pb-1 tracking-tight">
              {line.replace('### ', '')}
            </h3>
          );
        }
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return (
            <li key={idx} className="ml-5 list-disc text-slate-300">
              {line.replace(/^[-*]\s+/, '')}
            </li>
          );
        }
        if (/^\d+\.\s/.test(line.trim())) {
          return (
            <li key={idx} className="ml-5 list-decimal text-slate-300">
              {line.replace(/^\d+\.\s+/, '')}
            </li>
          );
        }
        if (line.trim() === '') {
          return <div key={idx} className="h-1" />;
        }
        return <p key={idx}>{line}</p>;
      })}
    </div>
  );
}

// 2. Code Block
function CodeBlock({ code, language, title }: { code: string; language: string; title?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl my-4">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-white">{title || 'Code Snippet'}</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase">
            {language}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 text-xs transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 text-xs sm:text-sm font-mono text-cyan-200 overflow-x-auto leading-relaxed scrollbar-thin scrollbar-thumb-slate-800">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// 3. Interactive Animation Block (Binary Search step demonstrator)
function AnimationBlock({ component, config }: { component: string; config?: Record<string, any> }) {
  const array = config?.array || [1, 3, 5, 7, 9, 11, 15];
  const target = config?.target || 11;

  const [stepIndex, setStepIndex] = useState(0);

  // Binary search deterministic steps
  const steps = [
    { low: 0, high: 6, mid: 3, state: 'Searching entire array [0..6]', found: false },
    { low: 0, high: 6, mid: 3, state: 'arr[3] = 7. Since 7 < 11, target is in the right half. Discard left half.', found: false },
    { low: 4, high: 6, mid: 5, state: 'New search range: [4..6]. mid = 5.', found: false },
    { low: 4, high: 6, mid: 5, state: 'arr[5] = 11. Target == arr[mid]! Element found at index 5!', found: true },
  ];

  const currentStep = steps[stepIndex];

  return (
    <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-2xl my-6 space-y-6 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Interactive Simulation</span>
          <h3 className="text-base font-bold text-white mt-0.5">Binary Search Visual Step Execution</h3>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
            Target = <span className="text-cyan-400 font-mono font-bold">{target}</span>
          </span>
          <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
            Step {stepIndex + 1} of {steps.length}
          </span>
        </div>
      </div>

      {/* Visual Array Bars */}
      <div className="flex justify-center items-end gap-2 sm:gap-3 py-6 px-2 overflow-x-auto">
        {array.map((val: number, idx: number) => {
          const isMid = idx === currentStep.mid;
          const isLow = idx === currentStep.low;
          const isHigh = idx === currentStep.high;
          const isInRange = idx >= currentStep.low && idx <= currentStep.high;
          const isTargetFound = currentStep.found && idx === currentStep.mid;

          let barColor = 'bg-slate-800 text-slate-500 opacity-40';
          if (isTargetFound) {
            barColor = 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/50 scale-105';
          } else if (isMid) {
            barColor = 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-300';
          } else if (isInRange) {
            barColor = 'bg-indigo-600/60 text-white border border-indigo-400/40';
          }

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5 transition-all duration-300">
              {/* Pointer indicator */}
              <div className="h-4 text-[10px] font-bold text-center">
                {isTargetFound ? (
                  <span className="text-emerald-400">FOUND</span>
                ) : isMid ? (
                  <span className="text-cyan-400">MID</span>
                ) : isLow && isHigh ? (
                  <span className="text-amber-400">L/H</span>
                ) : isLow ? (
                  <span className="text-amber-400">LOW</span>
                ) : isHigh ? (
                  <span className="text-purple-400">HIGH</span>
                ) : null}
              </div>

              {/* Element Box */}
              <div
                className={`w-10 sm:w-12 h-14 sm:h-16 rounded-2xl flex items-center justify-center text-sm sm:text-base font-extrabold transition-all duration-300 ${barColor}`}
              >
                {val}
              </div>

              {/* Index Number */}
              <span className="text-[10px] font-mono text-slate-500">[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Step Explanation Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 flex items-center gap-3">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
        <span>{currentStep.state}</span>
      </div>

      {/* Controller Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={() => setStepIndex(0)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setStepIndex(Math.max(0, stepIndex - 1))}
            disabled={stepIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white text-xs font-semibold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>
          <button
            onClick={() => setStepIndex(Math.min(steps.length - 1, stepIndex + 1))}
            disabled={stepIndex === steps.length - 1}
            className="flex items-center gap-1 px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 text-xs font-bold transition-all shadow-md active:scale-95"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// 4. YouTube Video Embed
function VideoBlock({ youtubeId, title, duration }: { youtubeId: string; title: string; duration?: string }) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl my-6">
      <div className="px-5 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <Play className="w-3 h-3 fill-rose-500" />
          </div>
          <span className="text-xs font-bold text-white">{title}</span>
        </div>
        {duration && (
          <span className="text-[10px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{duration}</span>
          </span>
        )}
      </div>
      <div className="relative aspect-video w-full">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-none"
        />
      </div>
    </div>
  );
}

// 5. Interactive Quiz Block
function QuizBlock({
  question,
  options,
  correctIndex,
  explanation,
  lessonSlug,
  blockIndex,
}: {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  lessonSlug: string;
  blockIndex: number;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{ is_correct: boolean; explanation: string } | null>(null);

  const handleSubmit = async () => {
    if (selected === null) return;
    try {
      const res = await apiClient.post(`/courses/lessons/${lessonSlug}/quiz/`, {
        selected_index: selected,
        quiz_index: blockIndex,
      });
      setResult(res);
      setSubmitted(true);
    } catch {
      // Local fallback evaluation
      const is_correct = selected === correctIndex;
      setResult({ is_correct, explanation });
      setSubmitted(true);
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 my-6 shadow-xl space-y-4">
      <div className="flex items-center gap-2 text-indigo-400">
        <HelpCircle className="w-5 h-5" />
        <span className="text-xs font-bold uppercase tracking-wider">Concept Check (+10 XP)</span>
      </div>

      <h3 className="text-base font-bold text-white">{question}</h3>

      <div className="space-y-2.5 pt-1">
        {options.map((opt, i) => {
          let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';
          if (submitted) {
            if (i === correctIndex) {
              btnStyle = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300 font-semibold';
            } else if (i === selected) {
              btnStyle = 'bg-rose-500/10 border-rose-500/50 text-rose-300';
            }
          } else if (selected === i) {
            btnStyle = 'bg-indigo-600/20 border-indigo-500 text-white font-semibold ring-1 ring-indigo-500/50';
          }

          return (
            <button
              key={i}
              type="button"
              disabled={submitted}
              onClick={() => setSelected(i)}
              className={`w-full p-3.5 rounded-2xl border text-xs sm:text-sm text-left flex items-center justify-between transition-all ${btnStyle}`}
            >
              <span>{opt}</span>
              {submitted && i === correctIndex && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              {submitted && i === selected && i !== correctIndex && <XCircle className="w-4 h-4 text-rose-400" />}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            disabled={selected === null}
            onClick={handleSubmit}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs transition-all shadow-md active:scale-95"
          >
            Check Answer
          </button>
        </div>
      ) : (
        <div
          className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1 animate-fade-in ${
            result?.is_correct
              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
          }`}
        >
          <div className="font-bold flex items-center gap-1.5">
            {result?.is_correct ? '🎉 Correct! +10 XP earned.' : '❌ Not quite right.'}
          </div>
          <p className="text-slate-300">{result?.explanation || explanation}</p>
        </div>
      )}
    </div>
  );
}

// 6. Complexity Card
function ComplexityBlock({ time, space, explanation }: { time: string; space: string; explanation?: string }) {
  return (
    <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 my-4 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Complexity Analysis</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Time Complexity</span>
          <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">{time}</div>
        </div>
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80">
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Space Complexity</span>
          <div className="text-sm font-bold text-indigo-400 font-mono mt-0.5">{space}</div>
        </div>
      </div>

      {explanation && <p className="text-xs text-slate-400">{explanation}</p>}
    </div>
  );
}

// 7. Callout Block
function CalloutBlock({ variant, title, text }: { variant: 'tip' | 'warning' | 'info'; title?: string; text: string }) {
  const configs = {
    tip: { icon: Lightbulb, border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', color: 'text-emerald-400' },
    warning: { icon: AlertTriangle, border: 'border-amber-500/20', bg: 'bg-amber-500/10', color: 'text-amber-400' },
    info: { icon: Info, border: 'border-cyan-500/20', bg: 'bg-cyan-500/10', color: 'text-cyan-400' },
  };
  const cfg = configs[variant] || configs.info;
  const Icon = cfg.icon;

  return (
    <div className={`p-4 rounded-2xl border ${cfg.border} ${cfg.bg} flex items-start gap-3 my-4`}>
      <Icon className={`w-5 h-5 ${cfg.color} shrink-0 mt-0.5`} />
      <div className="space-y-0.5 text-xs sm:text-sm">
        {title && <h4 className={`font-bold ${cfg.color}`}>{title}</h4>}
        <p className="text-slate-300 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
