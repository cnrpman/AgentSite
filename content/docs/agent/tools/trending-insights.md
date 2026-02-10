---
title: Trending Insights Tool
summary: Aggregate trending tokens, topics, and contracts.
---
**Tool ID:** `getTrendingInsights`

## Purpose
Collect trending datasets from multiple sources, including gainers/losers, community topics, community tokens, and preset trending contracts.

## Use This When
- You need a fast snapshot of what is trending.
- You want to build a market overview section.

## Input
All fields are optional.

Supported fields:
- `sections`: Array of requested datasets. Common values: `gainersLosers`, `communityTopics`, `communityTokens`, `duneContracts` (if enabled).
- `convert`: Quote currency (default `USD`).
- `timeFrame`: Time frame for gainers/losers (e.g. `24h`, `7d`).
- `gainersLosersLimit`: 1-100.
- `communityTopicsLimit`: 1-100.
- `communityTokensLimit`: 1-100.
- `duneChain`: Chain slug (e.g. `ethereum`, `bnb`).
- `duneContractsLimit`: 1-100.

## Output
- `success`: Boolean.
- `data`: Object keyed by section name.
- `error`: Aggregated error when any section fails.

## Example Call
```json
{
  "tool": "getTrendingInsights",
  "arguments": {
    "sections": ["gainersLosers", "communityTokens"],
    "timeFrame": "24h",
    "gainersLosersLimit": 10
  }
}
```

## Example Response
```json
{
  "success": true,
  "data": {
    "gainersLosers": [{ "symbol": "ABC", "change24h": 0.42 }],
    "communityTokens": [{ "symbol": "XYZ", "mentions": 320 }]
  }
}
```

## See also
- [Search Token Info](/docs/agent/tools/search-token/)
- [Web Search](/docs/agent/tools/web-search/)
