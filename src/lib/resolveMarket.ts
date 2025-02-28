import { waitForTransactionWithRetry } from '@/lib/utils';
import {ethers} from 'ethers';
import MarketMakerHookABI from '@/contracts/abis/MarketMakerHook.json';
import * as dotenv from 'dotenv';
import {readFileSync} from 'fs';
import * as crypto from 'crypto';

dotenv.config();

// Contract address - store in .env file for security
const MARKET_MAKER_HOOK_ADDRESS = process.env.MARKET_MAKER_HOOK_ADDRESS || '';
if (!MARKET_MAKER_HOOK_ADDRESS) throw 'missing hook address';
const RPC_URL = process.env.RPC_URL || 'http://localhost:8545';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
if (!PRIVATE_KEY) throw 'missing private key';


function loadWalletData() {
    try {
      const walletData = readFileSync('./wallet_data.txt', 'utf8');
      console.log(walletData);
      return JSON.parse(walletData);
    } catch (error) {
      console.error('Error loading wallet data:', error);
      throw new Error('Failed to load wallet data');
    }
  }

  function createWalletFromCdpSeed(seed: string, provider: ethers.JsonRpcProvider) {
    try {
      // For a 128-char hex string from CDP wallet, we need to derive the private key
      // Based on the code you shared, it appears to use CDP wallet format
      
      if (seed.length === 128 && /^[0-9a-fA-F]+$/.test(seed)) {
        // Method 1: Try using the first 64 characters directly as the private key
        try {
          const privateKey = `0x${seed.slice(0, 64)}`;
          return new ethers.Wallet(privateKey, provider);
        } catch (error) {
          console.warn('First 64 chars of seed failed as private key, trying alternative method...');
        }
        
        // Method 2: Try using the last 64 characters as the private key
        try {
          const privateKey = `0x${seed.slice(64)}`;
          return new ethers.Wallet(privateKey, provider);
        } catch (error) {
          console.warn('Last 64 chars of seed failed as private key, trying alternative method...');
        }
        
        // Method 3: Try hashing the entire seed to derive a private key
        try {
          const hash = crypto.createHash('sha256').update(Buffer.from(seed, 'hex')).digest('hex');
          const privateKey = `0x${hash}`;
          return new ethers.Wallet(privateKey, provider);
        } catch (error) {
          console.warn('SHA-256 hash of seed failed as private key.');
        }
      }
      
      // If the seed is already a correctly formatted private key
      if (seed.startsWith('0x') && seed.length === 66) {
        return new ethers.Wallet(seed, provider);
      }
      
      // Try as BIP-39 mnemonic
      try {
        return ethers.Wallet.fromPhrase(seed, provider);
      } catch (error) {
        console.warn('Seed is not a valid mnemonic phrase.');
      }
      
      throw new Error('Could not create wallet from Coinbase AgentKit CDP wallet seed');
    } catch (error) {
      console.error('Failed to create wallet from seed:', error);
      throw new Error('Failed to derive private key from CDP wallet seed');
    }
  }

export async function resolveMarket() {
    const walletData = loadWalletData();

  // Create provider and signer - ethers v6 syntax
  const provider = new ethers.JsonRpcProvider(RPC_URL);

  const wallet = new ethers.Wallet(PRIVATE_KEY, provider); // PRIVATE_KEY or walletData.seed
  
  console.log(`Using address: ${wallet.address}`);
  
  // Initialize contract
  const marketMakerHook = new ethers.Contract(
    MARKET_MAKER_HOOK_ADDRESS,
    MarketMakerHookABI.abi,
    wallet
  );
    
  const poolId = "af21d6fcd4e0eefacce52f2a075f73eab24e7af1f449ffca2244d80ab1c6d9d7";
  const market_id = `0x${poolId}`;

  const outcome = 0
  
  try {
    
    // encode function data
    const data = marketMakerHook.interface.encodeFunctionData(
        'resolveMarket',
        [market_id, outcome]
      );
            
      // Create and send the transaction manually
      const tx = await wallet.sendTransaction({
        to: MARKET_MAKER_HOOK_ADDRESS,
        data: data,
        gasLimit: 5000000
      });
    
    console.log(`Transaction submitted: ${tx.hash}`);
    
    // Wait for transaction to be mined
    const receipt = await waitForTransactionWithRetry(provider, tx.hash);

    if (receipt) {
      console.log(`Transaction confirmed in block ${receipt.blockNumber}`);

      console.log(receipt)
            
    } else {
      console.log('no receipt :(')
    }
  } catch (error) {
    console.error('Error creating market:', error);
    throw error;
  }
}
