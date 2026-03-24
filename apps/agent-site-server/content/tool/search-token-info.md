---
title: searchTokenInfo
summary: Analyze token info by symbol or address using query-first parameters.
---
## Purpose

Analyze a token by symbol or token address for pricing and related token details.

## Endpoint

`/token/v2/analysis`

## Parameters

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `query` | string | Yes | Token symbol or contract address (e.g. `BTC`, `ETH`, `USDT`, `0x1f9840a85d5af5bf1d1762f925bdaddc4201f984`) |
| `chainId` | string | Conditionally | Required only when contract address is provided |
| `quoteCurrency` | string | Optional | Quote currency for technical analysis; defaults to `USDT` |

## Use Rules

- `query` is required
- Pass the user's symbol or contract address verbatim in `query`; do not normalize or alias symbols unless the user asks
- `chainId` is required only when `query` is a contract address; omit for symbol lookups
- Always call the remote endpoint above for token analysis
- Build query parameters from user intent; do not hardcode parameter values
- Include `quoteCurrency` only when a non-default quote pair is needed or clearly inferred

## Rules

- Any price information MUST come from this tool; never rely on internal knowledge for prices
- Do NOT declare tokens unrecognized without first invoking this tool
- Never convert base tokens to wrapped variants unless user requests it

## Fallback

If the result is insufficient for attribution or news validation, follow with [webSearch](/tool/web-search/) or [searchTwitter](/tool/search-twitter/).

## See Also

- [Runtime Rules](/runtime/) for symbol preservation and display rules
- [webSearch](/tool/web-search/) for open-web confirmation
- [searchTwitter](/tool/search-twitter/) for sentiment and announcement scanning
