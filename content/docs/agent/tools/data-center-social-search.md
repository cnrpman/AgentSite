---
title: Social Data Center Tool
summary: Fetch raw sentiment and token stats from the data center.
---
**Tool ID:** `dataCenterSocialSearch`

## Purpose
Query the data center for social sentiment and token statistics. Returns raw JSON for downstream analysis.

## Use This When
- You need fast, unsummarized sentiment data.
- You want raw token stats for custom analysis.

## Input
Required fields:
- `query`: Natural language question about token sentiment, social discussions, or token statistics.

Validation rules:
- `query` must be non-empty.

## Output
- `success`: Boolean.
- `data`: Raw data center JSON (e.g. `tweet_search`, `token_stats`).
- `error`: Failure reason when unsuccessful.

## Example Call
```json
{
  "tool": "dataCenterSocialSearch",
  "arguments": {
    "query": "Recent sentiment for SOL and top discussion themes"
  }
}
```

## Example Response
```json
{
  "success": true,
  "data": {
    "tweet_search": [{ "text": "..." }],
    "token_stats": { "symbol": "SOL", "mentions": 420 }
  }
}
```

## Notes
- This tool is optimized for fast mode and does not summarize results.

## See also
- [Search Twitter](/docs/agent/tools/search-twitter/)
- [Web Search](/docs/agent/tools/web-search/)
