# searchTwitter

**Navigation:** [Home](/) > [tool](/AgentSite/tool/) > [search-twitter](/AgentSite/tool/search-twitter/)

**Summary:** Search Twitter/X for crypto-related tweets about tokens, projects, and market topics.

---

## Purpose

Search Twitter/X for recent discussion about crypto assets, projects, or related topics.

## Parameters

| Parameter | Type | Required | Notes |
|-----------|------|----------|-------|
| `query` | string | Yes | Search keywords, hashtags, phrases, project names, or token symbols |

## Output

Successful results return tweet objects that may include:

- `screen_name`
- `text`
- `created_at`
- Additional engagement or metadata fields when available

## When to Call

- Sentiment checks
- Announcement or rumor scans
- KOL or community discussion review
- Follow-up after token, protocol, or chain discovery

## See Also

- [webSearch](/AgentSite/tool/web-search/) for broader web validation
- [projectTool](/AgentSite/tool/project-tool/) for project-level context

Pages that **Backlink** to here:
- [TOOL Layer](/AgentSite/tool/)
- [searchPoolInfo](/AgentSite/tool/search-pool-info/)
- [searchTokenInfo](/AgentSite/tool/search-token-info/)
- [getTrendingInsights](/AgentSite/tool/trending-insights/)
