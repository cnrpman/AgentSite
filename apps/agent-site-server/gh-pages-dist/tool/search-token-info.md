# searchTokenInfo

**Navigation:** [Home](/) > [tool](/AgentSite/tool/index.md) > [search-token-info](/AgentSite/tool/search-token-info.md)

**Summary:** Analyze token info by symbol or address using query-first parameters.

---

## Purpose

Analyze a token by symbol or token address for pricing and related token details.

## Endpoint

`https://vf35f12f---defi-ai-services-gateway-staging-n7gcbq4uva-uc.a.run.app/token/v2/analysis`

## Parameters

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `query` | string | Required | The token symbol or token address to analyze (e.g., `BTC`, `ETH`) |
| `quote_currency` | string | Optional | The quote currency for the trading pair (for example, `USDT`) |
| `chain_index` | integer | Optional | Chain index used to scope the lookup |

## Use Rules

- `query` is required
- `quote_currency` and `chain_index` are optional
- Always call the remote endpoint above for token analysis
- Build query parameters from user intent; do not hardcode parameter values
- Include `quote_currency` and `chain_index` only when they are provided or clearly inferred

## Rules

- Any price information MUST come from this tool; never rely on internal knowledge for prices
- Do NOT declare tokens unrecognized without first invoking this tool
- Never convert base tokens to wrapped variants unless user requests it

## Fallback

If the result is insufficient for attribution or news validation, follow with [webSearch](/AgentSite/tool/web-search.md) or [searchTwitter](/AgentSite/tool/search-twitter.md).

## See Also

- [Runtime Rules](/AgentSite/runtime/index.md) for symbol preservation and display rules
- [webSearch](/AgentSite/tool/web-search.md) for open-web confirmation
- [searchTwitter](/AgentSite/tool/search-twitter.md) for sentiment and announcement scanning

Pages that **Backlink** to here:
- [TOOL Layer](/AgentSite/tool/index.md)
- [ExecuteSwapTool](/AgentSite/tool/execute-swap.md)
- [ExecuteTransferTool](/AgentSite/tool/execute-transfer.md)
- [projectTool](/AgentSite/tool/project-tool.md)
- [setupAlert](/AgentSite/tool/setup-alert.md)
- [getWalletTokenBalance](/AgentSite/tool/wallet-token-balance.md)
