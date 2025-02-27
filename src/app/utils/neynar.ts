// utils/neynar.ts - Neynar API utilities
import { NeynarAPIClient } from '@neynar/sdk';

// Initialize Neynar client
const neynarApiKey = process.env.NEYNAR_API_KEY || '';
const neynarClient = new NeynarAPIClient(neynarApiKey);

// Function to create a personalized frame response based on user's FID
export async function createPersonalizedFrameResponse(fid: number, imageType: string, baseUrl: string) {
  try {
    // Try to fetch user data if we have an API key
    let username = '';
    
    if (neynarApiKey) {
      try {
        // Fetch user info from Neynar
        const userResponse = await neynarClient.lookupUserByFid(fid);
        username = userResponse?.result?.user?.username || '';
      } catch (error) {
        console.error('Error fetching user data from Neynar:', error);
        // Continue without personalization if there's an error
      }
    }
    
    // Create the image URL, adding username if available
    const imageUrl = username 
      ? `${baseUrl}/api/images/${imageType}?username=${encodeURIComponent(username)}`
      : `${baseUrl}/api/images/${imageType}`;
    
    // Return frame response
    return {
      frame: {
        version: 'vNext',
        image: imageUrl,
        buttons: [
          // Customize buttons based on image type
          ...(imageType === 'welcome' ? [{ label: 'Start', action: 'post' }] : []),
          ...(imageType === 'page1' ? [
            { label: 'Previous', action: 'post' },
            { label: 'Next', action: 'post' }
          ] : []),
          ...(imageType === 'page2' ? [
            { label: 'Previous', action: 'post' },
            { label: 'Next', action: 'post' }
          ] : []),
          ...(imageType === 'page3' ? [
            { label: 'Previous', action: 'post' },
            { label: 'Finish', action: 'post' }
          ] : []),
          ...(imageType === 'thank-you' ? [{ label: 'Start Again', action: 'post' }] : []),
        ],
        postUrl: `${baseUrl}/api/frame`
      }
    };
  } catch (error) {
    console.error('Error creating personalized frame:', error);
    
    // Fallback to simple frame response without personalization
    return {
      frame: {
        version: 'vNext',
        image: `${baseUrl}/api/images/${imageType}`,
        buttons: [
          { label: 'Continue', action: 'post' }
        ],
        postUrl: `${baseUrl}/api/frame`
      }
    };
  }
}

// Function to fetch user data by Farcaster ID (additional utility function)
export async function fetchUserData(fid: number) {
  if (!neynarApiKey) {
    return null;
  }
  
  try {
    const response = await neynarClient.lookupUserByFid(fid);
    return response?.result?.user || null;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
}