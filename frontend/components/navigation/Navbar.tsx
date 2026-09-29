'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SearchModal } from '@/components/search/SearchModal';
import {
  Search,
  Flame,
  Star,
  Bell,
  Sparkles,
  LogIn,
  LogOut,
  User as UserIcon,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

export function Navbar() {
  const { user, profile, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    router.push('/login');
  };

  const totalXp = profile?.totalXp ?? 0;
  const currentStreak = profile?.currentStreak ?? 0;
  const dailyGoalSolved = profile?.problemsSolvedCount ? Math.min(profile.problemsSolvedCount, profile.dailyGoalTarget || 5) : 0;
  const dailyGoalTarget = profile?.dailyGoalTarget || 5;

  return (
    <>
      <header className="h-16 border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-xl sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Search Trigger Bar */}
        <button
          type="button"
          onClick={() => setIsSearchOpen(true)}
          className="flex-1 max-w-md hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700 transition-colors text-left"
        >
          <Search className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-400 flex-1">
            Search algorithms, problems, lessons... (Ctrl + K)
          </span>
          <kbd className="hidden lg:inline-block text-[10px] bg-slate-800 border border-slate-700/60 px-1.5 py-0.5 rounded text-slate-400 font-mono">
            ⌘K
          </kbd>
        </button>

      {/* Right Action Icons & Badges */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Daily XP Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{totalXp.toLocaleString()} XP</span>
        </div>

        {/* Streak Flame */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
          <span>{currentStreak} Days</span>
        </div>

        {/* Daily Goal Mini */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-medium">Goal:</span>
          <span className="font-bold text-cyan-400">{dailyGoalSolved}/{dailyGoalTarget} Solved</span>
        </div>

        {/* Notifications */}
        <button
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
        </button>

        {/* User Pill / Login Button */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 transition-all text-sm font-medium text-white focus:outline-none"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-7 h-7 rounded-lg object-cover"
                />
              ) : (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {user.fullName ? user.fullName[0].toUpperCase() : 'U'}
                </div>
              )}
              <span className="hidden sm:inline text-xs font-semibold truncate max-w-[120px]">
                {user.fullName || user.username}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-slate-900 border border-slate-800 py-1.5 shadow-2xl z-50 animate-fade-in">
                <div className="px-4 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
                <Link
                  href="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:bg-slate-800/60 hover:text-white transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Your Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-cyan-500/20 active:scale-95"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </header>
    <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
