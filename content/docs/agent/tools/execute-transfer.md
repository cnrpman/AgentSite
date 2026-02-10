---
title: Execute Transfer Tool
summary: Prepare a token transfer payload for downstream execution.
---
**Tool ID:** `ExecuteTransferTool`

## Purpose
Validate transfer inputs and return a normalized transfer payload for downstream execution.

## Use This When
- You want to prepare a transfer before signing or executing it.

## Input
All fields are optional, but more fields yield a more complete payload.

Supported fields:
- `amount`: Amount of tokens to transfer.
- `chainId`: Chain ID (e.g. `1`, `56`).
- `tokenAddress`: Token contract address.
- `receiveAddress`: Recipient address.

Validation rules:
- `tokenAddress` and `receiveAddress` must be valid EVM addresses when provided.

## Output
- `success`: Boolean.
- `action`: Always `Transfer` on success.
- `data`: Transfer payload with normalized fields and chain metadata.
- `error`: Failure reason when unsuccessful.

## Example Call
```json
{
  "tool": "ExecuteTransferTool",
  "arguments": {
    "amount": "0.25",
    "chainId": "1",
    "tokenAddress": "0x...",
    "receiveAddress": "0x..."
  }
}
```

## Example Response
```json
{
  "success": true,
  "action": "Transfer",
  "data": {
    "amount": "0.25",
    "tokenAddress": "0x...",
    "receiveAddress": "0x...",
    "chainId": "1",
    "chainIndex": 1,
    "chainName": "Ethereum",
    "chainSymbol": "ETH"
  }
}
```

## Notes
- If `receiveAddress` is omitted, it must be supplied before execution.

## See also
- [Execute Swap](/docs/agent/tools/execute-swap/)
- [Execute Stake](/docs/agent/tools/execute-stake/)
