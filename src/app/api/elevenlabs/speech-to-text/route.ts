import { NextRequest, NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = 'your_api_key';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const language = formData.get('language') as string || 'id';

    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      );
    }

    // For now, use Web Speech API on client side
    // ElevenLabs doesn't have STT yet, so we'll use browser's built-in
    // This endpoint is a placeholder for future enhancement
    
    return NextResponse.json({
      message: 'STT handled on client-side using Web Speech API',
      supported: false,
    });
  } catch (error: any) {
    console.error('STT API error:', error);
    return NextResponse.json(
      { error: 'Failed to process speech', details: error.message },
      { status: 500 }
    );
  }
}
