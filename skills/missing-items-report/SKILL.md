---
name: missing-items-report
description: Cross-checks the organized data room against the institutional 80-item checklist and runs internal consistency checks (as-of-date alignment, bank-statement-to-P&L reconciliation, vintage-curve completeness, unresolved cross-document references). Writes GAPS.md with severity-labeled findings. Used by the data-room-organizer master skill after the manifest is generated.
when_to_use: |
  Called by the master data-room-organizer skill after generate-manifest.
  Should not be invoked directly. Read-only across the data room — never
  moves, renames, or modifies files. Writes one new file: GAPS.md.
---

# Missing Items Report

Identify what's missing or inconsistent in the data room and write
`GAPS.md` at the source root with severity-labeled findings.

This is the subskill the lender will care most about. A clean checklist
result is the difference between "looks organized" and "actually ready."

## Inputs

- The full classification + move + rename history from prior subskills.
- The context answers from the master skill (purpose, deal size, borrower
  type, company slug).

## The 80-item institutional checklist

The checklist is held in this skill as code, not in a separate reference
file (it is small enough to inline and tightly coupled to the gap-checking
logic). Each item has: bucket, name, requirement (REQUIRED / RECOMMENDED /
N/A based on context).

### 01_Corporate_Legal (12 items)

1. Certificate of incorporation / formation
2. Operating agreement / bylaws
3. Cap table (current, fully diluted)
4. Board consents authorizing the transaction
5. Good standing certificate(s) — every state of operation
6. EIN letter / W-9
7. KYC / KYB packet for primary entity
8. OFAC / sanctions screen
9. Beneficial ownership disclosure (CTA / FinCEN)
10. Material contracts (top customer, top supplier)
11. Litigation summary
12. Insurance certificates (D&O, E&O, GL, cyber)

### 02_Financial_Statements (10 items)

13. Audited financials, year-1 (most recent)
14. Audited financials, year-2
15. Audited financials, year-3
16. Internal P&L (trailing 24 months, monthly)
17. Internal balance sheet (trailing 24 months, monthly)
18. Internal statement of cash flows (annual)
19. Bank statements (last 12 months, all operating accounts)
20. Bank reconciliations (last 3 months)
21. AR / AP aging (current)
22. Quality of Earnings report (deal size $25M+)

### 03_Tax (5 items)

23. Federal tax returns (3 years, primary entity)
24. State tax returns (3 years, primary state(s) of operation)
25. Sales / use tax filings (current year)
26. Property tax assessments (where material)
27. IRS account transcripts

### 04_Collateral (12 items, specialty-finance/RE only)

28. Loan tape (loan-level, current)
29. Vintage curves (originations by quarter, last 3 years)
30. Charge-off curves
31. Static pool analysis
32. Concentration analysis (top obligor, state, industry)
33. Roll rates / delinquency migration
34. Underwriting policy / credit policy
35. Servicing reports (most recent 3 months)
36. Custodial / lockbox reports
37. UCC filings / lien schedule
38. Appraisals / valuations (RE only)
39. Rent rolls (RE only)

### 05_Existing_Debt (8 items)

40. Current credit agreements (all facilities)
41. Amendments and waivers
42. Borrowing base certificates (last 3)
43. Compliance certificates (last 3)
44. Intercreditor agreements
45. Subordination agreements
46. Debt schedule (rolling, all facilities)
47. Term sheets of any in-flight refinancing

### 06_Operations (10 items)

48. Underwriting policy and procedures
49. Servicing policy and procedures
50. Collections policy
51. BSA / AML compliance program
52. State licensing schedule (NMLS / state-by-state)
53. Vendor list and key vendor agreements
54. SOC 1 or SOC 2 report (if available)
55. Disaster recovery / business continuity plan
56. Information security policy
57. Employee handbook (if material)

### 07_Management (6 items)

58. Org chart
59. Bios of executives and key personnel
60. Background-check confirmations
61. Compensation summary / equity plan
62. Reference list (3+ references per principal)
63. Board composition and committees

### 08_Projections (8 items)

64. Pro-forma financial model (3–5 year)
65. Originations forecast (specialty finance)
66. Base / upside / downside scenarios
67. Sensitivity tables
68. Use of proceeds memo
69. Capital plan
70. Investor / management presentation
71. Market study or industry data

### 09_Guarantor (9 items, conditional on guarantor structure)

72. PFS — guarantor 1
73. PFS — guarantor 2 (if applicable)
74. Personal tax returns — guarantor 1 (2 years)
75. Personal tax returns — guarantor 2 (2 years, if applicable)
76. Schedule of investments
77. Liquidity proof
78. Trust documentation (if applicable)
79. Existing personal guarantees
80. Net worth verification

## Severity rules

Severity for a missing item depends on context:

- **HIGH** — required for this deal type AND missing entirely.
- **MEDIUM** — required, but partial coverage exists (e.g., 2 years of tax
  returns when 3 are required); OR consistency check failed; OR file is
  unreadable so completeness cannot be verified.
- **LOW** — recommended but not required; OR a metadata gap (e.g., date
  fell back to filesystem mtime).

