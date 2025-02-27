// File: app/page.tsx
import { Metadata } from 'next';

// Base URL for your application
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

// Define metadata for the page including Open Graph and Frame metadata
export const metadata: Metadata = {
  title: 'My Farcaster Frame App',
  description: 'Interactive Farcaster Frame using Next.js',
  openGraph: {
    title: 'My Farcaster Frame App',
    description: 'Interactive Farcaster Frame using Next.js',
    images: [`${BASE_URL}/api/images/welcome`],
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${BASE_URL}/api/images/welcome`,
    'fc:frame:button:1': 'Start',
    'fc:frame:post_url': `${BASE_URL}/api/frame`,
  },
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-6">My Farcaster Frame</h1>
      <p className="text-xl mb-8">
        This is a Farcaster Frame app built with Next.js.
      </p>
      <div className="border border-gray-300 rounded-lg p-6 mb-8 max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li>Post this page on Farcaster to see the interactive frame</li>
          <li>Click through the buttons to navigate between different pages</li>
          <li>The frame will update with new content based on your choices</li>
          <li>Try it out and see how frames can create interactive experiences!</li>
        </ol>
      </div>
      
      <div className="border border-gray-300 rounded-lg p-6 mb-8 max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Preview</h2>
        <div className="aspect-[1200/630] relative bg-gray-100 rounded-lg overflow-hidden">
          <img 
            src="/api/images/welcome" 
            alt="Frame Preview" 
            className="w-full h-full object-cover"
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Note: This is just a preview. The interactive elements work when shared on Farcaster.
        </p>
      </div>
    </main>
  );
}