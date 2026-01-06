import { NextResponse } from 'next';

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Neon Tales ConvAI',
    version: '1.0.0'
  });
}
