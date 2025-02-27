// File: app/api/frame/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFrameMessage, FrameRequest } from '@neynar/nextjs-sdk';
import { validateMessage } from '@farcaster/core';
import { createPersonalizedFrameResponse } from '../../utils/neynar';

// Base URL for your application
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    // Parse and validate the frame message
    const body: FrameRequest = await req.json();
    const { isValid, message } = await getFrameMessage(body);

    if (!isValid || !message) {
      return NextResponse.json({ error: 'Invalid frame message' }, { status: 400 });
    }

    // Handle different button actions
    let nextFrameMetadata;
    
    // If Neynar API key is present, use personalized responses
    if (process.env.NEYNAR_API_KEY && message.fid) {
      try {
        switch (message.button) {
          case 1:
            nextFrameMetadata = await createPersonalizedFrameResponse(message.fid, 'page1', BASE_URL);
            break;
          case 2:
            nextFrameMetadata = await createPersonalizedFrameResponse(message.fid, 'page2', BASE_URL);
            break;
          case 3:
            nextFrameMetadata = await createPersonalizedFrameResponse(message.fid, 'page3', BASE_URL);
            break;
          case 4:
            nextFrameMetadata = await createPersonalizedFrameResponse(message.fid, 'thank-you', BASE_URL);
            break;
          default:
            nextFrameMetadata = await createPersonalizedFrameResponse(message.fid, 'welcome', BASE_URL);
        }
      } catch (error) {
        console.error('Error creating personalized response:', error);
        // Fall back to standard responses if personalization fails
        switch (message.button) {
          case 1:
            nextFrameMetadata = getFirstPageMetadata();
            break;
          case 2:
            nextFrameMetadata = getSecondPageMetadata();
            break;
          case 3:
            nextFrameMetadata = getThirdPageMetadata();
            break;
          case 4:
            nextFrameMetadata = getFourthPageMetadata();
            break;
          default:
            nextFrameMetadata = getInitialFrameMetadata();
        }
      }
    } else {
      // Use standard responses without personalization
      switch (message.button) {
        case 1:
          nextFrameMetadata = getFirstPageMetadata();
          break;
        case 2:
          nextFrameMetadata = getSecondPageMetadata();
          break;
        case 3:
          nextFrameMetadata = getThirdPageMetadata();
          break;
        case 4:
          nextFrameMetadata = getFourthPageMetadata();
          break;
        default:
          nextFrameMetadata = getInitialFrameMetadata();
      }
    }

    return NextResponse.json(nextFrameMetadata);
  } catch (error) {
    console.error('Error processing frame request:', error);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  // Return initial frame metadata for GET requests
  return NextResponse.json(getInitialFrameMetadata());
}

// Helper functions to generate frame metadata
function getInitialFrameMetadata() {
  return {
    frame: {
      version: 'vNext',
      image: `${BASE_URL}/api/images/welcome`,
      buttons: [
        {
          label: 'Start',
          action: 'post'
        }
      ],
      postUrl: `${BASE_URL}/api/frame`
    }
  };
}

function getFirstPageMetadata() {
  return {
    frame: {
      version: 'vNext',
      image: `${BASE_URL}/api/images/page1`,
      buttons: [
        {
          label: 'Previous',
          action: 'post'
        },
        {
          label: 'Next',
          action: 'post'
        }
      ],
      postUrl: `${BASE_URL}/api/frame`
    }
  };
}

function getSecondPageMetadata() {
  return {
    frame: {
      version: 'vNext',
      image: `${BASE_URL}/api/images/page2`,
      buttons: [
        {
          label: 'Previous',
          action: 'post'
        },
        {
          label: 'Next',
          action: 'post'
        }
      ],
      postUrl: `${BASE_URL}/api/frame`
    }
  };
}

function getThirdPageMetadata() {
  return {
    frame: {
      version: 'vNext',
      image: `${BASE_URL}/api/images/page3`,
      buttons: [
        {
          label: 'Previous',
          action: 'post'
        },
        {
          label: 'Finish',
          action: 'post'
        }
      ],
      postUrl: `${BASE_URL}/api/frame`
    }
  };
}

function getFourthPageMetadata() {
  return {
    frame: {
      version: 'vNext',
      image: `${BASE_URL}/api/images/thank-you`,
      buttons: [
        {
          label: 'Start Again',
          action: 'post'
        }
      ],
      postUrl: `${BASE_URL}/api/frame`
    }
  };
}