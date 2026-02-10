---
title: Search Twitter Tool
summary: Search X/Twitter for recent crypto discussions.
---
**Tool ID:** `searchTwitter`

## Purpose
Search Twitter/X for recent tweets matching a query string.

## Use This When
- You want to monitor sentiment or breaking news.
- You need recent community discussions on a topic.

## Input
Required fields:
- `query`: Search keywords, hashtags, or phrases.

Validation rules:
- `query` must be non-empty.

## Output
- `success`: Boolean.
- `data`: Array of tweet objects with text, author, timestamps, and engagement fields.
- `error`: Failure reason when unsuccessful.

## Example Call
```json
{
  "tool": "searchTwitter",
  "arguments": {
    "query": "#ETH layer2" 
  }
}
```

## Example Response
```json
{
  "success": true,
  "data": [
    { "screen_name": "alice", "text": "...", "created_at": "2026-02-10T08:15:00Z" }
  ]
}
```

## See also
- [Social Data Center](/docs/agent/tools/data-center-social-search/)
- [Web Search](/docs/agent/tools/web-search/)
