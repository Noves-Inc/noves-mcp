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
  chain: string;
  block: string;
  token: {
    address: string;
    symbol?: string;
    name?: string;
  };
  price: {
    amount: string;
    currency: string;
    status: string;
  };
  pricedBy?: {
    poolAddress?: string;
    exchange?: {
      name: string;
    };
    liquidity?: number;
    baseToken?: {
      address: string;
      symbol: string;
      name: string;
    };
  };
  priceType: string;
  priceStatus: string;
  timestamp?: string;
}

export interface WalletAnalysisData {
  totalTransactions: number;
  transactionTypes: Record<string, number>;
  uniqueTypes: string[];
  mostCommonType?: [string, number];
} 