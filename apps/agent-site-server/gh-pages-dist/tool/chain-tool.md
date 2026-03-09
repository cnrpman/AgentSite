# chainTool

**Navigation:** [Home](/) > [tool](/AgentSite/tool/index.md) > [chain-tool](/AgentSite/tool/chain-tool.md)

**Summary:** Retrieve chain-level DEX volume, TVL, and protocol-performance analysis for a blockchain network.

---

## Purpose

Analyze a chain's DeFi activity through DEX volume statistics, TVL data, protocol rankings, and market-share distribution.

## Parameters

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `chainId` | string | Conditionally | Chain ID such as `1` or `56` |
| `chainName` | string | Conditionally | Chain name such as `Ethereum`, `Polygon`, or `Arbitrum` |

At least one of `chainId` or `chainName` must be provided. If `chainId` is provided, it can be mapped to `chainName`.

## When to Call

- Chain comparison
- DEX activity review
- TVL trend review
- Protocol dominance analysis
- Trading-pattern scans at the chain level

## See Also

- [protocolTool](/AgentSite/tool/protocol-tool.md) for protocol-level financial analysis
- [getTrendingInsights](/AgentSite/tool/trending-insights.md) for broader market trend inputs

Pages that **Backlink** to here:
- [TOOL Layer](/AgentSite/tool/index.md)
