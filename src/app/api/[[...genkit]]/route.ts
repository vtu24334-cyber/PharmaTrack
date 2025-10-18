// PharmaTrack Lite - API Route for Genkit AI
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Import genkit instance
import { genkit } from '@/ai/genkit';

// Export GET handler
export async function GET(request: NextRequest) {
  try {
    // Handle Genkit dev UI and flow requests
    const url = new URL(request.url);
    const path = url.pathname;
    
    return NextResponse.json({ 
      message: 'Genkit API is ready',
      path 
    });
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Export POST handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    return NextResponse.json({
      message: 'Genkit POST handler',
      received: body
    });
  } catch (error) {
    console.error('POST Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}