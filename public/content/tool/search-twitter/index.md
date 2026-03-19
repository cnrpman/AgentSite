---
title: searchTwitter
summary: Search Twitter/X for crypto-related tweets about tokens, projects, and market topics.
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

- [webSearch](/tool/web-search/) for broader web validation
- [projectTool](/tool/project-tool/) for project-level context
