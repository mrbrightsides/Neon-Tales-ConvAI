/**
 * Choice Types
 * 
 * Represents interactive choices that children can make to influence story direction.
 * Choices embody moral values and consequences that shape character development.
 */

export type MoralValue = 
  | 'kindness'      // Kebaikan
  | 'honesty'       // Kejujuran
  | 'courage'       // Keberanian
  | 'friendship'    // Persahabatan
  | 'responsibility' // Tanggung Jawab
  | 'respect'       // Hormat
  | 'patience'      // Kesabaran
  | 'sharing'       // Berbagi
  | 'empathy'       // Empati
  | 'curiosity';    // Rasa Ingin Tahu

export interface Choice {
  /** Unique identifier for the choice */
  id: string;
  
  /** Display text shown to the child */
  text: string;
  
  /** Short description of what happens if this choice is selected */
  consequence: string;
  
  /** Moral value associated with this choice (optional) */
  moralValue?: MoralValue;
  
  /** Hint for AI to generate the next chapter based on this choice */
  nextChapterHint: string;
  
  /** Whether this choice leads to a positive outcome */
  isPositive: boolean;
  
  /** Difficulty level of the choice (for age-appropriate complexity) */
  difficultyLevel?: 'easy' | 'medium' | 'hard';
  
  /** Icon or emoji representing this choice */
  icon?: string;
  
  /** Number of times this choice has been selected (analytics) */
  timesSelected?: number;
}

/**
 * Helper to get moral value display name in Indonesian
 */
export function getMoralValueNameIndonesian(value: MoralValue): string {
  const names: Record<MoralValue, string> = {
    kindness: 'Kebaikan',
    honesty: 'Kejujuran',
    courage: 'Keberanian',
    friendship: 'Persahabatan',
    responsibility: 'Tanggung Jawab',
    respect: 'Hormat',
    patience: 'Kesabaran',
    sharing: 'Berbagi',
    empathy: 'Empati',
    curiosity: 'Rasa Ingin Tahu',
  };
  return names[value];
}

/**
 * Helper to get moral value display name in English
 */
export function getMoralValueNameEnglish(value: MoralValue): string {
  const names: Record<MoralValue, string> = {
    kindness: 'Kindness',
    honesty: 'Honesty',
    courage: 'Courage',
    friendship: 'Friendship',
    responsibility: 'Responsibility',
    respect: 'Respect',
    patience: 'Patience',
    sharing: 'Sharing',
    empathy: 'Empathy',
    curiosity: 'Curiosity',
  };
  return names[value];
}

/**
 * Helper to get emoji icon for moral value
 */
export function getMoralValueIcon(value: MoralValue): string {
  const icons: Record<MoralValue, string> = {
    kindness: '💝',
    honesty: '🤝',
    courage: '🦁',
    friendship: '👫',
    responsibility: '⭐',
    respect: '🙏',
    patience: '⏳',
    sharing: '🤲',
    empathy: '💖',
    curiosity: '🔍',
  };
  return icons[value];
}
