'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/AuthContext';
import { Loader2 } from 'lucide-react';

interface GoogleAuthButtonProps {
  mode?: 'signin' | 'signup';
  onError?: (msg: string) => void;
}

export function GoogleAuthButton({ mode = 'signin', onError }: GoogleAuthButtonProps) {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '121510940960-8dp887ad5lk4s0tvb7mp6hv176ercmnm.apps.googleusercontent.com';

  useEffect(() => {
    let checkInterval: NodeJS.Timeout;

    const initGoogle = () => {
      if (typeof window === 'undefined' || !(window as any).google?.accounts?.id) {
        return false;
      }

      try {
        (window as any).google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: { credential?: string }) => {
            if (!response.credential) {
              onError?.('No Google credential received.');
              return;
            }

            try {
              setIsAuthenticating(true);
              await loginWithGoogle(response.credential);
              router.push('/dashboard');
            } catch (err: any) {
              onError?.(err.message || 'Google authentication failed.');
            } finally {
              setIsAuthenticating(false);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          const containerWidth = containerRef.current.parentElement?.offsetWidth || 340;
          (window as any).google.accounts.id.renderButton(containerRef.current, {
            type: 'standard',
            theme: 'filled_black',
            size: 'large',
            text: mode === 'signup' ? 'signup_with' : 'continue_with',
            shape: 'pill',
            width: Math.min(containerWidth, 400),
            logo_alignment: 'left',
          });
          setScriptLoaded(true);
        }
        return true;
      } catch (e: any) {
        console.error('Google Auth Init Error:', e);
        return false;
      }
    };

    if (!initGoogle()) {
      checkInterval = setInterval(() => {
        if (initGoogle()) {
          clearInterval(checkInterval);
        }
      }, 200);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
    };
  }, [clientId, mode, loginWithGoogle, onError, router]);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[46px] relative">
      {isAuthenticating && (
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-2 z-10 text-cyan-400 text-xs font-semibold shadow-lg">
          <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          <span>Signing in with Google...</span>
        </div>
      )}
      <div
        ref={containerRef}
        id={`google-${mode}-btn`}
        className="w-full flex justify-center [&>div]:!w-full [&_iframe]:!mx-auto"
      />
      {!scriptLoaded && !isAuthenticating && (
        <div className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-slate-400 text-xs">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
          <span>Connecting to Google...</span>
        </div>
      )}
    </div>
  );
}
