'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Lightbulb,
  BookOpen,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Wand2,
  MessageSquare,
  ArrowRight,
} from 'lucide-react'

interface StoryScaffoldingProps {
  language: string
  ageGroup: string
  onPromptSelect: (prompt: string) => void
  onVocabSelect: (word: string) => void
  wordCount: number
}

interface StoryPrompt {
  id: string
  textId: string
  textEn: string
}

interface VocabCategory {
  category: string
  categoryEn: string
  icon: string
  words: Array<{ id: string, en: string }>
}

const STORY_PROMPTS: StoryPrompt[] = [
  { id: 'Suatu hari, ada seorang anak bernama...', textEn: 'Once upon a time, there was a child named...', textId: 'Suatu hari, ada seorang anak bernama...' },
  { id: 'Di sebuah hutan yang penuh keajaiban...', textEn: 'In a magical forest...', textId: 'Di sebuah hutan yang penuh keajaiban...' },
  { id: 'Seekor binatang kecil menemukan sesuatu yang misterius...', textEn: 'A small animal found something mysterious...', textId: 'Seekor binatang kecil menemukan sesuatu yang misterius...' },
  { id: 'Pada suatu pagi, sesuatu yang aneh terjadi...', textEn: 'One morning, something strange happened...', textId: 'Pada suatu pagi, sesuatu yang aneh terjadi...' },
  { id: 'Ada seorang pahlawan yang berani mencari...', textEn: 'There was a brave hero searching for...', textId: 'Ada seorang pahlawan yang berani mencari...' },
  { id: 'Di kerajaan yang jauh, hidup seorang putri yang...', textEn: 'In a faraway kingdom, lived a princess who...', textId: 'Di kerajaan yang jauh, hidup seorang putri yang...' },
  { id: 'Tiba-tiba, pintu ajaib terbuka dan...', textEn: 'Suddenly, a magical door opened and...', textId: 'Tiba-tiba, pintu ajaib terbuka dan...' },
  { id: 'Ketika bulan purnama, sesuatu yang istimewa selalu terjadi...', textEn: 'When the full moon rises, something special always happens...', textId: 'Ketika bulan purnama, sesuatu yang istimewa selalu terjadi...' },
]

const VOCABULARY_HELPERS: VocabCategory[] = [
  {
    category: '🦸 Tokoh (Karakter)',
    categoryEn: '🦸 Characters',
    icon: '🦸',
    words: [
      { id: 'pahlawan', en: 'hero' },
      { id: 'putri', en: 'princess' },
      { id: 'pangeran', en: 'prince' },
      { id: 'penyihir', en: 'wizard' },
      { id: 'petualang', en: 'adventurer' },
      { id: 'ksatria', en: 'knight' },
      { id: 'ratu', en: 'queen' },
      { id: 'raja', en: 'king' },
      { id: 'monster', en: 'monster' },
      { id: 'peri', en: 'fairy' },
    ],
  },
  {
    category: '🏔️ Tempat',
    categoryEn: '🏔️ Places',
    icon: '🏔️',
    words: [
      { id: 'hutan ajaib', en: 'magical forest' },
      { id: 'kerajaan', en: 'kingdom' },
      { id: 'gua misterius', en: 'mysterious cave' },
      { id: 'kastil', en: 'castle' },
      { id: 'desa', en: 'village' },
      { id: 'pulau terpencil', en: 'remote island' },
      { id: 'gunung tinggi', en: 'tall mountain' },
      { id: 'laut dalam', en: 'deep sea' },
      { id: 'menara tinggi', en: 'tall tower' },
      { id: 'kebun rahasia', en: 'secret garden' },
    ],
  },
  {
    category: '✨ Kata Sifat Menarik',
    categoryEn: '✨ Interesting Adjectives',
    icon: '✨',
    words: [
      { id: 'ajaib', en: 'magical' },
      { id: 'misterius', en: 'mysterious' },
      { id: 'menakjubkan', en: 'amazing' },
      { id: 'berani', en: 'brave' },
      { id: 'cerdik', en: 'clever' },
      { id: 'berbahaya', en: 'dangerous' },
      { id: 'indah', en: 'beautiful' },
      { id: 'mengerikan', en: 'scary' },
      { id: 'bersinar', en: 'glowing' },
      { id: 'tersembunyi', en: 'hidden' },
    ],
  },
  {
    category: '⚡ Kata Kerja (Aksi)',
    categoryEn: '⚡ Action Verbs',
    icon: '⚡',
    words: [
      { id: 'menemukan', en: 'discover' },
      { id: 'melawan', en: 'fight' },
      { id: 'menyelamatkan', en: 'rescue' },
      { id: 'menjelajahi', en: 'explore' },
      { id: 'terbang', en: 'fly' },
      { id: 'menghilang', en: 'disappear' },
      { id: 'berubah', en: 'transform' },
      { id: 'mencari', en: 'search' },
      { id: 'berlari', en: 'run' },
      { id: 'melompat', en: 'jump' },
    ],
  },
]

