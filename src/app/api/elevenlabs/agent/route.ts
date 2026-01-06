import { NextRequest, NextResponse } from 'next/server';

const ELEVENLABS_API_KEY = 'your_api_key';
const AGENT_ID = 'your_agent_id';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sessionId, text } = body;

    if (action === 'get-signed-url') {
      // Get signed URL for creating a conversation session
      const apiUrl = new URL('https://api.elevenlabs.io/v1/convai/conversation/get_signed_url');
      apiUrl.searchParams.set('agent_id', AGENT_ID);
      
      const response = await fetch(apiUrl.toString(), {
        method: 'GET',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs Get Signed URL error:', errorText);
        return NextResponse.json(
          { error: 'Failed to get signed URL', details: errorText },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log('Signed URL retrieved successfully:', data);
      return NextResponse.json(data);
    }

    if (action === 'send-message') {
      if (!sessionId || !text) {
        return NextResponse.json(
          { error: 'Missing sessionId or text' },
          { status: 400 }
        );
      }

      // Send a text message to the agent
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversations/${sessionId}/message`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs message API error:', errorText);
        return NextResponse.json(
          { error: 'Failed to send message', details: errorText },
          { status: response.status }
        );
      }

      // The response is an audio stream
      const audioBuffer = await response.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString('base64');

      return NextResponse.json({
        audio: `data:audio/mpeg;base64,${base64Audio}`,
      });
    }

    if (action === 'end-session') {
      if (!sessionId) {
        return NextResponse.json(
          { error: 'Missing sessionId' },
          { status: 400 }
        );
      }

      // End the conversation session
      const response = await fetch(
        `https://api.elevenlabs.io/v1/convai/conversations/${sessionId}`,
        {
          method: 'DELETE',
          headers: {
            'xi-api-key': ELEVENLABS_API_KEY,
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('ElevenLabs end session error:', errorText);
        return NextResponse.json(
          { error: 'Failed to end session', details: errorText },
          { status: response.status }
        );
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('ElevenLabs Agent API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
