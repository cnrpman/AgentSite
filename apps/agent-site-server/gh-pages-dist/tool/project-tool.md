# projectTool

**Navigation:** [Home](/) > [tool](/AgentSite/tool/index.md) > [project-tool](/AgentSite/tool/project-tool.md)

**Summary:** Retrieve project metadata and real-time prediction-market style sentiment for crypto projects and tokens.

---

## Purpose

Fetch project metadata plus market-implied expectations such as pre-market FDV views, short-term and long-term price targets, and trading-volume-backed confidence signals.

## Endpoint

`https://vf35f12f---defi-ai-services-gateway-staging-n7gcbq4uva-uc.a.run.app/project/analysis`

## Parameters

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `projectName` | string | Yes | Project or token name, for example `Bitcoin`, `Ethereum`, or `Zama` |

## Use Rules

- `projectName` is required
- Always call the remote endpoint above for project analysis
- Build request parameters from user intent; do not hardcode values

## When to Call

- Project due diligence
- Market-sentiment review
- Valuation expectation checks
- Token launch or pre-market interest scans

## See Also

- [searchTokenInfo](/AgentSite/tool/search-token-info.md) for live token lookup
- [searchTwitter](/AgentSite/tool/search-twitter.md) for social discussion
- [webSearch](/AgentSite/tool/web-search.md) for factual verification

Pages that **Backlink** to here:
- [TOOL Layer](/AgentSite/tool/index.md)
- [protocolTool](/AgentSite/tool/protocol-tool.md)
