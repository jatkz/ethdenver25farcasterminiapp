import { ethers } from 'ethers';

/**
 * Waits for a transaction receipt with timeout and retry mechanism
 * @param provider The ethers.js provider
 * @param txHash The transaction hash to check
 * @param timeoutMs Timeout in milliseconds before retrying (default: 5000ms)
 * @param maxRetries Maximum number of retries (default: 5)
 * @param retryDelayMs Delay between retries in milliseconds (default: 1000ms)
 * @returns The transaction receipt or null if it couldn't be retrieved after retries
 */
async function waitForTransactionWithRetry(
    provider: ethers.Provider,
    txHash: string,
    timeoutMs: number = 5000,
    maxRetries: number = 5,
    retryDelayMs: number = 5000
  ): Promise<ethers.TransactionReceipt | null> {
    let retries = 0;
    
    while (retries <= maxRetries) {
      try {
        // Create a promise for the transaction receipt
        const receiptPromise = provider.getTransactionReceipt(txHash);
        
        // Create a timeout promise
        const timeoutPromise = new Promise<null>((_, reject) => {
          setTimeout(() => reject(new Error('Transaction receipt timeout')), timeoutMs);
        });
        
        // Race the promises - whichever resolves/rejects first wins
        const receipt = await Promise.race([
          receiptPromise,
          timeoutPromise
        ]) as ethers.TransactionReceipt | null;
        
        // If we got a receipt, return it
        if (receipt) {
          console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
          return receipt;
        }
        
        // If no receipt but no timeout, the transaction is still pending
        console.log(`No receipt yet, transaction still pending...`);
        throw "catch error flow";
      } catch (error) {
        // If we timed out or got another error
        retries++;
        
        if (retries > maxRetries) {
          console.error(`Max retries (${maxRetries}) reached for transaction ${txHash}`);
          return null;
        }
        
        console.log(`Retry ${retries}/${maxRetries} for transaction ${txHash}`);
        
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, retryDelayMs));
      }
    }
    
    return null;
  }

export {waitForTransactionWithRetry};