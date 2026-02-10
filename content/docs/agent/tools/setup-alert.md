---
title: Setup Alert Tool
summary: Parse price alert intent into structured conditions.
---
**Tool ID:** `setupAlert`

## Purpose
Parse a natural language price alert request into structured alert conditions.

## Use This When
- The user wants price alerts for a token.
- You need deterministic alert rules from a natural language description.

## Input
Required fields:
- `alertType`: Must be `price`.
- `userIntent`: Natural language intent that includes the current price.

Validation rules:
- `userIntent` must include the current price (fetch via Search Token Info first).

## Output
- `success`: Boolean.
- `action`: Always `market-signal` on success.
- `data`: `conditions` array with `asset`, `condition_type`, `target_price`, and `note`.
- `error`: Failure reason when unsuccessful.

## Example Call
```json
{
  "tool": "setupAlert",
  "arguments": {
    "alertType": "price",
    "userIntent": "ETH is currently $1800. Alert me when it goes 10% above."
  }
}
```

## Example Response
```json
{
  "success": true,
  "action": "market-signal",
  "data": {
    "conditions": [
      {
        "asset": "ETH",
        "condition_type": "above",
        "target_price": 1980,
        "note": "10% above current price"
      }
    ]
  }
}
```

## Notes
- Always call [Search Token Info](/docs/agent/tools/search-token/) first to obtain the current price.

## See also
- [Search Token Info](/docs/agent/tools/search-token/)
