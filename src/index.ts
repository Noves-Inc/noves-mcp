#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { IntentProvider } from '@noves/intent-ethers-provider';
import { z } from 'zod';

/**
 * Noves MCP Server
 * Provides natural language blockchain data through Noves Intent service
 */

// Input validation schemas
const GetRecentTransactionsSchema = z.object({
  chain: z.string().describe('Blockchain network (e.g., ethereum, polygon, arbitrum)'),
  walletAddress: z.string().describe('Wallet address to analyze'),
  limit: z.number().optional().describe('Number of transactions to return (default: 10)')
});

const GetTransactionDetailsSchema = z.object({
  chain: z.string().describe('Blockchain network'),
  transactionHash: z.string().describe('Transaction hash to analyze')
});

const AnalyzeWalletSchema = z.object({
  chain: z.string().describe('Blockchain network'),
  walletAddress: z.string().describe('Wallet address to analyze'),
  timeframe: z.string().optional().describe('Time period to analyze (e.g., "7d", "30d", "1y")')
});

const GetTranslatedTransactionSchema = z.object({
  chain: z.string().describe('Blockchain network'),
  transactionHash: z.string().describe('Transaction hash to get human-readable description')
});

const GetTransactionTransfersSchema = z.object({
  chain: z.string().describe('Blockchain network'),
  walletAddress: z.string().describe('Wallet address to analyze'),
  limit: z.number().optional().describe('Number of transactions to return (default: 5)')
});

const GetWalletSummarySchema = z.object({
  chain: z.string().describe('Blockchain network'),
  walletAddress: z.string().describe('Wallet address to analyze'),
  limit: z.number().optional().describe('Number of recent transactions to include in summary (default: 10)')
});

class NovesMCPServer {
  private server: Server;
  private provider: IntentProvider;

