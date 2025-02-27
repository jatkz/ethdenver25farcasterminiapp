// File: app/api/frame/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { FrameActionDataParsedAndHubContext, FrameActionPayload, getFrameMessage } from 'frames.js';
import { createPersonalizedFrameResponse } from '../../utils/neynar';

// Base URL for your application
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function POST(req: NextRequest) {
  try {
    // Parse and validate the frame message
    const body: FrameActionPayload = await req.json();
    const frameMessage: FrameActionDataParsedAndHubContext = await getFrameMessage(body);

    if (frameMessage) {
        // Check if the frame action is valid
        const isValid = frameMessage.isValid;
        
        if (isValid) {
          // Access the actual data
          const { buttonIndex, inputText, castId } = frameMessage;
          
          // Now you can use these properties
          console.log(`Button clicked: ${buttonIndex}`);
          console.log(`User FID: ${castId?.fid}`);
          
          // Continue with your logic based on button index
          switch (buttonIndex) {
            case 1:
              // Handle button 1 click
              break;
            // Other cases...
          }
        }
      }

    // Handle different button actions
    let nextFrameMetadata;
    
    // If Neynar API key is present, use personalized responses
    if (process.env.NEYNAR_API_KEY && frameMessage.castId?.fid) {
      try {
        switch (frameMessage.buttonIndex) {
          case 1:
            nextFrameMetadata = await createPersonalizedFrameResponse(frameMessage.castId?.fid, 'page1', BASE_URL);
            break;
          case 2:
            nextFrameMetadata = await createPersonalizedFrameResponse(frameMessage.castId?.fid, 'page2', BASE_URL);
            break;
          case 3:
            nextFrameMetadata = await createPersonalizedFrameResponse(frameMessage.castId?.fid, 'page3', BASE_URL);
            break;
          case 4:
            nextFrameMetadata = await createPersonalizedFrameResponse(frameMessage.castId?.fid, 'thank-you', BASE_URL);
            break;
          default:
            nextFrameMetadata = await createPersonalizedFrameResponse(frameMessage.castId?.fid, 'welcome', BASE_URL);
        }
      } catch (error) {
        console.error('Error creating personalized response:', error);
        // Fall back to standard responses if personalization fails
        switch (frameMessage.buttonIndex) {
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
      switch (frameMessage.buttonIndex) {
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