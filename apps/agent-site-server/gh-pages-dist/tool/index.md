# TOOL Layer

**Navigation:** [Home](/) > [tool](/AgentSite/tool/index.md)

**Summary:** Callable contracts grouped for progressive routing: choose one branch, open one page, execute, iterate.

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
| token facts, price, contract, holders | [searchTokenInfo](/AgentSite/tool/search-token-info.md) | [projectTool](/AgentSite/tool/project-tool.md), [searchTwitter](/AgentSite/tool/search-twitter.md), [webSearch](/AgentSite/tool/web-search.md) |
| wallet balances or history | [getWalletTokenBalance](/AgentSite/tool/wallet-token-balance.md) | [searchTokenInfo](/AgentSite/tool/search-token-info.md) |
| pools, APY, staking options | [searchPoolInfo](/AgentSite/tool/search-pool-info.md) | [ExecuteStakeTool](/AgentSite/tool/execute-stake.md) |
| swaps or transfers | [ExecuteSwapTool](/AgentSite/tool/execute-swap.md) or [ExecuteTransferTool](/AgentSite/tool/execute-transfer.md) | [searchTokenInfo](/AgentSite/tool/search-token-info.md) |
| alerts | [setupAlert](/AgentSite/tool/setup-alert.md) | [searchTokenInfo](/AgentSite/tool/search-token-info.md) |
| chain or protocol analysis | [chainTool](/AgentSite/tool/chain-tool.md) or [protocolTool](/AgentSite/tool/protocol-tool.md) | [webSearch](/AgentSite/tool/web-search.md) |
| project sentiment or market pulse | [projectTool](/AgentSite/tool/project-tool.md) or [getTrendingInsights](/AgentSite/tool/trending-insights.md) | [searchTwitter](/AgentSite/tool/search-twitter.md), [webSearch](/AgentSite/tool/web-search.md) |

## Endpoint-Critical Pages

| Tool | Endpoint Rule |
|------|---------------|
| [searchTokenInfo](/AgentSite/tool/search-token-info.md) | Must call remote `/token/v2/analysis` endpoint with intent-driven parameters |
| [projectTool](/AgentSite/tool/project-tool.md) | Must call remote `/project/analysis` endpoint with intent-driven parameters |

## Tool Catalog

### Analysis

| Tool | Purpose | Page |
|------|---------|------|
| searchTokenInfo | Token lookup, price, metadata, holder inputs | [search-token-info](/AgentSite/tool/search-token-info.md) |
| searchPoolInfo | Pool discovery, scoring, APY/TVL trends | [search-pool-info](/AgentSite/tool/search-pool-info.md) |
| chainTool | Chain-level volume, TVL, protocol ranking analysis | [chain-tool](/AgentSite/tool/chain-tool.md) |
| protocolTool | DeFi protocol financial and TVL analysis | [protocol-tool](/AgentSite/tool/protocol-tool.md) |
| projectTool | Project metadata and prediction-market style signals | [project-tool](/AgentSite/tool/project-tool.md) |
| getTrendingInsights | Trending assets, topics, and contracts | [trending-insights](/AgentSite/tool/trending-insights.md) |

### Wallet and Execution

| Tool | Purpose | Page |
|------|---------|------|
| getWalletTokenBalance | Wallet balances, activity, and transaction history | [wallet-token-balance](/AgentSite/tool/wallet-token-balance.md) |
| ExecuteTransferTool | Token transfer execution setup | [execute-transfer](/AgentSite/tool/execute-transfer.md) |
| ExecuteSwapTool | Token swap execution setup | [execute-swap](/AgentSite/tool/execute-swap.md) |
| ExecuteStakeTool | Staking execution by `pool_id` | [execute-stake](/AgentSite/tool/execute-stake.md) |
| setupAlert | Natural-language alert parsing | [setup-alert](/AgentSite/tool/setup-alert.md) |

### External Signals

| Tool | Purpose | Page |
|------|---------|------|
| searchTwitter | Twitter/X search for crypto discussion | [search-twitter](/AgentSite/tool/search-twitter.md) |
| webSearch | Open-web search for live information | [web-search](/AgentSite/tool/web-search.md) |

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

**Subdirectories** under this directory:
- (none)

**Pages** in this directory:
- [chain-tool](/AgentSite/tool/chain-tool.md)
- [execute-stake](/AgentSite/tool/execute-stake.md)
- [execute-swap](/AgentSite/tool/execute-swap.md)
- [execute-transfer](/AgentSite/tool/execute-transfer.md)
- [project-tool](/AgentSite/tool/project-tool.md)
- [protocol-tool](/AgentSite/tool/protocol-tool.md)
- [search-pool-info](/AgentSite/tool/search-pool-info.md)
- [search-token-info](/AgentSite/tool/search-token-info.md)
- [search-twitter](/AgentSite/tool/search-twitter.md)
- [setup-alert](/AgentSite/tool/setup-alert.md)
- [trending-insights](/AgentSite/tool/trending-insights.md)
- [wallet-token-balance](/AgentSite/tool/wallet-token-balance.md)
- [web-search](/AgentSite/tool/web-search.md)
