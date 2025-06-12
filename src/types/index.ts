/**
 * Type definitions for Noves MCP Server
 */

export interface TransactionData {
  rawTransactionData: {
    transactionHash: string;
  };
  classificationData: {
    description: string;
    type: string;
  };
}

export interface TokenPriceData {
  price: {
    amount: string;
    currency: string;
  };
  token: {
    address: string;
    symbol?: string;
    name?: string;
  };
  chain: string;
  timestamp?: string;
}

export interface WalletAnalysisData {
  totalTransactions: number;
  transactionTypes: Record<string, number>;
  uniqueTypes: string[];
  mostCommonType?: [string, number];
} 