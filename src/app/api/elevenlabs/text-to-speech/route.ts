import { NextRequest, NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = 'your_api_key';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, voiceId = 'EXAVITQu4vr4xnSDxMaL', language = 'id' } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    // ElevenLabs TTS API
    const response = await fetch(
      `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.5,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('ElevenLabs TTS error:', error);
      return NextResponse.json(
        { error: 'Failed to generate speech', details: error },
        { status: response.status }
      );
    }

    // Get audio data
    const audioBuffer = await response.arrayBuffer();
    
    // Convert to base64 for easy transmission
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({
      audio: base64Audio,
      contentType: 'audio/mpeg',
    });
  } catch (error: any) {
    console.error('TTS API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech', details: error.message },
      { status: 500 }
    );
  }
}
