# Alert

**Navigation:** [Home](/) > [alert](/AgentSite/alert.md)

**Summary:** Price alert setup with the exact userIntent shape and hard prerequisites.

---

Use this page for alert creation.

## Primary Tools

| Tool | Signature | Required | Notes |
|------|-----------|----------|-------|
| `searchTokenInfo` | `searchTokenInfo(tokenSymbol?, tokenAddress?, chainId?, holdersLimit?, quoteCurrency?)` | `tokenSymbol + chainId` or `tokenAddress` | fetch current price first |
| `setupAlert` | `setupAlert(alertType, userIntent)` | `alertType=price`, `userIntent` | `userIntent` must include the current price |

## Parameter Shapes

| Parameter | Shape | Example |
|-----------|-------|---------|
| `alertType` | fixed string | `price` |
| `userIntent` | plain sentence with current price included | `BTC is currently $95000. Alert me when it drops 5%.` |
| `tokenSymbol` | exact symbol string | `BTC`, `ETH` |
| `chainId` | numeric chain id | `1`, `56` |

## Workflow

1. Fetch the current price with `searchTokenInfo`.
2. Rewrite the request so `userIntent` includes both the user's request and the current price.
3. Call `setupAlert`.

## Output Shape

- `success`: boolean
- `data`: parsed alert conditions array with asset, condition type, target price, and note
- `error`: failure reason when parsing fails

## Call Order

| Need | Calls |
|------|-------|
| any price alert | `searchTokenInfo`, then `setupAlert` |

## Stop Conditions

- Do not call `setupAlert` until the current price has been fetched.
- Do not call `setupAlert` if `userIntent` does not include the current price.

## Minimal Examples

| Goal | Example call |
|------|--------------|
| fetch price first | `searchTokenInfo(tokenSymbol='BTC', chainId=1)` |
| create alert | `setupAlert(alertType='price', userIntent='BTC is currently $95000. Alert me when it drops 5%.')` |

## See Also

- [/](/) for the full reference
- [Token](/AgentSite/token.md)

Pages that **Backlink** to here:
- [Tool Reference](/)
