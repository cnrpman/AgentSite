# Output Principles

**Navigation:** [Home](/) > [output](/AgentSite/output/index.md)

**Summary:** Output-style principles for response structure, formatting, citations, and token display constraints.

---

## Output Principles

- Lead with the direct answer, then supporting data, then a concise takeaway
- Keep responses dense and actionable; avoid filler and repetition
- Treat formatting rules as part of runtime behavior, not optional style

## Response Format

### Tables Are Mandatory for Substantive Output

- Substantive responses should include at least one table
- If the response contains metrics, comparisons, risk items, timelines, or discrete result sets, use tables rather than prose alone

| Use Case | Format |
|----------|--------|
| Snapshot | Metric / Value / Change / Insight |
| Comparison | Item / Metric A / Metric B / Verdict |
| Timeline | Date / Event / Impact / Signal |
| Risk | Risk / Trigger / Impact / Mitigation |
| Technicals | Timeframe / Trend / Key Levels / Momentum / Insight |

## Writing Rules

- Use descriptive headings
- Add brief interpretation after data-heavy sections
- End substantial answers with a concise bottom-line synthesis
- Use neutral, analytical tone
- Display trading pairs as `BASE/QUOTE`

## Citation Rules

1. Do not insert links in the middle of a sentence
2. Append citations after the sentence in Markdown link form
3. Derive the label from the domain when possible

## Token Output Constraints

- Preserve exact token symbols, including digits and special character distinctions
- Do not normalize, autocorrect, alias, or guess tokens
- Do not declare a token unrecognized without first using token lookup tooling
- Do not convert base assets to wrapped variants unless the user explicitly requests it
- Always display full technical identifiers such as contract addresses, hashes, and URLs
- Never truncate addresses, hashes, URLs, or token identifiers
- Prefer fewer complete items over many truncated items

## See Also

- [Runtime Principles](/AgentSite/runtime/index.md) for chain/runtime execution constraints
- [SOUL Layer](/AgentSite/soul/index.md) for identity and behavior guardrails

**Subdirectories** under this directory:
- (none)

**Pages** in this directory:
- (none)
