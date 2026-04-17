---
title: Market Signal
summary: Trend scanning, social discussion, external confirmation, and their call order.
---
Use this page for market pulse, trending movers, community discussion, and external validation.

## Primary Tools

| Tool | Signature | Required | Use when |
|------|-----------|----------|----------|
| `getTrendingInsights` | `getTrendingInsights(sections?, convert?, timeFrame?, gainersLosersLimit?, communityTopicsLimit?, communityTokensLimit?, duneChain?, duneContractsLimit?)` | none | trend scan and market pulse |
| `searchTwitter` | `searchTwitter(query)` | `query` | social discussion and rumor scan |
| `webSearch` | `webSearch(query)` | `query` | official-source and live external validation |
| `chainTool` | `chainTool(chainId?, chainName?)` | `chainId` or `chainName` | when a trend needs chain-level context |

## Parameter Shapes

| Parameter | Shape | Example |
|-----------|-------|---------|
| `sections[]` | trend section array | `['gainers', 'losers']`, `['communityTopics']` |
| `timeFrame` | short time window string | `24h`, `7d` |
| `convert` | quote currency string | `USD` |
| `query` | natural search string | `Zama`, `ETH ETF`, `Base ecosystem` |
| `chainId` | numeric chain id | `1`, `56` |
| `chainName` | chain name string | `Ethereum`, `BNB Chain` |

## Range Notes

- `gainersLosersLimit`: `1-100`
- `communityTopicsLimit`: `1-100`
- `communityTokensLimit`: `1-100`
- `duneContractsLimit`: `1-100`
- `duneChain`: chain slug such as `ethereum` or `bnb`

## Tool Notes

### `getTrendingInsights`

- All inputs are optional.
- Use section filters when a narrower result set is preferred.
- Dune-specific parameters only matter when contract-trend output is requested.

### `searchTwitter`

Successful results may include:

- `screen_name`
- `text`
- `created_at`
- engagement or metadata fields when available

Usage policy:

- For token or DeFi narratives, compare `searchTwitter` results against structured tool outputs before making a strong claim.
- Probe official handles first when token or project metadata exposes them.
- Tag social findings as `[Official Announcement]`, `[Community Sentiment]`, or `[Unverified Claim]`.
- Include handles, timestamps, and links when available when presenting social findings.
- Include freshness, handle, and confidence when social findings materially affect the answer.

### `webSearch`

Returns JSON with:

- `success`
- `data`, including `output` and `usage`
- `error`

## Call Order

| Need | Calls |
|------|-------|
| market pulse only | `getTrendingInsights` |
| trend plus social chatter | `getTrendingInsights`, then `searchTwitter` |
| trend plus chain context | `getTrendingInsights`, then `chainTool` |
| claim validation | relevant trend or social tool, then `webSearch` |
| social scan only | `searchTwitter` |
| token or project narrative check | relevant fundamental tool, then `searchTwitter`, then `webSearch` if confirmation is needed |

## Stop Conditions

- Stop after `getTrendingInsights` if the user only wanted a trend scan.
- Stop after `searchTwitter` if the user only wanted discussion.
- Add `webSearch` only when the answer depends on external confirmation.
- Add `chainTool` only when a trend needs chain-level explanation.

## Do Not

- Do not start with `webSearch` for a generic trend scan.
- Do not use `searchTwitter` as factual validation by itself.

## Minimal Examples

| Goal | Example call |
|------|--------------|
| trend scan | `getTrendingInsights(sections=['gainers'], timeFrame='24h')` |
| social scan | `searchTwitter(query='Zama')` |
| external validation | `webSearch(query='official Zama launch announcement')` |

## See Also

- [/](/) for the full reference
- [Protocol & Chain](/protocol-chain/)
- [Token](/token/)
