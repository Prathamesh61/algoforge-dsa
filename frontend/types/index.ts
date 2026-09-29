// Core Types for AlgoForge Platform

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  authProvider: 'email' | 'google';
  dateJoined: string;
  profile?: UserProfile;
}

export interface UserProfile {
  userId: string;
  headline?: string;
  bio?: string;
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string;
  dailyGoalTarget: number;
  preferredLanguage: string;
  problemsSolvedCount: number;
  lessonsCompletedCount: number;
  achievementsUnlockedCount: number;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  summary: string;
  thumbnailUrl?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  isPublished: boolean;
  completionPercentage?: number;
  moduleCount?: number;
  lessonCount?: number;
}

export interface Lesson {
  id: string;
  moduleId: string;
  slug: string;
  title: string;
  estimatedReadTime: number;
  xpReward: number;
  isCompleted?: boolean;
  contentBlocks: LessonBlock[];
}

export type LessonBlock =
  | { type: 'text'; content: string }
  | { type: 'code'; language: string; code: string; title?: string }
  | { type: 'animation'; component: string; config?: Record<string, any> }
  | { type: 'video'; youtubeId: string; title: string; duration?: string }
  | { type: 'quiz'; question: string; options: string[]; correctIndex: number; explanation: string }
  | { type: 'complexity'; time: string; space: string; explanation?: string }
  | { type: 'callout'; variant: 'tip' | 'warning' | 'info'; title?: string; text: string };

export type AlgorithmCategory = 'Searching' | 'Sorting' | 'Arrays' | 'Linked Lists' | 'Trees' | 'Graphs' | 'DP';

export interface Algorithm {
  id: string;
  slug: string;
  name: string;
  category: AlgorithmCategory;
  description: string;
  timeComplexityBest: string;
  timeComplexityAvg: string;
  timeComplexityWorst: string;
  spaceComplexity: string;
  defaultDataset: number[];
  implementationCode: Record<string, string>;
}

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
  action: StepActionType;
  arrayState?: T[];
  activeIndices?: number[];
  highlightType?: 'primary' | 'secondary' | 'success' | 'danger';
  auxiliaryData?: Record<string, any>;
  explanation: string;
  pseudoCodeLine?: number;
}

export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface ProblemTag {
  id: string;
  name: string;
  slug: string;
  problem_count?: number;
}

export interface ProblemListItem {
  id: string;
  slug: string;
  title: string;
  difficulty: ProblemDifficulty;
  xp_reward: number;
  tags: string[];
  is_solved?: boolean;
}

export interface ProblemDetail {
  id: string;
  slug: string;
  title: string;
  difficulty: ProblemDifficulty;
  xp_reward: number;
  tags: ProblemTag[];
  description_markdown: string;
  input_format: string;
  output_format: string;
  constraints: string;
  examples: { input: string; output: string; explanation?: string }[];
  time_limit_ms: number;
  memory_limit_mb: number;
  starter_templates: Record<string, string>;
  public_test_cases: {
    id: string;
    input_data: string;
    expected_output: string;
    is_hidden: boolean;
    display_order: number;
  }[];
  is_solved?: boolean;
}

export interface Problem {
  id: string;
  slug: string;
  title: string;
  difficulty: ProblemDifficulty;
  xpReward: number;
  tags: string[];
  descriptionMarkdown: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  starterTemplates: Record<string, string>;
  isSolved?: boolean;
}

export interface TestCase {
  id: string;
  inputData: string;
  expectedOutput: string;
  isHidden: boolean;
}

export type SubmissionStatus =
  | 'Queued'
  | 'Compiling'
  | 'Running'
  | 'Accepted'
  | 'Wrong Answer'
  | 'Time Limit Exceeded'
  | 'Memory Limit Exceeded'
  | 'Compilation Error'
  | 'Runtime Error';

export interface Submission {
  id: string;
  problemId: string;
  problemTitle?: string;
  language: string;
  sourceCode: string;
  status: SubmissionStatus;
  executionTimeMs: number;
  memoryUsedKb: number;
  testsPassed: number;
  testsTotal: number;
  errorMessage?: string;
  createdAt: string;
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  badgeIcon: string;
  xpBonus: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface RoadmapNode {
  id: string;
  title: string;
  topicKey: string;
  prerequisites: string[];
  status: 'completed' | 'in-progress' | 'locked';
  progressPercentage: number;
  problemsCount: number;
  lessonsCount: number;
}
