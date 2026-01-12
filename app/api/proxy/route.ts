import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      endpoint, 
      apiKey, 
      keyHeaderName, 
      requestBody,
      // Vision API specific
      serviceType,
      visionEndpoint,
      visionFeatures,
      smartCropRatios,
      imageUrl,
      imageBase64,
    } = body;

    // Handle Vision API requests
    if (serviceType === 'vision') {
      if (!visionEndpoint || !apiKey) {
        return NextResponse.json(
          { error: 'Missing Vision endpoint or API key' },
          { status: 400 }
        );
      }

      // Build the Vision API URL with features
      const features = visionFeatures || ['caption', 'tags'];
      let apiUrl = `${visionEndpoint}/computervision/imageanalysis:analyze?api-version=2024-02-01&features=${features.join(',')}`;
      
      // Add smart crop aspect ratios if smartCrops feature is enabled
      if (features.includes('smartCrops') && smartCropRatios && smartCropRatios.length > 0) {
        apiUrl += `&smartCrops-aspect-ratios=${smartCropRatios.join(',')}`;
      }

      let visionResponse;

      if (imageUrl) {
        // Send image URL
        visionResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': apiKey,
          },
          body: JSON.stringify({ url: imageUrl }),
        });
      } else if (imageBase64) {
        // Send base64 image as binary
        // Remove data URL prefix if present
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const binaryData = Buffer.from(base64Data, 'base64');

        visionResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
            'Ocp-Apim-Subscription-Key': apiKey,
          },
          body: binaryData,
        });
      } else {
        return NextResponse.json(
          { error: 'No image provided. Please upload an image or provide a URL.' },
          { status: 400 }
        );
      }

      const visionData = await visionResponse.json();

      if (!visionResponse.ok) {
        return NextResponse.json(
          { error: visionData.error?.message || 'Vision API request failed', details: visionData },
          { status: visionResponse.status }
        );
      }

      return NextResponse.json({
        data: visionData,
        status: visionResponse.status,
      });
    }

    // Handle ML Studio requests (existing functionality)
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
