'use client'

/**
 * IndexedDB Storage Manager for Neon Tales
 * Provides persistent storage that survives cache clearing
 */

export interface SavedStory {
  id: string
  title: string
  content: string
  rating: number
  timestamp: number
  category?: string
  ageGroup?: string
  language?: string
  readCount?: number
  lastRead?: number
  characterUsed?: string
  // User-created story fields
  sourceType?: 'ai-generated' | 'user-created'
  author?: string
  isDraft?: boolean
  lastEdited?: number
  wordCount?: number
}

export interface Character {
  id: string
  name: string
  description: string
  personality: string
  appearance: string
  timestamp: number
}

export interface Achievement {
  id: string
  unlockedAt: number
  progress?: number
}

export interface UserStats {
  totalStoriesRead: number
  totalReadingTime: number
  currentStreak: number
  lastReadDate: number
  favoriteCategory?: string
  achievementsUnlocked: string[]
}

const DB_NAME = 'neon-tales-db'
const DB_VERSION = 1

class StorageManager {
  private db: IDBDatabase | null = null
  private initPromise: Promise<IDBDatabase> | null = null

  async init(): Promise<IDBDatabase> {
    // Return existing promise if already initializing
    if (this.initPromise) {
      return this.initPromise
    }

    // Return existing database if already initialized
    if (this.db) {
      return Promise.resolve(this.db)
    }

    // Create new initialization promise
    this.initPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not available'))
        return
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => {
        reject(request.error)
      }

      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Stories store
        if (!db.objectStoreNames.contains('stories')) {
          const storyStore = db.createObjectStore('stories', { keyPath: 'id' })
          storyStore.createIndex('timestamp', 'timestamp', { unique: false })
          storyStore.createIndex('rating', 'rating', { unique: false })
          storyStore.createIndex('category', 'category', { unique: false })
        }

        // Characters store
        if (!db.objectStoreNames.contains('characters')) {
          const characterStore = db.createObjectStore('characters', { keyPath: 'id' })
          characterStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        // Achievements store
        if (!db.objectStoreNames.contains('achievements')) {
          db.createObjectStore('achievements', { keyPath: 'id' })
        }

        // User stats store
        if (!db.objectStoreNames.contains('stats')) {
          db.createObjectStore('stats', { keyPath: 'id' })
        }
      }
    })

    return this.initPromise
  }

  // Story operations
  async saveStory(story: SavedStory): Promise<void> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['stories'], 'readwrite')
      const store = transaction.objectStore('stories')
      const request = store.put(story)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getStories(): Promise<SavedStory[]> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['stories'], 'readonly')
      const store = transaction.objectStore('stories')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async getStory(id: string): Promise<SavedStory | undefined> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['stories'], 'readonly')
      const store = transaction.objectStore('stories')
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async deleteStory(id: string): Promise<void> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['stories'], 'readwrite')
      const store = transaction.objectStore('stories')
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Character operations
  async saveCharacter(character: Character): Promise<void> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['characters'], 'readwrite')
      const store = transaction.objectStore('characters')
      const request = store.put(character)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getCharacters(): Promise<Character[]> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['characters'], 'readonly')
      const store = transaction.objectStore('characters')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  async deleteCharacter(id: string): Promise<void> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['characters'], 'readwrite')
      const store = transaction.objectStore('characters')
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Achievement operations
  async unlockAchievement(achievement: Achievement): Promise<void> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['achievements'], 'readwrite')
      const store = transaction.objectStore('achievements')
      const request = store.put(achievement)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getAchievements(): Promise<Achievement[]> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['achievements'], 'readonly')
      const store = transaction.objectStore('achievements')
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result || [])
      request.onerror = () => reject(request.error)
    })
  }

  // Stats operations
  async getStats(): Promise<UserStats> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['stats'], 'readonly')
      const store = transaction.objectStore('stats')
      const request = store.get('user-stats')

      request.onsuccess = () => {
        const stats = request.result || {
          id: 'user-stats',
          totalStoriesRead: 0,
          totalReadingTime: 0,
          currentStreak: 0,
          lastReadDate: 0,
          achievementsUnlocked: []
        }
        resolve(stats)
      }
      request.onerror = () => reject(request.error)
    })
  }

  async updateStats(stats: UserStats): Promise<void> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['stats'], 'readwrite')
      const store = transaction.objectStore('stats')
      const request = store.put({ ...stats, id: 'user-stats' })

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Migration from localStorage
  async migrateFromLocalStorage(): Promise<void> {
    if (typeof window === 'undefined') return

    // Migrate stories
    const savedStories = localStorage.getItem('neon-tales-stories')
    if (savedStories) {
      try {
        const stories: SavedStory[] = JSON.parse(savedStories)
        for (const story of stories) {
          await this.saveStory(story)
        }
        console.log(`✅ Migrated ${stories.length} stories from localStorage`)
      } catch (err) {
        console.error('Failed to migrate stories:', err)
      }
    }
  }
}

