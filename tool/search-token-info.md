# searchTokenInfo

**Navigation:** [Home](/) > [tool](/AgentSite/tool/index.md) > [search-token-info](/AgentSite/tool/search-token-info.md)

**Summary:** Resolve tokens by symbol or address and retrieve price, metadata, and holder-analysis inputs.

---

## Purpose

Search for a token using either symbol or contract address. Use it for price lookup, metadata retrieval, contract confirmation, and optional holder-oriented analysis inputs.

## Parameters

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `tokenSymbol` | string | Conditionally | Required when `tokenAddress` is not provided |
| `tokenAddress` | string | Conditionally | Required when `tokenSymbol` is not provided |
| `chainId` | string | Conditionally | Required when using `tokenSymbol`; optional when only `tokenAddress` is provided |
| `holdersLimit` | integer | Optional | Top-holder limit from 1 to 50 |
| `quoteCurrency` | string | Optional | Quote currency for technical analysis; defaults to `USDT` |

## Input Rules

- Provide either `tokenSymbol` or `tokenAddress`
- When using `tokenSymbol`, also provide `chainId`
- Preserve exact token text; do not normalize or alias symbols
- Use `holdersLimit` only when holder ranking is useful

## Rules

- Any price information MUST come from this tool; never rely on internal knowledge for prices
- Do NOT declare tokens unrecognized without first invoking this tool
- Never convert base tokens to wrapped variants unless user requests it

## Fallback

If the result is insufficient for attribution or news validation, follow with [webSearch](/AgentSite/tool/web-search.md) or [searchTwitter](/AgentSite/tool/search-twitter.md).

## See Also

- [Runtime Rules](/AgentSite/soul/runtime.md) for symbol preservation and display rules
- [webSearch](/AgentSite/tool/web-search.md) for open-web confirmation
- [searchTwitter](/AgentSite/tool/search-twitter.md) for sentiment and announcement scanning

Pages that **Backlink** to here:
- [TOOL Layer](/AgentSite/tool/index.md)
- [ExecuteSwapTool](/AgentSite/tool/execute-swap.md)
- [ExecuteTransferTool](/AgentSite/tool/execute-transfer.md)
- [projectTool](/AgentSite/tool/project-tool.md)
- [setupAlert](/AgentSite/tool/setup-alert.md)
- [getWalletTokenBalance](/AgentSite/tool/wallet-token-balance.md)