Use the matrix in `taxonomy.md` ("Required vs optional buckets by deal
context") to map context → required/optional/N/A for each item.

## Consistency checks

Run these against the inventory + samples; record findings in GAPS.md
under a "Consistency findings" section.

### Check 1 — As-of-date alignment

For the most recent reporting period, every artifact that has an as-of
date should match within the same period:

- Audited financials: as of fiscal year-end.
- Internal P&L / BS / CF: most recent close should be ≤ 60 days old.
- Bank statements: most recent should be the same month as the most
  recent internal P&L.
- Tax returns: filed for the most recent fiscal year-end.

If the most recent audited financials are dated 2024-12-31 but the
internal P&L is only through 2024-09-30 → MEDIUM finding ("financials
predate internal management reporting").

### Check 2 — Bank-statement-to-P&L reconciliation

For each month present in both bank statements and internal P&L, verify:

- Total cash inflows / outflows on bank statements are within ±5% of
  P&L revenue and total expenses for the same month.
- If a deviation > 5% exists for any month → MEDIUM finding ("bank-stmt
  vs P&L reconciliation drift in <month>").

This is a directional check at v0.1. It does not require parsing every
transaction; comparing monthly aggregates is enough to surface the
problem.

### Check 3 — Vintage-curve completeness

If the borrower is specialty-finance / RE and a loan tape is present:

- The tape should span at least the last 12 originations months.
- If vintage curves are present, every quarter the tape covers should
  also appear in the curve dataset.

Gap → MEDIUM finding.

### Check 4 — Cross-document references that don't resolve

If any document references another by name (e.g., a credit agreement
references "Schedule 6.01(b)" or "the Compliance Certificate dated
March 31, 2025"):

- Verify the referenced artifact exists in the room.
- If not → LOW finding.

This check is best-effort at v0.1; only flag references that are clearly
formal cross-document citations, not casual mentions.

## GAPS.md output

Write at `<source_root>/GAPS.md`:

```markdown
# Gaps & Findings — <Company name>

**Generated:** <ISO date>
**Methodology:** OJ 80-item institutional checklist + 4 consistency checks.

---

## Summary

- HIGH severity: <N> findings
- MEDIUM severity: <N> findings
- LOW severity: <N> findings

A lender will block on HIGH. They will ask about MEDIUM. They may not
mention LOW, but it shapes the first impression.

---

## HIGH — block-the-deal items

(One bullet per finding, sorted by checklist item number.)

- **Item 13 — Audited financials, year-1.** Missing. Required for deal
  size $25–100M. Provide audit for fiscal year ending <date>.

(omit this section if zero findings)

---

## MEDIUM — questions you'll be asked

- **Item 20 — Bank reconciliations (last 3 months).** Only 1 of 3 months
  found. Provide reconciliations for the remaining 2 months.
- **Consistency check — Bank-stmt vs P&L reconciliation.** Drift of >5%
  detected in 2025-09. Provide a reconciling memo or corrected
  statements.

---

## LOW — polish

- **Item 56 — Information security policy.** Not found. Recommended for
  this deal size; not strictly required.

---

## Items present and accounted for

- 01_Corporate_Legal: <N> of 12 items present
- 02_Financial_Statements: <N> of 10 items present
- ...

---

## What's NOT a gap

(Optional — only if the user might wonder.)

Items the checklist normally requires but that are N/A for this deal:

- 04_Collateral items 28–39: borrower type is "Operating company" — not
  applicable.
```

## Steps

### Step 1 — Apply the context filter

Walk the 80-item list. Mark each item REQUIRED / RECOMMENDED / N/A based
on the context (purpose, deal size, borrower type) and the rules in
`taxonomy.md`.

### Step 2 — Map present-files to checklist items

For each REQUIRED or RECOMMENDED item, search the inventory for a match.
Match by:

1. Bucket — narrows the search.
2. Doctype slug from the renamed filename.
3. Original filename keyword match.
4. Sample text keyword match.

A "partial" match (e.g., 1 of 3 expected years of tax returns) counts as
present-but-incomplete — that's a MEDIUM finding, not a HIGH one.

### Step 3 — Run the four consistency checks

Each check returns 0 or more findings with severity. Record them.

### Step 4 — Compose GAPS.md

Use the template above. Sort within each severity by checklist item
number, then alphabetically. Be concise — one bullet, one finding, one
suggested action.

### Step 5 — Write the file

Write to `<source_root>/GAPS.md`. Do not back up a prior version (this
file is regenerated on every run; the prior version is never useful).

## Output

```
{
  "gaps_path": "<source_root>/GAPS.md",
  "high_count": <N>,
  "medium_count": <N>,
  "low_count": <N>,
  "items_required": <N>,
  "items_present": <N>,
  "items_partial": <N>
}
```

The numeric output feeds directly into `prep-for-lender` for scoring.

## Failure modes

- **Connector cannot write GAPS.md.** Emit the report content to the user
  with a note that they need to paste it into a file at the data-room root.
- **No files at all.** Stop with a single finding: "Data room is empty."
  Do not write a 80-item checklist of HIGHs.

## What this subskill does NOT do

- It does not move or rename files.
- It does not score (the next subskill, `prep-for-lender`, does that).
- It does not advise on remediation strategy beyond "provide X" — strategy
  is for the human reading GAPS.md.
- It does not OCR images or parse complex PDFs at v0.1; it works from the
  inventory and samples.
