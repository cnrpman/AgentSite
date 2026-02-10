---
title: Tools
summary: Tool reference pages with explicit inputs, outputs, and examples.
---
This directory hosts one page per tool. Each page is self-contained, stable, and linkable.

## Why This Format Beats a Tool Listing
- Every tool has a canonical URL that agents can revisit without scrolling or parsing a giant list.
- Inputs, outputs, validation rules, and examples are consistent across pages.
- Links are absolute and trailing-slash, so navigation is deterministic for `visit(url)` agents.
- Pages are easy to diff, review, and update without touching unrelated tools.
- Backlinks make tool discovery and cross-references explicit.

## How To Read A Tool Page
- **Tool ID**: The callable function name.
- **Purpose**: What the tool is for.
- **Use This When**: Common scenarios.
- **Input / Output**: The contract you can rely on.
- **Example Call / Response**: Copy-ready payloads.

## Start Here
If you are browsing for the first time, start with [Visit URL](/docs/agent/tools/visit-url/).

## See also
- [Overview](/docs/agent/overview/)
