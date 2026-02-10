---
title: Chain Insights Tool
summary: Analyze DEX volume, TVL, and protocol rankings for a chain.
---
**Tool ID:** `chainTool`

## Purpose
Return chain-level DEX volume statistics, TVL data, and protocol rankings with analysis.

## Use This When
- You need a snapshot of DeFi activity on a specific chain.
- You want DEX volume trends and protocol dominance.

## Input
At least one of the following is required:
- `chainId`: Chain ID (e.g. `1` for Ethereum, `56` for BSC).
- `chainName`: Chain name (e.g. `Ethereum`, `Polygon`, `Arbitrum`).

## Output
- `success`: Boolean.
- `data`: `llmData` (analysis) and `referenceData` (metrics tables).
- `error`: Failure reason when unsuccessful.

## Example Call
```json
{
  "tool": "chainTool",
  "arguments": {
    "chainId": "1"
  }
}
```

## Example Response
```json
{
  "success": true,
  "data": {
    "llmData": "...",
    "referenceData": {
      "dexVolume7dUsd": 123456789,
      "tvlUsd": 45678900000
    }
  }
}
```

## Notes
- If both `chainId` and `chainName` are provided, they should refer to the same chain.

## See also
- [Protocol Insights](/docs/agent/tools/protocol-tool/)
- [Trending Insights](/docs/agent/tools/trending-insights/)
