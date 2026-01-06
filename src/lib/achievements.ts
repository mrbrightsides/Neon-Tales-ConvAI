'use client'

/**
 * Achievement System for Neon Tales
 * Tracks reading activities and unlocks badges
 */

export interface AchievementDefinition {
  id: string
  title: string
  description: string
  icon: string
  category: 'reading' | 'collection' | 'social' | 'special'
  requirement: number
  hidden?: boolean
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  // Reading Achievements
  {
    id: 'first-story',
    title: 'Petualangan Pertama',
    description: 'Baca cerita pertama kamu!',
    icon: '📖',
    category: 'reading',
    requirement: 1
  },
  {
    id: 'story-explorer',
    title: 'Penjelajah Cerita',
    description: 'Baca 5 cerita berbeda',
    icon: '🗺️',
    category: 'reading',
    requirement: 5
  },
  {
    id: 'story-master',
    title: 'Master Pembaca',
    description: 'Baca 10 cerita berbeda',
    icon: '🎓',
    category: 'reading',
    requirement: 10
  },
  {
    id: 'story-legend',
    title: 'Legenda Pembaca',
    description: 'Baca 25 cerita berbeda',
    icon: '👑',
    category: 'reading',
    requirement: 25
  },
  {
    id: 'reading-streak-3',
    title: 'Rajin Membaca',
    description: 'Baca cerita 3 hari berturut-turut',
    icon: '🔥',
    category: 'reading',
    requirement: 3
  },
  {
    id: 'reading-streak-7',
    title: 'Pembaca Konsisten',
    description: 'Baca cerita 7 hari berturut-turut',
    icon: '⚡',
    category: 'reading',
    requirement: 7
  },
  {
    id: 'reading-streak-30',
    title: 'Pembaca Sejati',
    description: 'Baca cerita 30 hari berturut-turut!',
    icon: '💎',
    category: 'reading',
    requirement: 30
  },

  // Collection Achievements
  {
    id: 'first-bookmark',
    title: 'Koleksi Dimulai',
    description: 'Simpan cerita pertama kamu',
    icon: '🔖',
    category: 'collection',
    requirement: 1
  },
  {
    id: 'collector',
    title: 'Kolektor Cerita',
    description: 'Simpan 10 cerita',
    icon: '📚',
    category: 'collection',
    requirement: 10
  },
  {
    id: 'library-master',
    title: 'Master Perpustakaan',
    description: 'Simpan 25 cerita',
    icon: '🏛️',
    category: 'collection',
    requirement: 25
  },
  {
    id: 'five-star-fan',
    title: 'Pemberi Rating Tertinggi',
    description: 'Beri rating 5 bintang pada 5 cerita',
    icon: '⭐',
    category: 'collection',
    requirement: 5
  },

  // Bilingual Achievement
  {
    id: 'bilingual-reader',
    title: 'Pembaca Bilingual',
    description: 'Baca cerita dalam 2 bahasa (Indonesia & English)',
    icon: '🌐',
    category: 'special',
    requirement: 2
  },

  // Category Achievements
  {
    id: 'folklore-lover',
    title: 'Pecinta Cerita Rakyat',
    description: 'Baca 5 cerita rakyat',
    icon: '🏮',
    category: 'reading',
    requirement: 5
  },
  {
    id: 'myth-explorer',
    title: 'Penjelajah Mitos',
    description: 'Baca 5 cerita mitos',
    icon: '⚡',
    category: 'reading',
    requirement: 5
  },
  {
    id: 'fable-fan',
    title: 'Penggemar Fabel',
    description: 'Baca 5 cerita fabel',
    icon: '🦊',
    category: 'reading',
    requirement: 5
  },
  {
    id: 'adventure-seeker',
    title: 'Pencari Petualangan',
    description: 'Baca 5 cerita petualangan',
    icon: '🗺️',
    category: 'reading',
    requirement: 5
  },

  // Character Achievements
  {
    id: 'character-creator',
    title: 'Pencipta Karakter',
    description: 'Buat karakter pertama kamu',
    icon: '🎭',
    category: 'special',
    requirement: 1
  },
  {
    id: 'character-collection',
    title: 'Koleksi Karakter',
    description: 'Buat 5 karakter berbeda',
    icon: '👥',
    category: 'special',
    requirement: 5
  },

  // Interactive Story Achievement
  {
    id: 'choice-maker',
    title: 'Pembuat Keputusan',
    description: 'Selesaikan cerita interaktif pertama',
    icon: '🎮',
    category: 'special',
    requirement: 1
  },
  {
    id: 'path-explorer',
    title: 'Penjelajah Jalur',
    description: 'Coba semua pilihan dalam 1 cerita',
    icon: '🌟',
    category: 'special',
    requirement: 1
  },

