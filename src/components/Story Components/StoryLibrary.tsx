'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookOpen, Star, Search, Trash2, Clock, Download, Share2 } from 'lucide-react'

interface SavedStory {
  id: string
  title: string
  content: string
  rating: number
  timestamp: number
  category?: string
}

interface StoryLibraryProps {
  onStorySelect: (story: string) => void
  className?: string
}

export default function StoryLibrary({ onStorySelect, className = '' }: StoryLibraryProps) {
  const [savedStories, setSavedStories] = useState<SavedStory[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating'>('newest')

  useEffect(() => {
    const loadStories = (): void => {
      const saved = localStorage.getItem('neon-tales-stories')
      if (saved) {
        try {
          setSavedStories(JSON.parse(saved))
        } catch (error) {
          console.error('Failed to load saved stories:', error)
        }
      }
    }
    
    loadStories()
    
    // Listen for storage changes to update when stories are added/removed
    const handleStorageChange = (e: StorageEvent): void => {
      if (e.key === 'neon-tales-stories') {
        loadStories()
      }
    }
    
    window.addEventListener('storage', handleStorageChange)
    
    // Also check for changes periodically in case of same-page updates
    const interval = setInterval(loadStories, 2000)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const filteredStories = savedStories
    .filter(story => 
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.timestamp - a.timestamp
        case 'oldest':
          return a.timestamp - b.timestamp
        case 'rating':
          return b.rating - a.rating
        default:
          return b.timestamp - a.timestamp
      }
    })

  const deleteStory = (storyId: string): void => {
    const updatedStories = savedStories.filter(s => s.id !== storyId)
    setSavedStories(updatedStories)
    localStorage.setItem('neon-tales-stories', JSON.stringify(updatedStories))
  }

  const exportStory = (story: SavedStory): void => {
    const storyText = `${story.title}\n\n${story.content}`
    const blob = new Blob([storyText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${story.title}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareStory = async (story: SavedStory): Promise<void> => {
    const storyText = `${story.title}\n\n${story.content}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: storyText
        })
      } catch (err) {
        console.error('Failed to share story:', err)
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(storyText)
        alert('Story copied to clipboard!')
      } catch (err) {
        console.error('Failed to copy story:', err)
      }
    }
  }

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Hari ini'
    if (diffDays === 2) return 'Kemarin'
    if (diffDays <= 7) return `${diffDays - 1} hari lalu`
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    })
  }

  if (savedStories.length === 0) {
    return (
      <Card className={`bg-black/20 backdrop-blur-md border border-gray-500/30 ${className}`}>
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto opacity-50" />
            <h3 className="text-xl text-gray-400">
              Koleksi Cerita Kosong
            </h3>
            <p className="text-gray-500 text-sm">
              Cerita yang kamu simpan atau beri rating akan muncul di sini!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-black/20 backdrop-blur-md border border-purple-500/30 ${className}`}>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              📚 Koleksi Cerita Magical
            </h2>
            <p className="text-white/70 text-sm">
              {savedStories.length} cerita tersimpan
            </p>
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
              <Input
                placeholder="Cari cerita..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/30 border-purple-500/50 text-white placeholder-white/40"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'newest' ? 'default' : 'outline'}
                onClick={() => setSortBy('newest')}
                size="sm"
                className="text-xs"
              >
                🆕 Terbaru
              </Button>
              <Button
                variant={sortBy === 'rating' ? 'default' : 'outline'}
                onClick={() => setSortBy('rating')}
                size="sm"
                className="text-xs"
              >
                ⭐ Rating
              </Button>
              <Button
                variant={sortBy === 'oldest' ? 'default' : 'outline'}
                onClick={() => setSortBy('oldest')}
                size="sm"
                className="text-xs"
              >
                🕐 Lama
              </Button>
            </div>
          </div>

          {/* Stories Grid */}
          <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto space-y-4 md:space-y-0">
            {filteredStories.map((story) => (
              <Card 
                key={story.id}
                className="bg-black/30 border border-white/20 hover:border-purple-400/50 transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer transform hover:scale-105"
                onClick={() => onStorySelect(`**[${story.title}]**\n\n${story.content}`)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Title and Rating */}
                    <div className="flex items-start justify-between">
                      <h3 className="text-white font-semibold text-sm leading-tight flex-1 mr-2">
                        ✨ {story.title}
                      </h3>
                      <div className="flex items-center space-x-1 text-yellow-400 shrink-0">
                        <Star className="h-3 w-3 fill-current" />
                        <span className="text-xs">{story.rating}/5</span>
                      </div>
                    </div>

                    {/* Story Preview */}
                    <p className="text-white/60 text-xs line-clamp-3">
                      {story.content.substring(0, 120)}...
                    </p>

                    {/* Metadata and Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <div className="flex items-center space-x-1 text-white/40">
                        <Clock className="h-3 w-3" />
                        <span className="text-xs">{formatDate(story.timestamp)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            shareStory(story)
                          }}
                          className="h-6 w-6 p-0 text-white/40 hover:text-white hover:bg-white/10"
                        >
                          <Share2 className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            exportStory(story)
                          }}
                          className="h-6 w-6 p-0 text-white/40 hover:text-white hover:bg-white/10"
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteStory(story.id)
                          }}
                          className="h-6 w-6 p-0 text-red-400/60 hover:text-red-300 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredStories.length === 0 && searchTerm && (
            <div className="text-center py-8">
              <p className="text-white/60 text-sm">
                🔍 Tidak ada cerita yang cocok dengan "{searchTerm}"
              </p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-lg p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-purple-300">
                  {savedStories.length}
                </p>
                <p className="text-xs text-white/60">Total Cerita</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-300">
                  {savedStories.reduce((acc, story) => acc + story.rating, 0)}
                </p>
                <p className="text-xs text-white/60">Total Bintang</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-cyan-300">
                  {savedStories.filter(s => s.rating >= 4).length}
                </p>
                <p className="text-xs text-white/60">Cerita Favorit</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
