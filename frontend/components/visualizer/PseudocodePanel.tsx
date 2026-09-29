'use client';

import React from 'react';
import { Code2 } from 'lucide-react';

interface PseudocodePanelProps {
  pseudocodeLines: string[];
  activeLine?: number;
}

export function PseudocodePanel({ pseudocodeLines, activeLine }: PseudocodePanelProps) {
  if (!pseudocodeLines || pseudocodeLines.length === 0) return null;

  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900/90 border-b border-slate-800">
        <Code2 className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-semibold text-white">Algorithm Trace & Pseudocode</span>
      </div>

      <div className="p-3 font-mono text-xs overflow-x-auto space-y-0.5">
        {pseudocodeLines.map((line, idx) => {
          const lineNumber = idx + 1;
          const isActive = activeLine === lineNumber;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 px-2 py-1 rounded transition-colors ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border-l-2 border-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-5 text-right text-[10px] text-slate-600 select-none font-mono">
                {lineNumber}
              </span>
              <span className="whitespace-pre">{line}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