const STRUCTURE_GUIDE = {
  id: {
    title: '📖 Struktur Cerita (Panduan)',
    sections: [
      { emoji: '1️⃣', title: 'Pembukaan', desc: 'Kenalkan tokoh & tempat cerita' },
      { emoji: '2️⃣', title: 'Masalah', desc: 'Ada tantangan atau konflik yang muncul' },
      { emoji: '3️⃣', title: 'Petualangan', desc: 'Tokoh mencoba menyelesaikan masalah' },
      { emoji: '4️⃣', title: 'Klimaks', desc: 'Bagian paling seru dan menegangkan!' },
      { emoji: '5️⃣', title: 'Penyelesaian', desc: 'Masalah terselesaikan & cerita berakhir' },
    ],
  },
  en: {
    title: '📖 Story Structure (Guide)',
    sections: [
      { emoji: '1️⃣', title: 'Opening', desc: 'Introduce characters & setting' },
      { emoji: '2️⃣', title: 'Problem', desc: 'A challenge or conflict appears' },
      { emoji: '3️⃣', title: 'Adventure', desc: 'Character tries to solve the problem' },
      { emoji: '4️⃣', title: 'Climax', desc: 'The most exciting and tense part!' },
      { emoji: '5️⃣', title: 'Resolution', desc: 'Problem solved & story ends' },
    ],
  },
}

// PHASE 3: Contextual Writing Tips
const WRITING_TIPS = {
  id: [
    { range: [0, 100], tip: 'Mulai dengan pengenalan tokoh utama yang menarik!' },
    { range: [100, 500], tip: 'Jelaskan setting cerita dengan detail yang hidup!' },
    { range: [500, 1000], tip: 'Waktunya memperkenalkan konflik atau masalah!' },
    { range: [1000, 2500], tip: 'Buat tokoh menghadapi tantangan yang semakin sulit!' },
    { range: [2500, 5000], tip: 'Persiapkan menuju klimaks cerita yang menegangkan!' },
    { range: [5000, 10000], tip: 'Bagian klimaks - buat pembaca terpukau!' },
    { range: [10000, 20000], tip: 'Selesaikan konflik dan berikan ending yang memuaskan!' },
  ],
  en: [
    { range: [0, 100], tip: 'Start with an interesting main character introduction!' },
    { range: [100, 500], tip: 'Describe the setting with vivid details!' },
    { range: [500, 1000], tip: 'Time to introduce a conflict or problem!' },
    { range: [1000, 2500], tip: 'Make your character face increasingly difficult challenges!' },
    { range: [2500, 5000], tip: 'Prepare for the exciting story climax!' },
    { range: [5000, 10000], tip: 'Climax section - captivate your readers!' },
    { range: [10000, 20000], tip: 'Resolve the conflict and provide a satisfying ending!' },
  ],
}

// PHASE 3: Sentence Starters for different story sections
const SENTENCE_STARTERS = {
  id: {
    opening: ['Pada suatu hari...', 'Di sebuah tempat...', 'Ada seorang bernama...', 'Cerita ini dimulai ketika...'],
    problem: ['Tiba-tiba...', 'Namun, suatu hari...', 'Masalah dimulai ketika...', 'Semuanya berubah saat...'],
    action: ['Dengan berani...', 'Tanpa ragu...', 'Dia memutuskan untuk...', 'Perjalanan dimulai...'],
    climax: ['Di saat yang genting...', 'Pertarungan terakhir...', 'Akhirnya...', 'Dengan segala keberanian...'],
    ending: ['Sejak saat itu...', 'Dan mereka hidup...', 'Pelajaran dari cerita ini...', 'Akhirnya semua...'],
  },
  en: {
    opening: ['Once upon a time...', 'In a place...', 'There was someone named...', 'This story begins when...'],
    problem: ['Suddenly...', 'However, one day...', 'The problem started when...', 'Everything changed when...'],
    action: ['Bravely...', 'Without hesitation...', 'They decided to...', 'The journey began...'],
    climax: ['In that critical moment...', 'The final battle...', 'Finally...', 'With all their courage...'],
    ending: ['Since that day...', 'And they lived...', 'The lesson from this story...', 'Finally everything...'],
  },
}

