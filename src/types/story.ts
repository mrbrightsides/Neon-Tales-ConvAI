/**
 * Story / Session Types
 * 
 * Represents a storytelling session with chapters, choices, and progress tracking.
 * Stories are AI-generated narratives that adapt based on child's interactions.
 */

import type { Language, AgeGroup } from './user';
import type { Chapter } from './chapter';

export type StoryCategory = 
  | 'adventure'      // Petualangan / Adventure
  | 'fantasy'        // Fantasi / Fantasy
  | 'science'        // Sains / Science
  | 'nature'         // Alam / Nature
  | 'friendship'     // Persahabatan / Friendship
  | 'family'         // Keluarga / Family
  | 'mystery'        // Misteri / Mystery
  | 'educational'    // Edukasi / Educational
  | 'bedtime';       // Dongeng Tidur / Bedtime Story

export type StoryStatus = 'active' | 'completed' | 'paused' | 'abandoned';

export interface Story {
  /** Unique identifier for the story session */
  id: string;
  
  /** Reference to the User who owns this story */
  userId: string;
  
  /** Story title (AI-generated or user-provided) */
  title: string;
  
  /** Story category/genre */
  category: StoryCategory;
  
  /** Story language */
  language: Language;
  
  /** Target age group for content appropriateness */
  ageGroup: AgeGroup;
  
  /** Current status of the story */
  status: StoryStatus;
  
  /** Current chapter number (1-indexed) */
  currentChapter: number;
  
  /** Array of all chapters in this story */
  chapters: Chapter[];
  
  /** Story creation timestamp */
  createdAt: Date;
  
  /** Last time user interacted with this story */
  lastPlayedAt: Date;
  
  /** Completion timestamp (if status is 'completed') */
  completedAt?: Date;
  
  /** Total duration of story in minutes */
  totalDurationMinutes: number;
  
  /** Achievement IDs unlocked during this story */
  achievements: string[];
  
  /** Moral lessons learned in this story */
  moralLessons: string[];
  
  /** Story thumbnail or cover image URL (optional) */
  coverImageUrl?: string;
  
  /** Story synopsis/summary */
  synopsis?: string;
}

/**
 * Request type for creating a new story
 */
export interface CreateStoryRequest {
  userId: string;
  title?: string;
  category: StoryCategory;
  language: Language;
  ageGroup: AgeGroup;
  initialPrompt?: string; // Optional user prompt to guide story generation
}

/**
 * Helper to get category display name in Indonesian
 */
export function getCategoryNameIndonesian(category: StoryCategory): string {
  const names: Record<StoryCategory, string> = {
    adventure: 'Petualangan',
    fantasy: 'Fantasi',
    science: 'Sains',
    nature: 'Alam',
    friendship: 'Persahabatan',
    family: 'Keluarga',
    mystery: 'Misteri',
    educational: 'Edukasi',
    bedtime: 'Dongeng Tidur',
  };
  return names[category];
}

/**
 * Helper to get category display name in English
 */
export function getCategoryNameEnglish(category: StoryCategory): string {
  const names: Record<StoryCategory, string> = {
    adventure: 'Adventure',
    fantasy: 'Fantasy',
    science: 'Science',
    nature: 'Nature',
    friendship: 'Friendship',
    family: 'Family',
    mystery: 'Mystery',
    educational: 'Educational',
    bedtime: 'Bedtime Story',
  };
  return names[category];
}
