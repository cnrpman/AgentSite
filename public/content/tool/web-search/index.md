---
title: webSearch
summary: Perform a live web search to gather up-to-date information and sources from the open web.
---
## Purpose

Run a live web search for current information, official sources, and fast factual validation.

## Parameters

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `query` | string | Yes | Search query or question |

## Output

Returns JSON with:

- `success`
- `data`, including `output` and `usage`
- `error`

## When to Call

- Official-source lookup
- News validation
- Confirming claims after tool-specific analysis
- Filling factual gaps that on-platform tools do not cover

## See Also

- [searchTwitter](/tool/search-twitter/) for social discussion
- [projectTool](/tool/project-tool/) for project-specific analysis
- [protocolTool](/tool/protocol-tool/) for protocol financial context
