import { NeynarFetcher } from "../src/lib/farcaster";
import { anthropicParseFarcasterPost } from '../src/lib/anthropic';
import { createMarket } from '../src/lib/createMarket';
import path from 'path';
import { writeFile, readFile } from 'fs/promises';
import { storeMarketData } from "@/lib/walrus";
import * as dotenv from 'dotenv';
dotenv.config();

const main = async () => {

    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
        throw new Error("API key not found. Set NEYNAR_API_KEY in your environment or .env file.");
    }

    const fetcher = new NeynarFetcher(apiKey);
    // Mentions
    // TODO 4 more market list = 6
    const {casts} = await fetcher.searchByDaysAgo(15);
    console.log(casts)
    const gcasts = casts.find(x=> x.text.indexOf('minutes') > -1)
    if (!gcasts) throw "no casts found"

    let lastPoolId = '';
    const marketData = []
    // loop thru each cast... do only 1 for now
    for (const cast of [gcasts]) {
        const parsedResponse = await anthropicParseFarcasterPost(cast.text);
        console.log("AI response received:", parsedResponse);
    
        // Handle any mapping needed for getting token address for dev/test/main
        if (!parsedResponse.collateralAddress) {
            parsedResponse.collateralAddress = '0x6A4b68Dca82522d15B30456ae03736aA33483789'; // currently have to use this address for our tests
        }

        // Create the market and wait for the response
        const poolId = await createMarket(parsedResponse.collateralAddress);
        
        if (!poolId) {
        throw new Error("Failed to get poolId from market creation");
        }
        
        console.log(`Successfully created market with poolId: ${poolId}`);
        
        // Save the market data
        const marketResponse = {
            poolId,
            description: parsedResponse.description
        };

        marketData.push(marketResponse);
        lastPoolId = poolId;
    }

    console.log('Saving Walrus');

    // Walrus save end data description with pool ids
    const walrusStoredResponse = await storeMarketData(marketData);

    //store response to file
    const filePath = path.resolve(__dirname, '../data/walrusblob.json');
    await writeFile(filePath, JSON.stringify(walrusStoredResponse, null, 2));

    console.log('Successfully stored Blob Response')
        
    console.log('Operation completed successfully');

    let url = `https://eth-denver-frontend-pi.vercel.app/market/${'0x'+lastPoolId}/blob/${walrusStoredResponse.newlyCreated.blobObject.blobId}`
    console.log(url)
}

// Execute the function
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });