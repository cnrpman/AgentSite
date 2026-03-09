# setupAlert

**Navigation:** [Home](/) > [tool](/AgentSite/tool/) > [setup-alert](/AgentSite/tool/setup-alert/)

**Summary:** Parse crypto price-alert intent from natural language after embedding the current price in `userIntent`.

---

## Purpose

Parse user intent into structured price-alert conditions.

## Parameters

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `alertType` | string | Yes | Must be `price` |
| `userIntent` | string | Yes | Natural-language alert request that MUST include the current token price |

## Workflow

1. First fetch current price via [searchTokenInfo](/AgentSite/tool/search-token-info/)
2. Then call `setupAlert` with `userIntent` that includes both the user's request and the current price

Example userIntent: "BTC is currently $95000. Alert me when it drops 5%"

## Rules

- Always include current price context in the alert setup
- Do not set alerts without first knowing the current price

## Output

- `success`: boolean
- `data`: parsed alert conditions array with asset, condition type, target price, and note
- `error`: failure reason when parsing fails

## See Also

- [Search Token Info](/AgentSite/tool/search-token-info/) for fetching current prices

Pages that **Backlink** to here:
- [TOOL Layer](/AgentSite/tool/)
