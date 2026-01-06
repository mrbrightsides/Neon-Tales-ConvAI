'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronUp, BookOpen, Sparkles, Clock, Download } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export interface StoryPart {
  partNumber: number
  title: string
  content: string
  summary?: string
  timestamp: number
  wordCount: number
  readingMinutes: number
}

interface PartNavigatorProps {
  parts: StoryPart[]
  currentPart: number
  onPartSelect: (partNumber: number) => void
  onExportPart: (partNumber: number) => void
  className?: string
}

export default function PartNavigator({ 
  parts, 
  currentPart, 
  onPartSelect,
  onExportPart,
  className = '' 
}: PartNavigatorProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true)

  if (parts.length <= 1) return null

  return (
    <Card className={`bg-gradient-to-br from-purple-900/20 to-cyan-900/20 backdrop-blur-md border border-purple-500/30 ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-purple-400" />
            <h3 className="text-lg font-bold text-purple-300">
              📚 Daftar Isi Cerita
            </h3>
            <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/50">
              {parts.length} Part
            </Badge>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-white/70 hover:text-white"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>

        {isExpanded && (
          <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
            {parts.map((part) => {
              const isCurrent = part.partNumber === currentPart
              
              return (
                <div
                  key={part.partNumber}
                  className={`group relative rounded-lg border transition-all duration-200 hover:scale-[1.02] ${
                    isCurrent
                      ? 'bg-gradient-to-r from-purple-600/30 to-cyan-600/30 border-purple-400/50 shadow-lg'
                      : 'bg-black/20 border-white/10 hover:bg-white/5 hover:border-white/20'
                  }`}
                >
                  <button
                    onClick={() => onPartSelect(part.partNumber)}
                    className="w-full text-left p-3 rounded-lg"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge 
                            variant={isCurrent ? "default" : "outline"}
                            className={`text-xs ${
                              isCurrent 
                                ? 'bg-purple-500 text-white' 
                                : 'bg-white/10 text-white/70 border-white/20'
                            }`}
                          >
                            Part {part.partNumber}
                          </Badge>
                          {isCurrent && (
                            <Sparkles className="h-4 w-4 text-yellow-400 animate-pulse" />
                          )}
                        </div>
                        
                        <h4 className={`font-semibold text-sm mb-1 truncate ${
                          isCurrent ? 'text-purple-200' : 'text-white/80'
                        }`}>
                          {part.title}
                        </h4>
                        
                        {part.summary && (
                          <p className="text-xs text-white/60 line-clamp-2 mb-2">
                            {part.summary}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-3 text-xs text-white/50">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            ~{part.readingMinutes} min
                          </span>
                          <span>{part.wordCount} kata</span>
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onExportPart(part.partNumber)
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                        title="Export Part"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </button>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
          <span>📖 Total: {parts.reduce((sum, p) => sum + p.wordCount, 0)} kata</span>
          <span>⏱️ ~{parts.reduce((sum, p) => sum + p.readingMinutes, 0)} menit</span>
        </div>
      </CardContent>
    </Card>
  )
}
