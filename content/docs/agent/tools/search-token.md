---
title: Search Token Info Tool
summary: Lookup token metadata, market stats, top holders, and technical analysis.
---
**Tool ID:** `searchTokenInfo`

## Purpose
Retrieve a token's contract details, market statistics, official links, top holders, and technical analysis for a given chain.

## Use This When
- You need a token contract address or decimals.
- You want price, market cap, or 24h volume.
- You need official links or a technical analysis summary.

## Input
Required fields:
- `tokenSymbol` or `tokenAddress`.
- `chainId` is required when `tokenSymbol` is provided.

Optional fields:
- `holdersLimit`: 1-50.
- `quoteCurrency`: Quote currency for technical analysis (default `USDT`).

Validation rules:
- `tokenAddress` must be a valid EVM address if provided.
- If both `tokenSymbol` and `tokenAddress` are provided, the tool verifies they match.

## Output
- `success`: Boolean.
- `data`: Token metadata, market stats, top holders (when available), and technical analysis.
- `error`: Failure reason when unsuccessful.

## Example Call
```json
{
  "tool": "searchTokenInfo",
  "arguments": {
    "tokenSymbol": "ETH",
    "chainId": "1",
    "holdersLimit": 10,
    "quoteCurrency": "USDT"
  }
}
```

## Example Response
```json
{
  "success": true,
  "data": {
    "token": {
      "symbol": "ETH",
      "address": "0x...",
      "decimals": 18
    },
    "market": {
      "priceUsd": 1800.12,
      "volume24hUsd": 1200000000,
      "marketCapUsd": 220000000000
    },
    "analysis": {
      "summary": "..."
    }
  }
}
```

## See also
- [Search Pool Info](/docs/agent/tools/search-pool-info/)
- [Setup Alert](/docs/agent/tools/setup-alert/)
