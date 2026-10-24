'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Cpu, Mail, Lock, ArrowRight, AlertCircle, Loader2, X, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';
import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center mx-auto shadow-xl shadow-cyan-500/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Welcome Back</h1>
          <p className="text-xs text-slate-400">
            Sign in to continue your DSA practice and track your roadmap.
          </p>
        </div>

        {/* Card Container */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Continue with Google */}
          <GoogleAuthButton mode="signin" onError={setError} />

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[10px] uppercase font-bold tracking-wider text-slate-500 absolute">
              or with email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setForgotEmail(email || '');
                    setForgotSubmitted(false);
                    setShowForgotModal(true);
                  }}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <>
                  <span>Sign In to Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              Don’t have an account yet?{' '}
              <Link href="/register" className="text-cyan-400 font-bold hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Reset Password</h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Reset Link Sent</p>
                    <p className="text-[11px] text-emerald-400/80 mt-0.5">
                      Instructions have been dispatched to <span className="font-mono text-white">{forgotEmail}</span>.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowForgotModal(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (forgotEmail.trim()) {
                    setForgotSubmitted(true);
                  }
                }}
                className="space-y-3.5"
              >
                <p className="text-xs text-slate-400 leading-relaxed">
                  Enter your email address and we will send you a secure link to reset your account credentials.
                </p>

                <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-[11px] text-cyan-300 leading-relaxed">
                  <strong>Local Dev Tip:</strong> You can test using default credentials <code className="text-white font-mono bg-slate-800 px-1 py-0.5 rounded">alex@example.com</code> / <code className="text-white font-mono bg-slate-800 px-1 py-0.5 rounded">Password123!</code> or create a new account via Register.
                </div>

                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="alex@example.com"
                    required
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-xs font-bold text-slate-950 transition-all shadow-md shadow-cyan-500/20"
                  >
                    Send Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
