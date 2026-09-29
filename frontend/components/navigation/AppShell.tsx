'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/AuthContext';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Navbar } from '@/components/navigation/Navbar';
import { MobileNav } from '@/components/navigation/MobileNav';
import { PublicNav } from '@/components/navigation/PublicNav';
import { PublicFooter } from '@/components/navigation/PublicFooter';
import { Cpu } from 'lucide-react';

const PUBLIC_ROUTES = ['/', '/features', '/how-it-works', '/about'];
const AUTH_ROUTES = ['/login', '/register'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);
  const isProtectedRoute = !isPublicRoute && !isAuthRoute;

  useEffect(() => {
    if (!isLoading) {
      // If authenticated user visits login or register, redirect to dashboard
      if (user && isAuthRoute) {
        router.replace('/dashboard');
      }
      // If unauthenticated user visits a protected route, redirect to login
      else if (!user && isProtectedRoute) {
        router.replace('/login');
      }
    }
  }, [user, isLoading, pathname, isAuthRoute, isProtectedRoute, router]);

  // Loading state skeleton for route transitions
  if (isLoading && isProtectedRoute) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-cyan-500/20 animate-pulse">
          <Cpu className="w-8 h-8 text-white" />
        </div>
        <div className="space-y-1">
          <div className="text-white font-bold text-lg">Loading AlgoForge...</div>
          <div className="text-slate-400 text-xs">Synchronizing platform state & secure session</div>
        </div>
        <div className="w-48 h-1.5 bg-slate-900 rounded-full overflow-hidden">
          <div className="h-full bg-cyan-400 rounded-full animate-indeterminate" />
        </div>
      </div>
    );
  }

  // If on a public marketing page: Render Public Layout (PublicNav + Content + PublicFooter)
  if (isPublicRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <PublicNav />
        <main className="flex-1">
          {children}
        </main>
        <PublicFooter />
      </div>
    );
  }

  // If on Auth route (login/register): Render clean auth container
  if (isAuthRoute) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
        <PublicNav />
        <main className="flex-1 flex items-center justify-center p-4">
          {children}
        </main>
      </div>
    );
  }

  // For protected routes, only render if authenticated (or redirecting)
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="text-slate-400 text-sm">Redirecting to login...</div>
      </div>
    );
  }

  // Authenticated Dashboard Layout with Sidebar and Navbar
  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Main App Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto pb-16 md:pb-6">
          {children}
        </main>
      </div>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
}
