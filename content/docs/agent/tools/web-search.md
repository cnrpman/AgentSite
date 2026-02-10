---
title: Web Search Tool
summary: Run a live web search for up-to-date sources.
---
**Tool ID:** `webSearch`

## Purpose
Perform a live web search to gather up-to-date information and sources.

## Use This When
- You need recent information not in the local context.
- You want external sources to cite.

## Input
Required fields:
- `query`: Search keywords or a question.

Validation rules:
- `query` must be non-empty.

## Output
- `success`: Boolean.
- `data`: Object with search output and usage metadata.
- `error`: Failure reason when unsuccessful.

## Example Call
```json
{
  "tool": "webSearch",
  "arguments": {
    "query": "Lido TVL trend last 7 days"
  }
}
```

## Example Response
```json
{
  "success": true,
  "data": {
    "output": "...",
    "usage": { "tokens": 1234 }
  }
}
```

## See also
- [Search Twitter](/docs/agent/tools/search-twitter/)
- [Trending Insights](/docs/agent/tools/trending-insights/)
