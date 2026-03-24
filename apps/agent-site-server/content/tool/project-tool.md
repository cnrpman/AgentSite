---
title: projectTool
summary: Retrieve project metadata and real-time prediction-market style sentiment for crypto projects and tokens.
---
## Purpose

Fetch project metadata plus market-implied expectations such as pre-market FDV views, short-term and long-term price targets, and trading-volume-backed confidence signals.

## Endpoint

`/project/analysis`

## Parameters

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `projectName` | string | Yes | Project or token name, for example `Bitcoin`, `Ethereum`, or `Zama` |

## Use Rules

- `projectName` is required
- Always call the remote endpoint above for project analysis
- Build request parameters from user intent; do not hardcode values

## When to Call

- Project due diligence
- Market-sentiment review
- Valuation expectation checks
- Token launch or pre-market interest scans

## See Also

- [searchTokenInfo](/tool/search-token-info/) for live token lookup
- [searchTwitter](/tool/search-twitter/) for social discussion
- [webSearch](/tool/web-search/) for factual verification
