'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Sparkles } from 'lucide-react'

interface PartSummaryGeneratorProps {
  partContent: string
  partTitle: string
  onSummaryGenerated: (summary: string) => void
  className?: string
}

export default function PartSummaryGenerator({ 
  partContent, 
  partTitle,
  onSummaryGenerated,
  className = ''
}: PartSummaryGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  const generateSummary = async (): Promise<void> => {
    if (isGenerating) return

    setIsGenerating(true)

    try {
      // Detect language
      const isEnglish = /^[A-Za-z0-9\s.,!?'"-]+$/.test(partContent.substring(0, 100))
      const language = isEnglish ? 'en' : 'id'
      
      const systemPrompt = isEnglish
        ? 'You are an expert at creating concise, engaging story summaries for children. Create a brief 1-2 sentence summary that captures the main events or themes.'
        : 'Kamu adalah ahli membuat ringkasan cerita yang singkat dan menarik untuk anak-anak. Buat ringkasan 1-2 kalimat yang menangkap peristiwa atau tema utama.'
      
      const userPrompt = isEnglish
        ? `Summarize this story part in 1-2 engaging sentences:\n\nTitle: ${partTitle}\n\n${partContent.substring(0, 800)}`
        : `Ringkas bagian cerita ini dalam 1-2 kalimat yang menarik:\n\nJudul: ${partTitle}\n\n${partContent.substring(0, 800)}`

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: userPrompt
            }
          ],
          ageGroup: '6-8',
          language: language
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      const summary = data.fullText || ''
      
      if (summary.trim()) {
        onSummaryGenerated(summary.trim())
      }
    } catch (err) {
      console.error('Summary generation error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      onClick={generateSummary}
      disabled={isGenerating}
      variant="outline"
      size="sm"
      className={`bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 ${className}`}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
          <span className="text-xs">Membuat ringkasan...</span>
        </>
      ) : (
        <>
          <Sparkles className="h-3 w-3 mr-1" />
          <span className="text-xs">Buat Ringkasan AI</span>
        </>
      )}
    </Button>
  )
}
