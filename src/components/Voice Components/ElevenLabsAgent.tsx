'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, MicOff, Send, X, Volume2, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import AudioVisualizer from '@/components/AudioVisualizer';

interface Message {
  role: 'user' | 'agent';
  text: string;
  timestamp: number;
}

interface ElevenLabsAgentProps {
  onClose: () => void;
}

export default function ElevenLabsAgent({ onClose }: ElevenLabsAgentProps) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputText, setInputText] = useState('');
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session on mount
  useEffect(() => {
    createSession();
    
    // Cleanup on unmount
    return () => {
      if (sessionId) {
        endSession(sessionId);
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const createSession = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      
      const response = await fetch('/api/elevenlabs/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-signed-url' }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Session creation error:', data);
        throw new Error(data.details || data.error || 'Failed to create session');
      }

      console.log('Session created:', data);
      setSessionId(data.conversation_id);
      
      setMessages([
        {
          role: 'agent',
          text: '👋 Halo! Aku AI Story Agent dari Neon Tales! Ayo ngobrol tentang cerita seru! 🌟',
          timestamp: Date.now(),
        },
      ]);
    } catch (err) {
      console.error('Failed to create session:', err);
      setError('Gagal membuat sesi. Coba lagi ya!');
    } finally {
      setIsProcessing(false);
    }
  };

  const endSession = async (id: string) => {
    try {
      await fetch('/api/elevenlabs/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'end-session', sessionId: id }),
      });
    } catch (err) {
      console.error('Failed to end session:', err);
    }
  };

  const sendMessage = async (text: string) => {
    if (!sessionId || !text.trim()) return;

    try {
      setIsProcessing(true);
      setError(null);

      // Add user message
      const userMessage: Message = {
        role: 'user',
        text: text.trim(),
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setInputText('');

      // Send to agent
      const response = await fetch('/api/elevenlabs/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send-message',
          sessionId,
          text: text.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const data = await response.json();

      // Add agent message (placeholder until we play audio)
      const agentMessage: Message = {
        role: 'agent',
        text: '🔊 Mendengarkan jawaban...',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, agentMessage]);

      // Play audio response
      if (data.audio) {
        playAudio(data.audio);
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Gagal mengirim pesan. Coba lagi ya!');
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = (audioData: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(audioData);
    audioRef.current = audio;

    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => {
      setIsPlaying(false);
      // Update the last message to show it's done
      setMessages((prev) => {
        const updated = [...prev];
        if (updated[updated.length - 1].role === 'agent') {
          updated[updated.length - 1].text = '✅ Jawaban sudah diputar!';
        }
        return updated;
      });
    };
    audio.onerror = () => {
      setIsPlaying(false);
      setError('Gagal memutar audio. Coba lagi ya!');
    };

    audio.play().catch((err) => {
      console.error('Audio play error:', err);
      setError('Gagal memutar audio.');
    });
  };

  const startVoiceRecognition = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Browser kamu tidak support voice recognition 😢');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'id-ID';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      sendMessage(transcript);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      setError('Gagal mendengarkan suara. Coba lagi ya!');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gradient-to-br from-purple-900/40 via-pink-900/40 to-blue-900/40 backdrop-blur-xl border-2 border-purple-500/50 shadow-2xl animate__animated animate__fadeIn">
      <CardHeader className="relative border-b border-purple-500/30">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl md:text-3xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
            <Volume2 className="h-7 w-7 text-purple-400" />
            AI Story Agent
          </CardTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-white/70 text-sm mt-2">
          🎤 Ngobrol langsung dengan AI Agent tentang cerita seru! Gunakan suara atau ketik pesan.
        </p>
      </CardHeader>

      <CardContent className="p-4 md:p-6 space-y-4">
        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm animate__animated animate__shakeX">
            ⚠️ {error}
          </div>
        )}

        {/* Messages Area */}
        <div className="h-[400px] overflow-y-auto space-y-3 bg-black/20 rounded-lg p-4 border border-white/10">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate__animated animate__fadeIn`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  msg.role === 'user'
                    ? 'bg-blue-500/30 border border-blue-400/50 text-white'
                    : 'bg-purple-500/30 border border-purple-400/50 text-white'
                }`}
              >
                <p className="text-sm font-medium mb-1">
                  {msg.role === 'user' ? '👤 Kamu' : '🤖 Agent'}
                </p>
                <p className="text-white/90">{msg.text}</p>
                <p className="text-xs text-white/50 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Audio Visualizer */}
        {isPlaying && (
          <div className="bg-black/30 rounded-lg p-4 border border-green-500/30">
            <AudioVisualizer isActive={isPlaying} />
            <p className="text-center text-green-300 text-sm mt-2">🔊 Sedang memutar jawaban...</p>
          </div>
        )}

        {/* Input Area */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(inputText);
                }
              }}
              placeholder="Ketik pesanmu di sini..."
              disabled={isProcessing || !sessionId}
              className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-purple-500"
            />
            <Button
              onClick={() => sendMessage(inputText)}
              disabled={isProcessing || !inputText.trim() || !sessionId}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Voice Button */}
          <Button
            onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
            disabled={isProcessing || !sessionId}
            className={`w-full ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-green-500 hover:bg-green-600'
            } text-white font-bold py-6`}
          >
            {isListening ? (
              <>
                <MicOff className="h-6 w-6 mr-2" />
                🎤 Stop Recording
              </>
            ) : (
              <>
                <Mic className="h-6 w-6 mr-2" />
                🎤 Tekan untuk Bicara
              </>
            )}
          </Button>
        </div>

        {/* Info */}
        <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
          <p className="text-cyan-200 text-sm">
            💡 <strong>Tips:</strong> Tanya tentang cerita favorit, minta rekomendasi, atau ngobrol tentang
            karakter seru!
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
