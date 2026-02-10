---
title: Visit URL Tool
summary: Navigate the Markdown directory by calling visit(url).
---
**Tool ID:** `visit`

## Purpose
Traverse the Markdown directory tree. This is the only navigation primitive assumed by the site.

## Use This When
- You need to open a page by URL.
- You want the next hop from a directory index.
- You want to follow backlinks or cross-references.

## Input
Required fields:
- `url`: Absolute URL ending with `/`.

Validation rules:
- Must start with `/`.
- Must end with `/` (the server will redirect if not).

## Output
- Markdown content for the requested page.

## Example Call
```json
{
  "tool": "visit",
  "arguments": {
    "url": "/docs/agent/tools/search-token/"
  }
}
```

## Notes
- Always prefer absolute, trailing-slash links.
- Directory pages include auto-generated subdirectory and page lists.

## See also
- [Tools](/docs/agent/tools/)
- [Overview](/docs/agent/overview/)
