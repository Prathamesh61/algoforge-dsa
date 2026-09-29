'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Code2,
  Cpu,
  Map,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Learn', href: '/courses', icon: BookOpen },
    { label: 'Practice', href: '/problems', icon: Code2 },
    { label: 'Visualizer', href: '/visualizer', icon: Cpu },
    { label: 'Roadmap', href: '/roadmap', icon: Map },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 flex items-center justify-around shadow-2xl">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-150',
              isActive
                ? 'text-cyan-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            )}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
