'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AlgorithmStep } from '@/types/visualizer';

interface UseVisualizerTimelineProps {
  steps: AlgorithmStep[];
  initialSpeed?: number;
}

export function useVisualizerTimeline({ steps, initialSpeed = 1 }: UseVisualizerTimelineProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop playback when steps change or reach end
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    clearTimer();
  }, [clearTimer]);

  const stepForward = useCallback(() => {
    setCurrentStepIndex((prev) => {
      if (prev >= steps.length - 1) {
        pause();
        return prev;
      }
      return prev + 1;
    });
  }, [steps.length, pause]);

  const stepBackward = useCallback(() => {
    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToStep = useCallback((index: number) => {
    setCurrentStepIndex(Math.max(0, Math.min(steps.length - 1, index)));
  }, [steps.length]);

  const reset = useCallback(() => {
    pause();
    setCurrentStepIndex(0);
  }, [pause]);

  const play = useCallback(() => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(true);
  }, [currentStepIndex, steps.length]);

  // Handle auto-advance interval
  useEffect(() => {
    if (isPlaying) {
      const intervalMs = Math.max(150, Math.floor(1000 / speed));
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= steps.length - 1) {
            pause();
            return prev;
          }
          return prev + 1;
        });
      }, intervalMs);
    } else {
      clearTimer();
    }

    return () => clearTimer();
  }, [isPlaying, speed, steps.length, pause, clearTimer]);

  const currentStep = steps[currentStepIndex] || {
    stepIndex: 0,
    type: 'highlight',
    arrayState: [],
    message: 'Ready to run.',
  };

  return {
    currentStepIndex,
    currentStep,
    totalSteps: steps.length,
    isPlaying,
    speed,
    play,
    pause,
    stepForward,
    stepBackward,
    goToStep,
    reset,
    setSpeed,
  };
}
