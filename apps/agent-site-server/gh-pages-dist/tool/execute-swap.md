# ExecuteSwapTool

**Navigation:** [Home](/) > [tool](/AgentSite/tool/index.md) > [execute-swap](/AgentSite/tool/execute-swap.md)

**Summary:** Prepare and validate a DEX token swap using optional execution parameters.

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
- If only symbols are known, use [searchTokenInfo](/AgentSite/tool/search-token-info.md) first to resolve addresses
- If a token cannot be resolved or a quote cannot be obtained, the tool returns a failure reason

## Output

Returns swap parameters for downstream execution: `chainId`, `amount`, `fromTokenAddress`, and `toTokenAddress`.

## See Also

- [Search Token Info](/AgentSite/tool/search-token-info.md) for resolving symbols to addresses
- [Runtime Rules](/AgentSite/runtime/index.md) for chain limitations
- [Execute Transfer](/AgentSite/tool/execute-transfer.md) for transfers instead of swaps

Pages that **Backlink** to here:
- [TOOL Layer](/AgentSite/tool/index.md)
