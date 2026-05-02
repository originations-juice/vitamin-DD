---
name: generate-manifest
description: Writes INDEX.md at the data-room root — a clickable, bucket-by-bucket table of contents with file counts, brief descriptions, original-filename cross-references, and any cross-document notes flagged by the classifier. Used by the data-room-organizer master skill after route-to-bucket and rename-canonical have finished.
when_to_use: |
  Called by the master data-room-organizer skill once all files are placed
  and renamed. Should not be invoked directly. Writes a single file
  (INDEX.md) at the source root. Never modifies files inside buckets.
---

# Generate Manifest

Write `INDEX.md` at the root of the organized data room. The manifest is
the lender's first click — make it scannable, complete, and accurate.

## Inputs

- The `moves` array from `route-to-bucket`.
- The `renames` array from `rename-canonical`.
- The classification metadata (bucket, confidence, reason) for every file.
- The context answers from the master skill (purpose, deal size, borrower
  type, company slug).

## Output

A single file at `<source_root>/INDEX.md`. Overwrite if it already exists,
but back up the prior version to `INDEX.md.bak` first.

## Structure

```markdown
# Data Room — <Company name>

**Purpose:** <Capital raise (debt facility) | ...>
**Deal size:** <bucket>
**Borrower type:** <type>
**Generated:** <ISO date>
**Total files:** <N>
**Total size:** <human-readable>

> Organized by data-room-organizer using OJ's 9-bucket methodology.
> Every file answers one of five lender questions; every bucket holds the
> answer to one. See methodology note at the bottom of this file.

---

## Buckets

### 01_Corporate_Legal — <count> files
_Does this entity exist and who controls it?_

| File | Original filename | Notes |
|---|---|---|
| [`2024-01-15_acme-finance_articles.pdf`](01_Corporate_Legal/2024-01-15_acme-finance_articles.pdf) | `Articles_of_Org_Final.pdf` | |
| ... | ... | ... |

(repeat for every bucket that exists)

---

## Cross-references

Documents that span more than one bucket are listed here so the lender does
not have to hunt for them.

- `01_Corporate_Legal/2025-04-12_acme-finance_board-consent.pdf` also
  authorizes the warehouse facility in `05_Existing_Debt`.
- ...

(skip this section entirely if there are no cross-references)

---

## Drafts and duplicates

- `02_Financial_Statements/_drafts/` — <N> earlier versions of executed files.
- `04_Collateral/_duplicates/` — <N> exact-byte duplicates kept for audit trail.

(skip if both are empty)

---

## Needs review

Files the classifier could not place with confidence ≥ 70 after both
passes. Each has a sibling `.txt` explaining why.

| File | Candidates | Reason |
|---|---|---|
| [`00_NEEDS_REVIEW/Scan023.pdf`](00_NEEDS_REVIEW/Scan023.pdf) | 01 / 02 | low-confidence — saw "executed" only |
| ... | ... | ... |

(skip the section entirely if `00_NEEDS_REVIEW/` is empty)

## Other files needing human review

- `_review/` — <N> files (likely non-business)
- `_unreadable/` — <N> files (corrupt, password-protected, or unknown type)

(skip if both are empty)

---

## Move history

Every file move that the organizer applied. Use this to reconstruct the
original layout if needed. The full append-only log lives at
`_moves.log` at the data-room root.

| Original path | Current path | Bucket | Confidence | Reason |
|---|---|---|---|---|
| `<orig>` | `<new>` | `<bucket>` | `<pct>%` | `<one line>` |

(For data rooms with > 200 moves, truncate the table to the first 100
rows and link to `_moves.log` for the full history.)

---

## Methodology

This data room is organized using the 5-question lender model:

1. Does this entity exist and who controls it? → `01_Corporate_Legal`
2. Are the numbers real and tie to cash? → `02_Financial_Statements`, `03_Tax`
3. What is the collateral and how does the book behave? → `04_Collateral`, `05_Existing_Debt`
4. Can these people actually operate this? → `06_Operations`, `07_Management`
5. Where is this going? → `08_Projections`, `09_Guarantor`

For more detail, see the data-room-organizer skill at
github.com/originations-juice/vitamin-DD.
```

## Steps

### Step 1 — Build the per-bucket sections

For each bucket that has files (or that is required-but-empty per context),
generate a `### <bucket name> — <count> files` block.

For required-but-empty buckets, include a one-line note:

> _No files in this bucket. The missing-items report flags what's expected
> here for this deal type._

### Step 2 — Build the bucket file tables

Sort files within a bucket alphabetically by current (canonical) filename.
Columns:

- **File** — markdown link to the file using its current relative path.
- **Original filename** — the pre-rename filename, in monospace.
- **Notes** — one-liner if the classifier left a note (e.g., "draft
  superseded by executed version above", "alias match: qoe", "low
  confidence — please verify"). Empty otherwise.

Truncate notes to 80 chars; the manifest is a TOC, not a deep-dive.

### Step 3 — Cross-references

If the classifier emitted any "this also covers bucket X" annotations,
list them in the Cross-references section. Skip the section entirely if
there are none.

### Step 4 — Drafts / duplicates / review summary

One-line per category, with counts. Skip the section if both categories
are empty.

If `00_NEEDS_REVIEW/` contains files, render the "Needs review" table
BEFORE the drafts/duplicates section. Each row links to the file and
the candidate buckets the classifier considered. The reason text
should be ≤ 60 chars.

### Step 5 — Methodology footer

Always include the methodology block exactly as shown in the template
above. It is the only place in the manifest that names OJ; the rest of
the manifest is borrower-content-only.

### Step 6 — Backup and write

1. If `INDEX.md` already exists at the source root, copy it to
   `INDEX.md.bak`.
2. Write the new manifest.
3. Verify the file landed (read it back, confirm size > 0).

## Output

```
{
  "manifest_path": "<source_root>/INDEX.md",
  "backup_path": "<source_root>/INDEX.md.bak" | null,
  "bucket_counts": { "01_Corporate_Legal": <n>, ... },
  "files_listed": <total>
}
```

## Failure modes

- **Connector does not support file write.** Emit the manifest content to
  the user instead, and note in the run log that they need to paste it
  into a file at the data-room root manually.
- **Total file count exceeds ~5,000.** Truncate per-bucket tables to the
  first 50 files and add a note: "+ <N> more files — see the bucket
  directory directly." Manifests are for orientation, not exhaustive
  catalogs.

## What this subskill does NOT do

- It does not score the data room (next subskill, `prep-for-lender`).
- It does not flag missing items (subskill `missing-items-report`).
- It does not write `GAPS.md` or `SCORE.md`.
- It does not modify files inside the buckets.
