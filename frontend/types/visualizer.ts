export type StepActionType =
  | 'compare'
  | 'swap'
  | 'highlight'
  | 'visit'
  | 'modify'
  | 'partition'
  | 'found'
  | 'not-found'
  | 'complete';

export interface AlgorithmStep<T = number> {
  stepIndex: number;
  type: StepActionType;
  arrayState: T[];
  indices?: number[]; // active pointers, e.g. [i, j] or [low, mid, high]
  values?: T[];
  pointerLabels?: Record<number, string>; // e.g. { 0: 'LOW', 3: 'MID', 6: 'HIGH' }
  highlightType?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning';
  message: string;
  auxiliaryData?: Record<string, any>;
  pseudoCodeLine?: number;
}

export interface VisualizerPlaybackState {
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number; // 0.5, 1, 2, 4
  totalSteps: number;
}
