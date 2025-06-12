import { IntentProvider } from '@noves/intent-ethers-provider';
import {
  GetCurrentTokenPriceSchema,
  GetHistoricalTokenPriceSchema,
  GetTokenPriceComparisonSchema,
} from '../schemas/index.js';
import type { TokenPriceData } from '../types/index.js';

// Extended IntentProvider interface to include new getTokenPrice method
interface ExtendedIntentProvider extends IntentProvider {
  getTokenPrice(params: {
    chain: string;
    token_address: string;
    timestamp?: string;
  }): Promise<TokenPriceData>;
}

/**
 * Token price tool handlers
 */
export class TokenHandlers {
  constructor(private provider: IntentProvider) {}

  // Type assertion helper to access the new getTokenPrice method
  private get extendedProvider(): ExtendedIntentProvider {
    return this.provider as ExtendedIntentProvider;
  }

  /**
   * Handle getting current token price
   */
  async handleGetCurrentTokenPrice(args: any) {
    const { chain, tokenAddress } = GetCurrentTokenPriceSchema.parse(args);

    try {
      // Get current token price using the provider
      const priceData = await this.extendedProvider.getTokenPrice({
        chain: chain,
        token_address: tokenAddress
      });

      const response = `**Current Token Price**

**Token Address:** ${tokenAddress}
**Chain:** ${chain}
**Current Price:** ${priceData.price.amount} ${priceData.price.currency}
${priceData.token?.symbol ? `**Symbol:** ${priceData.token.symbol}` : ''}
${priceData.token?.name ? `**Name:** ${priceData.token.name}` : ''}

**Price Information:**
- Amount: ${priceData.price.amount}
- Currency: ${priceData.price.currency}
- Retrieved at: ${new Date().toISOString()}`;

      return {
        content: [
          {
            type: 'text',
            text: response,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching current token price: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
          },
        ],
      };
    }
  }

  /**
   * Handle getting historical token price
   */
  async handleGetHistoricalTokenPrice(args: any) {
    const { chain, tokenAddress, timestamp } = GetHistoricalTokenPriceSchema.parse(args);

    try {
      // Get historical token price using the provider
      const priceData = await this.extendedProvider.getTokenPrice({
        chain: chain,
        token_address: tokenAddress,
        timestamp: timestamp
      });

      const timestampDate = new Date(parseInt(timestamp) * 1000);

      const response = `**Historical Token Price**

**Token Address:** ${tokenAddress}
**Chain:** ${chain}
**Historical Price:** ${priceData.price.amount} ${priceData.price.currency}
**Date:** ${timestampDate.toISOString()}
${priceData.token?.symbol ? `**Symbol:** ${priceData.token.symbol}` : ''}
${priceData.token?.name ? `**Name:** ${priceData.token.name}` : ''}

**Price Information:**
- Amount: ${priceData.price.amount}
- Currency: ${priceData.price.currency}
- Timestamp: ${timestamp} (Unix)
- Date: ${timestampDate.toLocaleDateString()} ${timestampDate.toLocaleTimeString()}`;

      return {
        content: [
          {
            type: 'text',
            text: response,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error fetching historical token price: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
          },
        ],
      };
    }
  }

  /**
   * Handle token price comparison between two timestamps
   */
  async handleGetTokenPriceComparison(args: any) {
    const { chain, tokenAddress, fromTimestamp, toTimestamp } = GetTokenPriceComparisonSchema.parse(args);

    try {
      // Use current timestamp if toTimestamp is not provided
      const endTimestamp = toTimestamp || Math.floor(Date.now() / 1000).toString();
      
      // Get both prices
      const [fromPriceData, toPriceData] = await Promise.all([
        this.extendedProvider.getTokenPrice({
          chain: chain,
          token_address: tokenAddress,
          timestamp: fromTimestamp
        }),
        endTimestamp === Math.floor(Date.now() / 1000).toString() 
          ? this.extendedProvider.getTokenPrice({
              chain: chain,
              token_address: tokenAddress
            })
          : this.extendedProvider.getTokenPrice({
              chain: chain,
              token_address: tokenAddress,
              timestamp: endTimestamp
            })
      ]);

      const fromPrice = parseFloat(fromPriceData.price.amount);
      const toPrice = parseFloat(toPriceData.price.amount);
      const priceChange = toPrice - fromPrice;
      const percentageChange = fromPrice !== 0 ? ((priceChange / fromPrice) * 100) : 0;

      const fromDate = new Date(parseInt(fromTimestamp) * 1000);
      const toDate = new Date(parseInt(endTimestamp) * 1000);

      const changeDirection = priceChange >= 0 ? '📈' : '📉';
      const changeColor = priceChange >= 0 ? 'increased' : 'decreased';

      const response = `**Token Price Comparison**

**Token Address:** ${tokenAddress}
**Chain:** ${chain}
${fromPriceData.token?.symbol ? `**Symbol:** ${fromPriceData.token.symbol}` : ''}
${fromPriceData.token?.name ? `**Name:** ${fromPriceData.token.name}` : ''}

**Price Comparison:**
- **From:** ${fromDate.toLocaleDateString()} - ${fromPriceData.price.amount} ${fromPriceData.price.currency}
- **To:** ${toDate.toLocaleDateString()} - ${toPriceData.price.amount} ${toPriceData.price.currency}

**Price Movement:** ${changeDirection}
- **Change:** ${priceChange > 0 ? '+' : ''}${priceChange.toFixed(6)} ${fromPriceData.price.currency}
- **Percentage:** ${percentageChange > 0 ? '+' : ''}${percentageChange.toFixed(2)}%
- **Direction:** Price has ${changeColor} ${changeDirection}

**Analysis:**
The token price has ${changeColor} by ${Math.abs(percentageChange).toFixed(2)}% over the selected period.`;

      return {
        content: [
          {
            type: 'text',
            text: response,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error comparing token prices: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
          },
        ],
      };
    }
  }
} 