// PHASE 3: Transition Words
const TRANSITION_WORDS = {
  id: {
    time: ['kemudian', 'lalu', 'setelah itu', 'selanjutnya', 'sementara itu', 'pada akhirnya'],
    contrast: ['namun', 'tetapi', 'sebaliknya', 'di sisi lain', 'meskipun begitu'],
    addition: ['selain itu', 'juga', 'bahkan', 'tidak hanya itu', 'lebih dari itu'],
    cause: ['karena', 'oleh karena itu', 'sehingga', 'akibatnya', 'maka'],
  },
  en: {
    time: ['then', 'next', 'after that', 'meanwhile', 'finally', 'eventually'],
    contrast: ['however', 'but', 'on the contrary', 'on the other hand', 'nevertheless'],
    addition: ['furthermore', 'also', 'moreover', 'in addition', 'besides'],
    cause: ['because', 'therefore', 'so', 'as a result', 'thus'],
  },
}

export default function StoryScaffolding({
  language,
  ageGroup,
  onPromptSelect,
  onVocabSelect,
  wordCount,
}: StoryScaffoldingProps) {
  const [showPrompts, setShowPrompts] = useState<boolean>(false)
  const [showVocab, setShowVocab] = useState<boolean>(false)
  const [showStructure, setShowStructure] = useState<boolean>(false)
  const [showSentenceStarters, setShowSentenceStarters] = useState<boolean>(false)
  const [showTransitions, setShowTransitions] = useState<boolean>(false)
  const [currentTip, setCurrentTip] = useState<string>('')

  const currentLang = language === 'en' ? 'en' : 'id'
  const structureContent = STRUCTURE_GUIDE[currentLang]

  // PHASE 3: Get contextual tip based on word count
  useEffect(() => {
    const tips = WRITING_TIPS[currentLang]
    const relevantTip = tips.find(t => wordCount >= t.range[0] && wordCount < t.range[1])
    if (relevantTip) {
      setCurrentTip(relevantTip.tip)
    }
  }, [wordCount, currentLang])

  return (
    <div className="space-y-4">
      {/* PHASE 3: Contextual Writing Tip */}
      {currentTip && (
        <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-pink-500/10 border-2 border-yellow-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Wand2 className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-yellow-300 font-bold mb-1">
                {language === 'en' ? '✨ Writing Tip' : '✨ Tips Menulis'}
              </h4>
              <p className="text-white/80 text-sm">{currentTip}</p>
            </div>
          </div>
        </div>
      )}

      {/* Story Prompts */}
      <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 border border-purple-500/20 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowPrompts(!showPrompts)}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Lightbulb className="h-5 w-5 text-purple-300" />
            </div>
            <div className="text-left">
              <h3 className="text-white/90 font-semibold">
                {language === 'en' ? '💡 Story Starters' : '💡 Pembuka Cerita'}
              </h3>
              <p className="text-white/50 text-xs">
                {language === 'en' ? 'Need inspiration? Try these!' : 'Butuh inspirasi? Coba ini!'}
              </p>
            </div>
          </div>
          {showPrompts ? (
            <ChevronUp className="h-5 w-5 text-white/60" />
          ) : (
            <ChevronDown className="h-5 w-5 text-white/60" />
          )}
        </button>

        {showPrompts && (
          <div className="p-4 pt-0 space-y-2">
            <div className="grid gap-2">
              {STORY_PROMPTS.map((prompt, index) => (
                <Button
                  key={index}
                  type="button"
                  onClick={() => onPromptSelect(language === 'en' ? prompt.textEn : prompt.textId)}
                  variant="ghost"
                  className="justify-start text-left h-auto py-3 px-4 bg-black/30 hover:bg-purple-500/20 border border-white/10 hover:border-purple-500/30 text-white/80 hover:text-white"
                >
                  <Sparkles className="h-4 w-4 mr-2 text-purple-300 flex-shrink-0" />
                  <span className="text-sm">
                    {language === 'en' ? prompt.textEn : prompt.textId}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Structure Guide */}
      <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowStructure(!showStructure)}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <BookOpen className="h-5 w-5 text-cyan-300" />
            </div>
            <div className="text-left">
              <h3 className="text-white/90 font-semibold">{structureContent.title}</h3>
              <p className="text-white/50 text-xs">
                {language === 'en' ? 'Follow this simple guide' : 'Ikuti panduan sederhana ini'}
              </p>
            </div>
          </div>
          {showStructure ? (
            <ChevronUp className="h-5 w-5 text-white/60" />
          ) : (
            <ChevronDown className="h-5 w-5 text-white/60" />
          )}
        </button>

        {showStructure && (
          <div className="p-4 pt-0 space-y-3">
            {structureContent.sections.map((section, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-black/30 border border-white/10 rounded-lg"
              >
                <span className="text-2xl flex-shrink-0">{section.emoji}</span>
                <div>
                  <h4 className="text-white/90 font-semibold text-sm">{section.title}</h4>
                  <p className="text-white/60 text-xs mt-1">{section.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PHASE 3: Sentence Starters */}
      <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-500/20 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowSentenceStarters(!showSentenceStarters)}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <MessageSquare className="h-5 w-5 text-green-300" />
            </div>
            <div className="text-left">
              <h3 className="text-white/90 font-semibold">
                {language === 'en' ? '🚀 Sentence Starters' : '🚀 Kalimat Pembuka'}
              </h3>
              <p className="text-white/50 text-xs">
                {language === 'en' ? 'Start your sentences easily' : 'Mulai kalimat dengan mudah'}
              </p>
            </div>
          </div>
          {showSentenceStarters ? (
            <ChevronUp className="h-5 w-5 text-white/60" />
          ) : (
            <ChevronDown className="h-5 w-5 text-white/60" />
          )}
        </button>

        {showSentenceStarters && (
          <div className="p-4 pt-0 space-y-3">
            {Object.entries(SENTENCE_STARTERS[currentLang]).map(([section, starters], idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                  {section}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(starters as string[]).map((starter, index) => (
                    <Badge
                      key={index}
                      onClick={() => onVocabSelect(starter)}
                      className="cursor-pointer bg-black/30 hover:bg-green-500/20 border border-white/20 hover:border-green-500/30 text-white/80 hover:text-white text-xs px-3 py-1.5 transition-all"
                    >
                      {starter}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PHASE 3: Transition Words */}
      <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowTransitions(!showTransitions)}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <ArrowRight className="h-5 w-5 text-blue-300" />
            </div>
            <div className="text-left">
              <h3 className="text-white/90 font-semibold">
                {language === 'en' ? '🔗 Transition Words' : '🔗 Kata Penghubung'}
              </h3>
              <p className="text-white/50 text-xs">
                {language === 'en' ? 'Connect your ideas smoothly' : 'Hubungkan ide dengan lancar'}
              </p>
            </div>
          </div>
          {showTransitions ? (
            <ChevronUp className="h-5 w-5 text-white/60" />
          ) : (
            <ChevronDown className="h-5 w-5 text-white/60" />
          )}
        </button>

        {showTransitions && (
          <div className="p-4 pt-0 space-y-3">
            {Object.entries(TRANSITION_WORDS[currentLang]).map(([category, words], idx) => (
              <div key={idx} className="space-y-2">
                <h4 className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                  {category === 'time' && (language === 'en' ? 'Time' : 'Waktu')}
                  {category === 'contrast' && (language === 'en' ? 'Contrast' : 'Perbedaan')}
                  {category === 'addition' && (language === 'en' ? 'Addition' : 'Tambahan')}
                  {category === 'cause' && (language === 'en' ? 'Cause/Effect' : 'Sebab/Akibat')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(words as string[]).map((word, index) => (
                    <Badge
                      key={index}
                      onClick={() => onVocabSelect(word)}
                      className="cursor-pointer bg-black/30 hover:bg-blue-500/20 border border-white/20 hover:border-blue-500/30 text-white/80 hover:text-white text-xs px-3 py-1.5 transition-all"
                    >
                      {word}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vocabulary Helpers */}
      <div className="bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-pink-500/10 border border-yellow-500/20 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowVocab(!showVocab)}
          className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Sparkles className="h-5 w-5 text-yellow-300" />
            </div>
            <div className="text-left">
              <h3 className="text-white/90 font-semibold">
                {language === 'en' ? '✨ Word Ideas' : '✨ Ide Kata-Kata'}
              </h3>
              <p className="text-white/50 text-xs">
                {language === 'en' ? 'Make your story more exciting!' : 'Buat cerita lebih seru!'}
              </p>
            </div>
          </div>
          {showVocab ? (
            <ChevronUp className="h-5 w-5 text-white/60" />
          ) : (
            <ChevronDown className="h-5 w-5 text-white/60" />
          )}
        </button>

        {showVocab && (
          <div className="p-4 pt-0 space-y-4">
            {VOCABULARY_HELPERS.map((category, catIndex) => (
              <div key={catIndex} className="space-y-2">
                <h4 className="text-white/80 font-semibold text-sm flex items-center gap-2">
                  {language === 'en' ? category.categoryEn : category.category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {category.words.map((word, wordIndex) => (
                    <Badge
                      key={wordIndex}
                      onClick={() => onVocabSelect(language === 'en' ? word.en : word.id)}
                      className="cursor-pointer bg-black/30 hover:bg-yellow-500/20 border border-white/20 hover:border-yellow-500/30 text-white/80 hover:text-white text-xs px-3 py-1.5 transition-all"
                    >
                      {language === 'en' ? word.en : word.id}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Encouragement Message */}
      <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-lg p-3">
        <p className="text-white/70 text-xs text-center">
          💚 {language === 'en' 
            ? 'Remember: There are no wrong stories! Let your imagination flow freely! 🌈' 
            : 'Ingat: Tidak ada cerita yang salah! Biarkan imajinasimu mengalir bebas! 🌈'}
        </p>
      </div>
    </div>
  )
}
