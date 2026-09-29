'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlgorithmStep } from '@/types/visualizer';

interface ArrayVisualizerProps {
  step: AlgorithmStep;
}

export function ArrayVisualizer({ step }: ArrayVisualizerProps) {
  const arr = step.arrayState || [];
  const maxVal = Math.max(...arr, 1);
  const minVal = Math.min(...arr, 0);
  const range = maxVal - minVal || 1;

  return (
    <div className="w-full flex flex-col items-center justify-center p-6 sm:p-8 min-h-[320px] bg-slate-950/70 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden backdrop-blur-xl">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

      {/* Array Elements Container */}
      <div className="relative z-10 w-full flex items-end justify-center gap-2 sm:gap-3 px-2 overflow-x-auto min-h-[220px] pb-2">
        {arr.map((val, idx) => {
          const isActive = step.indices?.includes(idx);
          const pointerLabel = step.pointerLabels?.[idx];
          const isComplete = step.type === 'complete';
          const isFound = step.type === 'found' && isActive;
          const isSwap = step.type === 'swap' && isActive;
          const isCompare = step.type === 'compare' && isActive;

          // Height percentage scaled between 35% and 95%
          const heightPercent = Math.max(30, Math.min(95, Math.round(((val - minVal) / range) * 85 + 15)));

          // Dynamic colors & styling
          let barBg = 'bg-slate-800/80 text-slate-300 border-slate-700/60';
          let ringEffect = '';

          if (isComplete || isFound) {
            barBg = 'bg-gradient-to-t from-emerald-600 to-teal-400 text-slate-950 font-bold border-emerald-400';
            ringEffect = 'ring-4 ring-emerald-500/30 shadow-lg shadow-emerald-500/40';
          } else if (isSwap) {
            barBg = 'bg-gradient-to-t from-amber-600 to-orange-400 text-slate-950 font-bold border-amber-300';
            ringEffect = 'ring-4 ring-orange-500/30 shadow-lg shadow-orange-500/40';
          } else if (isCompare) {
            barBg = 'bg-gradient-to-t from-indigo-600 to-cyan-400 text-slate-950 font-bold border-cyan-300';
            ringEffect = 'ring-4 ring-cyan-500/30 shadow-lg shadow-cyan-500/40';
          } else if (isActive) {
            barBg = 'bg-indigo-600 text-white font-semibold border-indigo-400';
          }

          return (
            <div key={idx} className="flex flex-col items-center gap-1.5 shrink-0">
              {/* Pointer Tag / Indicator */}
              <div className="h-6 flex items-center justify-center">
                {pointerLabel ? (
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow uppercase tracking-wider ${
                      isFound
                        ? 'bg-emerald-400 text-slate-950'
                        : isSwap
                        ? 'bg-orange-400 text-slate-950'
                        : isCompare
                        ? 'bg-cyan-400 text-slate-950'
                        : 'bg-indigo-500 text-white'
                    }`}
                  >
                    {pointerLabel}
                  </motion.span>
                ) : null}
              </div>

              {/* Vertical Bar Box */}
              <motion.div
                layout
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                style={{ height: `${heightPercent * 1.5}px` }}
                className={`w-9 sm:w-12 rounded-2xl flex flex-col justify-between items-center py-2 border transition-all ${barBg} ${ringEffect}`}
              >
                <span className="text-xs sm:text-sm font-black font-mono">
                  {val}
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
              </motion.div>

              {/* Index Label */}
              <span className="text-[10px] font-mono text-slate-500">
                [{idx}]
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
