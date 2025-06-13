import { IntentProvider } from '@noves/intent-ethers-provider';
import {
  GetCurrentTokenPriceSchema,
  GetHistoricalTokenPriceSchema,
  GetTokenPriceComparisonSchema,
} from '../schemas/index.js';
import type { TokenPriceData } from '../types/index.js';

/**
 * Token price tool handlers
 * Uses the getTokenPrice method available on IntentProvider
 */
export class TokenHandlers {
  constructor(private provider: IntentProvider) {
    // Debug: Log provider initialization
    console.error('🔧 TokenHandlers initialized');
    console.error('🔧 Provider instance:', !!this.provider);
    console.error('🔧 Provider constructor:', this.provider.constructor.name);
    console.error('🔧 Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.provider)));

    // Check for the getTokenPrice method
    console.error('🔧 Has getTokenPrice method:', typeof (this.provider as any).getTokenPrice);

    if (typeof (this.provider as any).getTokenPrice === 'function') {
      console.error('✅ getTokenPrice method exists on provider');
    } else {
      console.error('❌ getTokenPrice method NOT found on provider');
      console.error('🔧 Available methods:', Object.getOwnPropertyNames(this.provider));
      console.error('🔧 Available prototype methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(this.provider)));
    }
  }

  /**
   * Handle getting current token price using getTokenPrice
   */
  async handleGetCurrentTokenPrice(args: any) {
    console.error('🚀 handleGetCurrentTokenPrice called with args:', JSON.stringify(args, null, 2));

    try {
      const { chain, tokenAddress } = GetCurrentTokenPriceSchema.parse(args);
      console.error('✅ Schema validation passed:', { chain, tokenAddress });

      // Debug: Log the exact parameters being passed
      const params = {
        chain: chain,
        token_address: tokenAddress
      };
      console.error('🔧 Calling getTokenPrice with params:', JSON.stringify(params, null, 2));

      // Check if method exists before calling
      if (typeof (this.provider as any).getTokenPrice !== 'function') {
        throw new Error('getTokenPrice method not available on provider instance');
      }

      // Get current token price using the provider
      console.error('🔄 Making getTokenPrice call...');
      const priceData = await (this.provider as any).getTokenPrice(params) as TokenPriceData;
      console.error('✅ getTokenPrice response:', JSON.stringify(priceData, null, 2));

      const response = `**Current Token Price**

**Token Address:** ${tokenAddress}
**Chain:** ${chain}
**Current Price:** ${priceData.price.amount} ${priceData.price.currency}
${priceData.token?.symbol ? `**Symbol:** ${priceData.token.symbol}` : ''}
${priceData.token?.name ? `**Name:** ${priceData.token.name}` : ''}

**Price Information:**
- Amount: ${priceData.price.amount}
- Currency: ${priceData.price.currency}
- Status: ${priceData.price.status}
- Block: ${priceData.block}
- Retrieved at: ${new Date().toISOString()}

**Pricing Details:**
- Priced by: ${priceData.pricedBy?.exchange?.name || 'Unknown'} (${priceData.pricedBy?.poolAddress || 'N/A'})
- Liquidity: ${priceData.pricedBy?.liquidity ? `$${priceData.pricedBy.liquidity.toLocaleString()}` : 'N/A'}
- Price Type: ${priceData.priceType}`;

      console.error('✅ Returning successful response');
      return {
        content: [
          {
            type: 'text',
            text: response,
          },
        ],
      };
    } catch (error) {
      console.error('❌ Error in handleGetCurrentTokenPrice:', error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');

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
   * Handle getting historical token price using getTokenPrice
   */
  async handleGetHistoricalTokenPrice(args: any) {
    console.error('🚀 handleGetHistoricalTokenPrice called with args:', JSON.stringify(args, null, 2));

    try {
      const { chain, tokenAddress, timestamp } = GetHistoricalTokenPriceSchema.parse(args);
      console.error('✅ Schema validation passed:', { chain, tokenAddress, timestamp });

      // Debug: Log the exact parameters being passed
      const params = {
        chain: chain,
        token_address: tokenAddress,
        timestamp: timestamp
      };
      console.error('🔧 Calling getTokenPrice with params:', JSON.stringify(params, null, 2));

      // Check if method exists before calling
      if (typeof (this.provider as any).getTokenPrice !== 'function') {
        throw new Error('getTokenPrice method not available on provider instance');
      }

      // Get historical token price using the provider
      console.error('🔄 Making getTokenPrice call...');
      const priceData = await (this.provider as any).getTokenPrice(params) as TokenPriceData;
      console.error('✅ getTokenPrice response:', JSON.stringify(priceData, null, 2));

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
- Status: ${priceData.price.status}
- Block: ${priceData.block}
- Timestamp: ${timestamp} (Unix)
- Date: ${timestampDate.toLocaleDateString()} ${timestampDate.toLocaleTimeString()}

**Pricing Details:**
- Priced by: ${priceData.pricedBy?.exchange?.name || 'Unknown'} (${priceData.pricedBy?.poolAddress || 'N/A'})
- Liquidity: ${priceData.pricedBy?.liquidity ? `$${priceData.pricedBy.liquidity.toLocaleString()}` : 'N/A'}
- Price Type: ${priceData.priceType}`;

      console.error('✅ Returning successful response');
      return {
        content: [
          {
            type: 'text',
            text: response,
          },
        ],
      };
    } catch (error) {
      console.error('❌ Error in handleGetHistoricalTokenPrice:', error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');

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
    console.error('🚀 handleGetTokenPriceComparison called with args:', JSON.stringify(args, null, 2));

    try {
      const { chain, tokenAddress, fromTimestamp, toTimestamp } = GetTokenPriceComparisonSchema.parse(args);
      console.error('✅ Schema validation passed:', { chain, tokenAddress, fromTimestamp, toTimestamp });

      // Use current timestamp if toTimestamp is not provided
      const endTimestamp = toTimestamp || Math.floor(Date.now() / 1000).toString();

      // Check if method exists before calling
      if (typeof (this.provider as any).getTokenPrice !== 'function') {
        throw new Error('getTokenPrice method not available on provider instance');
      }

      console.error('🔄 Making parallel getTokenPrice calls...');

      // Get both prices
      const [fromPriceData, toPriceData] = await Promise.all([
        (this.provider as any).getTokenPrice({
          chain: chain,
          token_address: tokenAddress,
          timestamp: fromTimestamp
        }) as Promise<TokenPriceData>,
        endTimestamp === Math.floor(Date.now() / 1000).toString()
          ? (this.provider as any).getTokenPrice({
            chain: chain,
            token_address: tokenAddress
          }) as Promise<TokenPriceData>
          : (this.provider as any).getTokenPrice({
            chain: chain,
            token_address: tokenAddress,
            timestamp: endTimestamp
          }) as Promise<TokenPriceData>
      ]);

      console.error('✅ Both getTokenPrice calls completed');
      console.error('🔧 From price data:', JSON.stringify(fromPriceData, null, 2));
      console.error('🔧 To price data:', JSON.stringify(toPriceData, null, 2));

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
The token price has ${changeColor} by ${Math.abs(percentageChange).toFixed(2)}% over the selected period.

**Pricing Details:**
- From Block: ${fromPriceData.block}
- To Block: ${toPriceData.block}
- Price Type: ${fromPriceData.priceType}`;

      console.error('✅ Returning successful response');
      return {
        content: [
          {
            type: 'text',
            text: response,
          },
        ],
      };
    } catch (error) {
      console.error('❌ Error in handleGetTokenPriceComparison:', error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');

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