import { z } from 'zod';

/**
 * Input validation schemas for Noves MCP Server tools
 */

export const GetRecentTransactionsSchema = z.object({
  chain: z.string().describe('Blockchain network (e.g., ethereum, polygon, arbitrum)'),
  walletAddress: z.string().describe('Wallet address to analyze'),
  limit: z.number().optional().describe('Number of transactions to return (default: 10)')
});

export const GetTransactionDetailsSchema = z.object({
  chain: z.string().describe('Blockchain network'),
  transactionHash: z.string().describe('Transaction hash to analyze')
});

export const AnalyzeWalletSchema = z.object({
  chain: z.string().describe('Blockchain network'),
  walletAddress: z.string().describe('Wallet address to analyze'),
  timeframe: z.string().optional().describe('Time period to analyze (e.g., "7d", "30d", "1y")')
});

export const GetTranslatedTransactionSchema = z.object({
  chain: z.string().describe('Blockchain network'),
  transactionHash: z.string().describe('Transaction hash to get human-readable description')
});

export const GetTransactionTransfersSchema = z.object({
  chain: z.string().describe('Blockchain network'),
  walletAddress: z.string().describe('Wallet address to analyze'),
  limit: z.number().optional().describe('Number of transactions to return (default: 5)')
});

export const GetWalletSummarySchema = z.object({
  chain: z.string().describe('Blockchain network'),
  walletAddress: z.string().describe('Wallet address to analyze'),
  limit: z.number().optional().describe('Number of recent transactions to include in summary (default: 10)')
});

// New schemas for token price functionality
export const GetCurrentTokenPriceSchema = z.object({
  chain: z.string().describe('Blockchain network (e.g., ethereum, polygon, arbitrum)'),
  tokenAddress: z.string().describe('Token contract address')
});

export const GetHistoricalTokenPriceSchema = z.object({
  chain: z.string().describe('Blockchain network (e.g., ethereum, polygon, arbitrum)'),
  tokenAddress: z.string().describe('Token contract address'),
  timestamp: z.string().describe('Unix timestamp for historical price')
});

export const GetTokenPriceComparisonSchema = z.object({
  chain: z.string().describe('Blockchain network (e.g., ethereum, polygon, arbitrum)'),
  tokenAddress: z.string().describe('Token contract address'),
  fromTimestamp: z.string().describe('Start Unix timestamp for comparison'),
  toTimestamp: z.string().optional().describe('End Unix timestamp for comparison (default: current time)')
}); 