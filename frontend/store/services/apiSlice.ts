import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  ProblemListItem,
  ProblemDetail,
  ProblemTag,
  Course,
  Lesson,
  User,
  UserProfile,
} from '@/types';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('algoforge_access_token');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
  tagTypes: [
    'Problems',
    'Problem',
    'Courses',
    'Course',
    'Lessons',
    'Lesson',
    'Roadmap',
    'Achievements',
    'Analytics',
    'Progress',
    'User',
    'Settings',
  ],
  endpoints: (builder) => ({
    // 1. Problems Endpoints
    getProblems: builder.query<
      ProblemListItem[],
      { search?: string; difficulty?: string; tag?: string } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.search) queryParams.set('search', params.search);
        if (params?.difficulty && params.difficulty !== 'all')
          queryParams.set('difficulty', params.difficulty);
        if (params?.tag && params.tag !== 'all')
          queryParams.set('tag', params.tag);
        const qs = queryParams.toString();
        return `/problems/${qs ? `?${qs}` : ''}`;
      },
      providesTags: ['Problems'],
    }),
    getProblemBySlug: builder.query<ProblemDetail, string>({
      query: (slug) => `/problems/${slug}/`,
      providesTags: (result, error, slug) => [{ type: 'Problem', id: slug }],
    }),
    getProblemTags: builder.query<ProblemTag[], void>({
      query: () => '/problems/tags/',
      providesTags: ['Problems'],
    }),

    // 2. Code Execution & Judge
    executeCode: builder.mutation<
      {
        stdout: string;
        stderr: string;
        exit_code: number;
        execution_time_ms: number;
      },
      { language: string; source_code: string; stdin?: string }
    >({
      query: (body) => ({
        url: '/compiler/execute/',
        method: 'POST',
        body,
      }),
    }),
    traceCode: builder.mutation<
      any,
      {
        language: string;
        source_code: string;
        stdin?: string;
        expected_output?: string;
      }
    >({
      query: (body) => ({
        url: '/compiler/trace/',
        method: 'POST',
        body,
      }),
    }),
    submitProblem: builder.mutation<
      any,
      { problem_slug: string; language: string; source_code: string }
    >({
      query: (body) => ({
        url: '/submissions/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Problems', 'Progress', 'Analytics', 'Achievements'],
    }),

    // 3. Courses & Lessons
    getCourses: builder.query<Course[], void>({
      query: () => '/courses/',
      providesTags: ['Courses'],
    }),
    getCourseBySlug: builder.query<any, string>({
      query: (slug) => `/courses/${slug}/`,
      providesTags: (result, error, slug) => [{ type: 'Course', id: slug }],
    }),
    getLessonBySlug: builder.query<any, string>({
      query: (slug) => `/courses/lessons/${slug}/`,
      providesTags: (result, error, slug) => [{ type: 'Lesson', id: slug }],
    }),
    enrollCourse: builder.mutation<{ message: string }, string>({
      query: (slug) => ({
        url: `/courses/${slug}/enroll/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, slug) => [
        { type: 'Course', id: slug },
        'Courses',
      ],
    }),
    completeLesson: builder.mutation<
      { message: string; xp_awarded: number },
      string
    >({
      query: (slug) => ({
        url: `/courses/lessons/${slug}/complete/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, slug) => [
        { type: 'Lesson', id: slug },
        'Progress',
        'Analytics',
        'Achievements',
      ],
    }),

    // 4. Learning Roadmap
    getRoadmap: builder.query<any, string | void>({
      query: (slug = 'dsa-mastery') => `/roadmaps/${slug}/`,
      providesTags: ['Roadmap'],
    }),

    // 5. Achievements
    getAchievements: builder.query<any[], void>({
      query: () => '/achievements/',
      providesTags: ['Achievements'],
    }),

    // 6. Progress & Dashboard
    getDashboard: builder.query<any, void>({
      query: () => '/progress/dashboard/',
      providesTags: ['Progress'],
    }),
    getLeaderboard: builder.query<any, void>({
      query: () => '/progress/leaderboard/',
      providesTags: ['Progress'],
    }),
    getStats: builder.query<any, void>({
      query: () => '/progress/stats/',
      providesTags: ['Progress'],
    }),
    getHeatmap: builder.query<any, void>({
      query: () => '/progress/heatmap/',
      providesTags: ['Progress'],
    }),

    // 7. Analytics
    getPlatformAnalytics: builder.query<any, void>({
      query: () => '/analytics/platform/',
      providesTags: ['Analytics'],
    }),
    getUserAnalytics: builder.query<any, void>({
      query: () => '/analytics/user/',
      providesTags: ['Analytics'],
    }),

    // 8. Global Search
    searchGlobal: builder.query<any, string>({
      query: (q) => `/search/?q=${encodeURIComponent(q)}`,
    }),

    // 9. Auth & User Profile
    getMe: builder.query<User, void>({
      query: () => '/auth/me/',
      providesTags: ['User'],
    }),
    getUserSettings: builder.query<any, void>({
      query: () => '/auth/settings/',
      providesTags: ['Settings'],
    }),
    updateUserSettings: builder.mutation<any, any>({
      query: (body) => ({
        url: '/auth/settings/',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Settings', 'User'],
    }),
  }),
});

export const {
  useGetProblemsQuery,
  useGetProblemBySlugQuery,
  useGetProblemTagsQuery,
  useExecuteCodeMutation,
  useTraceCodeMutation,
  useSubmitProblemMutation,
  useGetCoursesQuery,
  useGetCourseBySlugQuery,
  useGetLessonBySlugQuery,
  useEnrollCourseMutation,
  useCompleteLessonMutation,
  useGetRoadmapQuery,
  useGetAchievementsQuery,
  useGetDashboardQuery,
  useGetLeaderboardQuery,
  useGetStatsQuery,
  useGetHeatmapQuery,
  useGetPlatformAnalyticsQuery,
  useGetUserAnalyticsQuery,
  useSearchGlobalQuery,
  useGetMeQuery,
  useGetUserSettingsQuery,
  useUpdateUserSettingsMutation,
} = apiSlice;
