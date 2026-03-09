# TOOL Layer

**Navigation:** [Home](/) > [tool](/AgentSite/tool/)

**Summary:** Callable tool contracts grouped by task, with a low-cost reading path for choosing the right tool quickly.

---

The TOOL layer defines what the agent can DO as atomic operations. Each tool has a clear contract: when to call it, what parameters it takes, and how to handle failures.

## Fast Routing Table

Use this page as the router. In most cases, read this page first, then jump to only one or two specific tool pages.

| If the user wants... | Start here | Then optionally add |
|----------------------|------------|---------------------|
| token facts, price, contract, holders | [searchTokenInfo](/AgentSite/tool/search-token-info/) | [projectTool](/AgentSite/tool/project-tool/), [searchTwitter](/AgentSite/tool/search-twitter/), [webSearch](/AgentSite/tool/web-search/) |
| wallet balances or history | [getWalletTokenBalance](/AgentSite/tool/wallet-token-balance/) | [searchTokenInfo](/AgentSite/tool/search-token-info/) |
| pools, APY, staking options | [searchPoolInfo](/AgentSite/tool/search-pool-info/) | [ExecuteStakeTool](/AgentSite/tool/execute-stake/) |
| swaps or transfers | [ExecuteSwapTool](/AgentSite/tool/execute-swap/) or [ExecuteTransferTool](/AgentSite/tool/execute-transfer/) | [searchTokenInfo](/AgentSite/tool/search-token-info/) |
| alerts | [setupAlert](/AgentSite/tool/setup-alert/) | [searchTokenInfo](/AgentSite/tool/search-token-info/) |
| chain or protocol analysis | [chainTool](/AgentSite/tool/chain-tool/) or [protocolTool](/AgentSite/tool/protocol-tool/) | [webSearch](/AgentSite/tool/web-search/) |
| project sentiment or market pulse | [projectTool](/AgentSite/tool/project-tool/) or [getTrendingInsights](/AgentSite/tool/trending-insights/) | [searchTwitter](/AgentSite/tool/search-twitter/), [webSearch](/AgentSite/tool/web-search/) |

## Tool Groups

### Discovery and Analysis

| Tool | Purpose | Page |
|------|---------|------|
| searchTokenInfo | Token lookup, price, metadata, holder view inputs | [search-token-info](/AgentSite/tool/search-token-info/) |
| searchPoolInfo | Pool discovery, scoring, APY/TVL trend analysis | [search-pool-info](/AgentSite/tool/search-pool-info/) |
| chainTool | Chain-level DEX volume, TVL, protocol ranking analysis | [chain-tool](/AgentSite/tool/chain-tool/) |
| protocolTool | DeFi protocol financial and TVL analysis | [protocol-tool](/AgentSite/tool/protocol-tool/) |
| projectTool | Project metadata, valuation sentiment, and prediction-market style signals | [project-tool](/AgentSite/tool/project-tool/) |
| getTrendingInsights | Trending gainers or losers, community topics, tokens, and contract trends | [trending-insights](/AgentSite/tool/trending-insights/) |

### Wallet and Execution

| Tool | Purpose | Page |
|------|---------|------|
| getWalletTokenBalance | Wallet balances, activity, and transaction history | [wallet-token-balance](/AgentSite/tool/wallet-token-balance/) |
| ExecuteTransferTool | Token transfer execution setup | [execute-transfer](/AgentSite/tool/execute-transfer/) |
| ExecuteSwapTool | Token swap execution setup | [execute-swap](/AgentSite/tool/execute-swap/) |
| ExecuteStakeTool | Staking execution by `pool_id` | [execute-stake](/AgentSite/tool/execute-stake/) |
| setupAlert | Natural-language alert parsing | [setup-alert](/AgentSite/tool/setup-alert/) |

### External Signal Collection

| Tool | Purpose | Page |
|------|---------|------|
| searchTwitter | Twitter/X search for crypto discussion | [search-twitter](/AgentSite/tool/search-twitter/) |
| webSearch | Open-web search for live information | [web-search](/AgentSite/tool/web-search/) |

**Core rule**: Tools are the PRIMARY information source. Never ask the user for information that tools can provide. Call tools immediately, iterate if results are insufficient.

**Concurrency**: All tools called in the same round execute in parallel. If tool B needs output from tool A, call them in SEPARATE rounds.

## Common Multi-Tool Patterns

Former mock "skill" flows are documented here as tool combinations rather than separate pages.

| Goal | Typical Tool Combination |
|------|--------------------------|
| Token due diligence | `searchTokenInfo` + `projectTool` + `searchTwitter` + `webSearch` |
| Protocol due diligence | `protocolTool` + `chainTool` + `webSearch` |
| Yield discovery and execution | `searchPoolInfo` + `ExecuteStakeTool` |
| Wallet review | `getWalletTokenBalance` + `searchTokenInfo` |
| Market pulse scan | `getTrendingInsights` + `chainTool` + `searchTwitter` |

## Packaging Note

This overview is intentionally dense so an agent can pick the right branch with one read. Detailed parameter contracts stay in per-tool pages.

**Subdirectories** under this directory:
- (none)

**Pages** in this directory:
- [chain-tool](/AgentSite/tool/chain-tool/)
- [execute-stake](/AgentSite/tool/execute-stake/)
- [execute-swap](/AgentSite/tool/execute-swap/)
- [execute-transfer](/AgentSite/tool/execute-transfer/)
- [project-tool](/AgentSite/tool/project-tool/)
- [protocol-tool](/AgentSite/tool/protocol-tool/)
- [search-pool-info](/AgentSite/tool/search-pool-info/)
- [search-token-info](/AgentSite/tool/search-token-info/)
- [search-twitter](/AgentSite/tool/search-twitter/)
- [setup-alert](/AgentSite/tool/setup-alert/)
- [trending-insights](/AgentSite/tool/trending-insights/)
- [wallet-token-balance](/AgentSite/tool/wallet-token-balance/)
- [web-search](/AgentSite/tool/web-search/)
