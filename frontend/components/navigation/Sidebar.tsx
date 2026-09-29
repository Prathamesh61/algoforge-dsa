'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Map,
  Code2,
  Cpu,
  Trophy,
  BarChart3,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
  Sparkles,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const sections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'LEARN',
      items: [
        { label: 'Courses', href: '/courses', icon: BookOpen },
        { label: 'Roadmap', href: '/roadmap', icon: Map, badge: 'Pro' },
      ],
    },
    {
      title: 'PRACTICE',
      items: [
        { label: 'Problems', href: '/problems', icon: Code2 },
        { label: 'Daily Challenge', href: '/problems/daily', icon: Sparkles, badge: 'XP x2' },
      ],
    },
    {
      title: 'VISUALIZE',
      items: [
        { label: 'Algorithm Lab', href: '/visualizer', icon: Cpu },
        { label: 'Data Structures', href: '/visualizer/ds', icon: Layers },
      ],
    },
    {
      title: 'PROGRESS',
      items: [
        { label: 'Leaderboard', href: '/leaderboard', icon: Trophy },
        { label: 'Achievements', href: '/achievements', icon: Sparkles },
        { label: 'Analytics', href: '/analytics', icon: BarChart3 },
      ],
    },
    {
      title: 'ACCOUNT',
      items: [
        { label: 'Profile', href: '/profile', icon: User },
        { label: 'Settings', href: '/settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={cn(
        'relative hidden md:flex flex-col border-r border-slate-800 bg-slate-950/80 backdrop-blur-xl transition-all duration-300 z-30 h-screen sticky top-0',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      {collapsed ? (
        <div className="h-16 flex items-center justify-center relative border-b border-slate-800/80 w-full">
          <Link
            href="/dashboard"
            className="flex items-center justify-center"
            title="AlgoForge - DSA Platform"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0 hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5 text-white" />
            </div>
          </Link>
          <button
            onClick={() => setCollapsed(false)}
            className="absolute -right-3 top-5 p-1 rounded-full bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors shadow-md z-30"
            title="Expand sidebar"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 w-full">
          <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 shrink-0">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                AlgoForge
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  v1.0
                </span>
              </span>
              <span className="text-[11px] text-slate-400 font-medium">DSA Learning & Judge</span>
            </div>
          </Link>
          <button
            onClick={() => setCollapsed(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            {!collapsed && (
              <h3 className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                {section.title}
              </h3>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 relative',
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/20 to-cyan-500/10 text-white font-semibold border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 shrink-0 transition-colors',
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                    )}
                  />
                  {!collapsed && (
                    <span className="flex-1 truncate tracking-tight">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Streak Card */}
      {!collapsed ? (
        <div className="p-3 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 shadow-inner flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">7 Day Streak</div>
                <div className="text-[10px] text-slate-400">Keep it burning today!</div>
              </div>
            </div>
            <div className="text-xs font-bold text-cyan-400">+20 XP</div>
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-slate-800/80 flex justify-center">
          <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
          </div>
        </div>
      )}
    </aside>
  );
}
