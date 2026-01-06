'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, RefreshCw } from 'lucide-react'

interface StoryContinuationProps {
  previousStory: string
  onContinuationGenerated: (continuation: string) => void
}

export default function StoryContinuation({ previousStory, onContinuationGenerated }: StoryContinuationProps) {
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const generateContinuation = async (): Promise<void> => {
    if (isGenerating) return

    setIsGenerating(true)
    setError('')

    try {
      // Detect language from previous story
      const isEnglish = /^[A-Za-z0-9\s.,!?'"-]+$/.test(previousStory.substring(0, 100))
      const language = isEnglish ? 'en' : 'id'
      
      const systemPrompt = isEnglish
        ? 'You are an expert children\'s storyteller who creates engaging story continuations. Continue the story naturally, maintaining the same characters, tone, and style. Add new adventures or lessons while keeping it age-appropriate and entertaining.'
        : 'Kamu adalah pencerita anak yang ahli dalam membuat kelanjutan cerita yang menarik. Lanjutkan cerita secara natural, pertahankan karakter, tone, dan gaya yang sama. Tambahkan petualangan atau pelajaran baru sambil tetap sesuai usia dan menghibur.'
      
      const userPrompt = isEnglish
        ? `Here is a story:\n\n${previousStory}\n\nPlease write a continuation of this story. The continuation should:\n1. Start naturally from where the previous story ended\n2. Keep the same characters and setting\n3. Add a new adventure or challenge\n4. Maintain the same tone and reading level\n5. Be approximately 300-500 words\n6. Have a satisfying conclusion or cliffhanger\n7. Include dialogue and vivid descriptions\n\nFormat:\n**[CONTINUATION TITLE]**\n\n[Story continuation...]`
        : `Berikut adalah sebuah cerita:\n\n${previousStory}\n\nSilakan tulis kelanjutan dari cerita ini. Kelanjutan harus:\n1. Dimulai secara natural dari akhir cerita sebelumnya\n2. Mempertahankan karakter dan setting yang sama\n3. Menambahkan petualangan atau tantangan baru\n4. Mempertahankan tone dan level bacaan yang sama\n5. Sekitar 300-500 kata\n6. Memiliki kesimpulan yang memuaskan atau cliffhanger\n7. Mengandung dialog dan deskripsi yang vivid\n\nFormat:\n**[JUDUL KELANJUTAN]**\n\n[Kelanjutan cerita...]`

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
      const continuation = data.fullText || ''
      
      if (continuation.trim()) {
        onContinuationGenerated(continuation.trim())
      } else {
        throw new Error('Story continuation returned empty result')
      }
    } catch (err) {
      console.error('Story continuation error:', err)
      setError('Maaf, ada kendala saat membuat kelanjutan cerita. Silakan coba lagi!')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-md">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h3 className="text-white font-semibold text-sm mb-1 flex items-center justify-center md:justify-start">
              <RefreshCw className="h-4 w-4 mr-2" />
              💫 Ingin tahu kelanjutannya?
            </h3>
            <p className="text-white/70 text-xs">
              Generate kelanjutan cerita dengan petualangan baru!
            </p>
          </div>
          
          <Button
            onClick={generateContinuation}
            disabled={isGenerating}
            className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-700 hover:via-blue-700 hover:to-purple-700 text-white font-bold transform transition-all duration-200 hover:scale-105"
            size="sm"
          >
            {isGenerating ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Membuat kelanjutan...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Buat Kelanjutan Cerita</span>
              </div>
            )}
          </Button>
        </div>
        
        {error && (
          <div className="mt-3 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-200 text-xs text-center">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
