---
title: Protocol Insights Tool
summary: Analyze protocol-level TVL, fees, revenue, and capital flows.
---
**Tool ID:** `protocolTool`

## Purpose
Fetch comprehensive protocol analytics in markdown form, with reference metrics for TVL, fees, revenue, and flows.

## Use This When
- You need a protocol deep dive with current metrics.
- You want consistent protocol comparisons across the ecosystem.

## Input
Required fields:
- `protocol`: Protocol slug (e.g. `aave-v3`, `uniswap`).

## Output
- `success`: Boolean.
- `data`: `llmData` (analysis) and `referenceData` (metrics).
- `error`: Failure reason when unsuccessful.

## Example Call
```json
{
  "tool": "protocolTool",
  "arguments": {
    "protocol": "uniswap"
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
      "tvlUsd": 5400000000,
      "fees7dUsd": 12000000
    }
  }
}
```

## See also
- [Chain Insights](/docs/agent/tools/chain-tool/)
- [Search Pool Info](/docs/agent/tools/search-pool-info/)
