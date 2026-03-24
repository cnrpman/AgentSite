---
title: TOOL Layer
summary: "Callable contracts grouped for progressive routing: choose one branch, open one page, execute, iterate."
---
The TOOL layer defines executable capabilities. For each task, choose the smallest matching page and execute from that contract.

## Progressive Tool Flow

1. Select one task row below
2. Open one or more relevant tool pages based on query scope
3. Execute tools with required parameters
4. Add dependent or validating tools in additional rounds as needed

## Fetch Budget and Stop Rules

- Start with the smallest relevant tool set, then expand to additional tool pages when evidence is incomplete
- Open add-on pages when attribution, validation, or workflow dependencies require them
- Stop doc traversal once endpoint, required params, and constraints are known
- Prefer retrying tool calls over opening many additional docs pages

## Fast Routing Table

| If the user wants... | Primary Tool | Optional Add-Ons |
|----------------------|------------|---------------------|
| token facts, price, contract, holders | [searchTokenInfo](/tool/search-token-info/) | [projectTool](/tool/project-tool/), [searchTwitter](/tool/search-twitter/), [webSearch](/tool/web-search/) |
| wallet balances or history | [getWalletTokenBalance](/tool/wallet-token-balance/) | [searchTokenInfo](/tool/search-token-info/) |
| pools, APY, staking options | [searchPoolInfo](/tool/search-pool-info/) | [ExecuteStakeTool](/tool/execute-stake/) |
| swaps or transfers | [ExecuteSwapTool](/tool/execute-swap/) or [ExecuteTransferTool](/tool/execute-transfer/) | [searchTokenInfo](/tool/search-token-info/) |
| alerts | [setupAlert](/tool/setup-alert/) | [searchTokenInfo](/tool/search-token-info/) |
| chain or protocol analysis | [chainTool](/tool/chain-tool/) or [protocolTool](/tool/protocol-tool/) | [webSearch](/tool/web-search/) |
| project sentiment or market pulse | [projectTool](/tool/project-tool/) or [getTrendingInsights](/tool/trending-insights/) | [searchTwitter](/tool/search-twitter/), [webSearch](/tool/web-search/) |

## Endpoint-Critical Pages

| Tool | Endpoint Rule |
|------|---------------|
| [searchTokenInfo](/tool/search-token-info/) | Must call remote `/token/v2/analysis` endpoint with intent-driven parameters |
| [projectTool](/tool/project-tool/) | Must call remote `/project/analysis` endpoint with intent-driven parameters |

## Tool Catalog

### Analysis

| Tool | Purpose | Page |
|------|---------|------|
| searchTokenInfo | Token lookup, price, metadata, holder inputs | [search-token-info](/tool/search-token-info/) |
| searchPoolInfo | Pool discovery, scoring, APY/TVL trends | [search-pool-info](/tool/search-pool-info/) |
| chainTool | Chain-level volume, TVL, protocol ranking analysis | [chain-tool](/tool/chain-tool/) |
| protocolTool | DeFi protocol financial and TVL analysis | [protocol-tool](/tool/protocol-tool/) |
| projectTool | Project metadata and prediction-market style signals | [project-tool](/tool/project-tool/) |
| getTrendingInsights | Trending assets, topics, and contracts | [trending-insights](/tool/trending-insights/) |

### Wallet and Execution

| Tool | Purpose | Page |
|------|---------|------|
| getWalletTokenBalance | Wallet balances, activity, and transaction history | [wallet-token-balance](/tool/wallet-token-balance/) |
| ExecuteTransferTool | Token transfer execution setup | [execute-transfer](/tool/execute-transfer/) |
| ExecuteSwapTool | Token swap execution setup | [execute-swap](/tool/execute-swap/) |
| ExecuteStakeTool | Staking execution by `pool_id` | [execute-stake](/tool/execute-stake/) |
| setupAlert | Natural-language alert parsing | [setup-alert](/tool/setup-alert/) |

### External Signals

| Tool | Purpose | Page |
|------|---------|------|
| searchTwitter | Twitter/X search for crypto discussion | [search-twitter](/tool/search-twitter/) |
| webSearch | Open-web search for live information | [web-search](/tool/web-search/) |

## Core Rules

- Tools are the primary factual source
- Never ask users for information that tools can provide
- Call tools immediately, iterate if results are insufficient
- If tool B depends on tool A output, call them in separate rounds

## Common Multi-Tool Patterns

| Goal | Typical Tool Combination |
|------|--------------------------|
| Token due diligence | `searchTokenInfo` + `projectTool` + `searchTwitter` + `webSearch` |
| Protocol due diligence | `protocolTool` + `chainTool` + `webSearch` |
| Yield discovery and execution | `searchPoolInfo` + `ExecuteStakeTool` |
| Wallet review | `getWalletTokenBalance` + `searchTokenInfo` |
| Market pulse scan | `getTrendingInsights` + `chainTool` + `searchTwitter` |

## Packaging Note

Keep router pages dense and leaf pages explicit. This preserves a shallow navigation tree and reduces retrieval cost.
