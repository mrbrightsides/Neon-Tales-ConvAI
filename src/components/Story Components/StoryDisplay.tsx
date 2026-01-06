'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Share2, BookOpen, Sparkles, Star, Bookmark, BookmarkCheck, Download, Type, Clock, RefreshCw, List } from 'lucide-react'
import TextToSpeech from './TextToSpeech'
import PartNavigator from './PartNavigator'
import PartSummaryGenerator from './PartSummaryGenerator'
import { parseMultiPartStory, exportPart, savePartBookmark, getPartBookmark, updatePartSummary, type StoryPart } from '@/lib/multiPartStory'

interface StoryDisplayProps {
  story: string
  onNewStory: () => void
  onContinueStory?: (previousStory: string) => void
}

interface SavedStory {
  id: string
  title: string
  content: string
  rating: number
  timestamp: number
  category?: string
  sourceType?: 'ai-generated' | 'user-created'
  author?: string
  wordCount?: number
}

export default function StoryDisplay({ story, onNewStory, onContinueStory }: StoryDisplayProps) {
  const [copied, setCopied] = useState<boolean>(false)
  const [shared, setShared] = useState<boolean>(false)
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false)
  const [rating, setRating] = useState<number>(0)
  const [savedStories, setSavedStories] = useState<SavedStory[]>([])
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium')
  const [readingProgress, setReadingProgress] = useState<number>(0)
  const [isGeneratingContinuation, setIsGeneratingContinuation] = useState<boolean>(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const [showShareMenu, setShowShareMenu] = useState<boolean>(false)
  
  // Multi-part story state
  const [storyParts, setStoryParts] = useState<StoryPart[]>([])
  const [currentPartNumber, setCurrentPartNumber] = useState<number>(1)
  const [showPartNavigator, setShowPartNavigator] = useState<boolean>(false)

  // Parse title from story if it exists (formatted as **[TITLE]** or **TITLE**)
  const parseStory = (text: string) => {
    const titleMatch = text.match(/\*\*\[(.*?)\]\*\*/)
    if (titleMatch) {
      const title = titleMatch[1]
      const content = text.replace(titleMatch[0], '').trim()
      return { title, content }
    }
    
    const altTitleMatch = text.match(/\*\*(.*?)\*\*/)
    if (altTitleMatch && altTitleMatch.index === 0) {
      const title = altTitleMatch[1]
      const content = text.replace(altTitleMatch[0], '').trim()
      return { title, content }
    }
    
    return { title: null, content: text }
  }

  const { title, content } = parseStory(story)
  
  // Parse multi-part story
  useEffect(() => {
    if (story) {
      const parts = parseMultiPartStory(story)
      setStoryParts(parts)
      
      // Restore bookmark if exists
      if (title && parts.length > 1) {
        const bookmark = getPartBookmark(title, currentPartNumber)
        if (bookmark) {
          setTimeout(() => {
            window.scrollTo({ top: bookmark.scrollPosition, behavior: 'smooth' })
          }, 100)
        }
      }
    }
  }, [story])
  
  const wordCount = content.split(/\s+/).length
  const readingMinutes = Math.ceil(wordCount / 200)
  const isMultiPart = storyParts.length > 1
  const currentPart = storyParts.find(p => p.partNumber === currentPartNumber)
  
  const fontSizeClasses = {
    small: 'text-base',
    medium: 'text-lg',
    large: 'text-xl'
  }

  useEffect(() => {
    const saved = localStorage.getItem('neon-tales-stories')
    if (saved) {
      setSavedStories(JSON.parse(saved))
    }
    
    const savedFontSize = localStorage.getItem('neon-tales-font-size') as 'small' | 'medium' | 'large'
    if (savedFontSize) {
      setFontSize(savedFontSize)
    }
  }, [])
  
  useEffect(() => {
    const handleScroll = (): void => {
      if (!contentRef.current) return
      
      const element = contentRef.current
      const windowHeight = window.innerHeight
      const documentHeight = element.scrollHeight
      const scrollTop = window.scrollY
      const trackLength = documentHeight - windowHeight
      
      const percentageScrolled = Math.min(
        Math.max((scrollTop / trackLength) * 100, 0),
        100
      )
      
      setReadingProgress(Math.round(percentageScrolled))
    }
    
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [story])

  useEffect(() => {
    if (story && title) {
      const isCurrentBookmarked = savedStories.some(s => s.title === title)
      setIsBookmarked(isCurrentBookmarked)
      
      const currentStory = savedStories.find(s => s.title === title)
      if (currentStory) {
        setRating(currentStory.rating)
      } else {
        setRating(0)
      }
    }
  }, [story, title, savedStories])

  const handleCopy = (): void => {
    const textarea = document.createElement('textarea')
    textarea.value = story
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy story:', err)
    } finally {
      document.body.removeChild(textarea)
    }
  }

  const handleShare = (): void => {
    setShowShareMenu(!showShareMenu)
  }
  
  const shareToWhatsApp = (): void => {
    const shareTitle = title ? `${title} - Neon Tales` : 'Cerita dari Neon Tales'
    const shareText = title 
      ? `✨ ${title} ✨\n\n${content.substring(0, 150)}...\n\n📖 Baca cerita lengkap di Neon Tales!\n${window.location.href}`
      : story.substring(0, 200) + '...'
    const encodedText = encodeURIComponent(shareText)
    window.open(`https://wa.me/?text=${encodedText}`, '_blank')
    setShowShareMenu(false)
    setShared(true)
    setTimeout(() => setShared(false), 2000)
  }
  
  const shareToTelegram = (): void => {
    const shareTitle = title ? `${title} - Neon Tales` : 'Cerita dari Neon Tales'
    const shareText = title 
      ? `✨ ${title} ✨\n\n${content.substring(0, 150)}...`
      : story.substring(0, 200) + '...'
    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent(window.location.href)
    window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, '_blank')
    setShowShareMenu(false)
    setShared(true)
    setTimeout(() => setShared(false), 2000)
  }
  
  const shareToTwitter = (): void => {
    const shareTitle = title ? `${title} - Neon Tales` : 'Cerita dari Neon Tales'
    const shareText = title 
      ? `✨ ${title} ✨ - ${content.substring(0, 100)}...`
      : story.substring(0, 150) + '...'
    const encodedText = encodeURIComponent(shareText)
    const encodedUrl = encodeURIComponent(window.location.href)
    window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank')
    setShowShareMenu(false)
    setShared(true)
    setTimeout(() => setShared(false), 2000)
  }
  
  const shareToFacebook = (): void => {
    const encodedUrl = encodeURIComponent(window.location.href)
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')
    setShowShareMenu(false)
    setShared(true)
    setTimeout(() => setShared(false), 2000)
  }

  const handleBookmark = (): void => {
    if (!title || !story) return

    const storyId = `story-${Date.now()}`
    const newStory: SavedStory = {
      id: storyId,
      title,
      content,
      rating: rating,
      timestamp: Date.now()
    }

    let updatedStories: SavedStory[]
    
    if (isBookmarked) {
      updatedStories = savedStories.filter(s => s.title !== title)
      setIsBookmarked(false)
    } else {
      updatedStories = [...savedStories, newStory]
      setIsBookmarked(true)
    }

    setSavedStories(updatedStories)
    localStorage.setItem('neon-tales-stories', JSON.stringify(updatedStories))
  }

  const handleRating = (stars: number): void => {
    setRating(stars)

    if (title && story) {
      const updatedStories = savedStories.map(s => 
        s.title === title ? { ...s, rating: stars } : s
      )
      
      if (!isBookmarked) {
        const newStory: SavedStory = {
          id: `story-${Date.now()}`,
          title,
          content,
          rating: stars,
          timestamp: Date.now()
        }
        updatedStories.push(newStory)
        setIsBookmarked(true)
      }
      
      setSavedStories(updatedStories)
      localStorage.setItem('neon-tales-stories', JSON.stringify(updatedStories))
    }
  }

  const exportStory = (): void => {
    if (!title || !content) return
    
    const storyText = `${title}\n\n${content}`
    const blob = new Blob([storyText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${title}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  
  const handleFontSizeChange = (size: 'small' | 'medium' | 'large'): void => {
    setFontSize(size)
    localStorage.setItem('neon-tales-font-size', size)
  }
  
  const handleContinueStory = (): void => {
    if (onContinueStory) {
      onContinueStory(story)
    }
  }
  
  const handlePartSelect = (partNumber: number): void => {
    setCurrentPartNumber(partNumber)
    const part = storyParts.find(p => p.partNumber === partNumber)
    if (part && title) {
      // Save bookmark
      savePartBookmark({
        storyId: title,
        partNumber,
        scrollPosition: 0,
        timestamp: Date.now()
      })
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  
  const handleExportPart = (partNumber: number): void => {
    const part = storyParts.find(p => p.partNumber === partNumber)
    if (part) {
      exportPart(part)
    }
  }
  
  const handleSummaryGenerated = (partNumber: number, summary: string): void => {
    const updatedParts = updatePartSummary(storyParts, partNumber, summary)
    setStoryParts(updatedParts)
  }

  if (!story.trim()) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-black/20 backdrop-blur-md border border-gray-500/30">
        <CardContent className="p-8 text-center">
          <div className="space-y-4">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto opacity-50" />
            <h3 className="text-xl text-gray-400">
              Belum ada cerita yang dibuat
            </h3>
            <p className="text-gray-500 text-sm">
              Pilih kategori cerita dan klik "Buat Cerita Baru" untuk memulai!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6" ref={contentRef}>
      {readingProgress > 0 && readingProgress < 100 && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 transition-all duration-300"
            style={{ width: `${readingProgress}%` }}
          />
          <div className="absolute top-2 right-4 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white">
            📖 {readingProgress}%
          </div>
        </div>
      )}
      
      <div className="flex justify-center">
        <Button
          onClick={onNewStory}
          variant="outline"
          className="bg-black/30 border-purple-500/50 text-purple-300 hover:bg-purple-500/20 hover:text-purple-200 transform transition-all duration-200 hover:scale-105"
          size="lg"
        >
          <Sparkles className="h-5 w-5 mr-2" />
          ⬅️ Kembali ke Beranda
        </Button>
      </div>

      {/* Part Navigator */}
      {isMultiPart && (
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPartNavigator(!showPartNavigator)}
            className="bg-purple-500/10 border-purple-500/30 text-purple-300 hover:bg-purple-500/20 mb-2"
          >
            <List className="h-4 w-4 mr-2" />
            {showPartNavigator ? 'Sembunyikan Daftar Isi' : `📚 Lihat Daftar Isi (${storyParts.length} Parts)`}
          </Button>
          
          {showPartNavigator && (
            <PartNavigator
              parts={storyParts}
              currentPart={currentPartNumber}
              onPartSelect={handlePartSelect}
              onExportPart={handleExportPart}
              className="animate__animated animate__fadeIn"
            />
          )}
        </div>
      )}

      <Card className="bg-black/20 backdrop-blur-md border border-purple-500/30 shadow-2xl animate__animated animate__fadeIn">
        <CardContent className="p-8">
          {title && (
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-3 mb-3">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  ✨ {title} ✨
                </h2>
              </div>
              {isMultiPart && (
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-xs font-semibold">
                    📖 Part {currentPartNumber} of {storyParts.length}
                  </span>
                  {currentPart && !currentPart.summary && (
                    <PartSummaryGenerator
                      partContent={currentPart.content}
                      partTitle={currentPart.title}
                      onSummaryGenerated={(summary) => handleSummaryGenerated(currentPartNumber, summary)}
                    />
                  )}
                </div>
              )}
              {isMultiPart && currentPart?.summary && (
                <div className="max-w-xl mx-auto mb-3">
                  <p className="text-sm text-cyan-300 italic bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-4 py-2">
                    💡 {currentPart.summary}
                  </p>
                </div>
              )}
              <div className="flex items-center justify-center gap-4 mt-2">
                <div className="flex items-center text-white/60 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>~{readingMinutes} menit</span>
                </div>
                <div className="flex items-center text-white/60 text-sm">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span>{wordCount} kata</span>
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full mx-auto w-32 mt-3"></div>
            </div>
          )}
          
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/20">
            <span className="text-white/70 text-sm flex items-center">
              <Type className="h-4 w-4 mr-2" />
              Ukuran Teks:
            </span>
            <div className="flex gap-2">
              <Button
                variant={fontSize === 'small' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFontSizeChange('small')}
                className="text-xs"
              >
                A
              </Button>
              <Button
                variant={fontSize === 'medium' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFontSizeChange('medium')}
                className="text-sm"
              >
                A
              </Button>
              <Button
                variant={fontSize === 'large' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFontSizeChange('large')}
                className="text-base"
              >
                A
              </Button>
            </div>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <div 
              className={`text-white leading-relaxed ${fontSizeClasses[fontSize]} whitespace-pre-line transition-all duration-200`}
              style={{
                textShadow: '0 0 10px rgba(255, 255, 255, 0.1)'
              }}
            >
              {content}
            </div>
          </div>

          <div className="space-y-4 mt-6 pt-6 border-t border-white/20">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-white/60 text-sm">✨ Seberapa suka kamu?</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(star)}
                    className={`transition-all duration-200 hover:scale-125 ${
                      star <= rating ? 'text-yellow-400' : 'text-white/30'
                    }`}
                  >
                    <Star 
                      className={`h-6 w-6 ${star <= rating ? 'fill-current' : ''}`} 
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <span className="text-yellow-400 text-sm font-medium">
                  {rating}/5 ⭐
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
              <Button
                onClick={handleContinueStory}
                variant="outline"
                disabled={!onContinueStory || isGeneratingContinuation}
                className="bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 hover:text-cyan-200 transform transition-all duration-200 hover:scale-105"
                size="sm"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">Lanjutkan</span>
                <span className="md:hidden">➡️</span>
              </Button>
              <Button
                onClick={onNewStory}
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white font-bold transform transition-all duration-200 hover:scale-105"
                size="sm"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">Cerita Baru</span>
                <span className="md:hidden">Baru</span>
              </Button>

              <Button
                onClick={handleBookmark}
                variant="outline"
                className={`border-pink-500/50 hover:bg-pink-500/20 transform transition-all duration-200 hover:scale-105 ${
                  isBookmarked 
                    ? 'bg-pink-500/20 text-pink-300 border-pink-400' 
                    : 'text-pink-300 hover:text-pink-200'
                }`}
                size="sm"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4 mr-1" />
                ) : (
                  <Bookmark className="h-4 w-4 mr-1" />
                )}
                <span className="hidden md:inline">{isBookmarked ? 'Tersimpan' : 'Simpan'}</span>
                <span className="md:hidden">💾</span>
              </Button>

              <Button
                onClick={handleCopy}
                variant="outline"
                className="border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/20 hover:text-cyan-200 transform transition-all duration-200 hover:scale-105"
                size="sm"
              >
                <Copy className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">{copied ? 'Tersalin!' : 'Salin'}</span>
                <span className="md:hidden">📋</span>
              </Button>

              <Button
                onClick={exportStory}
                variant="outline"
                className="border-green-500/50 text-green-300 hover:bg-green-500/20 hover:text-green-200 transform transition-all duration-200 hover:scale-105"
                size="sm"
              >
                <Download className="h-4 w-4 mr-1" />
                <span className="hidden md:inline">Export</span>
                <span className="md:hidden">⬇️</span>
              </Button>

              <div className="relative w-full">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className={`w-full border-purple-500/50 hover:bg-purple-500/20 transform transition-all duration-200 hover:scale-105 ${
                    shared 
                      ? 'bg-purple-500/20 text-purple-300 border-purple-400' 
                      : 'text-purple-300 hover:text-purple-200'
                  }`}
                  size="sm"
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">{shared ? 'Dibagikan! ✓' : 'Bagikan'}</span>
                  <span className="md:hidden">{shared ? '✓' : '📤'}</span>
                </Button>
                
                {showShareMenu && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black/90 backdrop-blur-md border border-purple-500/50 rounded-lg p-2 space-y-1 min-w-[200px] shadow-2xl z-50 animate__animated animate__fadeIn animate__faster">
                    <button
                      onClick={shareToWhatsApp}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-left text-white hover:bg-green-500/30 rounded-lg transition-all duration-200 hover:scale-105 group"
                    >
                      <span className="text-xl group-hover:scale-125 transition-transform">💬</span>
                      <span className="text-sm font-medium">WhatsApp</span>
                    </button>
                    <button
                      onClick={shareToTelegram}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-left text-white hover:bg-blue-500/30 rounded-lg transition-all duration-200 hover:scale-105 group"
                    >
                      <span className="text-xl group-hover:scale-125 transition-transform">✈️</span>
                      <span className="text-sm font-medium">Telegram</span>
                    </button>
                    <button
                      onClick={shareToTwitter}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-left text-white hover:bg-cyan-500/30 rounded-lg transition-all duration-200 hover:scale-105 group"
                    >
                      <span className="text-xl group-hover:scale-125 transition-transform">🐦</span>
                      <span className="text-sm font-medium">Twitter/X</span>
                    </button>
                    <button
                      onClick={shareToFacebook}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-left text-white hover:bg-blue-600/30 rounded-lg transition-all duration-200 hover:scale-105 group"
                    >
                      <span className="text-xl group-hover:scale-125 transition-transform">👥</span>
                      <span className="text-sm font-medium">Facebook</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {savedStories.length > 0 && (
              <div className="text-center text-xs text-white/50 space-y-1">
                <p>📚 {savedStories.length} cerita tersimpan di koleksi</p>
                {rating > 0 && (
                  <p>🌟 Cerita ini mendapat rating {rating}/5 bintang!</p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <TextToSpeech 
        text={story}
        className="animate__animated animate__fadeInUp animate__delay-1s"
      />
    </div>
  )
}
