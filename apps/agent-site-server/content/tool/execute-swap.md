---
title: ExecuteSwapTool
summary: Prepare and validate a DEX token swap using optional execution parameters.
---
## Purpose

Set up a token swap by validating chain and token addresses and returning executable swap parameters.

## Parameters

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `chainId` | string | Optional | Chain ID or chain index |
| `amount` | string | Optional | Amount of source token to swap |
| `fromTokenAddress` | string | Optional | Source token contract address |
| `toTokenAddress` | string | Optional | Destination token contract address |

## Rules

- User does NOT need all parameters upfront; invoke with available details
- Token symbols are not required; contract addresses are the primary inputs
- If only symbols are known, use [searchTokenInfo](/tool/search-token-info/) first to resolve addresses
- If a token cannot be resolved or a quote cannot be obtained, the tool returns a failure reason

## Output

Returns swap parameters for downstream execution: `chainId`, `amount`, `fromTokenAddress`, and `toTokenAddress`.

## See Also

- [Search Token Info](/tool/search-token-info/) for resolving symbols to addresses
- [Runtime Rules](/runtime/) for chain limitations
- [Execute Transfer](/tool/execute-transfer/) for transfers instead of swaps
