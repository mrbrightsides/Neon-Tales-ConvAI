/**
 * Achievement / Badge Types
 * 
 * Gamification system to reward children for completing stories,
 * learning moral values, and exploring different story categories.
 */

export type AchievementType = 
  | 'story_completed'    // Menyelesaikan cerita
  | 'moral_learned'      // Belajar nilai moral
  | 'category_explored'  // Menjelajahi kategori baru
  | 'streak'            // Streak harian
  | 'voice_interaction'  // Interaksi suara
  | 'choices_made'      // Membuat pilihan
  | 'time_spent';       // Waktu bermain

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  /** Unique identifier for the achievement */
  id: string;
  
  /** Reference to User ID who earned this */
  userId: string;
  
  /** Type of achievement */
  type: AchievementType;
  
  /** Display title of the achievement */
  title: string;
  
  /** Detailed description */
  description: string;
  
  /** Icon emoji or URL */
  icon: string;
  
  /** Rarity level (affects visual styling) */
  rarity: AchievementRarity;
  
  /** Timestamp when achievement was unlocked */
  unlockedAt: Date;
  
  /** Story ID that triggered this achievement (if applicable) */
  relatedStoryId?: string;
  
  /** Progress towards achievement (for progressive achievements) */
  progress?: {
    current: number;
    total: number;
  };
  
  /** Whether this achievement is hidden until unlocked */
  isHidden?: boolean;
  
  /** Experience points awarded */
  xpReward?: number;
}

/**
 * Achievement Definition (template for creating achievements)
 */
export interface AchievementDefinition {
  id: string;
  type: AchievementType;
  title: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  criteria: {
    type: string;
    value: number | string;
  };
  xpReward: number;
}

/**
 * Predefined achievement definitions
 */
export const ACHIEVEMENT_DEFINITIONS: AchievementDefinition[] = [
  {
    id: 'first_story',
    type: 'story_completed',
    title: 'Penjelajah Pemula',
    description: 'Menyelesaikan cerita pertama',
    icon: '🌟',
    rarity: 'common',
    criteria: { type: 'stories_completed', value: 1 },
    xpReward: 50,
  },
  {
    id: 'story_master_10',
    type: 'story_completed',
    title: 'Master Cerita',
    description: 'Menyelesaikan 10 cerita',
    icon: '📚',
    rarity: 'rare',
    criteria: { type: 'stories_completed', value: 10 },
    xpReward: 200,
  },
  {
    id: 'moral_kindness',
    type: 'moral_learned',
    title: 'Hati Emas',
    description: 'Belajar nilai kebaikan',
    icon: '💝',
    rarity: 'common',
    criteria: { type: 'moral_value', value: 'kindness' },
    xpReward: 30,
  },
  {
    id: 'moral_courage',
    type: 'moral_learned',
    title: 'Pemberani',
    description: 'Belajar nilai keberanian',
    icon: '🦁',
    rarity: 'common',
    criteria: { type: 'moral_value', value: 'courage' },
    xpReward: 30,
  },
  {
    id: 'explorer',
    type: 'category_explored',
    title: 'Penjelajah Dunia',
    description: 'Menjelajahi 5 kategori cerita berbeda',
    icon: '🗺️',
    rarity: 'rare',
    criteria: { type: 'unique_categories', value: 5 },
    xpReward: 150,
  },
  {
    id: 'daily_streak_7',
    type: 'streak',
    title: 'Pembaca Setia',
    description: 'Bermain 7 hari berturut-turut',
    icon: '🔥',
    rarity: 'epic',
    criteria: { type: 'daily_streak', value: 7 },
    xpReward: 300,
  },
  {
    id: 'voice_champion',
    type: 'voice_interaction',
    title: 'Juara Suara',
    description: 'Menggunakan voice interaction 20 kali',
    icon: '🎤',
    rarity: 'rare',
    criteria: { type: 'voice_interactions', value: 20 },
    xpReward: 100,
  },
  {
    id: 'decision_maker',
    type: 'choices_made',
    title: 'Pengambil Keputusan',
    description: 'Membuat 50 pilihan dalam cerita',
    icon: '🎯',
    rarity: 'epic',
    criteria: { type: 'choices_made', value: 50 },
    xpReward: 250,
  },
  {
    id: 'time_traveler',
    type: 'time_spent',
    title: 'Petualang Waktu',
    description: 'Menghabiskan 10 jam bermain',
    icon: '⏰',
    rarity: 'legendary',
    criteria: { type: 'total_minutes', value: 600 },
    xpReward: 500,
  },
];

/**
 * Helper to check if achievement criteria is met
 */
export function checkAchievementCriteria(
  definition: AchievementDefinition,
  userStats: Record<string, number | string>
): boolean {
  const { criteria } = definition;
  const userValue = userStats[criteria.type];
  
  if (typeof criteria.value === 'number' && typeof userValue === 'number') {
    return userValue >= criteria.value;
  }
  
  if (typeof criteria.value === 'string' && typeof userValue === 'string') {
    return userValue === criteria.value;
  }
  
  return false;
}
