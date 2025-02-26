import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PUBLISHER = process.env.PUBLISHER || '';
if (PUBLISHER == '') throw 'missing publisher';

interface WalrusMarketData {
    description: string;
    poolId: string;
}

async function storeMarketData(marketData: WalrusMarketData[]) {
  try {
    const stringifiedJson = JSON.stringify(marketData)
    const response = await axios.put(
      `${PUBLISHER}/v1/blobs?epochs=100`,
      stringifiedJson,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Blob stored successfully:');
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error storing blob:', error);
    }
    throw error;
  }
}

const AGGREGATOR = process.env.AGGREGATOR || 'https://aggregator-url.example.com';
if (AGGREGATOR == '') throw 'missing aggregator';

async function getMarketData(blobId: string) {
  try {
    const response = await axios.get(
      `${AGGREGATOR}/v1/blobs/${blobId}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );
    
    console.log('Blob retrieved successfully:');
    console.log(response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Error retrieving blob:', error);
    }
    throw error;
  }
}

export { storeMarketData, getMarketData };