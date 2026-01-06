import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = 'your_api_key';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, ageGroup, language } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Initialize Gemini Pro model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    // Build system prompt for storytelling
    const systemPrompt = language === 'id'
      ? `Kamu adalah AI storyteller untuk anak-anak usia ${ageGroup} tahun. Kamu berbicara dengan bahasa yang hangat dan ramah. Tugasmu adalah:
1. Mendengarkan keinginan anak tentang cerita
2. Bertanya 2-3 pertanyaan untuk memahami detail cerita yang diinginkan
3. Membuat cerita yang menarik, aman, dan sesuai usia
4. Memberikan pilihan interaktif di tengah cerita
5. Menyampaikan pesan moral dengan lembut

Gunakan bahasa Indonesia yang mudah dipahami anak-anak. Buat percakapan yang natural dan friendly.`
      : `You are an AI storyteller for children aged ${ageGroup}. You speak with warmth and friendliness. Your tasks:
1. Listen to the child's story wishes
2. Ask 2-3 questions to understand story details
3. Create engaging, safe, age-appropriate stories
4. Provide interactive choices during the story
5. Deliver moral messages gently

Use simple English that children can understand. Make conversations natural and friendly.`;

    // Convert messages to Gemini format
    const chatHistory = messages.slice(0, -1).map((msg: any) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    // Start chat with history
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }],
        },
        {
          role: 'model',
          parts: [{ text: 'Understood! I\'m ready to create magical stories for children!' }],
        },
        ...chatHistory,
      ],
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    // Send message and get response
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response;
    const text = response.text();

    // Parse response for structured output
    const structuredResponse = {
      text: text,
      type: detectResponseType(text),
      narration: extractNarration(text),
      dialogue: extractDialogue(text),
      choices: extractChoices(text),
    };

    return NextResponse.json({
      response: structuredResponse,
      fullText: text,
    });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response', details: error.message },
      { status: 500 }
    );
  }
}

// Helper functions to parse Gemini response
function detectResponseType(text: string): 'question' | 'story' | 'choice' | 'ending' {
  if (text.includes('?') && text.length < 300) return 'question';
  if (text.includes('pilihan') || text.includes('choose') || text.includes('mau')) return 'choice';
  if (text.includes('tamat') || text.includes('selesai') || text.includes('the end')) return 'ending';
  return 'story';
}

function extractNarration(text: string): string {
  // Extract main narration (non-dialogue parts)
  const cleaned = text
    .replace(/"[^"]*"/g, '') // Remove quoted dialogue
    .replace(/\*\*[^*]*\*\*/g, '') // Remove bold formatting
    .trim();
  return cleaned;
}

function extractDialogue(text: string): Array<{ speaker: string; text: string }> | null {
  // Extract dialogue from quotes
  const dialoguePattern = /"([^"]+)"/g;
  const matches = Array.from(text.matchAll(dialoguePattern));
  
  if (matches.length === 0) return null;

  return matches.map((match, index) => ({
    speaker: index === 0 ? 'Narrator' : 'Character',
    text: match[1],
  }));
}

function extractChoices(text: string): string[] | null {
  // Extract choices if present
  const choicePatterns = [
    /pilihan.*?:?\s*\n\s*[-•]\s*(.+?)(?:\n|$)/gi,
    /choose.*?:?\s*\n\s*[-•]\s*(.+?)(?:\n|$)/gi,
    /[12]\.\s*(.+?)(?:\n|$)/g,
  ];

  for (const pattern of choicePatterns) {
    const matches = Array.from(text.matchAll(pattern));
    if (matches.length >= 2) {
      return matches.slice(0, 3).map(m => m[1].trim());
    }
  }

  return null;
}
