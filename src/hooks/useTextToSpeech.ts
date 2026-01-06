'use client'

import { useState, useEffect, useCallback } from 'react'

// Extend window interface for Android TTS bridge
declare global {
  interface Window {
    AndroidTTS?: {
      speak: (text: string, language: string) => void
      stop: () => void
      pause: () => void
      resume: () => void
      isAvailable: () => boolean
      setRate: (rate: number) => void
      setPitch: (pitch: number) => void
      setVolume: (volume: number) => void
      getLanguage: () => string
    }
  }
}

interface UseTextToSpeechOptions {
  rate?: number
  pitch?: number
  volume?: number
  voice?: SpeechSynthesisVoice | null
  language?: string
}

interface UseTextToSpeechReturn {
  speak: (text: string) => void
  stop: () => void
  pause: () => void
  resume: () => void
  isSupported: boolean
  isSpeaking: boolean
  isPaused: boolean
  voices: SpeechSynthesisVoice[]
  setVoice: (voice: SpeechSynthesisVoice | null) => void
  setRate: (rate: number) => void
  setPitch: (pitch: number) => void
  setVolume: (volume: number) => void
  setLanguage: (lang: string) => void
  isNativeAndroid: boolean
}

export function useTextToSpeech(options: UseTextToSpeechOptions = {}): UseTextToSpeechReturn {
  const [isSupported, setIsSupported] = useState<boolean>(false)
  const [isNativeAndroid, setIsNativeAndroid] = useState<boolean>(false)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
  const [isPaused, setIsPaused] = useState<boolean>(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voice, setVoiceState] = useState<SpeechSynthesisVoice | null>(options.voice || null)
  const [rate, setRateState] = useState<number>(options.rate || 1)
  const [pitch, setPitchState] = useState<number>(options.pitch || 1)
  const [volume, setVolumeState] = useState<number>(options.volume || 1)
  const [language, setLanguageState] = useState<string>(options.language || 'id')

  // Check if Android TTS or Web Speech API is supported
  useEffect(() => {
    if (typeof window === 'undefined') return

    console.log('🔍 TTS Detection Starting...')
    console.log('Window object:', typeof window)
    console.log('AndroidTTS available:', typeof window.AndroidTTS)
    console.log('speechSynthesis available:', typeof window.speechSynthesis)

    // Check for native Android TTS first (priority)
    if (typeof window.AndroidTTS !== 'undefined') {
      console.log('🤖 AndroidTTS object found, checking availability...')
      try {
        const isAvailable = window.AndroidTTS.isAvailable()
        console.log('AndroidTTS.isAvailable() returned:', isAvailable)
        if (isAvailable) {
          console.log('✅ Native Android TTS detected and available')
          setIsNativeAndroid(true)
          setIsSupported(true)
          return
        } else {
          console.warn('⚠️ AndroidTTS exists but isAvailable() returned false')
        }
      } catch (err) {
        console.error('❌ Native Android TTS check failed:', err)
        console.log('Falling back to Web Speech API')
      }
    } else {
      console.log('ℹ️ AndroidTTS not found (expected if not in native app)')
    }

    // Fallback to Web Speech API
    if ('speechSynthesis' in window) {
      console.log('🌐 Web Speech API detected')
      
      // Test if it actually works (some browsers have it but blocked)
      try {
        const test = window.speechSynthesis.getVoices()
        console.log('Available voices:', test.length)
        setIsNativeAndroid(false)
        setIsSupported(true)
      } catch (err) {
        console.error('❌ Web Speech API found but blocked:', err)
        setIsSupported(false)
      }
      
      // Load voices for Web Speech API
      const loadVoices = (): void => {
        const availableVoices = window.speechSynthesis.getVoices()
        setVoices(availableVoices)
        
        // Set default voice to Indonesian or English if available
        if (availableVoices.length > 0 && !voice) {
          const indonesianVoice = availableVoices.find((v: SpeechSynthesisVoice) => 
            v.lang.startsWith('id')
          )
          const englishVoice = availableVoices.find((v: SpeechSynthesisVoice) => 
            v.lang.startsWith('en')
          )
          setVoiceState(indonesianVoice || englishVoice || availableVoices[0])
        }
      }

      loadVoices()
      
      // Some browsers load voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices
      }

      return () => {
        if (window.speechSynthesis) {
          window.speechSynthesis.onvoiceschanged = null
        }
      }
    } else {
      console.error('❌ No TTS available (neither Android nor Web Speech API)')
      console.log('This is common in WebView without native bridge implementation')
      setIsSupported(false)
    }

    console.log('🔍 TTS Detection Complete')
    console.log('Final state - isSupported:', isSupported, 'isNativeAndroid:', isNativeAndroid)
  }, [voice])

  const speak = useCallback((text: string): void => {
    console.log('🎙️ Speak function called')
    console.log('isSupported:', isSupported)
    console.log('text length:', text?.length || 0)
    console.log('isNativeAndroid:', isNativeAndroid)
    
    if (!isSupported || !text) {
      console.warn('⚠️ Cannot speak: isSupported=', isSupported, 'text=', !!text)
      return
    }

    // Use Native Android TTS if available
    if (isNativeAndroid && window.AndroidTTS) {
      console.log('🤖 Using Native Android TTS')
      try {
        // Stop any existing speech first
        window.AndroidTTS.stop()
        
        // Set parameters
        window.AndroidTTS.setRate(rate)
        window.AndroidTTS.setPitch(pitch)
        window.AndroidTTS.setVolume(volume)
        
        console.log(`Calling AndroidTTS.speak with language: ${language}, rate: ${rate}`)
        // Speak with language parameter
        window.AndroidTTS.speak(text, language)
        
        setIsSpeaking(true)
        setIsPaused(false)
        
        console.log(`✅ Speaking with Native Android TTS (${language})`)
        return
      } catch (err) {
        console.error('❌ Android TTS error:', err)
        alert(`Android TTS Error: ${err}`)
      }
    }

    // Fallback to Web Speech API
    console.log('🌐 Using Web Speech API fallback')
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel()
      } catch (err) {
        console.error('Error canceling speech:', err)
      }

      const utterance = new SpeechSynthesisUtterance(text)
      
      if (voice) {
        utterance.voice = voice
      }
      
      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = volume
      utterance.lang = language === 'id' ? 'id-ID' : 'en-US'

      utterance.onstart = () => {
        setIsSpeaking(true)
        setIsPaused(false)
      }

      utterance.onend = () => {
        setIsSpeaking(false)
        setIsPaused(false)
      }

      utterance.onerror = () => {
        setIsSpeaking(false)
        setIsPaused(false)
      }

      utterance.onpause = () => {
        setIsPaused(true)
      }

      utterance.onresume = () => {
        setIsPaused(false)
      }

      try {
        window.speechSynthesis.speak(utterance)
        console.log('✅ Speaking with Web Speech API')
      } catch (err) {
        console.error('❌ Web Speech API error:', err)
        alert(`Web Speech API Error: ${err}`)
        setIsSpeaking(false)
      }
    } else {
      console.error('❌ speechSynthesis not available')
      alert('Text-to-Speech tidak tersedia di browser/WebView ini')
    }
  }, [isSupported, isNativeAndroid, voice, rate, pitch, volume, language])

  const stop = useCallback((): void => {
    if (!isSupported) return
    
    // Use Native Android TTS if available
    if (isNativeAndroid && window.AndroidTTS) {
      try {
        window.AndroidTTS.stop()
        setIsSpeaking(false)
        setIsPaused(false)
        return
      } catch (err) {
        console.error('Android TTS stop error:', err)
      }
    }
    
    // Fallback to Web Speech API
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setIsPaused(false)
    }
  }, [isSupported, isNativeAndroid])

  const pause = useCallback((): void => {
    if (!isSupported) return
    
    // Use Native Android TTS if available
    if (isNativeAndroid && window.AndroidTTS) {
      try {
        window.AndroidTTS.pause()
        setIsPaused(true)
        return
      } catch (err) {
        console.error('Android TTS pause error:', err)
      }
    }
    
    // Fallback to Web Speech API
    if (window.speechSynthesis) {
      window.speechSynthesis.pause()
      setIsPaused(true)
    }
  }, [isSupported, isNativeAndroid])

  const resume = useCallback((): void => {
    if (!isSupported) return
    
    // Use Native Android TTS if available
    if (isNativeAndroid && window.AndroidTTS) {
      try {
        window.AndroidTTS.resume()
        setIsPaused(false)
        return
      } catch (err) {
        console.error('Android TTS resume error:', err)
      }
    }
    
    // Fallback to Web Speech API
    if (window.speechSynthesis) {
      window.speechSynthesis.resume()
      setIsPaused(false)
    }
  }, [isSupported, isNativeAndroid])

  const setVoice = useCallback((newVoice: SpeechSynthesisVoice | null): void => {
    setVoiceState(newVoice)
  }, [])

  const setRate = useCallback((newRate: number): void => {
    setRateState(Math.max(0.1, Math.min(10, newRate)))
  }, [])

  const setPitch = useCallback((newPitch: number): void => {
    setPitchState(Math.max(0, Math.min(2, newPitch)))
  }, [])

  const setVolume = useCallback((newVolume: number): void => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)))
  }, [])

  const setLanguage = useCallback((lang: string): void => {
    setLanguageState(lang)
  }, [])

  return {
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
  }
}
