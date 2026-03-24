---
title: chainTool
summary: Retrieve chain-level DEX volume, TVL, and protocol-performance analysis for a blockchain network.
---
## Purpose

Analyze a chain's DeFi activity through DEX volume statistics, TVL data, protocol rankings, and market-share distribution.

## Endpoint

`/chain/analysis`

## Parameters

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `chainId` | string | Conditionally | Chain ID such as `1` or `56` |
| `chainName` | string | Conditionally | Chain name such as `Ethereum`, `Polygon`, or `Arbitrum` |

At least one of `chainId` or `chainName` must be provided. If `chainId` is provided, it can be mapped to `chainName`.

## Use Rules

- At least one of `chainId` or `chainName` is required
- Always call the remote endpoint above for chain analysis
- Build request parameters from user intent; do not hardcode values

## When to Call

- Chain comparison
- DEX activity review
- TVL trend review
- Protocol dominance analysis
- Trading-pattern scans at the chain level

## See Also

- [protocolTool](/tool/protocol-tool/) for protocol-level financial analysis
- [getTrendingInsights](/tool/trending-insights/) for broader market trend inputs
