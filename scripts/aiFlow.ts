import { NeynarFetcher } from "../src/lib/farcaster";
import { anthropicParseFarcasterPost } from '../src/lib/anthropic';
import { createMarket } from '../src/lib/createMarket';
import path from 'path';
import { writeFile } from 'fs/promises';


const main = async () => {

    const apiKey = process.env.NEYNAR_API_KEY;
    if (!apiKey) {
        throw new Error("API key not found. Set NEYNAR_API_KEY in your environment or .env file.");
    }

    const fetcher = new NeynarFetcher(apiKey);

    const {casts} = await fetcher.searchByDaysAgo(15);

    // loop thru each cast... do only 1 for now
    for (const cast of [casts[0]]) {
        const parsedResponse = await anthropicParseFarcasterPost(cast.text);
        console.log("AI response received:", parsedResponse);
    
        // Handle any mapping needed for getting token address for dev/test/main
        if (!parsedResponse.collateralAddress) {
            console.log("Collateral address not provided, using default USDC on Sepolia");
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
        
        //read/save the walrus blob id

        const filePath = path.resolve(__dirname, '../data/mentions.json');
        await writeFile(filePath, JSON.stringify(data, null, 2));

        const filePath = path.resolve(__dirname, '../data/markets.json');
        console.log(`Saving market data to ${filePath}`);
        
        const savedFilePath = await saveMarketResponseToFile(marketResponse, filePath);
        console.log(`File successfully saved at: ${savedFilePath}`);
        
        console.log('Operation completed successfully');
            
    }
}
