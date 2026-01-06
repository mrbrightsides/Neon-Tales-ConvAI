'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Sparkles, BookOpen, Users, Globe, Zap, Crown, Heart } from 'lucide-react'

interface StoryGeneratorProps {
  onStoryGenerated: (story: string) => void
  isGenerating?: boolean
}

type StoryCategory = 'fairy-tale' | 'fable' | 'folklore' | 'adventure' | 'educational' | 'funny' | 'mitos' | 'sage' | 'parabel'
type StoryLength = 'short' | 'medium' | 'long'
type StoryLanguage = 'id' | 'en'
type AgeGroup = '3-5' | '6-8' | '9-12'

const LANGUAGES = {
  'id': {
    label: '🇮🇩 Bahasa Indonesia',
    name: 'Indonesia',
    systemPrompt: 'Gunakan bahasa Indonesia yang mudah dipahami anak-anak.',
    emoji: '🇮🇩'
  },
  'en': {
    label: '🇬🇧 English',
    name: 'English',
    systemPrompt: 'Use simple English that children can easily understand.',
    emoji: '🇬🇧'
  }
}

const AGE_GROUPS = {
  '3-5': {
    label: '👶 3-5 Tahun (Balita)',
    description: 'Sangat sederhana, kalimat pendek',
    vocabularyNote: 'Use very simple vocabulary, short sentences (5-8 words), lots of repetition, basic concepts, and colorful descriptions.',
    emoji: '👶'
  },
  '6-8': {
    label: '🧒 6-8 Tahun (SD Kecil)',
    description: 'Sedang, mulai ada dialog',
    vocabularyNote: 'Use age-appropriate vocabulary, medium-length sentences (8-12 words), simple dialogue, basic emotions, and descriptive language.',
    emoji: '🧒'
  },
  '9-12': {
    label: '👦 9-12 Tahun (SD Besar)',
    description: 'Kompleks, cerita lebih detail',
    vocabularyNote: 'Use richer vocabulary, longer sentences (12-15 words), complex dialogue, deeper emotions, detailed descriptions, and moral complexity.',
    emoji: '👦'
  }
}

const STORY_LENGTHS = {
  'short': {
    label: '📖 Pendek (2-3 menit)',
    words: '200-300',
    prompt: 'dalam 200-300 kata (cerita pendek untuk waktu singkat)',
    emoji: '📖',
    recommended: '✅ Paling Stabil'
  },
  'medium': {
    label: '📚 Sedang (4-6 menit)', 
    words: '400-600',
    prompt: 'dalam 400-600 kata (cerita sedang dengan detail lebih)',
    emoji: '📚',
    recommended: '⭐ Rekomendasi'
  },
  'long': {
    label: '📜 Panjang (8-10 menit)',
    words: '700-1000', 
    prompt: 'dalam 700-1000 kata (cerita panjang dengan petualangan lengkap)',
    emoji: '📜',
    recommended: '🚀 Epic Story'
  }
}