// Singleton instance
let storageManager: StorageManager | null = null

export function getStorageManager(): StorageManager {
  if (!storageManager) {
    storageManager = new StorageManager()
  }
  return storageManager
}

// Fallback to localStorage if IndexedDB fails
export function getFallbackStorage() {
  return {
    async saveStory(story: SavedStory): Promise<void> {
      const stories = await this.getStories()
      const existingIndex = stories.findIndex((s: SavedStory) => s.id === story.id)
      if (existingIndex >= 0) {
        stories[existingIndex] = story
      } else {
        stories.push(story)
      }
      localStorage.setItem('neon-tales-stories', JSON.stringify(stories))
    },

    async getStories(): Promise<SavedStory[]> {
      const saved = localStorage.getItem('neon-tales-stories')
      return saved ? JSON.parse(saved) : []
    },

    async deleteStory(id: string): Promise<void> {
      const stories = await this.getStories()
      const filtered = stories.filter((s: SavedStory) => s.id !== id)
      localStorage.setItem('neon-tales-stories', JSON.stringify(filtered))
    },

    async getCharacters(): Promise<Character[]> {
      const saved = localStorage.getItem('neon-tales-characters')
      return saved ? JSON.parse(saved) : []
    },

    async saveCharacter(character: Character): Promise<void> {
      const characters = await this.getCharacters()
      const existingIndex = characters.findIndex((c: Character) => c.id === character.id)
      if (existingIndex >= 0) {
        characters[existingIndex] = character
      } else {
        characters.push(character)
      }
      localStorage.setItem('neon-tales-characters', JSON.stringify(characters))
    },

    async deleteCharacter(id: string): Promise<void> {
      const characters = await this.getCharacters()
      const filtered = characters.filter((c: Character) => c.id !== id)
      localStorage.setItem('neon-tales-characters', JSON.stringify(filtered))
    },

    async getAchievements(): Promise<Achievement[]> {
      const saved = localStorage.getItem('neon-tales-achievements')
      return saved ? JSON.parse(saved) : []
    },

    async unlockAchievement(achievement: Achievement): Promise<void> {
      const achievements = await this.getAchievements()
      const exists = achievements.some((a: Achievement) => a.id === achievement.id)
      if (!exists) {
        achievements.push(achievement)
        localStorage.setItem('neon-tales-achievements', JSON.stringify(achievements))
      }
    },

    async getStats(): Promise<UserStats> {
      const saved = localStorage.getItem('neon-tales-stats')
      return saved ? JSON.parse(saved) : {
        totalStoriesRead: 0,
        totalReadingTime: 0,
        currentStreak: 0,
        lastReadDate: 0,
        achievementsUnlocked: []
      }
    },

    async updateStats(stats: UserStats): Promise<void> {
      localStorage.setItem('neon-tales-stats', JSON.stringify(stats))
    },

    async migrateFromLocalStorage(): Promise<void> {
      // No migration needed for fallback
    }
  }
}
