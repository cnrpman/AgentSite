---
title: Token
summary: Token lookup, price, contract, metadata, and token-level follow-up calls.
---
Use this page for token identity, price, contract address, metadata, and basic token diligence.

## Primary Tool

| Tool | Signature | Required | Notes |
|------|-----------|----------|-------|
| `searchTokenInfo` | `searchTokenInfo(tokenSymbol?, tokenAddress?, chainId?, holdersLimit?, quoteCurrency?)` | `tokenSymbol + chainId` or `tokenAddress` | primary token lookup tool |

## Parameter Shapes

| Parameter | Shape | Example |
|-----------|-------|---------|
| `tokenSymbol` | exact symbol string | `ETH`, `USDC`, `BTC` |
| `tokenAddress` | EVM address | `0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48` |
| `chainId` | numeric chain id | `1`, `56` |
| `holdersLimit` | integer | `10`, `50` |
| `quoteCurrency` | quote asset string | `USDT`, `USD` |

## Endpoint Mapping

Underlying endpoint: `/token/v2/analysis`

- The underlying lookup is query-first: pass the user token symbol or contract address verbatim as the lookup query.
- When the lookup is contract-address based, keep `chainId` with it.
- Use `quoteCurrency` only when a non-default quote pair is required.
- Build request parameters from user intent; do not hardcode values.

## Input Rules

- Provide either `tokenSymbol` or `tokenAddress`.
- When using `tokenSymbol`, also provide `chainId`.
- Use `holdersLimit` only when holder ranking is useful.

## Rules

- Any price information must come from `searchTokenInfo`.
- Do not declare a token unrecognized before invoking this tool.
- Never convert a base asset to a wrapped variant unless the user explicitly asked for it.
- If token lookup is not enough for attribution or news validation, follow with `webSearch` or `searchTwitter`.

## Follow-Up Tools

| Tool | Signature | Use when |
|------|-----------|----------|
| `projectTool` | `projectTool(projectName)` | token maps to a broader project and you need project context |
| `searchTwitter` | `searchTwitter(query)` | you need social discussion or rumor scan |
| `webSearch` | `webSearch(query)` | you need official-source or open-web validation |

## Call Order

| Need | Calls |
|------|-------|
| token price, contract, metadata | `searchTokenInfo` |
| token plus project context | `searchTokenInfo`, then `projectTool` |
| token plus social chatter | `searchTokenInfo`, then `searchTwitter` |
| token plus external confirmation | `searchTokenInfo`, then `webSearch` |
| full token diligence | `searchTokenInfo` + `projectTool` + `searchTwitter` + `webSearch` |

For token or DeFi diligence, compare fundamentals from `searchTokenInfo` against sentiment from `searchTwitter` and confirmation from `webSearch` before drawing a strong conclusion.
Mandatory alongside fundamentals: for diligence, investigation, or narrative-sensitive token work, `searchTwitter` is mandatory alongside fundamentals before the conclusion is finalized.

## Stop Conditions

- Stop after `searchTokenInfo` if the user only wanted price, contract, metadata, or symbol validation.
- Add `projectTool` only when the token maps to a broader project question.
- Add `searchTwitter` only when narrative or discussion matters.
- Add `webSearch` only when external confirmation matters.

## Social-Intel Notes

- When token metadata exposes official handles, probe those first in `searchTwitter`.
- Tag social findings as `[Official Announcement]`, `[Community Sentiment]`, or `[Unverified Claim]`.
- When presenting social findings, include handles, timestamps, and links when available.
- Keep community commentary separate from factual token metrics.

## Do Not

- Do not start with `webSearch` for token identity or price.
- Do not guess token addresses.
- Do not normalize token symbols or silently map them to wrapped variants.

## Minimal Examples

| Goal | Example call |
|------|--------------|
| lookup by symbol | `searchTokenInfo(tokenSymbol='ETH', chainId=1)` |
| lookup by address | `searchTokenInfo(tokenAddress='0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')` |
| token with holder view | `searchTokenInfo(tokenSymbol='ETH', chainId=1, holdersLimit=10)` |

## See Also

- [Project](/project/)
- [Market Signal](/market-signal/)
- [Execution](/execution/)
- [Alert](/alert/)
