---
title: Execute Swap Tool
summary: Prepare a DEX swap payload for downstream execution.
---
**Tool ID:** `ExecuteSwapTool`

## Purpose
Validate swap inputs and return a normalized swap payload.

## Use This When
- You need to prepare a DEX swap before execution.
- You want to validate token addresses on a chain.

## Input
All fields are optional, but missing fields can lead to an incomplete payload.

Supported fields:
- `chainId`: Chain ID or chain index.
- `amount`: Amount of the source token to swap.
- `fromTokenAddress`: Source token contract address.
- `toTokenAddress`: Destination token contract address.

Validation rules:
- Validates token addresses on the specified chain.
- Returns a failure reason if a token cannot be resolved or quoted.

## Output
- `success`: Boolean.
- `action`: Always `Swap` on success.
- `data`: Swap payload with normalized fields.
- `error`: Failure reason when unsuccessful.

## Example Call
```json
{
  "tool": "ExecuteSwapTool",
  "arguments": {
    "chainId": "1",
    "amount": "1000",
    "fromTokenAddress": "0x...",
    "toTokenAddress": "0x..."
  }
}
```

## Example Response
```json
{
  "success": true,
  "action": "Swap",
  "data": {
    "chainId": "1",
    "amount": "1000",
    "fromTokenAddress": "0x...",
    "toTokenAddress": "0x..."
  }
}
```

## See also
- [Execute Transfer](/docs/agent/tools/execute-transfer/)
- [Search Pool Info](/docs/agent/tools/search-pool-info/)
