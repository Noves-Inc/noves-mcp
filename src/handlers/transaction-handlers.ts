import { IntentProvider } from '@noves/intent-ethers-provider';
import {
  GetRecentTransactionsSchema,
  GetTransactionDetailsSchema,
  GetTranslatedTransactionSchema,
  GetTransactionTransfersSchema,
} from '../schemas/index.js';
import type { TransactionData } from '../types/index.js';

/**
 * Transaction-related tool handlers
 */
export class TransactionHandlers {
  constructor(private provider: IntentProvider) {}

  /**
   * Handle getting recent transactions for a wallet
   */
  async handleGetRecentTransactions(args: any) {
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
  async handleGetTransactionDetails(args: any) {
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
  async handleGetTranslatedTransaction(args: any) {
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
  async handleGetTransactionTransfers(args: any) {
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
} 