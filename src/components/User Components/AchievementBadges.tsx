'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trophy, Lock, X, Award, Star } from 'lucide-react'
import { ACHIEVEMENTS, getAchievementById } from '@/lib/achievements'
import type { AchievementDefinition } from '@/lib/achievements'
import type { Achievement } from '@/lib/storage'

interface AchievementBadgesProps {
  unlockedAchievements: Achievement[]
  stats: {
    totalStoriesRead: number
    currentStreak: number
  }
  className?: string
}

export default function AchievementBadges({ unlockedAchievements, stats, className = '' }: AchievementBadgesProps) {
  const [showAll, setShowAll] = useState<boolean>(false)
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementDefinition | null>(null)
  const [newUnlock, setNewUnlock] = useState<string | null>(null)

  const unlockedIds = unlockedAchievements.map((a: Achievement) => a.id)
  const unlockedCount = unlockedIds.length
  const totalCount = ACHIEVEMENTS.filter((a: AchievementDefinition) => !a.hidden).length
  const progress = Math.round((unlockedCount / totalCount) * 100)

  // Check for new achievement unlock (for animation)
  useEffect(() => {
    if (unlockedAchievements.length > 0) {
      const latest = unlockedAchievements[unlockedAchievements.length - 1]
      const timeSinceUnlock = Date.now() - latest.unlockedAt
      if (timeSinceUnlock < 5000) {
        setNewUnlock(latest.id)
        setTimeout(() => setNewUnlock(null), 5000)
      }
    }
  }, [unlockedAchievements])

  const visibleAchievements = showAll 
    ? ACHIEVEMENTS.filter((a: AchievementDefinition) => !a.hidden || unlockedIds.includes(a.id))
    : ACHIEVEMENTS.filter((a: AchievementDefinition) => !a.hidden).slice(0, 6)

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      'reading': 'from-purple-500 to-pink-500',
      'collection': 'from-cyan-500 to-blue-500',
      'social': 'from-green-500 to-emerald-500',
      'special': 'from-yellow-500 to-orange-500'
    }
    return colors[category] || 'from-gray-500 to-gray-600'
  }

  const getCategoryBadgeColor = (category: string): string => {
    const colors: Record<string, string> = {
      'reading': 'bg-purple-500/20 text-purple-300 border-purple-500/50',
      'collection': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
      'social': 'bg-green-500/20 text-green-300 border-green-500/50',
      'special': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50'
    }
    return colors[category] || 'bg-gray-500/20 text-gray-300 border-gray-500/50'
  }

  return (
    <>
      <Card className={`bg-black/20 backdrop-blur-md border border-yellow-500/30 ${className}`}>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent flex items-center">
              <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
              🏆 Achievement Badges
            </h3>
            <div className="text-right">
              <p className="text-yellow-300 font-bold text-lg">{unlockedCount}/{totalCount}</p>
              <p className="text-white/60 text-xs">Terbuka</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Progress</span>
              <span className="text-yellow-300 font-bold">{progress}%</span>
            </div>
            <div className="h-3 bg-black/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 transition-all duration-1000 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-purple-300">{stats.totalStoriesRead}</p>
              <p className="text-xs text-white/60">Cerita Dibaca</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-orange-300">{stats.currentStreak}🔥</p>
              <p className="text-xs text-white/60">Hari Berturut</p>
            </div>
          </div>

          {/* Achievement Grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {visibleAchievements.map((achievement: AchievementDefinition) => {
              const isUnlocked = unlockedIds.includes(achievement.id)
              const isNew = newUnlock === achievement.id

              return (
                <button
                  key={achievement.id}
                  onClick={() => setSelectedAchievement(achievement)}
                  className={`relative aspect-square rounded-lg border-2 transition-all duration-300 hover:scale-110 ${
                    isUnlocked
                      ? `bg-gradient-to-br ${getCategoryColor(achievement.category)} border-white/30 shadow-lg`
                      : 'bg-black/30 border-white/10 grayscale opacity-50'
                  } ${isNew ? 'animate__animated animate__bounceIn animate__slow' : ''}`}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-3xl ${isNew ? 'animate-pulse' : ''}`}>
                      {isUnlocked ? achievement.icon : <Lock className="h-6 w-6 text-white/30" />}
                    </span>
                  </div>
                  {isNew && (
                    <div className="absolute -top-1 -right-1">
                      <Star className="h-4 w-4 text-yellow-300 fill-yellow-300 animate-pulse" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Show More Button */}
          {ACHIEVEMENTS.filter((a: AchievementDefinition) => !a.hidden).length > 6 && (
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="w-full border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/20"
              size="sm"
            >
              {showAll ? 'Tampilkan Lebih Sedikit' : `Lihat Semua (${totalCount} Achievement)`}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Achievement Detail Modal */}
      {selectedAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate__animated animate__fadeIn animate__faster">
          <Card className="max-w-md w-full bg-black/90 border-2 border-yellow-500/50 shadow-2xl animate__animated animate__zoomIn animate__faster">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`text-5xl ${unlockedIds.includes(selectedAchievement.id) ? '' : 'grayscale opacity-50'}`}>
                    {unlockedIds.includes(selectedAchievement.id) ? selectedAchievement.icon : '🔒'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{selectedAchievement.title}</h3>
                    <Badge className={`${getCategoryBadgeColor(selectedAchievement.category)} text-xs`}>
                      {selectedAchievement.category}
                    </Badge>
                  </div>
                </div>
                <Button
                  onClick={() => setSelectedAchievement(null)}
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-white/80 text-sm">{selectedAchievement.description}</p>

              {unlockedIds.includes(selectedAchievement.id) ? (
                <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 text-center">
                  <Award className="h-8 w-8 text-green-300 mx-auto mb-2" />
                  <p className="text-green-300 font-bold">Achievement Terbuka!</p>
                  <p className="text-green-200/70 text-xs mt-1">
                    Dibuka pada {new Date(
                      unlockedAchievements.find((a: Achievement) => a.id === selectedAchievement.id)?.unlockedAt || Date.now()
                    ).toLocaleDateString('id-ID', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              ) : (
                <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-center">
                  <Lock className="h-8 w-8 text-white/30 mx-auto mb-2" />
                  <p className="text-white/60 font-bold">Belum Terbuka</p>
                  <p className="text-white/40 text-xs mt-1">
                    Persyaratan: {selectedAchievement.requirement}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
