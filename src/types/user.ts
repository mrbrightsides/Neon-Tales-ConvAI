/**
 * User / Child Profile Types
 * 
 * Represents a child user in the Neon Tales storytelling platform.
 * Includes personal preferences, age-appropriate settings, and gamification data.
 */

export type AgeGroup = 'toddler' | 'kid' | 'preteen';
export type Language = 'id' | 'en';

export interface UserPreferences {
  /** Array of favorite story categories for personalized recommendations */
  favoriteCategories: string[];
  
  /** Voice narration speed multiplier (0.8 = slower, 1.2 = faster) */
  voiceSpeed: number;
  
  /** Background music volume level (0-100) */
  backgroundMusicVolume: number;
}

export interface User {
  /** Unique identifier for the user */
  id: string;
  
  /** Child's display name */
  name: string;
  
  /** Child's age (3-12 years) */
  age: number;
  
  /** Age group classification: toddler (3-5), kid (6-8), preteen (9-12) */
  ageGroup: AgeGroup;
  
  /** Preferred language for stories and interface */
  language: Language;
  
  /** Avatar color or theme color for personalization */
  avatarColor: string;
  
  /** Account creation timestamp */
  createdAt: Date;
  
  /** Last activity timestamp */
  lastActiveAt?: Date;
  
  /** User preferences and settings */
  preferences: UserPreferences;
  
  /** Total stories completed (for gamification) */
  storiesCompleted: number;
  
  /** Total playtime in minutes */
  totalPlaytimeMinutes: number;
}

/**
 * Helper function to determine age group from age
 */
export function getAgeGroup(age: number): AgeGroup {
  if (age >= 3 && age <= 5) return 'toddler';
  if (age >= 6 && age <= 8) return 'kid';
  if (age >= 9 && age <= 12) return 'preteen';
  return 'kid'; // Default fallback
}

/**
 * Default user preferences for new users
 */
export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  favoriteCategories: [],
  voiceSpeed: 1.0,
  backgroundMusicVolume: 50,
};