const STORY_CATEGORIES = {
  'fairy-tale': {
    label: 'Dongeng & Fairy Tales',
    icon: Sparkles,
    prompt: 'Buatkan cerita dongeng yang magical dan penuh petualangan untuk anak-anak. Cerita harus memiliki karakter yang menarik, pelajaran moral yang baik, dan akhir yang bahagia. Gunakan bahasa Indonesia yang mudah dipahami anak-anak.'
  },
  'fable': {
    label: 'Cerita Fabel (Hewan)',
    icon: Users,
    prompt: 'Buatkan cerita fabel dengan karakter hewan yang mengajarkan nilai-nilai moral kepada anak-anak. Cerita harus mengandung pelajaran hidup yang berharga dan diceritakan dengan cara yang menyenangkan. Gunakan bahasa Indonesia.'
  },
  'folklore': {
    label: 'Cerita Rakyat Nusantara',
    icon: Globe,
    prompt: 'Buatkan cerita rakyat Indonesia yang kaya akan budaya dan tradisi. Cerita bisa dari berbagai daerah di Nusantara dengan karakter-karakter lokal dan mengandung nilai-nilai budaya Indonesia. Gunakan bahasa Indonesia.'
  },
  'adventure': {
    label: 'Petualangan Seru',
    icon: BookOpen,
    prompt: 'Buatkan cerita petualangan yang seru dan menegangkan untuk anak-anak. Cerita harus penuh aksi, eksplorasi, dan penemuan yang menarik. Pastikan cerita aman dan sesuai untuk anak-anak. Gunakan bahasa Indonesia.'
  },
  'educational': {
    label: 'Cerita Edukasi',
    icon: BookOpen,
    prompt: 'Buatkan cerita edukatif yang mengajarkan pengetahuan menarik kepada anak-anak seperti sains, alam, sejarah, atau kehidupan sehari-hari. Pastikan informasinya akurat dan disampaikan dengan cara yang menyenangkan. Gunakan bahasa Indonesia.'
  },
  'funny': {
    label: 'Cerita Lucu',
    icon: Sparkles,
    prompt: 'Buatkan cerita yang lucu dan menghibur untuk anak-anak. Cerita harus penuh humor yang sehat, situasi kocak, dan karakter-karakter yang menggemaskan. Gunakan bahasa Indonesia.'
  },
  'mitos': {
    label: 'Mitos & Cerita Dewa',
    icon: Zap,
    prompt: 'Buatkan cerita mitos yang menakjubkan tentang dewa-dewi, penciptaan dunia, kekuatan supernatural, atau legenda kuno. Cerita harus memiliki elemen magical yang kuat, karakter-karakter yang powerful, dan mengajarkan nilai-nilai universal. Sesuaikan dengan usia anak-anak. Gunakan bahasa Indonesia.'
  },
  'sage': {
    label: 'Legenda & Saga Pahlawan',
    icon: Crown,
    prompt: 'Buatkan cerita legenda heroik tentang pahlawan pemberani, pejuang kebaikan, atau tokoh legendaris. Cerita harus penuh petualangan epik, keberanian, pengorbanan, dan kemenangan kebaikan atas kejahatan. Cocok untuk anak-anak dengan pesan inspiratif. Gunakan bahasa Indonesia.'
  },
  'parabel': {
    label: 'Parabel & Hikayat Bijak',
    icon: Heart,
    prompt: 'Buatkan cerita parabel yang dalam dan penuh makna, mengandung pelajaran hidup yang berharga melalui simbolisme dan metafora yang mudah dipahami anak-anak. Cerita harus memiliki pesan moral yang kuat namun disampaikan dengan cara yang menarik dan tidak menggurui. Gunakan bahasa Indonesia.'
  }
}

