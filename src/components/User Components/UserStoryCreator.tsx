'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Volume2, VolumeX, Loader2, Sparkles, X } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface VoiceStoryModeProps {
  language?: 'id' | 'en';
  ageGroup?: '3-5' | '6-8' | '9-12';
  onClose?: () => void;
}

export default function VoiceStoryMode({ 
  language = 'id', 
  ageGroup = '6-8',
  onClose 
}: VoiceStoryModeProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [error, setError] = useState('');

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'id' ? 'id-ID' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleVoiceInput(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setError('Maaf, tidak bisa mendengar. Coba lagi ya!');
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Send initial greeting
    sendInitialGreeting();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const sendInitialGreeting = async () => {
    const greetingMessage: Message = {
      role: 'assistant',
      content: language === 'id' 
        ? 'Halo! Aku senang bisa bercerita denganmu hari ini! Mau cerita tentang apa? Kamu bisa bilang pakai suara atau ketik di bawah ya! 🌟'
        : 'Hello! I\'m excited to tell you a story today! What would you like a story about? You can tell me using your voice or type below! 🌟',
      timestamp: Date.now(),
    };
    
    setMessages([greetingMessage]);
    await speakText(greetingMessage.content);
  };

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setError('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error('Failed to start recognition:', err);
        setError('Tidak bisa mulai mendengar. Coba lagi!');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleVoiceInput = async (transcript: string) => {
    if (!transcript.trim()) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: transcript,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsListening(false);
    setIsProcessing(true);

    try {
      // Call Gemini API
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          ageGroup,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const assistantText = data.fullText || data.response.text;

      // Add assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: assistantText,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Speak the response
      await speakText(assistantText);
    } catch (err: any) {
      console.error('Error getting response:', err);
      setError('Maaf, ada masalah. Coba lagi ya!');
    } finally {
      setIsProcessing(false);
    }
  };

  const speakText = async (text: string) => {
    setIsSpeaking(true);

    try {
      // Call ElevenLabs TTS
      const response = await fetch('/api/elevenlabs/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate speech');
      }

      const data = await response.json();
      
      // Convert base64 to audio blob
      const audioBlob = base64ToBlob(data.audio, 'audio/mpeg');
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play audio
      if (audioRef.current) {
        audioRef.current.pause();
      }

      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audioRef.current.play();
    } catch (err: any) {
      console.error('TTS error:', err);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsSpeaking(false);
    }
  };

  const base64ToBlob = (base64: string, contentType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-black/30 backdrop-blur-md border border-purple-500/30 shadow-2xl animate__animated animate__fadeIn">
      <CardContent className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                🎤 Voice Story Mode
              </h2>
              <p className="text-white/60 text-sm">
                {language === 'id' ? 'Berbicara dengan AI Storyteller' : 'Talk to AI Storyteller'}
              </p>
            </div>
          </div>
          {onClose && (
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-white/60 hover:text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Conversation Display */}
        <div className="bg-black/20 rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate__animated animate__fadeInUp`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.role === 'user'
                    ? 'bg-blue-500/20 border border-blue-400/30 text-blue-100'
                    : 'bg-purple-500/20 border border-purple-400/30 text-purple-100'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs text-white/40 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="flex justify-start animate__animated animate__fadeInUp">
              <div className="bg-purple-500/20 border border-purple-400/30 p-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-purple-300" />
                  <span className="text-sm text-purple-200">
                    {language === 'id' ? 'Sedang berpikir...' : 'Thinking...'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Audio Visualizer */}
        {isSpeaking && (
          <AudioVisualizer 
            isActive={isSpeaking}
            className="animate__animated animate__fadeIn"
          />
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 animate__animated animate__shakeX">
            <p className="text-red-200 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Voice Controls */}
        <div className="flex items-center justify-center space-x-4">
          {/* Mic Button */}
          <Button
            onClick={isListening ? stopListening : startListening}
            disabled={isSpeaking || isProcessing}
            className={`relative h-20 w-20 rounded-full transition-all duration-300 ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 animate__animated animate__pulse animate__infinite'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
            }`}
          >
            {isListening ? (
              <MicOff className="h-8 w-8 text-white" />
            ) : (
              <Mic className="h-8 w-8 text-white" />
            )}
          </Button>

          {/* Speaker Button */}
          <Button
            onClick={isSpeaking ? stopSpeaking : () => {}}
            disabled={!isSpeaking}
            variant="outline"
            className="h-16 w-16 rounded-full border-2 border-cyan-500/50 bg-black/30 hover:bg-cyan-500/20"
          >
            {isSpeaking ? (
              <Volume2 className="h-6 w-6 text-cyan-300 animate__animated animate__pulse animate__infinite" />
            ) : (
              <VolumeX className="h-6 w-6 text-white/40" />
            )}
          </Button>
        </div>

        {/* Instructions */}
        <div className="text-center space-y-2">
          <p className="text-white/80 text-sm font-medium">
            {isListening 
              ? (language === 'id' ? '🎤 Bicara sekarang...' : '🎤 Speak now...')
              : (language === 'id' ? '💡 Tekan tombol mikrofon untuk mulai bicara' : '💡 Press the microphone to start speaking')
            }
          </p>
          <p className="text-white/50 text-xs">
            {language === 'id' 
              ? 'Contoh: "Ceritakan tentang naga yang baik hati"'
              : 'Example: "Tell me about a kind dragon"'
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
