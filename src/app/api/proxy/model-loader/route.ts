import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/proxy/model-loader?url=<public GLB URL>
 * Proxies remote 3D GLB (or mesh) files for CORS-safe browser loading.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const modelUrl = searchParams.get('url');

    if (!modelUrl) {
      return NextResponse.json({ error: 'Missing model URL parameter' }, { status: 400 });
    }

    const response = await fetch(modelUrl);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch model' }, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'model/gltf-binary';
    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
