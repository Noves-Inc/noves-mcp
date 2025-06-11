# Noves MCP Server

An MCP (Model Context Protocol) server that wraps the Noves Intent service to provide natural language blockchain data. This allows AI assistants to have conversational access to blockchain transaction data with human-readable descriptions.

## 🌟 Features

- **🗣️ Natural Language Blockchain Data**: Get transaction descriptions in plain English
- **🌐 Multiple Blockchain Support**: Works with 100+ blockchain networks supported by Noves
- **💬 Conversational Interface**: Perfect for AI assistants to understand and explain blockchain activity
- **🔧 Multiple Analysis Tools**: 6 specialized tools for different types of blockchain analysis
- **⚡ Easy Installation**: Install via NPM with a single command
- **🔒 No Authentication Required**: Noves Intent service is free to use

## 🛠️ Available Tools

### 🔍 **Transaction Analysis Tools**

1. **`get_recent_transactions`**: Get recent transactions for a wallet address with natural language descriptions
2. **`get_transaction_details`**: Get detailed analysis of a specific transaction (filtered from recent transactions)
3. **`get_translated_transaction`**: Get human-readable description of a specific transaction using Noves translation
4. **`get_transaction_transfers`**: Get detailed transfer information focusing on token movements

### 📊 **Wallet Analysis Tools**

5. **`get_wallet_summary`**: Get a comprehensive summary of wallet activity with key insights
6. **`analyze_wallet`**: Analyze wallet activity and provide detailed insights with natural language summaries

## 🚀 Quick Start

### Installation for Cursor/Claude

Add this MCP server to your Cursor configuration file (`~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "noves-blockchain": {
      "command": "npx",
      "args": ["@noves/noves-mcp-server@0.1.0"]
    }
  }
}
```

**That's it!** The server will be automatically downloaded and running when you restart Cursor.

### Example Cursor Configuration

```json
{
  "mcpServers": {
    "browser-tools": {
      "command": "npx",
      "args": ["@agentdeskai/browser-tools-mcp@1.1.0"]
    },
    "noves-blockchain": {
      "command": "npx",
      "args": ["@noves/noves-mcp-server@0.1.0"]
    }
  }
}
```

## 💬 How to Use

Once installed, you can have natural conversations with your AI assistant about blockchain data:

### 🎯 **Example Questions & Conversations**

**Recent Activity:**

> "What are the recent transactions for wallet 0x28c6c06298d514db089934071355e5743bf21d60 on Ethereum?"

**Wallet Analysis:**

> "Can you analyze the activity of the Binance hot wallet and tell me what kind of transactions they've been doing?"

**Specific Transaction:**

> "Get details for this transaction hash: 0x1234... and explain what happened"

**Token Transfers:**

> "Show me the recent token transfers for wallet 0xabc123... on Polygon and focus on what tokens were moved"

**Comprehensive Summary:**

> "Give me a complete summary of this wallet's activity on Arbitrum with key insights"

**Multi-Chain Analysis:**

> "Compare the activity of this wallet on Ethereum vs Polygon"

### 🤖 **AI Context Awareness**

The AI will automatically choose the best tool based on your question:

- Asking about "recent activity" → `get_recent_transactions`
- Asking about a specific hash → `get_translated_transaction`
- Asking for "analysis" or "insights" → `analyze_wallet`
- Asking about "transfers" or "tokens moved" → `get_transaction_transfers`
- Asking for a "summary" → `get_wallet_summary`

## 🌐 Supported Networks

The server supports **100+ blockchain networks** that Noves supports, including:

| **Major Networks**    | **Layer 2s**          | **Alt Chains**              |
| --------------------- | --------------------- | --------------------------- |
| Ethereum (`ethereum`) | Polygon (`polygon`)   | Binance Smart Chain (`bsc`) |
| Bitcoin (`bitcoin`)   | Arbitrum (`arbitrum`) | Avalanche (`avalanche`)     |
|                       | Optimism (`optimism`) | Fantom (`fantom`)           |
|                       | Base (`base`)         | Cronos (`cronos`)           |

And many more! Just use the network name as specified by Noves.

## 🔧 Development & Local Testing

### For Contributors

1. **Clone the repository:**

```bash
git clone <repository-url>
cd noves-mcp-server
```

2. **Install dependencies:**

```bash
npm install
```

3. **Build the project:**

```bash
npm run build
```

4. **Test locally:**

```bash
npm start
```

### Development Commands

- `npm run build` - Build TypeScript
- `npm run start` - Run compiled server
- `npm run dev` - Run with ts-node for development
- `npm run prepare` - Prepare for publishing

## 📦 Publishing Updates

For maintainers updating the package:

1. **Make your changes**
2. **Update version in `package.json`**
3. **Build and publish:**

```bash
npm run build
npm publish
```

4. **Users can update by changing the version in their Cursor config**

## ❓ Troubleshooting

### MCP Server Shows "0 tools enabled"

- Make sure you restarted Cursor after adding the configuration
- Check that the package name and version are correct in your `mcp.json`
- Verify your `mcp.json` syntax is valid JSON

### Connection Issues

- The server uses stdio communication (no network required)
- No authentication or API keys needed
- Check Cursor's MCP logs for specific error messages

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Related Projects

- [Noves Intent Ethers Provider](https://www.npmjs.com/package/@noves/intent-ethers-provider) - The underlying library
- [Model Context Protocol](https://github.com/modelcontextprotocol) - The MCP standard
