'use client';

import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Gauge,
} from 'lucide-react';

interface TimelineControlsProps {
  currentStepIndex: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSeek: (stepIndex: number) => void;
  onSpeedChange: (speed: number) => void;
}

export function TimelineControls({
  currentStepIndex,
  totalSteps,
  isPlaying,
  speed,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSeek,
  onSpeedChange,
}: TimelineControlsProps) {
  const speeds = [0.5, 1, 2, 4];

  return (
    <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 shadow-xl space-y-3">
      {/* Scrubber Range Slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Step {currentStepIndex + 1} of {Math.max(1, totalSteps)}</span>
          <span>{totalSteps > 0 ? Math.round(((currentStepIndex + 1) / totalSteps) * 100) : 0}%</span>
        </div>
        <input
          type="range"
          min="0"
          max={Math.max(0, totalSteps - 1)}
          value={currentStepIndex}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
      </div>

      {/* Button Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Left: Reset */}
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 transition-colors"
          title="Reset to beginning"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>

        {/* Center: Stepping & Playback */}
        <div className="flex items-center gap-2">
          <button
            onClick={onStepBackward}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-white border border-slate-800 transition-all active:scale-95"
            title="Step Back"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={isPlaying ? onPause : onPlay}
            className="flex items-center justify-center w-10 h-10 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 transition-all active:scale-95"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-slate-950" />
            ) : (
              <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
            )}
          </button>

          <button
            onClick={onStepForward}
            disabled={currentStepIndex >= totalSteps - 1}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-30 text-white border border-slate-800 transition-all active:scale-95"
            title="Step Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Speed Multiplier */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <Gauge className="w-3.5 h-3.5 text-slate-500 ml-1.5" />
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono transition-all ${
                speed === s
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
