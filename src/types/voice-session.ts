/**
 * Voice Session Types
 * 
 * Represents voice conversation sessions with ElevenLabs AI Agent.
 * Tracks voice interactions for chat-based storytelling and Q&A.
 */

export type MessageRole = 'user' | 'agent' | 'system';

export interface VoiceMessage {
  /** Unique identifier for the message */
  id: string;
  
  /** Role of the message sender */
  role: MessageRole;
  
  /** Text transcript of the message */
  text: string;
  
  /** Audio recording URL (for user messages) or TTS output URL (for agent) */
  audioUrl?: string;
  
  /** Audio duration in seconds */
  audioDurationSeconds?: number;
  
  /** Timestamp when message was sent */
  timestamp: Date;
  
  /** Confidence score for speech recognition (0-1) */
  confidenceScore?: number;
  
  /** Whether the message contains profanity or inappropriate content */
  isFlagged?: boolean;
  
  /** Sentiment analysis of the message */
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface VoiceSession {
  /** Unique identifier for the session */
  id: string;
  
  /** Reference to User ID */
  userId: string;
  
  /** ElevenLabs Agent ID */
  agentId: string;
  
  /** Array of messages in this conversation */
  messages: VoiceMessage[];
  
  /** Session start timestamp */
  startedAt: Date;
  
  /** Session end timestamp (if ended) */
  endedAt?: Date;
  
  /** Total session duration in seconds */
  durationSeconds: number;
  
  /** Topic or context of the conversation */
  topic?: string;
  
  /** Language used in the session */
  language: 'id' | 'en';
  
  /** Associated story ID (if conversation is about a specific story) */
  relatedStoryId?: string;
  
  /** User satisfaction rating (1-5) */
  userRating?: number;
  
  /** Session status */
  status: 'active' | 'completed' | 'interrupted' | 'error';
  
  /** Error message if session ended with error */
  errorMessage?: string;
}

/**
 * Request type for starting a new voice session
 */
export interface StartVoiceSessionRequest {
  userId: string;
  agentId: string;
  language: 'id' | 'en';
  topic?: string;
  relatedStoryId?: string;
}

/**
 * Request type for sending a message in voice session
 */
export interface SendVoiceMessageRequest {
  sessionId: string;
  text: string;
  audioUrl?: string;
  audioDurationSeconds?: number;
}

/**
 * Response type from ElevenLabs Agent
 */
export interface VoiceAgentResponse {
  text: string;
  audioUrl?: string;
  audioDurationSeconds?: number;
  timestamp: Date;
  sentiment?: VoiceMessage['sentiment'];
}

/**
 * Analytics data for voice sessions
 */
export interface VoiceSessionAnalytics {
  /** Total number of sessions */
  totalSessions: number;
  
  /** Total conversation time in minutes */
  totalMinutes: number;
  
  /** Average session duration in minutes */
  averageDurationMinutes: number;
  
  /** Total messages sent by user */
  totalUserMessages: number;
  
  /** Total messages from agent */
  totalAgentMessages: number;
  
  /** Average user satisfaction rating */
  averageRating: number;
  
  /** Most discussed topics */
  topTopics: Array<{ topic: string; count: number }>;
  
  /** Language distribution */
  languageDistribution: {
    id: number;
    en: number;
  };
}
