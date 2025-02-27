// File: app/api/images/[type]/route.tsx
import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Function to render welcome image
export async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  const { type } = params;
  
  try {
    // Based on the type parameter, generate different images
    switch (type) {
      case 'welcome':
        return new ImageResponse(
          (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: '#1E1E1E',
              color: 'white',
              fontSize: 32,
              fontWeight: 'bold',
              padding: 20,
            }}>
              <h1 style={{ marginBottom: 20 }}>Welcome to My Farcaster Frame</h1>
              <p style={{ fontSize: 24, textAlign: 'center' }}>
                Click "Start" to begin the journey
              </p>
            </div>
          ),
          {
            width: 1200,
            height: 630,
          }
        );
      
      case 'page1':
        return new ImageResponse(
          (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: '#3498db',
              color: 'white',
              fontSize: 32,
              padding: 20,
            }}>
              <h1 style={{ marginBottom: 20 }}>Page 1</h1>
              <p style={{ fontSize: 24, textAlign: 'center' }}>
                Here's some interesting content for page 1
              </p>
            </div>
          ),
          {
            width: 1200,
            height: 630,
          }
        );
      
      case 'page2':
        return new ImageResponse(
          (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: '#9b59b6',
              color: 'white',
              fontSize: 32,
              padding: 20,
            }}>
              <h1 style={{ marginBottom: 20 }}>Page 2</h1>
              <p style={{ fontSize: 24, textAlign: 'center' }}>
                Explore more on page 2
              </p>
            </div>
          ),
          {
            width: 1200,
            height: 630,
          }
        );
      
      case 'page3':
        return new ImageResponse(
          (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: '#2ecc71',
              color: 'white',
              fontSize: 32,
              padding: 20,
            }}>
              <h1 style={{ marginBottom: 20 }}>Page 3</h1>
              <p style={{ fontSize: 24, textAlign: 'center' }}>
                Final page with important information
              </p>
            </div>
          ),
          {
            width: 1200,
            height: 630,
          }
        );
      
      case 'thank-you':
        return new ImageResponse(
          (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: '#e74c3c',
              color: 'white',
              fontSize: 32,
              padding: 20,
            }}>
              <h1 style={{ marginBottom: 20 }}>Thank You!</h1>
              <p style={{ fontSize: 24, textAlign: 'center' }}>
                You've completed the interactive frame journey
              </p>
            </div>
          ),
          {
            width: 1200,
            height: 630,
          }
        );
      
      default:
        return new Response('Image type not found', { status: 404 });
    }
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response('Error generating image', { status: 500 });
  }
}