export default function StoryGenerator({ onStoryGenerated, isGenerating = false }: StoryGeneratorProps) {
  const [selectedCategory, setSelectedCategory] = useState<StoryCategory>('fairy-tale')
  const [selectedLength, setSelectedLength] = useState<StoryLength>('medium')
  const [selectedLanguage, setSelectedLanguage] = useState<StoryLanguage>('id')
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup>('6-8')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [storyCount, setStoryCount] = useState<number>(0)

  // Helper: Retry with exponential backoff
  const retryWithBackoff = async <T,>(
    fn: () => Promise<T>,
    retries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    try {
      return await fn()
    } catch (error) {
      if (retries === 0) throw error
      
      console.log(`⚠️ Retry attempt ${4 - retries}/3 after ${delay}ms...`)
      await new Promise(resolve => setTimeout(resolve, delay))
      
      return retryWithBackoff(fn, retries - 1, delay * 2)
    }
  }

  const generateStory = async (): Promise<void> => {
    if (isGenerating || isLoading) return

    setIsLoading(true)
    setError('')

    try {
      const category = STORY_CATEGORIES[selectedCategory]
      const length = STORY_LENGTHS[selectedLength]
      const language = LANGUAGES[selectedLanguage]
      const ageGroup = AGE_GROUPS[selectedAgeGroup]
      
      console.log(`🎬 Generating ${selectedLength} story...`)
      
      const systemPrompt = selectedLanguage === 'id' 
        ? `Kamu adalah seorang pencerita anak yang ahli dalam berbagai jenis cerita dari seluruh dunia. Kamu memiliki pengetahuan mendalam tentang dongeng, cerita rakyat, fabel, dan berbagai tradisi bercerita. Buatlah cerita yang menarik, aman untuk anak-anak usia ${selectedAgeGroup} tahun, dan sesuai dengan kategori yang diminta. Pastikan cerita ${length.prompt} dan memiliki alur yang jelas serta mengandai nilai-nilai positif. ${language.systemPrompt} ${ageGroup.vocabularyNote}`
        : `You are an expert children's storyteller with deep knowledge of fairy tales, folktales, fables, and storytelling traditions from around the world. Create engaging, age-appropriate stories for children aged ${selectedAgeGroup} years old that match the requested category. Ensure the story ${length.prompt.replace('dalam', 'is')} and has a clear narrative with positive values. ${language.systemPrompt} ${ageGroup.vocabularyNote}`
      
      const userPrompt = selectedLanguage === 'id'
        ? `${category.prompt}\n\nBuatlah cerita ${length.prompt} yang baru dan original untuk anak usia ${selectedAgeGroup} tahun (${ageGroup.description}). ${ageGroup.vocabularyNote}\n\nCerita harus memiliki:\n1. Judul yang menarik dan unik\n2. Karakter yang memorable dan relatable untuk usia ${selectedAgeGroup} tahun\n3. Alur yang seru dan mudah diikuti\n4. Dialog yang hidup dan natural (sesuai usia)\n5. Deskripsi yang vivid tapi mudah dipahami\n6. Pelajaran atau pesan positif yang tidak menggurui\n7. Akhir yang memuaskan dan menghangatkan hati\n\nFormat cerita:\n**[JUDUL CERITA]**\n\n[Isi cerita dengan dialog dan deskripsi yang menarik...]`
        : `Create an engaging ${category.label} story in English. Write ${length.prompt.replace('dalam', 'in')} for children aged ${selectedAgeGroup} years old (${ageGroup.description}). ${ageGroup.vocabularyNote}\n\nThe story must have:\n1. An engaging and unique title\n2. Memorable and relatable characters for ${selectedAgeGroup} year olds\n3. An exciting and easy-to-follow plot\n4. Lively and natural dialogue (age-appropriate)\n5. Vivid but understandable descriptions\n6. A positive lesson or message (not preachy)\n7. A satisfying and heartwarming ending\n\nFormat:\n**[STORY TITLE]**\n\n[Story content with engaging dialogue and descriptions...]`
      
      // 🔄 Retry mechanism with exponential backoff (3 attempts)
      const data = await retryWithBackoff(async () => {
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
            ageGroup: selectedAgeGroup,
            language: selectedLanguage
          }),
        })
        
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`)
        }
        
        const apiData = await response.json()
        
        // Validate response
        if (!apiData.fullText) {
          throw new Error('Empty response from API')
        }
        
        return apiData
      })

      const story = data.fullText || ''
      
      if (story.trim()) {
        console.log(`✅ Story generated successfully (${story.length} chars)`)
        onStoryGenerated(story.trim())
        setStoryCount(prev => prev + 1)
      } else {
        throw new Error('Story generation returned empty result')
      }
    } catch (err: any) {
      console.error('❌ Story generation error:', err)
      
      // 🎯 User-friendly error messages
      let errorMessage = 'Maaf, ada kendala saat membuat cerita. '
      
      if (err?.message?.includes('fetch') || err?.message?.includes('network')) {
        errorMessage += 'Periksa koneksi internet kamu dan coba lagi!'
      } else if (err?.message?.includes('timeout')) {
        errorMessage += 'Cerita terlalu panjang untuk diproses. Coba pilih "Pendek" atau "Sedang"!'
      } else if (err?.message?.includes('Empty response')) {
        errorMessage += 'AI tidak berhasil membuat cerita. Silakan coba kategori lain!'
      } else {
        errorMessage += 'Silakan coba lagi dalam beberapa detik!'
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const CategoryIcon = STORY_CATEGORIES[selectedCategory].icon

  return (
    <Card className="w-full max-w-2xl mx-auto bg-black/20 backdrop-blur-md border border-purple-500/30 shadow-2xl">
      <CardContent className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            ✨ Neon Tales Generator ✨
          </h2>
          <p className="text-white/80 text-sm">
            Pilih kategori cerita yang kamu inginkan, lalu biarkan AI menciptakan cerita magical untukmu!
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white font-medium text-sm">
                🌐 Bahasa:
              </label>
              <Select
                value={selectedLanguage}
                onValueChange={(value: StoryLanguage) => setSelectedLanguage(value)}
              >
                <SelectTrigger className="w-full bg-black/30 border-green-500/50 text-white hover:border-green-400 focus:border-green-400 transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-green-500/50">
                  {Object.entries(LANGUAGES).map(([key, lang]) => (
                    <SelectItem 
                      key={key} 
                      value={key}
                      className="text-white hover:bg-green-500/20 focus:bg-green-500/30"
                    >
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-white font-medium text-sm">
                👶 Usia Anak:
              </label>
              <Select
                value={selectedAgeGroup}
                onValueChange={(value: AgeGroup) => setSelectedAgeGroup(value)}
              >
                <SelectTrigger className="w-full bg-black/30 border-yellow-500/50 text-white hover:border-yellow-400 focus:border-yellow-400 transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-yellow-500/50">
                  {Object.entries(AGE_GROUPS).map(([key, age]) => (
                    <SelectItem 
                      key={key} 
                      value={key}
                      className="text-white hover:bg-yellow-500/20 focus:bg-yellow-500/30"
                    >
                      <div className="flex flex-col">
                        <span>{age.label}</span>
                        <span className="text-xs text-white/60">{age.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white font-medium text-sm">
                📚 Kategori Cerita:
              </label>
              <Select
                value={selectedCategory}
                onValueChange={(value: StoryCategory) => setSelectedCategory(value)}
              >
                <SelectTrigger className="w-full bg-black/30 border-purple-500/50 text-white hover:border-purple-400 focus:border-purple-400 transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-purple-500/50">
                  {Object.entries(STORY_CATEGORIES).map(([key, category]) => (
                    <SelectItem 
                      key={key} 
                      value={key}
                      className="text-white hover:bg-purple-500/20 focus:bg-purple-500/30"
                    >
                      <div className="flex items-center space-x-2">
                        <category.icon className="h-4 w-4" />
                        <span>{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-white font-medium text-sm">
                ⏱️ Panjang Cerita:
              </label>
              <Select
                value={selectedLength}
                onValueChange={(value: StoryLength) => setSelectedLength(value)}
              >
                <SelectTrigger className="w-full bg-black/30 border-cyan-500/50 text-white hover:border-cyan-400 focus:border-cyan-400 transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-cyan-500/50">
                  {Object.entries(STORY_LENGTHS).map(([key, length]) => (
                    <SelectItem 
                      key={key} 
                      value={key}
                      className="text-white hover:bg-cyan-500/20 focus:bg-cyan-500/30"
                    >
                      <div className="flex flex-col items-start">
                        <div className="flex items-center justify-between w-full">
                          <span>{length.label}</span>
                          <span className="text-xs text-white/60 ml-2">{length.words} kata</span>
                        </div>
                        <span className="text-xs text-cyan-300/80 mt-0.5">{length.recommended}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={generateStory}
            disabled={isLoading || isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-700 hover:via-pink-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105 animate__animated"
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Menciptakan cerita magical...</span>
                </div>
                <p className="text-xs text-white/60">✨ AI sedang menulis {STORY_LENGTHS[selectedLength].label.split('(')[0].trim()}...</p>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <CategoryIcon className="h-5 w-5" />
                <span>🎭 Buat Cerita Baru!</span>
              </div>
            )}
          </Button>
        </div>

        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-200 text-sm text-center">{error}</p>
          </div>
        )}

        <div className="text-center text-xs text-white/60 space-y-1">
          <p>🤖 Dipersembahkan oleh AI yang penuh kreativitas</p>
          {storyCount > 0 && (
            <p className="text-purple-300">✨ {storyCount} cerita magical telah diciptakan!</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
