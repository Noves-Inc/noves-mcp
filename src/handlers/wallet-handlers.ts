import { IntentProvider } from '@noves/intent-ethers-provider';
import {
  GetWalletSummarySchema,
  AnalyzeWalletSchema,
} from '../schemas/index.js';
import type { WalletAnalysisData } from '../types/index.js';

/**
 * Wallet analysis tool handlers
 */
export class WalletHandlers {
  constructor(private provider: IntentProvider) {}

  /**
   * Handle getting wallet summary (comprehensive overview)
   */
  async handleGetWalletSummary(args: any) {
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
  async handleAnalyzeWallet(args: any) {
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
} 