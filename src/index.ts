#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { IntentProvider } from '@noves/intent-ethers-provider';
import { toolDefinitions } from './tools/definitions.js';
import { TransactionHandlers, WalletHandlers, TokenHandlers } from './handlers/index.js';

/**
 * Noves MCP Server
 * Provides natural language blockchain data through Noves Intent service
 */
class NovesMCPServer {
  private server: Server;
  private provider: IntentProvider;
  private transactionHandlers: TransactionHandlers;
  private walletHandlers: WalletHandlers;
  private tokenHandlers: TokenHandlers;

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

    // Initialize handlers
    this.transactionHandlers = new TransactionHandlers(this.provider);
    this.walletHandlers = new WalletHandlers(this.provider);
    this.tokenHandlers = new TokenHandlers(this.provider);

    this.setupToolHandlers();
  }

  /**
   * Set up tool handlers for the MCP server
   */
  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: toolDefinitions,
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          // Transaction-related tools
          case 'get_recent_transactions':
            return await this.transactionHandlers.handleGetRecentTransactions(args);
          
          case 'get_transaction_details':
            return await this.transactionHandlers.handleGetTransactionDetails(args);
          
          case 'get_translated_transaction':
            return await this.transactionHandlers.handleGetTranslatedTransaction(args);
          
          case 'get_transaction_transfers':
            return await this.transactionHandlers.handleGetTransactionTransfers(args);
          
          // Wallet analysis tools
          case 'get_wallet_summary':
            return await this.walletHandlers.handleGetWalletSummary(args);
          
          case 'analyze_wallet':
            return await this.walletHandlers.handleAnalyzeWallet(args);
          
          // Token price tools
          case 'get_current_token_price':
            return await this.tokenHandlers.handleGetCurrentTokenPrice(args);
          
          case 'get_historical_token_price':
            return await this.tokenHandlers.handleGetHistoricalTokenPrice(args);
          
          case 'get_token_price_comparison':
            return await this.tokenHandlers.handleGetTokenPriceComparison(args);
          
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