  constructor() {
    this.server = new Server(
      {
        name: 'noves-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize Noves Intent Provider
    this.provider = new IntentProvider();

    this.setupToolHandlers();
  }

  /**
   * Set up tool handlers for the MCP server
   */
  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
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
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_recent_transactions':
            return await this.handleGetRecentTransactions(args);
          
          case 'get_transaction_details':
            return await this.handleGetTransactionDetails(args);
          
          case 'get_translated_transaction':
            return await this.handleGetTranslatedTransaction(args);
          
          case 'get_transaction_transfers':
            return await this.handleGetTransactionTransfers(args);
          
          case 'get_wallet_summary':
            return await this.handleGetWalletSummary(args);
          
          case 'analyze_wallet':
            return await this.handleAnalyzeWallet(args);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
            },
          ],
        };
      }
    });
  }

  /**
   * Handle getting recent transactions for a wallet
   */
  private async handleGetRecentTransactions(args: any) {
    const { chain, walletAddress, limit = 10 } = GetRecentTransactionsSchema.parse(args);

    const transactions = await this.provider.getRecentTxs(chain, walletAddress);
    const limitedTransactions = transactions.slice(0, limit);

    const summary = `Found ${transactions.length} total transactions for wallet ${walletAddress} on ${chain}. Showing ${limitedTransactions.length} most recent:\n\n`;
    
    const transactionDetails = limitedTransactions.map((tx, index) => {
      const hash = tx.rawTransactionData.transactionHash;
      const description = tx.classificationData.description;
      const type = tx.classificationData.type;
      return `${index + 1}. **${description}**
   - Type: ${type}
   - Hash: ${hash}
   `;
    }).join('\n');

    return {
      content: [
        {
          type: 'text',
          text: summary + transactionDetails,
        },
      ],
    };
  }

  /**
   * Handle getting transaction details
   */
  private async handleGetTransactionDetails(args: any) {
    const { chain, transactionHash } = GetTransactionDetailsSchema.parse(args);

    // For now, we'll use getRecentTxs and filter, but in future versions
    // we can use specific transaction detail methods from Noves
    const transactions = await this.provider.getRecentTxs(chain, transactionHash);
    const transaction = transactions.find(tx => 
      tx.rawTransactionData.transactionHash.toLowerCase() === transactionHash.toLowerCase()
    );

    if (!transaction) {
      return {
        content: [
          {
            type: 'text',
            text: `Transaction ${transactionHash} not found in recent transactions on ${chain}. This might be an older transaction or from a different address.`,
          },
        ],
      };
    }

    const details = `**Transaction Analysis**

**Description:** ${transaction.classificationData.description}
**Type:** ${transaction.classificationData.type}
**Hash:** ${transaction.rawTransactionData.transactionHash}
**Chain:** ${chain}`;

    return {
      content: [
        {
          type: 'text',
          text: details,
        },
      ],
    };
  }

  /**
   * Handle getting translated transaction description
   */
  private async handleGetTranslatedTransaction(args: any) {
    const { chain, transactionHash } = GetTranslatedTransactionSchema.parse(args);

    const tx = await this.provider.getTranslatedTx(chain, transactionHash);

    const description = `**Transaction Translation**

**Hash:** ${transactionHash}
**Chain:** ${chain}
**Description:** ${tx.classificationData.description}
**Type:** ${tx.classificationData.type}

**Human-Readable Summary:**
${tx.classificationData.description}`;

    return {
      content: [
        {
          type: 'text',
          text: description,
        },
      ],
    };
  }

  /**
   * Handle getting transaction transfers (detailed token movements)
   */
  private async handleGetTransactionTransfers(args: any) {
    const { chain, walletAddress, limit = 5 } = GetTransactionTransfersSchema.parse(args);

    const transactions = await this.provider.getRecentTxs(chain, walletAddress);
    const limitedTransactions = transactions.slice(0, limit);

    const transferDetails = `**Token Transfer Analysis for ${walletAddress}**

**Chain:** ${chain}
**Analyzing:** ${limitedTransactions.length} recent transactions

**Detailed Transfer Information:**

${limitedTransactions.map((tx, index) => {
  const hash = tx.rawTransactionData.transactionHash;
  const description = tx.classificationData.description;
  const type = tx.classificationData.type;

  // Focus on transfer-related details
  return `${index + 1}. **${description}**
   - **Type:** ${type}
   - **Hash:** ${hash}
   - **Transfer Details:** ${description}`;
}).join('\n\n')}`;

    return {
      content: [
        {
          type: 'text',
          text: transferDetails,
        },
      ],
    };
  }

  /**
   * Handle getting wallet summary (comprehensive overview)
   */
  private async handleGetWalletSummary(args: any) {
    const { chain, walletAddress, limit = 10 } = GetWalletSummarySchema.parse(args);

    const transactions = await this.provider.getRecentTxs(chain, walletAddress);
    const limitedTransactions = transactions.slice(0, limit);

    // Analyze transaction patterns
    const transactionTypes = transactions.reduce((acc, tx) => {
      const type = tx.classificationData.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonType = Object.entries(transactionTypes)
      .sort(([,a], [,b]) => b - a)[0];

    const summary = `**Comprehensive Wallet Summary**

**Wallet:** ${walletAddress}
**Chain:** ${chain}
**Analysis of ${limitedTransactions.length} Recent Transactions**

**Quick Stats:**
- Total Recent Transactions: ${transactions.length}
- Most Common Activity: ${mostCommonType ? `${mostCommonType[0]} (${mostCommonType[1]}x)` : 'None'}
- Transaction Types: ${Object.keys(transactionTypes).length}

**Recent Activity:**
${limitedTransactions.map((tx, index) => 
  `${index + 1}. ${tx.classificationData.description}`
).join('\n')}

**Activity Breakdown:**
${Object.entries(transactionTypes)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 5)
  .map(([type, count]) => `- ${type}: ${count} transactions`)
  .join('\n')}`;

    return {
      content: [
        {
          type: 'text',
          text: summary,
        },
      ],
    };
  }

  /**
   * Handle wallet analysis
   */
  private async handleAnalyzeWallet(args: any) {
    const { chain, walletAddress, timeframe = '30d' } = AnalyzeWalletSchema.parse(args);

    const transactions = await this.provider.getRecentTxs(chain, walletAddress);

    // Basic analysis
    const totalTransactions = transactions.length;
    const transactionTypes = transactions.reduce((acc, tx) => {
      const type = tx.classificationData.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const uniqueTypes = Object.keys(transactionTypes);
    const mostCommonType = Object.entries(transactionTypes)
      .sort(([,a], [,b]) => b - a)[0];

    const analysis = `**Wallet Analysis for ${walletAddress}**

**Summary:**
- Total Recent Transactions: ${totalTransactions}
- Unique Transaction Types: ${uniqueTypes.length}
- Most Common Activity: ${mostCommonType ? `${mostCommonType[0]} (${mostCommonType[1]} times)` : 'None'}
- Chain: ${chain}
- Analysis Period: ${timeframe}

**Transaction Type Breakdown:**
${Object.entries(transactionTypes)
  .sort(([,a], [,b]) => b - a)
  .map(([type, count]) => `- ${type}: ${count} transactions`)
  .join('\n')}

**Recent Activity Sample:**
${transactions.slice(0, 3).map((tx, index) => 
  `${index + 1}. ${tx.classificationData.description}`
).join('\n')}`;

    return {
      content: [
        {
          type: 'text',
          text: analysis,
        },
      ],
    };
  }

  /**
   * Start the MCP server
   */
  async run() {
    try {
      console.error('🚀 Initializing Noves MCP server...');
      const transport = new StdioServerTransport();
      console.error('📡 Creating transport...');
      await this.server.connect(transport);
      console.error('✅ Noves MCP server running on stdio');
    } catch (error) {
      console.error('❌ Failed to start MCP server:', error);
      process.exit(1);
    }
  }
}

// Start the server
const server = new NovesMCPServer();
server.run().catch(console.error); 