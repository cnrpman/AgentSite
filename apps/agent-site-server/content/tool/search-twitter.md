---
title: searchTwitter
summary: Mandatory social-intelligence tool for DeFi/token queries. Surfaces sentiment, announcements, and community discussion with structured tagging.
---
## Purpose

Search Twitter/X for real-time sentiment, incidents, announcements, governance debates, listings, and community discussion across crypto social feeds.

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

## Usage Policy

- **Mandatory alongside fundamentals**: For any DeFi or token-related query, `searchTwitter` is required alongside `searchTokenInfo` and other fundamental tools. Compare sentiment takeaways with factual data and reconcile discrepancies explicitly.
- **Probe official handles**: Use `searchTokenInfo` metadata to identify official social handles, then use `searchTwitter` to probe those handles before referencing them.
- **Cite evidence**: Include handles, timestamps, and links when presenting social intelligence.
- **Separate facts from commentary**: Distinguish confirmed facts from community speculation in all output.

## Insight Tagging

After processing results, tag every insight with one of:

| Tag | Meaning |
|-----|---------|
| [Official Announcement] | From verified project accounts or confirmed official channels |
| [Community Sentiment] | Aggregate community opinion, KOL takes, or discussion trends |
| [Unverified Claim] | Rumors, speculation, or claims without corroboration |

Flag confidence level and data freshness for each tagged insight. Corroborate with [webSearch](/tool/web-search/) or other tools when higher precision is required.

## When to Call

- Sentiment checks for any token or DeFi query (mandatory, not optional)
- Announcement or rumor scans
- KOL or community discussion review
- Follow-up after token, protocol, or chain discovery
- Governance debate monitoring
- Listing or partnership signal detection

## See Also

- [webSearch](/tool/web-search/) for broader web validation and off-platform confirmation
- [projectTool](/tool/project-tool/) for project-level context
- [searchTokenInfo](/tool/search-token-info/) for fundamental data to compare against sentiment
