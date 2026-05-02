---
name: classify-document
description: Classifies a single inventory row into one of the 9 data-room buckets (or 00_NEEDS_REVIEW) using a two-pass strategy — filename peek first, content peek as fallback. Returns a bucket assignment, a confidence percentage, and the signals used. Used by the data-room-organizer master skill once per file in the inventory.
when_to_use: |
  Called by the master data-room-organizer skill once per file from the
  ingest-data-room inventory. Should not be invoked directly. Operates on
  a single file at a time; the master skill loops.
---

# Classify Document

Assign a single file to a bucket using a **two-pass** strategy: filename
peek first, content peek only when filename signals are weak. Always
return a structured result; never return free-form prose.

The full peek mechanics — per-file-type extraction, token budgets,
confidence math, failure modes — live in
`../data-room-organizer/references/peek-strategies.md`. Read that
alongside this subskill.

## The model (full reference: `../data-room-organizer/references/taxonomy.md`)

Every document answers exactly one of:

1. Q1 — Does this entity exist & who controls it?
2. Q2 — Are the numbers real & do they tie to cash?
3. Q3 — What is the collateral & how does the book behave?
4. Q4 — Can these people actually operate this?
5. Q5 — Where is this going?

Each question maps to one or two buckets. The taxonomy reference has the
full mapping; the alias dictionary
(`../data-room-organizer/references/document-aliases.md`) shortcuts the
most common cases.

## Inputs

A single inventory row from `ingest-data-room`:

```
{
  "relative_path": "...",
  "filename": "...",
  "ext": "...",
  "size_bytes": ...,
  "mtime_iso": "...",
  "content_type_sniff": "...",
  "sample_text": "...",
  "readable": true | false
}
```

Plus the context answers from the master skill (purpose, deal size,
borrower type) — used only as a tiebreaker for ambiguous cases.

## Steps

### Step 0 — Filter unreadable / non-business

- If `readable == false` and ext is an archive (`.zip`, `.rar`, `.7z`)
  → return `{bucket: "_review", confidence_pct: 95, reason: "archive — user must unzip first"}`.
- If filename or path matches obvious personal-life patterns
  ("vacation", "wedding", "house-bills", "kids-school") → return
  `{bucket: "_review", confidence_pct: 90, reason: "appears non-business"}`.
- If `readable == false` and content type is `unknown` and the magic
  number sniff also fails → continue to Pass 2 with empty content; if
  Pass 2 also fails, route to `00_NEEDS_REVIEW` with reason
  `unknown-type`.

### Step 1 — Pass 1: filename peek

Apply, in order:

1. **Alias match** — substring (case-insensitive, normalized whitespace
   / hyphen / underscore) against the alias dictionary. Apply the
   disambiguation rules at the bottom of the dictionary
   (1040, borrowing-base, term-sheet, audit, etc.).
2. **Path-segment hints** — words inside path segments before the
   filename. Example: `guarantor/anything.pdf` is a strong 09 hint.
3. **Confidence math** — compute Pass 1 confidence using the table in
   `peek-strategies.md` ("Confidence scoring (Pass 1)").

If `pass_1_confidence_pct >= 80` → commit, skip Pass 2. Return:

```
{
  bucket: <bucket>,
  confidence_pct: <pass_1_confidence_pct>,
  signals_used: ["filename:<alias>", "path:<segment>", ...],
  pass_run: 1
}
```

### Step 2 — Pass 2: content peek

Triggered when Pass 1 confidence is < 80. Use the file-type-specific
peek per `peek-strategies.md`. Cap each peek at the documented token
budget; truncate aggressively.

The content peek does **not** keyword-match — reason about the document
using the 5-question model in `taxonomy.md`. Ask: which lender question
does this artifact answer? Map question → bucket.

Compute Pass 2 confidence per the scoring table in `peek-strategies.md`.

### Step 3 — Combine and gate

```
combined_confidence_pct =
    if Pass 1 and Pass 2 agree on bucket: max(pass_1, pass_2 + boost)
    if they disagree: min(75, pass_2_confidence_pct)
    if Pass 2 was not run: pass_1_confidence_pct
```

Apply the confidence gate:

- `combined_confidence_pct >= 70` → commit. Return the bucket.
- `combined_confidence_pct < 70` → route to `00_NEEDS_REVIEW`. Return:

```
{
  bucket: "00_NEEDS_REVIEW",
  candidates: [<bucket_a>, <bucket_b>],
  confidence_pct: <combined_pct>,
  signals_used: [...],
  reason: "ambiguous — saw <signals_summary>, couldn't decide between <a> and <b>",
  pass_run: 2
}
```

### Step 4 — Apply context tiebreakers (only when combined_pct is 70–85)

In the borderline-confidence band, use the context from the master
skill to bias the decision:

- Borrower type = "Operating company" → bias away from 04 (Collateral),
  since loan tape / vintage curves do not apply.
- Deal size < $5M → audit is optional; reviewed/compiled financials
  route to 02 with normal confidence.
- Purpose = "Equity raise" → 09 (Guarantor) is rarely required; if a
  borderline 09 candidate appears, prefer to surface the file via
  `00_NEEDS_REVIEW` rather than auto-route.

Tiebreakers shift the decision; they do not boost confidence.

## Output (per file)

```
{
  "source_path": "<relative_path>",
  "bucket": "01_Corporate_Legal" | ... | "09_Guarantor"
            | "00_NEEDS_REVIEW" | "_review" | "_unreadable",
  "subbucket": null | "_drafts" | "_duplicates",
  "confidence_pct": <int 0-100>,
  "signals_used": ["filename:cap-table", "content:'Capitalization Table — As of'"],
  "pass_run": 1 | 2,
  "reason": "one short line"
}
```

`subbucket` is set when this file is a draft or a content-duplicate of
another in the same bucket (set in coordination with `route-to-bucket`).

## What this subskill does NOT do

- It does not move files. That's `route-to-bucket`.
- It does not rename files. That's `rename-canonical`.
- It does not surface `00_NEEDS_REVIEW` to the user during the run — it
  returns the bucket and the master skill batches review surfaces.
- It does not modify the inventory. The output references the original
  row by `source_path`.
