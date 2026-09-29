'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Code2,
  BookOpen,
  Cpu,
  Layers,
  Compass,
  ArrowRight,
  Loader2,
  Sparkles
} from 'lucide-react';
import { apiClient } from '@/lib/api-client';

interface SearchResultItem {
  id: string;
  category: 'Algorithms' | 'Problems' | 'Courses' | 'Lessons' | 'Roadmap';
  title: string;
  subtitle: string;
  url: string;
  badge?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await apiClient.get<any>(`/search/?q=${encodeURIComponent(query.trim())}`);
        if (res && res.results) {
          setResults(res.results);
          setSelectedIndex(0);
        } else {
          setResults([]);
        }
      } catch (e) {
        console.error('Search request failed', e);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard navigation (Escape, Up, Down, Enter)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results.length > 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex]);

  const handleSelect = (item: SearchResultItem) => {
    onClose();
    router.push(item.url);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Algorithms':
        return <Cpu className="w-4 h-4 text-cyan-400" />;
      case 'Problems':
        return <Code2 className="w-4 h-4 text-emerald-400" />;
      case 'Courses':
        return <Layers className="w-4 h-4 text-indigo-400" />;
      case 'Lessons':
        return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'Roadmap':
        return <Compass className="w-4 h-4 text-purple-400" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search problems, algorithms, lessons, roadmap... (Type at least 2 chars)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />}
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block text-[10px] bg-slate-800 border border-slate-700/60 px-2 py-0.5 rounded text-slate-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {query.trim().length >= 2 && results.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1 block">
                Found {results.length} result{results.length > 1 ? 's' : ''}
              </span>
              {results.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-500/10 border border-cyan-500/30 text-white shadow-sm'
                        : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center shrink-0">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white truncate">{item.title}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/60">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{item.subtitle}</p>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 shrink-0 transition-transform ${isSelected ? 'translate-x-1 text-cyan-400' : 'text-slate-600'}`} />
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty Query: Quick suggestions */}
          {query.trim().length < 2 && (
            <div className="p-4 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Quick Search Suggestions
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  'Binary Search',
                  'Two Sum',
                  'Linked List',
                  'Trees',
                  'Graphs',
                  'Dynamic Programming',
                  'Sorting',
                  'Recursion'
                ].map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800/70 hover:bg-slate-800 text-xs text-slate-300 hover:text-white border border-slate-700/60 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Query with 0 results */}
          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <div className="py-12 px-4 text-center space-y-3">
              <Search className="w-8 h-8 text-slate-600 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">No results found for &ldquo;{query}&rdquo;</h4>
                <p className="text-xs text-slate-400">Try searching for broader keywords like Arrays, Trees, Sorting, or Binary Search.</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Navigate with <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">↑</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">↓</kbd></span>
          <span>Open with <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Enter</kbd></span>
          <span>Close with <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Esc</kbd></span>
        </div>
      </div>
    </div>
  );
}
