# webSearch

**Navigation:** [Home](/) > [tool](/AgentSite/tool/) > [web-search](/AgentSite/tool/web-search/)

**Summary:** Perform a live web search to gather up-to-date information and sources from the open web.

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

- [searchTwitter](/AgentSite/tool/search-twitter/) for social discussion
- [projectTool](/AgentSite/tool/project-tool/) for project-specific analysis
- [protocolTool](/AgentSite/tool/protocol-tool/) for protocol financial context

Pages that **Backlink** to here:
- [TOOL Layer](/AgentSite/tool/)
- [searchPoolInfo](/AgentSite/tool/search-pool-info/)
- [searchTokenInfo](/AgentSite/tool/search-token-info/)
