# Project

**Navigation:** [Home](/) > [project](/AgentSite/project.md)

**Summary:** Project-level context, valuation expectations, and project follow-up calls.

---

Use this page when the question is about a named project rather than just a token contract.

## Primary Tool

| Tool | Signature | Required | Notes |
|------|-----------|----------|-------|
| `projectTool` | `projectTool(projectName)` | `projectName` | primary project context tool |

## Endpoint Mapping

Underlying endpoint: `/project/analysis`

- Pass the project or token name directly.
- Build request parameters from user intent; do not hardcode values.
- Use this tool first for structured project context before social or open-web follow-up.

## Parameter Shapes

| Parameter | Shape | Example |
|-----------|-------|---------|
| `projectName` | project or token name string | `Ethereum`, `Bitcoin`, `Zama` |

## When To Call

- Project due diligence
- Market-sentiment review
- Valuation expectation checks
- Token launch or pre-market interest scans

## Output Notes

- Project metadata
- Market-implied expectations such as pre-market FDV views
- Short-term and long-term target framing when available
- Trading-volume-backed confidence signals when available

## Follow-Up Tools

| Tool | Signature | Use when |
|------|-----------|----------|
| `searchTwitter` | `searchTwitter(query)` | discussion, rumor scan, or KOL chatter |
| `webSearch` | `webSearch(query)` | official pages, launches, or external confirmation |
| `searchTokenInfo` | `searchTokenInfo(tokenSymbol?, tokenAddress?, chainId?, holdersLimit?, quoteCurrency?)` | token price, contract address, or token metadata is also needed |

## Call Order

| Need | Calls |
|------|-------|
| project context only | `projectTool` |
| project plus discussion | `projectTool`, then `searchTwitter` |
| project plus official confirmation | `projectTool`, then `webSearch` |
| project plus token price or contract | `projectTool`, then `searchTokenInfo` |
| full project diligence | `projectTool`, then `searchTwitter`, then `webSearch`, then `searchTokenInfo` if token facts are needed |

## Stop Conditions

- Stop after `projectTool` if the answer only needs project context or valuation expectations.
- Add `searchTwitter` only when discussion matters.
- Add `webSearch` only when official-source confirmation matters.
- Add `searchTokenInfo` only when token-level facts are needed.

For due diligence or launch-interest questions, compare structured project output with both `searchTwitter` discussion and `webSearch` confirmation before finalizing the answer.
Mandatory alongside fundamentals: for diligence, investigation, or narrative-sensitive project work, `searchTwitter` is mandatory alongside fundamentals before the conclusion is finalized.

## Do Not

- Do not start with `searchTwitter` if the user is asking for structured project context.
- Do not start with `webSearch` if `projectTool` can answer the project-level question first.

## Minimal Examples

| Goal | Example call |
|------|--------------|
| project context | `projectTool(projectName='Ethereum')` |
| project plus discussion | `projectTool(projectName='Zama')`, then `searchTwitter(query='Zama')` |

## See Also

- [/](/) for the full reference
- [Token](/AgentSite/token.md)
- [Market Signal](/AgentSite/market-signal.md)

Pages that **Backlink** to here:
- [Tool Reference](/)
