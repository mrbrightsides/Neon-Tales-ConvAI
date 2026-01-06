/**
 * Neon Tales - Complete Type System
 * 
 * Central export point for all data structures used in the application.
 * This provides a single import point for all types across the codebase.
 * 
 * Usage:
 * ```typescript
 * import type { User, Story, Chapter, Achievement } from '@/types';
 * ```
 */

// User Types
export type {
  User,
  UserPreferences,
  AgeGroup,
  Language,
} from './user';

export {
  getAgeGroup,
  DEFAULT_USER_PREFERENCES,
} from './user';

// Story Types
export type {
  Story,
  StoryCategory,
  StoryStatus,
  CreateStoryRequest,
} from './story';

export {
  getCategoryNameIndonesian,
  getCategoryNameEnglish,
} from './story';

// Chapter Types
export type {
  Chapter,
  GenerateChapterRequest,
  GenerateChapterResponse,
} from './chapter';

// Choice Types
export type {
  Choice,
  MoralValue,
} from './choice';

export {
  getMoralValueNameIndonesian,
  getMoralValueNameEnglish,
  getMoralValueIcon,
} from './choice';

// Achievement Types
export type {
  Achievement,
  AchievementDefinition,
  AchievementType,
  AchievementRarity,
} from './achievement';

export {
  ACHIEVEMENT_DEFINITIONS,
  checkAchievementCriteria,
} from './achievement';

// Voice Session Types
export type {
  VoiceSession,
  VoiceMessage,
  MessageRole,
  StartVoiceSessionRequest,
  SendVoiceMessageRequest,
  VoiceAgentResponse,
  VoiceSessionAnalytics,
} from './voice-session';

/**
 * Common utility types used across the application
 */

/** API Response wrapper */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/** Pagination parameters */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Filter parameters for story queries */
export interface StoryFilterParams {
  userId?: string;
  category?: string;
  status?: string;
  language?: string;
  ageGroup?: string;
  dateFrom?: Date;
  dateTo?: Date;
}

/** Statistics summary */
export interface UserStatistics {
  storiesCompleted: number;
  totalPlaytimeMinutes: number;
  achievementsUnlocked: number;
  favoriteCategory: string;
  currentStreak: number;
  longestStreak: number;
  voiceInteractions: number;
  choicesMade: number;
  uniqueCategoriesExplored: number;
}
