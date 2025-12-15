import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint, apiKey, keyHeaderName, requestBody } = body;

    if (!endpoint || !apiKey) {
      return NextResponse.json(
        { error: 'Missing endpoint or API key' },
        { status: 400 }
      );
    }

    // Forward the request to Azure ML
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        [keyHeaderName || 'Authorization']: apiKey.startsWith('Bearer ')
          ? apiKey
          : `Bearer ${apiKey}`,
      },
      body: requestBody,
    });

    const data = await response.json();

    return NextResponse.json({
      data,
      status: response.status,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Proxy request failed' },
      { status: 500 }
    );
  }
}




