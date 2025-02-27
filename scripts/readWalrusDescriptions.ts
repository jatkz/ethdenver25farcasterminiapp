import path from 'path';
import { readFile } from 'fs/promises';
import { getMarketData } from "@/lib/walrus";

interface WalrusBlob {
    newlyCreated: {
      blobObject: {
        blobId: string;
        // Include other properties as needed
      }
    }
  }


const main = async () => {
    const filePath = path.resolve(__dirname, '../data/walrusblob.json');
    const blobResponse = await readFile(filePath, 'utf8');
    const blobData: WalrusBlob = JSON.parse(blobResponse);

    console.log('Retrieved Walrus Blob');

    const data = await getMarketData(blobData.newlyCreated.blobObject.blobId);
}

// Execute the function
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });