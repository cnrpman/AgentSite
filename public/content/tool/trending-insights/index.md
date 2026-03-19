---
title: getTrendingInsights
summary: Retrieve trending market insights including gainers or losers, community topics, community tokens, and optional Dune contract trends.
---
## Purpose

Retrieve a packaged market-pulse view across major trending sections.

## Parameters

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `sections` | array<string> | Optional | Section filters for supported trend groups such as gainers/losers, community topics, and community tokens |
| `convert` | string | Optional | Quote currency, default `USD` |
| `timeFrame` | string | Optional | Time frame such as `24h` or `7d` |
| `gainersLosersLimit` | integer | Optional | From 1 to 100 |
| `communityTopicsLimit` | integer | Optional | From 1 to 100 |
| `communityTokensLimit` | integer | Optional | From 1 to 100 |
| `duneChain` | string | Optional | Chain slug for Dune preset contract trends, such as `ethereum` or `bnb` |
| `duneContractsLimit` | integer | Optional | From 1 to 100 |

## Notes

- All inputs are optional
- Use section filters when a narrower result set is preferred
- Dune-specific parameters only matter when contract-trend output is requested

## See Also

- [chainTool](/tool/chain-tool/) for chain-level interpretation
- [searchTwitter](/tool/search-twitter/) for social follow-through on trends
