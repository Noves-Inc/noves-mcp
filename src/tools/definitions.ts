/**
 * Tool definitions for Noves MCP Server
 * This file contains all the tool schemas and descriptions for the MCP protocol
 */

export const toolDefinitions = [
  {
    name: 'get_recent_transactions',
    description: 'Get recent transactions for a wallet address with natural language descriptions',
    inputSchema: {
      type: 'object',
      properties: {
        chain: {
          type: 'string',
          description: 'Blockchain network (e.g., ethereum, polygon, arbitrum, bsc)',
        },
        walletAddress: {
          type: 'string',
          description: 'Wallet address to analyze',
        },
        limit: {
          type: 'number',
          description: 'Number of transactions to return (default: 10)',
          default: 10,
        },
      },
      required: ['chain', 'walletAddress'],
    },
  },
  {
    name: 'get_transaction_details',
    description: 'Get detailed analysis of a specific transaction with natural language description',
    inputSchema: {
      type: 'object',
      properties: {
        chain: {
          type: 'string',
          description: 'Blockchain network',
        },
        transactionHash: {
          type: 'string',
          description: 'Transaction hash to analyze',
        },
      },
      required: ['chain', 'transactionHash'],
    },
  },
  {
    name: 'get_translated_transaction',
    description: 'Get human-readable description of a specific transaction using Noves translation',
    inputSchema: {
      type: 'object',
      properties: {
        chain: {
          type: 'string',
          description: 'Blockchain network',
        },
        transactionHash: {
          type: 'string',
          description: 'Transaction hash to get human-readable description',
        },
      },
      required: ['chain', 'transactionHash'],
    },
  },
  {
    name: 'get_transaction_transfers',
    description: 'Get detailed transfer information from recent transactions (focus on token movements)',
    inputSchema: {
      type: 'object',
      properties: {
        chain: {
          type: 'string',
          description: 'Blockchain network',
        },
        walletAddress: {
          type: 'string',
          description: 'Wallet address to analyze',
        },
        limit: {
          type: 'number',
          description: 'Number of transactions to return (default: 5)',
          default: 5,
        },
      },
      required: ['chain', 'walletAddress'],
    },
  },
  {
    name: 'get_wallet_summary',
    description: 'Get a comprehensive summary of wallet activity with key insights',
    inputSchema: {
      type: 'object',
      properties: {
        chain: {
          type: 'string',
          description: 'Blockchain network',
        },
        walletAddress: {
          type: 'string',
          description: 'Wallet address to analyze',
        },
        limit: {
          type: 'number',
          description: 'Number of recent transactions to include in summary (default: 10)',
          default: 10,
        },
      },
      required: ['chain', 'walletAddress'],
    },
  },
  {
    name: 'analyze_wallet',
    description: 'Analyze wallet activity and provide insights with natural language summaries',
    inputSchema: {
      type: 'object',
      properties: {
        chain: {
          type: 'string',
          description: 'Blockchain network',
        },
        walletAddress: {
          type: 'string',
          description: 'Wallet address to analyze',
        },
        timeframe: {
          type: 'string',
          description: 'Time period to analyze (e.g., "7d", "30d", "1y")',
          default: '30d',
        },
      },
      required: ['chain', 'walletAddress'],
    },
  },
  // New token price tools
  {
    name: 'get_current_token_price',
    description: 'Get current price of a token on a specific blockchain',
    inputSchema: {
      type: 'object',
      properties: {
        chain: {
          type: 'string',
          description: 'Blockchain network (e.g., ethereum, polygon, arbitrum)',
        },
        tokenAddress: {
          type: 'string',
          description: 'Token contract address',
        },
      },
      required: ['chain', 'tokenAddress'],
    },
  },
  {
    name: 'get_historical_token_price',
    description: 'Get historical price of a token at a specific timestamp',
    inputSchema: {
      type: 'object',
      properties: {
        chain: {
          type: 'string',
          description: 'Blockchain network (e.g., ethereum, polygon, arbitrum)',
        },
        tokenAddress: {
          type: 'string',
          description: 'Token contract address',
        },
        timestamp: {
          type: 'string',
          description: 'Unix timestamp for historical price',
        },
      },
      required: ['chain', 'tokenAddress', 'timestamp'],
    },
  },
  {
    name: 'get_token_price_comparison',
    description: 'Compare token price between two timestamps to show price change',
    inputSchema: {
      type: 'object',
      properties: {
        chain: {
          type: 'string',
          description: 'Blockchain network (e.g., ethereum, polygon, arbitrum)',
        },
        tokenAddress: {
          type: 'string',
          description: 'Token contract address',
        },
        fromTimestamp: {
          type: 'string',
          description: 'Start Unix timestamp for comparison',
        },
        toTimestamp: {
          type: 'string',
          description: 'End Unix timestamp for comparison (default: current time)',
          default: Math.floor(Date.now() / 1000).toString(),
        },
      },
      required: ['chain', 'tokenAddress', 'fromTimestamp'],
    },
  },
]; 