'use client'

import { useState, useEffect } from 'react'
import { useTextToSpeech } from '@/hooks/useTextToSpeech'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Play, Pause, Square, Volume2, Settings, Mic, Smartphone } from 'lucide-react'

interface TextToSpeechProps {
  text: string
  className?: string
  onRateChange?: (rate: number) => void
}

export default function TextToSpeech({ text, className = '', onRateChange }: TextToSpeechProps) {
  const {
    speak,
    stop,
    pause,
    resume,
    isSupported,
    isSpeaking,
    isPaused,
    voices,
    setVoice,
    setRate,
    setPitch,
    setVolume,
    setLanguage,
    isNativeAndroid
  } = useTextToSpeech({
    rate: 0.9,
    pitch: 1.1,
    volume: 1,
    language: 'id'
  })

  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<string>('0')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('id')
  const [showSettings, setShowSettings] = useState<boolean>(false)
  const [currentRate, setCurrentRate] = useState<number>(0.9)
  const [currentPitch, setCurrentPitch] = useState<number>(1.1)
  const [currentVolume, setCurrentVolume] = useState<number>(1)
  const [speedPreset, setSpeedPreset] = useState<string>('normal')

  // Speed presets
  const speedPresets = {
    'slow': { rate: 0.6, label: '🐢 Pelan', emoji: '🐢' },
    'normal': { rate: 0.9, label: '🚶 Normal', emoji: '🚶' },
    'fast': { rate: 1.3, label: '🏃 Cepat', emoji: '🏃' },
    'turbo': { rate: 1.7, label: '🚀 Turbo', emoji: '🚀' }
  }

  // Find Indonesian and English voices (for Web Speech API)
  const indonesianVoices = voices.filter(voice => voice.lang.startsWith('id'))
  const englishVoices = voices.filter(voice => voice.lang.startsWith('en'))
  const preferredVoices = voices.filter(voice => 
    voice.lang.startsWith('id') || voice.lang.startsWith('en')
  )
  const availableVoices = preferredVoices.length > 0 ? preferredVoices : voices

  // Auto-switch voice when language changes
  useEffect(() => {
    if (!isNativeAndroid && voices.length > 0) {
      let targetVoice: SpeechSynthesisVoice | null = null
      
      if (selectedLanguage === 'id') {
        // Find best Indonesian voice
        targetVoice = indonesianVoices.find(v => v.lang === 'id-ID') || 
                     indonesianVoices[0] || 
                     null
      } else if (selectedLanguage === 'en') {
        // Find best English voice (prioritize en-US, then en-GB)
        targetVoice = englishVoices.find(v => v.lang === 'en-US') ||
                     englishVoices.find(v => v.lang === 'en-GB') ||
                     englishVoices[0] ||
                     null
      }
      
      if (targetVoice && availableVoices.length > 0) {
        const voiceIndex = availableVoices.indexOf(targetVoice)
        if (voiceIndex >= 0) {
          setSelectedVoiceIndex(voiceIndex.toString())
          setVoice(targetVoice)
          console.log(`🎤 Auto-switched to ${targetVoice.name} (${targetVoice.lang}) for ${selectedLanguage}`)
        }
      }
    }
  }, [selectedLanguage, voices, availableVoices, setVoice, isNativeAndroid, indonesianVoices, englishVoices])

  const handlePlay = (): void => {
    if (!text.trim()) return
    
    // Set language before speaking
    setLanguage(selectedLanguage)
    
    // Strip markdown formatting for TTS (remove **, *, _, etc.)
    const cleanText = text
      .replace(/\*\*\[(.*?)\]\*\*/g, '$1') // Remove **[title]**
      .replace(/\*\*(.*?)\*\*/g, '$1')     // Remove **bold**
      .replace(/\*(.*?)\*/g, '$1')         // Remove *italic*
      .replace(/_(.*?)_/g, '$1')           // Remove _underline_
      .replace(/#{1,6}\s/g, '')            // Remove markdown headers
      .replace(/`{1,3}(.*?)`{1,3}/g, '$1') // Remove code blocks
    speak(cleanText)
  }

  const handlePauseResume = (): void => {
    if (isPaused) {
      resume()
    } else {
      pause()
    }
  }

  const handleVoiceChange = (index: string): void => {
    setSelectedVoiceIndex(index)
    const voiceIndex = parseInt(index)
    if (availableVoices[voiceIndex]) {
      setVoice(availableVoices[voiceIndex])
    }
  }

  const handleLanguageChange = (lang: string): void => {
    setSelectedLanguage(lang)
    setLanguage(lang)
    
    // Stop current speech when changing language
    if (isSpeaking) {
      stop()
    }
  }

  const handleRateChange = (value: number[]): void => {
    const newRate = value[0]
    setCurrentRate(newRate)
    setRate(newRate)
    if (onRateChange) {
      onRateChange(newRate)
    }
  }

  const handlePitchChange = (value: number[]): void => {
    const newPitch = value[0]
    setCurrentPitch(newPitch)
    setPitch(newPitch)
  }

  const handleVolumeChange = (value: number[]): void => {
    const newVolume = value[0]
    setCurrentVolume(newVolume)
    setVolume(newVolume)
  }

  const handleSpeedPreset = (preset: string): void => {
    setSpeedPreset(preset)
    const speed = speedPresets[preset as keyof typeof speedPresets].rate
    setCurrentRate(speed)
    setRate(speed)
    if (onRateChange) {
      onRateChange(speed)
    }
  }

  if (!isSupported) {
    return (
      <Card className={`bg-yellow-500/20 border-yellow-500/50 ${className}`}>
        <CardContent className="p-4 space-y-3">
          <div className="text-center">
            <div className="text-2xl mb-2">🔇</div>
            <p className="text-yellow-200 text-sm font-medium mb-2">
              Text-to-Speech tidak tersedia
            </p>
            <p className="text-yellow-200/80 text-xs">
              Browser atau WebView Anda tidak mendukung fitur suara. 
            </p>
          </div>
          <div className="bg-black/30 rounded-lg p-3 space-y-2">
            <p className="text-white/70 text-xs font-medium">📱 Untuk pengguna Android:</p>
            <ul className="text-white/60 text-xs space-y-1 list-disc list-inside">
              <li>Pastikan aplikasi sudah mengimplementasi Native Android TTS</li>
              <li>Update aplikasi ke versi terbaru</li>
              <li>Restart aplikasi setelah update</li>
            </ul>
          </div>
          <p className="text-yellow-200/60 text-xs text-center">
            💡 Tip: Anda tetap bisa membaca cerita tanpa fitur suara!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`bg-black/20 backdrop-blur-md border border-cyan-500/30 ${className}`}>
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent flex items-center space-x-2">
            <Mic className="h-5 w-5 text-cyan-400" />
            <span>🎙️ Story Reader</span>
            {isNativeAndroid && (
              <span className="flex items-center text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full border border-green-500/50">
                <Smartphone className="h-3 w-3 mr-1" />
                Native
              </span>
            )}
            {!isNativeAndroid && isSupported && (
              <span className="flex items-center text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-500/50">
                🌐 Web
              </span>
            )}
          </h3>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-white/60 hover:text-white hover:bg-white/10"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Language Selection */}
        <div className="flex items-center justify-center space-x-2">
          <span className="text-white/70 text-sm">🌐 Bahasa:</span>
          <div className="flex space-x-2">
            <Button
              variant={selectedLanguage === 'id' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleLanguageChange('id')}
              className={selectedLanguage === 'id' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
              }
            >
              🇮🇩 Indonesia
            </Button>
            <Button
              variant={selectedLanguage === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleLanguageChange('en')}
              className={selectedLanguage === 'en' 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' 
                : 'border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
              }
            >
              🇬🇧 English
            </Button>
          </div>
        </div>

        {/* Main Controls - Vertical on Mobile, Horizontal on Desktop */}
        <div className="flex flex-col items-stretch space-y-2 md:flex-row md:items-center md:justify-center md:space-y-0 md:space-x-3">
          <Button
            onClick={handlePlay}
            disabled={!text.trim() || isSpeaking}
            className="w-full md:w-auto bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transform transition-all duration-200 hover:scale-105"
            size="lg"
          >
            <Play className="h-5 w-5 mr-2" />
            🎵 Mulai Baca
          </Button>

          {isSpeaking && (
            <>
              <Button
                onClick={handlePauseResume}
                className="w-full md:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white transform transition-all duration-200 hover:scale-105"
                size="lg"
              >
                {isPaused ? (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    ▶️ Lanjut
                  </>
                ) : (
                  <>
                    <Pause className="h-5 w-5 mr-2" />
                    ⏸️ Jeda
                  </>
                )}
              </Button>

              <Button
                onClick={stop}
                className="w-full md:w-auto bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white transform transition-all duration-200 hover:scale-105"
                size="lg"
              >
                <Square className="h-5 w-5 mr-2" />
                ⏹️ Stop
              </Button>
            </>
          )}
        </div>

        {/* Status */}
        <div className="text-center">
          {isSpeaking ? (
            <p className="text-green-400 text-sm animate-pulse">
              🎵 {isPaused ? 'Dijeda...' : 'Sedang membaca cerita...'}
            </p>
          ) : (
            <p className="text-white/60 text-sm">
              💬 Klik "Mulai Baca" untuk mendengar cerita
            </p>
          )}
          {isNativeAndroid && (
            <p className="text-cyan-400 text-xs mt-1">
              ⚡ Menggunakan Native Android TTS (No permissions needed!)
            </p>
          )}
        </div>

        {/* Speed Preset Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(speedPresets).map(([key, preset]) => (
            <Button
              key={key}
              onClick={() => handleSpeedPreset(key)}
              variant={speedPreset === key ? "default" : "outline"}
              className={`text-xs transition-all duration-200 hover:scale-105 ${
                speedPreset === key 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-400" 
                  : "border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
              }`}
              size="sm"
            >
              <span className="mr-1">{preset.emoji}</span>
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Advanced Settings */}
        {showSettings && (
          <div className="space-y-4 pt-4 border-t border-white/20">
            <div className="space-y-3">
              {/* Voice Selection (only for Web Speech API) */}
              {!isNativeAndroid && availableVoices.length > 0 && (
                <div className="space-y-2">
                  <label className="text-white text-sm font-medium">🗣️ Pilih Suara:</label>
                  <Select
                    value={selectedVoiceIndex}
                    onValueChange={handleVoiceChange}
                  >
                    <SelectTrigger className="bg-black/30 border-cyan-500/50 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-cyan-500/50">
                      {availableVoices.map((voice, index) => (
                        <SelectItem 
                          key={index} 
                          value={index.toString()}
                          className="text-white hover:bg-cyan-500/20"
                        >
                          {voice.name} ({voice.lang})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {isNativeAndroid && (
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                  <p className="text-cyan-300 text-xs">
                    ℹ️ Menggunakan suara sistem Android. Voice selection tidak tersedia untuk Native TTS.
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-white text-sm font-medium">
                  ⚡ Kecepatan: {currentRate.toFixed(1)}x
                </label>
                <Slider
                  value={[currentRate]}
                  onValueChange={handleRateChange}
                  min={0.1}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white text-sm font-medium">
                  🎵 Nada Suara: {currentPitch.toFixed(1)}
                </label>
                <Slider
                  value={[currentPitch]}
                  onValueChange={handlePitchChange}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-white text-sm font-medium flex items-center">
                  <Volume2 className="h-4 w-4 mr-1" />
                  Volume: {Math.round(currentVolume * 100)}%
                </label>
                <Slider
                  value={[currentVolume]}
                  onValueChange={handleVolumeChange}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
