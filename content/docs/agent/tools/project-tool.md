---
title: Project Prediction Tool
summary: Get prediction-market odds and metadata for crypto projects.
---
**Tool ID:** `projectTool`

## Purpose
Retrieve prediction market data for a crypto project, including odds, valuation targets, and confidence indicators.

## Use This When
- You want market-implied expectations for a project.
- You need pre-market FDV or price target ranges.

## Input
Required fields:
- `projectName`: Project name or symbol (e.g. `Bitcoin`, `Ethereum`, `Zama`).

## Output
- `success`: Boolean.
- `data`: `llmData` (analysis) and `referenceData` (market odds, targets, volume).
- `error`: Failure reason when unsuccessful.

## Example Call
```json
{
  "tool": "projectTool",
  "arguments": {
    "projectName": "Zama"
  }
}
```

## Example Response
```json
{
  "success": true,
  "data": {
    "llmData": "...",
    "referenceData": {
      "fdvTargets": {
        "shortTerm": 1500000000,
        "longTerm": 3000000000
      }
    }
  }
}
```

## See also
- [Search Token Info](/docs/agent/tools/search-token/)
- [Trending Insights](/docs/agent/tools/trending-insights/)
