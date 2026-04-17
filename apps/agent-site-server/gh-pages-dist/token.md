# Token

**Navigation:** [Home](/) > [token](/agent-site/token.md)

**Summary:** Token lookup, price, contract, metadata, and token-level follow-up calls.

---

Use this page for token identity, price, contract address, metadata, and basic token diligence.

## Primary Tool

| Tool | Signature | Required | Notes |
|------|-----------|----------|-------|
| `searchTokenInfo` | `searchTokenInfo(tokenSymbol?, tokenAddress?, chainId?, holdersLimit?, quoteCurrency?)` | `tokenSymbol + chainId` or `tokenAddress` | primary token lookup tool |

## Parameter Shapes

| Parameter | Shape | Example |
|-----------|-------|---------|
| `tokenSymbol` | exact symbol string | `ETH`, `USDC`, `BTC` |
| `tokenAddress` | EVM address | `0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48` |
| `chainId` | numeric chain id | `1`, `56` |
| `holdersLimit` | integer | `10`, `50` |
| `quoteCurrency` | quote asset string | `USDT`, `USD` |

## Input Rules

- Provide either `tokenSymbol` or `tokenAddress`.
- When using `tokenSymbol`, also provide `chainId`.
- Use `holdersLimit` only when holder ranking is useful.

## Rules

- Any price information must come from `searchTokenInfo`.
- Do not declare a token unrecognized before invoking this tool.
- Never convert a base asset to a wrapped variant unless the user explicitly asked for it.

## Input Rules

- Provide either `tokenSymbol` or `tokenAddress`.
- When using `tokenSymbol`, also provide `chainId`.
- Use `holdersLimit` only when holder ranking is useful.

## Rules

- Any price information must come from `searchTokenInfo`.
- Do not declare a token unrecognized before invoking this tool.
- Never convert a base asset to a wrapped variant unless the user explicitly asked for it.

## Follow-Up Tools

| Tool | Signature | Use when |
|------|-----------|----------|
| `projectTool` | `projectTool(projectName)` | token maps to a broader project and you need project context |
| `searchTwitter` | `searchTwitter(query)` | you need social discussion or rumor scan |
| `webSearch` | `webSearch(query)` | you need official-source or open-web validation |

## Call Order

| Need | Calls |
|------|-------|
| token price, contract, metadata | `searchTokenInfo` |
| token plus project context | `searchTokenInfo`, then `projectTool` |
| token plus social chatter | `searchTokenInfo`, then `searchTwitter` |
| token plus external confirmation | `searchTokenInfo`, then `webSearch` |
| full token diligence | `searchTokenInfo` + `projectTool` + `searchTwitter` + `webSearch` |

## Stop Conditions

- Stop after `searchTokenInfo` if the user only wanted price, contract, metadata, or symbol validation.
- Add `projectTool` only when the token maps to a broader project question.
- Add `searchTwitter` only when narrative or discussion matters.
- Add `webSearch` only when external confirmation matters.

## Fallback

- If token lookup is not enough for attribution or news validation, follow with `webSearch` or `searchTwitter`.

## Fallback

- If token lookup is not enough for attribution or news validation, follow with `webSearch` or `searchTwitter`.

## Do Not

- Do not start with `webSearch` for token identity or price.
- Do not guess token addresses.
- Do not normalize token symbols or silently map them to wrapped variants.

## Minimal Examples

| Goal | Example call |
|------|--------------|
| lookup by symbol | `searchTokenInfo(tokenSymbol='ETH', chainId=1)` |
| lookup by address | `searchTokenInfo(tokenAddress='0xA0b86991c6218b36c1d19d4a2e9eb0ce3606eb48')` |
| token with holder view | `searchTokenInfo(tokenSymbol='ETH', chainId=1, holdersLimit=10)` |

## See Also

- [/](/) for the full reference
- [Project](/agent-site/project.md)
- [Execution](/agent-site/execution.md)
- [Alert](/agent-site/alert.md)

Pages that **Backlink** to here:
- [Tool Reference](/)
- [Market Signal](/agent-site/market-signal.md)
