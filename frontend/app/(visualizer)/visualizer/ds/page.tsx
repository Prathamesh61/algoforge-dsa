'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Layers,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Plus,
  Trash2,
  Search,
  ArrowRight,
  GitBranch,
  Cpu,
  Clock,
  Sparkles,
  Info,
  Maximize2
} from 'lucide-react';

type DSType = 'linked-list' | 'stack' | 'queue' | 'binary-tree' | 'graph' | 'recursion' | 'dp';

export default function DataStructuresVisualizerPage() {
  const [selectedDS, setSelectedDS] = useState<DSType>('linked-list');
  const [inputValue, setInputValue] = useState<string>('25');

  // Stepper state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [steps, setSteps] = useState<any[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  // 1. Linked List State
  const [linkedList, setLinkedList] = useState<number[]>([10, 20, 30, 40]);
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  // 2. Stack State
  const [stackItems, setStackItems] = useState<number[]>([10, 20, 30]);

  // 3. Queue State
  const [queueItems, setQueueItems] = useState<number[]>([10, 20, 30, 40]);

  // 4. Binary Tree State
  const [treeNodes, setTreeNodes] = useState<{ id: number; val: number; left?: number; right?: number; x: number; y: number }[]>([
    { id: 1, val: 50, x: 250, y: 50, left: 2, right: 3 },
    { id: 2, val: 30, x: 150, y: 130, left: 4, right: 5 },
    { id: 3, val: 70, x: 350, y: 130, left: 6, right: 7 },
    { id: 4, val: 20, x: 100, y: 210 },
    { id: 5, val: 40, x: 200, y: 210 },
    { id: 6, val: 60, x: 300, y: 210 },
    { id: 7, val: 80, x: 400, y: 210 },
  ]);
  const [activeTreeNodeId, setActiveTreeNodeId] = useState<number | null>(null);

  // 5. Graph State
  const graphVertices = [
    { id: 'A', x: 80, y: 80 },
    { id: 'B', x: 220, y: 50 },
    { id: 'C', x: 360, y: 80 },
    { id: 'D', x: 120, y: 200 },
    { id: 'E', x: 320, y: 200 },
  ];
  const graphEdges = [
    { u: 'A', v: 'B', weight: 4 },
    { u: 'B', v: 'C', weight: 2 },
    { u: 'A', v: 'D', weight: 5 },
    { u: 'B', v: 'E', weight: 7 },
    { u: 'C', v: 'E', weight: 3 },
    { u: 'D', v: 'E', weight: 6 },
  ];
  const [visitedVertices, setVisitedVertices] = useState<string[]>([]);
  const [activeVertex, setActiveVertex] = useState<string | null>(null);

  // 6. Recursion Tree State (Fibonacci n=4)
  const [recursionFrames, setRecursionFrames] = useState<string[]>([]);

  // 7. DP Matrix State (0/1 Knapsack or Grid Paths)
  const [dpGrid, setDpGrid] = useState<number[][]>([
    [1, 1, 1, 1],
    [1, 2, 3, 4],
    [1, 3, 6, 10],
  ]);
  const [activeDpCell, setActiveDpCell] = useState<{ r: number; c: number } | null>(null);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying || steps.length === 0) return;
    const delays = { slow: 1200, normal: 600, fast: 250 };
    const delay = delays[playbackSpeed];

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev + 1 >= steps.length) {
          setIsPlaying(false);
          return prev;
        }
        const next = prev + 1;
        executeStepAction(steps[next]);
        return next;
      });
    }, delay);

    return () => clearInterval(timer);
  }, [isPlaying, steps, playbackSpeed]);

  const executeStepAction = (step: any) => {
    if (!step) return;
    if (step.highlightIndex !== undefined) setHighlightedIndex(step.highlightIndex);
    if (step.treeNodeId !== undefined) setActiveTreeNodeId(step.treeNodeId);
    if (step.activeVertex !== undefined) setActiveVertex(step.activeVertex);
    if (step.visitedVertices) setVisitedVertices(step.visitedVertices);
    if (step.recursionFrames) setRecursionFrames(step.recursionFrames);
    if (step.dpCell) setActiveDpCell(step.dpCell);
  };

  // LINKED LIST ACTIONS
  const handleLLInsertHead = () => {
    const val = Number(inputValue) || 99;
    setLinkedList([val, ...linkedList]);
    setHighlightedIndex(0);
    setTimeout(() => setHighlightedIndex(null), 1200);
  };

  const handleLLInsertTail = () => {
    const val = Number(inputValue) || 99;
    setLinkedList([...linkedList, val]);
    setHighlightedIndex(linkedList.length);
    setTimeout(() => setHighlightedIndex(null), 1200);
  };

  const handleLLDelete = () => {
    if (linkedList.length === 0) return;
    setHighlightedIndex(0);
    setTimeout(() => {
      setLinkedList(linkedList.slice(1));
      setHighlightedIndex(null);
    }, 400);
  };

  const handleLLSearch = () => {
    const target = Number(inputValue);
    const newSteps = [];
    for (let i = 0; i < linkedList.length; i++) {
      newSteps.push({
        step: i + 1,
        highlightIndex: i,
        message: `Visiting Node ${i}: value = ${linkedList[i]} (Target = ${target})`,
      });
      if (linkedList[i] === target) {
        newSteps.push({
          step: i + 2,
          highlightIndex: i,
          message: `Found target ${target} at node index ${i}!`,
        });
        break;
      }
    }
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    if (newSteps.length > 0) executeStepAction(newSteps[0]);
  };

  // STACK ACTIONS
  const handleStackPush = () => {
    const val = Number(inputValue) || 99;
    setStackItems([...stackItems, val]);
  };

  const handleStackPop = () => {
    if (stackItems.length === 0) return;
    setStackItems(stackItems.slice(0, stackItems.length - 1));
  };

  // QUEUE ACTIONS
  const handleQueueEnqueue = () => {
    const val = Number(inputValue) || 99;
    setQueueItems([...queueItems, val]);
  };

  const handleQueueDequeue = () => {
    if (queueItems.length === 0) return;
    setQueueItems(queueItems.slice(1));
  };

  // TREE ACTIONS (BFS Traversal)
  const handleTreeBFS = () => {
    const order = [1, 2, 3, 4, 5, 6, 7];
    const newSteps = order.map((id, idx) => ({
      step: idx + 1,
      treeNodeId: id,
      message: `BFS Level-Order Visit: Node ${treeNodes.find(n => n.id === id)?.val}`,
    }));
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    if (newSteps.length > 0) executeStepAction(newSteps[0]);
  };

  // GRAPH ACTIONS (BFS Traversal)
  const handleGraphBFS = () => {
    const sequence = ['A', 'B', 'D', 'C', 'E'];
    const visited: string[] = [];
    const newSteps = sequence.map((node, idx) => {
      visited.push(node);
      return {
        step: idx + 1,
        activeVertex: node,
        visitedVertices: [...visited],
        message: `Graph Traversal: Visited vertex '${node}'`,
      };
    });
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    if (newSteps.length > 0) executeStepAction(newSteps[0]);
  };

  // RECURSION ACTIONS (Factorial call stack)
  const handleRecursionDemo = () => {
    const sequence = [
      ['main()'],
      ['main()', 'factorial(4)'],
      ['main()', 'factorial(4)', 'factorial(3)'],
      ['main()', 'factorial(4)', 'factorial(3)', 'factorial(2)'],
      ['main()', 'factorial(4)', 'factorial(3)', 'factorial(2)', 'factorial(1) [Base Case = 1]'],
      ['main()', 'factorial(4)', 'factorial(3)', 'factorial(2) returns 2'],
      ['main()', 'factorial(4)', 'factorial(3) returns 6'],
      ['main()', 'factorial(4) returns 24'],
      ['main() Completed. Result = 24'],
    ];
    const newSteps = sequence.map((frames, idx) => ({
      step: idx + 1,
      recursionFrames: frames,
      message: `Call Stack frame: ${frames[frames.length - 1]}`,
    }));
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    if (newSteps.length > 0) executeStepAction(newSteps[0]);
  };

  // DP ACTIONS (Unique Paths simulation)
  const handleDPSimulate = () => {
    const cells: { r: number; c: number }[] = [];
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        cells.push({ r, c });
      }
    }
    const newSteps = cells.map((cell, idx) => ({
      step: idx + 1,
      dpCell: cell,
      message: `Computing dp[${cell.r}][${cell.c}] = dp[${cell.r - 1}][${cell.c}] + dp[${cell.r}][${cell.c - 1}] = ${dpGrid[cell.r][cell.c]}`,
    }));
    setSteps(newSteps);
    setCurrentStepIndex(0);
    setIsPlaying(true);
    if (newSteps.length > 0) executeStepAction(newSteps[0]);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>Interactive Data Structure Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Visual Memory & Pointer Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Interact with Linked Lists, Stacks, Queues, Trees, Graphs, Recursion, and DP grids in real-time.
          </p>
        </div>

        {/* DS Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800">
          {[
            { key: 'linked-list', label: 'Linked List' },
            { key: 'stack', label: 'Stack (LIFO)' },
            { key: 'queue', label: 'Queue (FIFO)' },
            { key: 'binary-tree', label: 'Binary Tree' },
            { key: 'graph', label: 'Graph & BFS' },
            { key: 'recursion', label: 'Recursion Tree' },
            { key: 'dp', label: 'DP Table' },
          ].map((ds) => (
            <button
              key={ds.key}
              onClick={() => {
                setSelectedDS(ds.key as DSType);
                setSteps([]);
                setIsPlaying(false);
                setHighlightedIndex(null);
                setActiveTreeNodeId(null);
                setActiveVertex(null);
                setActiveDpCell(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedDS === ds.key
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {ds.label}
            </button>
          ))}
        </div>
      </div>

      {/* Control Action Toolbar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Dynamic Controls based on selected DS */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedDS === 'linked-list' && (
            <>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-20 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                placeholder="Val"
              />
              <button
                onClick={handleLLInsertHead}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" /> Insert Head
              </button>
              <button
                onClick={handleLLInsertTail}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" /> Insert Tail
              </button>
              <button
                onClick={handleLLDelete}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Head
              </button>
              <button
                onClick={handleLLSearch}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-bold text-cyan-300 flex items-center gap-1"
              >
                <Search className="w-3.5 h-3.5" /> Search Node
              </button>
            </>
          )}

          {selectedDS === 'stack' && (
            <>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-20 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                placeholder="Val"
              />
              <button
                onClick={handleStackPush}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Push (Top)
              </button>
              <button
                onClick={handleStackPop}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Pop
              </button>
            </>
          )}

          {selectedDS === 'queue' && (
            <>
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-20 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                placeholder="Val"
              />
              <button
                onClick={handleQueueEnqueue}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Enqueue (Rear)
              </button>
              <button
                onClick={handleQueueDequeue}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Dequeue (Front)
              </button>
            </>
          )}

          {selectedDS === 'binary-tree' && (
            <button
              onClick={handleTreeBFS}
              className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" /> Run Level-Order (BFS) Traversal
            </button>
          )}

          {selectedDS === 'graph' && (
            <button
              onClick={handleGraphBFS}
              className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" /> Run BFS Traversal from 'A'
            </button>
          )}

          {selectedDS === 'recursion' && (
            <button
              onClick={handleRecursionDemo}
              className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" /> Trace Factorial(4) Recursion Stack
            </button>
          )}

          {selectedDS === 'dp' && (
            <button
              onClick={handleDPSimulate}
              className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1"
            >
              <Play className="w-3.5 h-3.5 fill-slate-950" /> Simulate DP Unique Paths Transition
            </button>
          )}
        </div>

        {/* Stepper Timeline Controls */}
        {steps.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIndex((prev) => Math.max(0, prev - 1));
                executeStepAction(steps[Math.max(0, currentStepIndex - 1)]);
              }}
              disabled={currentStepIndex === 0}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-3 py-1 rounded-lg bg-slate-800 text-xs font-bold text-white flex items-center gap-1"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={() => {
                setIsPlaying(false);
                const next = Math.min(steps.length - 1, currentStepIndex + 1);
                setCurrentStepIndex(next);
                executeStepAction(steps[next]);
              }}
              disabled={currentStepIndex >= steps.length - 1}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-40"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
            <span className="text-xs font-mono text-slate-400">
              {currentStepIndex + 1} / {steps.length}
            </span>
          </div>
        )}
      </div>

      {/* Main Interactive Stage */}
      <div className="p-8 rounded-3xl bg-slate-900/40 border border-slate-800 min-h-[420px] flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-xl">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* 1. LINKED LIST STAGE */}
        {selectedDS === 'linked-list' && (
          <div className="flex flex-wrap items-center justify-center gap-3 py-8">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider mr-2">HEAD →</span>
            {linkedList.map((val, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div
                  className={`p-3.5 rounded-2xl border transition-all duration-300 flex items-center shadow-lg ${
                    highlightedIndex === idx
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 scale-110 shadow-cyan-500/30'
                      : 'bg-slate-950/80 border-slate-800 text-white'
                  }`}
                >
                  <div className="px-3 font-mono font-bold text-base">{val}</div>
                  <div className="border-l border-slate-800 pl-2 text-[10px] font-mono text-slate-500">
                    next
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600 shrink-0" />
              </div>
            ))}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-500">
              NULL
            </div>
          </div>
        )}

        {/* 2. STACK STAGE (LIFO) */}
        {selectedDS === 'stack' && (
          <div className="flex flex-col items-center py-6">
            <div className="text-xs font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
              <span>TOP OF STACK ↓</span>
            </div>
            <div className="w-48 border-x-2 border-b-2 border-slate-700 rounded-b-2xl p-3 flex flex-col-reverse gap-2 bg-slate-950/60 min-h-[220px]">
              {stackItems.map((val, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-center font-mono font-bold text-sm shadow-md transition-all ${
                    idx === stackItems.length - 1
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 animate-scale-in'
                      : 'bg-slate-900 border-slate-800 text-slate-200'
                  }`}
                >
                  {val}
                </div>
              ))}
            </div>
            <span className="text-[11px] text-slate-500 mt-2 font-mono">LIFO (Last In First Out)</span>
          </div>
        )}

        {/* 3. QUEUE STAGE (FIFO) */}
        {selectedDS === 'queue' && (
          <div className="flex flex-col items-center py-8 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">FRONT (Dequeue) →</span>
              <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-950/70 border-y-2 border-slate-700 min-w-[320px] overflow-x-auto">
                {queueItems.map((val, idx) => (
                  <div
                    key={idx}
                    className={`px-4 py-3 rounded-xl border font-mono font-bold text-sm text-center shadow-md transition-all ${
                      idx === 0
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-slate-900 border-slate-800 text-slate-200'
                    }`}
                  >
                    {val}
                  </div>
                ))}
              </div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">← REAR (Enqueue)</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">FIFO (First In First Out)</span>
          </div>
        )}

        {/* 4. BINARY TREE STAGE */}
        {selectedDS === 'binary-tree' && (
          <div className="w-full flex justify-center py-4">
            <svg width="500" height="280" className="overflow-visible">
              {/* Edges */}
              {treeNodes.map((node) => {
                const leftChild = treeNodes.find((n) => n.id === node.left);
                const rightChild = treeNodes.find((n) => n.id === node.right);
                return (
                  <g key={`edges-${node.id}`}>
                    {leftChild && (
                      <line
                        x1={node.x}
                        y1={node.y}
                        x2={leftChild.x}
                        y2={leftChild.y}
                        stroke="#334155"
                        strokeWidth="2"
                      />
                    )}
                    {rightChild && (
                      <line
                        x1={node.x}
                        y1={node.y}
                        x2={rightChild.x}
                        y2={rightChild.y}
                        stroke="#334155"
                        strokeWidth="2"
                      />
                    )}
                  </g>
                );
              })}

              {/* Nodes */}
              {treeNodes.map((node) => {
                const isActive = activeTreeNodeId === node.id;
                return (
                  <g key={node.id} className="cursor-pointer transition-transform duration-300">
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r="22"
                      fill={isActive ? '#06b6d4' : '#0f172a'}
                      stroke={isActive ? '#22d3ee' : '#334155'}
                      strokeWidth="2"
                      className="transition-colors duration-300"
                    />
                    <text
                      x={node.x}
                      y={node.y + 5}
                      textAnchor="middle"
                      fill={isActive ? '#020617' : '#ffffff'}
                      fontSize="12"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {node.val}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* 5. GRAPH STAGE */}
        {selectedDS === 'graph' && (
          <div className="w-full flex justify-center py-4">
            <svg width="450" height="260" className="overflow-visible">
              {/* Edges with weights */}
              {graphEdges.map((e, idx) => {
                const uNode = graphVertices.find((v) => v.id === e.u)!;
                const vNode = graphVertices.find((v) => v.id === e.v)!;
                const midX = (uNode.x + vNode.x) / 2;
                const midY = (uNode.y + vNode.y) / 2;
                return (
                  <g key={idx}>
                    <line
                      x1={uNode.x}
                      y1={uNode.y}
                      x2={vNode.x}
                      y2={vNode.y}
                      stroke="#334155"
                      strokeWidth="2"
                    />
                    <rect
                      x={midX - 10}
                      y={midY - 9}
                      width="20"
                      height="16"
                      rx="4"
                      fill="#020617"
                      stroke="#1e293b"
                    />
                    <text
                      x={midX}
                      y={midY + 3}
                      textAnchor="middle"
                      fontSize="10"
                      fill="#94a3b8"
                      fontFamily="monospace"
                    >
                      {e.weight}
                    </text>
                  </g>
                );
              })}

              {/* Vertices */}
              {graphVertices.map((v) => {
                const isVisited = visitedVertices.includes(v.id);
                const isActive = activeVertex === v.id;
                return (
                  <g key={v.id}>
                    <circle
                      cx={v.x}
                      cy={v.y}
                      r="22"
                      fill={isActive ? '#06b6d4' : (isVisited ? '#10b981' : '#0f172a')}
                      stroke={isActive ? '#22d3ee' : (isVisited ? '#34d399' : '#334155')}
                      strokeWidth="2.5"
                    />
                    <text
                      x={v.x}
                      y={v.y + 4}
                      textAnchor="middle"
                      fill={isActive || isVisited ? '#020617' : '#ffffff'}
                      fontSize="13"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {v.id}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}

        {/* 6. RECURSION CALL STACK */}
        {selectedDS === 'recursion' && (
          <div className="w-full max-w-lg space-y-2 py-4">
            <span className="text-xs font-bold text-cyan-400 block mb-2">Recursive Call Stack Frame Hierarchy:</span>
            {recursionFrames.length > 0 ? (
              recursionFrames.map((frame, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border font-mono text-xs transition-all ${
                    idx === recursionFrames.length - 1
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-950 border-slate-800 text-slate-300'
                  }`}
                  style={{ marginLeft: `${idx * 16}px` }}
                >
                  <span className="text-slate-500 mr-2">├──</span>
                  {frame}
                </div>
              ))
            ) : (
              <div className="text-xs text-slate-500 italic text-center py-8">
                Click &ldquo;Trace Factorial(4) Recursion Stack&rdquo; above to animate the call tree and return unwind.
              </div>
            )}
          </div>
        )}

        {/* 7. DYNAMIC PROGRAMMING GRID */}
        {selectedDS === 'dp' && (
          <div className="space-y-4 py-4">
            <span className="text-xs font-bold text-cyan-400 block text-center">
              2D Tabulation Grid [Row = Heights, Col = Steps]
            </span>
            <div className="grid grid-cols-4 gap-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
              {dpGrid.map((row, r) =>
                row.map((val, c) => {
                  const isActive = activeDpCell?.r === r && activeDpCell?.c === c;
                  return (
                    <div
                      key={`${r}-${c}`}
                      className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center font-mono transition-all ${
                        isActive
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 scale-105 shadow-md shadow-cyan-500/30'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300'
                      }`}
                    >
                      <span className="text-[9px] text-slate-500">[{r}][{c}]</span>
                      <span className="text-sm font-bold text-white">{val}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Operation Log Explanation */}
      {steps.length > 0 && steps[currentStepIndex] && (
        <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-center gap-3">
          <Info className="w-4 h-4 shrink-0 text-cyan-400" />
          <span>{steps[currentStepIndex].message}</span>
        </div>
      )}
    </div>
  );
}
