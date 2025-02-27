import { waitForTransactionWithRetry } from '@/lib/utils';
import {ethers} from 'ethers';
import MarketMakerHookABI from '@/contracts/abis/MarketMakerHook.json';
import * as dotenv from 'dotenv';
dotenv.config();

// Contract address - store in .env file for security
const MARKET_MAKER_HOOK_ADDRESS = process.env.MARKET_MAKER_HOOK_ADDRESS || '';
if (!MARKET_MAKER_HOOK_ADDRESS) throw 'missing hook address';
const RPC_URL = process.env.RPC_URL || 'http://localhost:8545';
const PRIVATE_KEY = process.env.PRIVATE_KEY || '';
if (!PRIVATE_KEY) throw 'missing private key';

export async function createMarket(collateralTokenAddress?: string|undefined) {
  console.log('Address', collateralTokenAddress);

  // Create provider and signer - ethers v6 syntax
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
  
  console.log(`Using address: ${wallet.address}`);
  
  // Initialize contract
  const marketMakerHook = new ethers.Contract(
    MARKET_MAKER_HOOK_ADDRESS,
    MarketMakerHookABI.abi,
    wallet
  );
  
  // Parameters for createMarketAndDepositCollateral
  const oracle = '0xD6139B01CDf8e2A33df49d85D128397fE8c7419b'; // Address of the oracle
  const creator = wallet.address; // Using your wallet as the creator
  const collateralAddress = collateralTokenAddress||'0x6A4b68Dca82522d15B30456ae03736aA33483789'; // ERC20 token to use as collateral
  const collateralAmount = ethers.parseUnits('10', 6); // Amount of collateral (10 tokens with 18 decimals)
  
  console.log('Creating market...');
  
  try {
    // First approve the MarketMakerHook to spend your tokens if using ERC20 as collateral
    await handleCollateralAllowance(collateralAddress, wallet, collateralAmount);
    
    // encode function data
    const data = marketMakerHook.interface.encodeFunctionData(
        'createMarketAndDepositCollateral',
        [oracle, creator, collateralAddress, collateralAmount]
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
            
      // After getting the receipt
      const txLogs = await provider.getLogs({
        blockHash: receipt.blockHash
      });

      console.log(txLogs);
      console.log(receipt);

      // Filter logs for only those from your transaction
      const txSpecificLogs = txLogs.filter(log => log.transactionHash === receipt.hash);

      console.log(txSpecificLogs)
      console.log('tes')

      
    // // Log specific properties of each log
    // txSpecificLogs.forEach((log, index) => {
    //     console.log(`Log #${index + 1}:`);
    //     console.log(`  Address: ${log.address}`);
    //     console.log(`  Topics: ${log.topics}`);
    //     console.log(`  Data: ${log.data}`);
    //     console.log(`  Block Number: ${log.blockNumber}`);
    //     console.log('-------------------');
    // });

      // After getting the receipt and logs
      const marketCreatedEventSignature = '0x1cbee7c4e3c575e7f2c0fbc27b89ce2a0636ffa1f47983b91719c42d5d8e1886';

      // Find the log with this event signature
      const marketCreatedLog = txSpecificLogs.find(
        log => log.address.toLowerCase() === MARKET_MAKER_HOOK_ADDRESS.toLowerCase()
      );

      if (marketCreatedLog) {
        // The poolId is likely in the data field
        // Assuming the event structure has the poolId as the last parameter
        const poolId = marketCreatedLog.data.slice(-64); // Last 32 bytes (64 hex chars)
        console.log(`Market created with pool ID: 0x${poolId}`);
      
        return poolId;
      } else {

        txLogs.forEach(log => {
            const value = log.data.slice(-64); // Last 32 bytes (64 hex chars)
            console.log(`Test: 0x${value} - ${log.index}`);
        console.log(`  Address: ${log.address}`);
        console.log(`  Topics: ${log.topics}`);
        console.log(`  Data: ${log.data}`);
        console.log('-------------------');
        })
        console.log(receipt);

      }
    } else {
      console.log('no receipt :(')
    }
  } catch (error) {
    console.error('Error creating market:', error);
    throw error;
  }
}

const handleCollateralAllowance = async (collateralAddress: string, wallet: ethers.Wallet, collateralAmount: bigint) => {
        // First approve the MarketMakerHook to spend your tokens if using ERC20 as collateral
        const erc20Interface = new ethers.Interface([
            'function balanceOf(address account) view returns (uint256)',
            'function allowance(address owner, address spender) view returns (uint256)',
            'function approve(address spender, uint256 amount) returns (bool)',
            'function decimals() view returns (uint8)'
          ]);
        const tokenContract = new ethers.Contract(collateralAddress, erc20Interface, wallet);
      
        
        const decimals = await tokenContract.decimals();
        console.log(`Token decimals: ${decimals}`);
        
        // Check token balance
        const tokenBalance = await tokenContract.balanceOf(wallet.address);
        console.log(`Token balance: ${ethers.formatUnits(tokenBalance, decimals)} tokens`);
        if (tokenBalance < collateralAmount) {
            console.error(`Insufficient token balance. Have ${ethers.formatUnits(tokenBalance, decimals)}, need ${ethers.formatUnits(collateralAmount, decimals)}`);
            throw new Error('Insufficient token balance');
          }
        
        // Check if approval is needed
        const allowance = await tokenContract.allowance(wallet.address, MARKET_MAKER_HOOK_ADDRESS);
        console.log(`Current allowance: ${ethers.formatUnits(allowance, decimals)} tokens`);
    
        if (allowance < collateralAmount) {
          console.log('Approving tokens...');
          const approveTx = await tokenContract.approve(MARKET_MAKER_HOOK_ADDRESS, collateralAmount);
          await approveTx.wait();
          console.log(`Approval transaction: ${approveTx.hash}`);
        }
    
}