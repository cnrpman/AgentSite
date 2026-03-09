# ExecuteTransferTool

**Navigation:** [Home](/) > [tool](/AgentSite/tool/) > [execute-transfer](/AgentSite/tool/execute-transfer/)

**Summary:** Prepare and validate a token transfer using optional transfer parameters.

---

## Purpose

Set up a token transfer by validating chain and token inputs and returning transfer-ready parameters.

## Parameters

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `amount` | string | Optional | Amount of tokens to transfer |
| `chainId` | string | Optional | Target chain ID |
| `tokenAddress` | string | Optional | Token contract address |
| `receiveAddress` | string | Optional | Receiver wallet address or ENS |

## Rules

- User does NOT need all parameters upfront; invoke with available details
- If only a symbol is known, use [searchTokenInfo](/AgentSite/tool/search-token-info/) first to resolve the token address
- If `receiveAddress` is omitted, the tool should return parameters with an empty `receiveAddress`
- Accept wallet addresses and ENS names directly
- Invalid chain IDs or token addresses should produce a failure reason

## Output

The tool returns transfer parameters in JSON for downstream execution, along with token metadata when available.

## See Also

- [Search Token Info](/AgentSite/tool/search-token-info/) for resolving symbols
- [Runtime Rules](/AgentSite/soul/runtime/) for chain limitations
- [Execute Swap](/AgentSite/tool/execute-swap/) for swaps instead of transfers

Pages that **Backlink** to here:
- [TOOL Layer](/AgentSite/tool/)
