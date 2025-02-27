# Farcaster Frames Mini App

This is a simple Farcaster Frames application built with Next.js. It demonstrates how to create interactive frames for Farcaster with optional Neynar API integration.

## Features

- Interactive multi-page frame experience
- Dynamic image generation based on user interaction
- Optional personalization using Neynar API
- Easy deployment to Vercel or other hosting providers

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Farcaster account
- (Optional) Neynar API key for enhanced functionality

### Installation

1. Clone this repository or download the code

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
   Then edit `.env.local` with your own values:
   - Set `NEXT_PUBLIC_BASE_URL` to your development or production URL
   - (Optional) Add your `NEYNAR_API_KEY`

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result

## Deployment

### Deploying to Vercel

The easiest way to deploy your Farcaster Frame app is using Vercel:

1. Push your code to a Git repository (GitHub, GitLab, etc.)
2. Import the project in Vercel
3. Set the environment variables in the Vercel dashboard
4. Deploy!

Make sure to update `NEXT_PUBLIC_BASE_URL` to your production URL after deployment.

### Using with Neynar API

The app works without Neynar API, but for enhanced functionality:

1. Sign up for a [Neynar API key](https://neynar.com)
2. Add the API key to your environment variables
3. The app will automatically use Neynar when the API key is present

## How It Works

1. The app exposes an API endpoint at `/api/frame` that handles frame interactions
2. Dynamic images are generated at `/api/images/[type]` using Next.js Edge Runtime
3. When a user interacts with the frame, their action is processed and a new frame is returned
4. If Neynar API is enabled, user data is fetched to personalize the experience

## Customization

- Modify the image generation in `/app/api/images/[type]/route.tsx`
- Change frame navigation logic in `/app/api/frame/route.ts`
- Update the main page content in `/app/page.tsx`

## Learn More

- [Farcaster Frames Documentation](https://docs.farcaster.xyz/reference/frames/spec)
- [Neynar API Documentation](https://docs.neynar.com/)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT