import { NextRequest, NextResponse } from 'next';

interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as LogEntry;
    
    const { level, message, timestamp, context } = body;
    
    // Console log based on level
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    switch (level) {
      case 'error':
        console.error(logMessage, context);
        break;
      case 'warn':
        console.warn(logMessage, context);
        break;
      case 'debug':
        console.debug(logMessage, context);
        break;
      default:
        console.log(logMessage, context);
    }
    
    return NextResponse.json({
      success: true,
      logged: true
    });
  } catch (error) {
    console.error('Logger error:', error);
    return NextResponse.json(
      { error: 'Failed to log message' },
      { status: 500 }
    );
  }
}
