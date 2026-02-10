---
title: Search Pool Info Tool
summary: Find and score staking/yield pools with APY and TVL trends.
---
**Tool ID:** `searchPoolInfo`

## Purpose
Retrieve staking or yield pools, rank them by score, and return recent APY/TVL trends with commentary.

## Use This When
- You want to compare yield opportunities across protocols.
- You need a specific pool by ID.
- You need a ranked list with historical context.

## Input
All fields are optional. Provide at least one filter when possible.

Supported fields:
- `chain`: Chain ID (1 for Ethereum, 56 for BSC).
- `protocol`: Protocol slug (e.g. `lido`, `aave-v3`).
- `token_symbol`: Token symbol filter (e.g. `ETH`, `USDC`).
- `pool_id`: Specific pool identifier.

## Output
- `success`: Boolean.
- `data`: `poolAnalysis` text and a ranked `pools` array with metadata and trend points.
- `error`: Failure reason when unsuccessful.

## Example Call
```json
{
  "tool": "searchPoolInfo",
  "arguments": {
    "chain": 1,
    "protocol": "aave-v3",
    "token_symbol": "USDC"
  }
}
```

## Example Response
```json
{
  "success": true,
  "data": {
    "poolAnalysis": "...",
    "pools": [
      {
        "pool_id": "aab39a8c-9722-40d9-a539-0608e38e889d",
        "apy": 4.2,
        "tvl": 120000000,
        "trend": [
          { "date": "2026-01-01", "apy": 3.9, "tvl": 118000000 }
        ]
      }
    ]
  }
}
```

## See also
- [Execute Stake](/docs/agent/tools/execute-stake/)
- [Chain Insights](/docs/agent/tools/chain-tool/)