  // Social Achievements
  {
    id: 'first-share',
    title: 'Berbagi Kebahagiaan',
    description: 'Bagikan cerita pertama kamu',
    icon: '📤',
    category: 'social',
    requirement: 1
  },
  {
    id: 'social-butterfly',
    title: 'Kupu-Kupu Sosial',
    description: 'Bagikan 10 cerita',
    icon: '🦋',
    category: 'social',
    requirement: 10
  },

  // Special Hidden Achievements
  {
    id: 'night-reader',
    title: 'Pembaca Malam',
    description: 'Baca cerita antara jam 10 malam - 6 pagi',
    icon: '🌙',
    category: 'special',
    requirement: 1,
    hidden: true
  },
  {
    id: 'early-bird',
    title: 'Burung Pagi',
    description: 'Baca cerita antara jam 5-7 pagi',
    icon: '🌅',
    category: 'special',
    requirement: 1,
    hidden: true
  },
  {
    id: 'speed-reader',
    title: 'Pembaca Kilat',
    description: 'Baca 3 cerita dalam 1 jam',
    icon: '⚡',
    category: 'special',
    requirement: 3,
    hidden: true
  }
]

export function getAchievementById(id: string): AchievementDefinition | undefined {
  return ACHIEVEMENTS.find((a: AchievementDefinition) => a.id === id)
}

export function checkAchievements(stats: {
  totalStoriesRead: number
  currentStreak: number
  savedStoriesCount: number
  fiveStarCount: number
  languagesUsed: string[]
  categoryCounts: Record<string, number>
  charactersCreated: number
  storiesShared: number
  interactiveCompleted: number
}, unlockedIds: string[]): string[] {
  const newUnlocks: string[] = []

  for (const achievement of ACHIEVEMENTS) {
    // Skip if already unlocked
    if (unlockedIds.includes(achievement.id)) continue

    let shouldUnlock = false

    switch (achievement.id) {
      // Reading achievements
      case 'first-story':
        shouldUnlock = stats.totalStoriesRead >= 1
        break
      case 'story-explorer':
        shouldUnlock = stats.totalStoriesRead >= 5
        break
      case 'story-master':
        shouldUnlock = stats.totalStoriesRead >= 10
        break
      case 'story-legend':
        shouldUnlock = stats.totalStoriesRead >= 25
        break

      // Streak achievements
      case 'reading-streak-3':
        shouldUnlock = stats.currentStreak >= 3
        break
      case 'reading-streak-7':
        shouldUnlock = stats.currentStreak >= 7
        break
      case 'reading-streak-30':
        shouldUnlock = stats.currentStreak >= 30
        break

      // Collection achievements
      case 'first-bookmark':
        shouldUnlock = stats.savedStoriesCount >= 1
        break
      case 'collector':
        shouldUnlock = stats.savedStoriesCount >= 10
        break
      case 'library-master':
        shouldUnlock = stats.savedStoriesCount >= 25
        break
      case 'five-star-fan':
        shouldUnlock = stats.fiveStarCount >= 5
        break

      // Bilingual
      case 'bilingual-reader':
        shouldUnlock = stats.languagesUsed.length >= 2
        break

      // Category achievements
      case 'folklore-lover':
        shouldUnlock = (stats.categoryCounts['folklore'] || 0) >= 5
        break
      case 'myth-explorer':
        shouldUnlock = (stats.categoryCounts['mitos'] || 0) >= 5
        break
      case 'fable-fan':
        shouldUnlock = (stats.categoryCounts['fable'] || 0) >= 5
        break
      case 'adventure-seeker':
        shouldUnlock = (stats.categoryCounts['adventure'] || 0) >= 5
        break

      // Character achievements
      case 'character-creator':
        shouldUnlock = stats.charactersCreated >= 1
        break
      case 'character-collection':
        shouldUnlock = stats.charactersCreated >= 5
        break

      // Interactive achievements
      case 'choice-maker':
        shouldUnlock = stats.interactiveCompleted >= 1
        break

      // Social achievements
      case 'first-share':
        shouldUnlock = stats.storiesShared >= 1
        break
      case 'social-butterfly':
        shouldUnlock = stats.storiesShared >= 10
        break

      // Time-based achievements
      case 'night-reader':
        const hour = new Date().getHours()
        shouldUnlock = (hour >= 22 || hour <= 6) && stats.totalStoriesRead > 0
        break
      case 'early-bird':
        const earlyHour = new Date().getHours()
        shouldUnlock = (earlyHour >= 5 && earlyHour <= 7) && stats.totalStoriesRead > 0
        break
    }

    if (shouldUnlock) {
      newUnlocks.push(achievement.id)
    }
  }

  return newUnlocks
}

export function getCategoryFromStory(category: string): string {
  const categoryMap: Record<string, string> = {
    'fairy-tale': 'fairy-tale',
    'fable': 'fable',
    'folklore': 'folklore',
    'adventure': 'adventure',
    'educational': 'educational',
    'funny': 'funny',
    'mitos': 'mitos',
    'sage': 'sage',
    'parabel': 'parabel'
  }
  return categoryMap[category] || 'other'
}
