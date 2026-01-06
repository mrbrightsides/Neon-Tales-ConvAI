import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const contentType = request.headers.get('content-type') || '';
    let body;
    let headers: Record<string, string> = {};
    let protocol: string;
    let origin: string;
    let path: string;
    let method: string;

    if (contentType.includes('application/json')) {
      const json = await request.json();
      protocol = json.protocol;
      origin = json.origin;
      path = json.path;
      method = json.method;
      headers = json.headers || {};
      body = json.body;
    } else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      protocol = formData.get('protocol') as string;
      origin = formData.get('origin') as string;
      path = formData.get('path') as string;
      method = formData.get('method') as string;
      
      const headersJson = formData.get('headers') as string;
      headers = headersJson ? JSON.parse(headersJson) : {};
      
      body = formData;
    } else {
      return NextResponse.json(
        { error: 'Unsupported content type' },
        { status: 400 }
      );
    }

    if (!protocol || !origin || !path || !method) {
      return NextResponse.json(
        { error: 'Missing required fields: protocol, origin, path, method' },
        { status: 400 }
      );
    }

    const targetUrl = `${protocol}://${origin}${path}`;

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (body && method !== 'GET' && method !== 'HEAD') {
      if (body instanceof FormData) {
        fetchOptions.body = body;
      } else if (typeof body === 'object') {
        fetchOptions.body = JSON.stringify(body);
      } else {
        fetchOptions.body = body;
      }
    }

    const response = await fetch(targetUrl, fetchOptions);
    const responseContentType = response.headers.get('content-type') || '';
    
    let responseData;
    if (responseContentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    return NextResponse.json({
      status: response.status,
      data: responseData,
      headers: Object.fromEntries(response.headers.entries()),
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
