---
name: rename-canonical
description: Standardizes filenames across the organized data room to YYYY-MM-DD_company_doctype.ext format. Used by the data-room-organizer master skill after route-to-bucket has placed every file in its bucket. Preserves original filenames in the INDEX.md cross-reference so nothing is lost.
when_to_use: |
  Called by the master data-room-organizer skill after route-to-bucket has
  finished moving files. Should not be invoked directly. Mutates filenames
  in place — confirm with the user before running.
---

# Rename Canonical

Standardize every filename in the organized data room to a canonical form a
lender can scan in seconds. The canonical form:

```
YYYY-MM-DD_company_doctype.ext
```

When a date is not derivable, fall back to:

```
company_doctype.ext
```

When a company is not derivable from context, fall back to:

```
YYYY-MM-DD_doctype.ext
```

When neither is derivable, leave the filename unchanged and note in
`INDEX.md`.

## Inputs

- The `moves` array from `route-to-bucket`.
- The context answers from the master skill (the company name is the
  borrower the user is preparing this room for; if the master skill did
  not capture it, ask once now via `AskUserQuestion`).

## Pre-flight: capture the company slug

If the master skill did not capture a company name, ask:

> "What's the borrower's name as you want it to appear in filenames?
> (Short slug, no spaces — e.g., `acme-finance`, `metroplex-lending`.)"

Slugify the answer:

- Lowercase.
- Replace spaces with hyphens.
- Strip non-alphanumeric except hyphens.
- Cap at 30 chars.

Hold this slug for the duration of the run.

## Steps

### Step 1 — Derive a date

For each file, in priority order:

1. Filename match for `YYYY-MM-DD`, `YYYYMMDD`, `MM-DD-YYYY`, `M-D-YY`,
   `YYYY-Q[1-4]`, `YYYY-MMM` (e.g., `2025-Mar`). Normalize to ISO
   `YYYY-MM-DD`. For quarter-only, use the last day of the quarter. For
   month-only, use the last day of the month.
2. "As-of" date inside the document (sample text from ingest may show
   "As of December 31, 2025" or "Period ending 9/30/2025"). Normalize.
3. File mtime as an absolute fallback. Tag this case so the manifest can
   note that the date came from filesystem metadata, not the document.

If none of the above succeed → no date.

### Step 2 — Derive a doctype

Map from the bucket and content signals to a short canonical doctype slug:

| Bucket | Common doctypes |
|---|---|
| 01 | `articles`, `op-agreement`, `cap-table`, `board-consent`, `kyc`, `ofac`, `coi`, `litigation-summary`, `material-contract` |
| 02 | `audit`, `reviewed-fs`, `compiled-fs`, `pl`, `bs`, `cf`, `bank-stmts`, `bank-rec`, `ar-aging`, `ap-aging`, `qoe`, `mgmt-letter` |
| 03 | `1120`, `1120s`, `1065`, `1040`, `state-tax`, `sales-tax`, `irs-transcript` |
| 04 | `loan-tape`, `vintage-curve`, `static-pool`, `concentration`, `roll-rate`, `uw-guidelines`, `servicing-report`, `ucc`, `appraisal`, `lockbox-report`, `rent-roll` |
| 05 | `credit-agreement`, `amendment`, `waiver`, `bbc`, `compliance-cert`, `intercreditor`, `subordination`, `debt-schedule`, `term-sheet` |
| 06 | `uw-policy`, `servicing-policy`, `collections-policy`, `bsa-aml`, `licensing-schedule`, `vendor-list`, `soc1`, `soc2`, `bcp`, `infosec-policy`, `employee-handbook` |
| 07 | `org-chart`, `bio`, `resume`, `comp-summary`, `references`, `board-composition` |
| 08 | `pro-forma`, `forecast`, `sensitivity`, `use-of-proceeds`, `capital-plan`, `cim`, `investor-deck`, `market-study` |
| 09 | `pfs`, `personal-tax-return`, `liquidity-proof`, `trust-doc`, `personal-guaranty`, `nwc` |

If multiple files in the same bucket share a doctype slug → append a
disambiguator. Order: bank account name (for bank-stmts), period (for
financials), guarantor name (for PFS), then `__1`, `__2`.

Example outputs:

```
2025-12_acme-finance_bank-stmts__primary-checking.pdf
2025-Q4_acme-finance_pl.xlsx
2025-12-31_acme-finance_audit.pdf
acme-finance_op-agreement.pdf
2024_acme-finance_1120.pdf
2025-12-31_jane-doe_pfs.pdf
```

### Step 3 — Apply the rename

For each file:

1. Compute the canonical filename per the rules above.
2. If the canonical name equals the existing name → skip (record as
   `unchanged`).
3. If the canonical name collides with another file in the same bucket
   → apply the disambiguator from step 2.
4. Rename in place.
5. Append to the run-local rename log:

```
<old basename>  →  <new basename>   (bucket, original-filename-preserved-in-INDEX)
```

### Step 4 — Drafts and duplicates

Draft files inside `_drafts/` and duplicate files inside `_duplicates/`
get the canonical name with a `__draft-vN` or `__dup` suffix appended
before the extension. The "primary" file (the one promoted to the bucket
root) gets the clean canonical name.

### Step 5 — Bucket-root utility files

Files in `_review/` and `_unreadable/` keep their original filenames. Do
not rename — those folders are for human triage and the original name is
the most useful piece of information.

## Output

```
{
  "renames": [
    { "from_path": "...", "to_path": "...", "kept_original": "..." },
    ...
  ],
  "unchanged_count": ...,
  "rename_count": ...,
  "collisions_resolved": ...
}
```

## Failure modes

- **Filesystem disallows the canonical character set.** Fall back to ASCII
  only. The slug rules already enforce this; surface the case in the run
  log if encountered.
- **Connector does not support rename.** Fall back to "virtual layout" —
  emit the canonical names in INDEX.md alongside originals; do not error
  the run.
- **Rename creates a name longer than 255 chars.** Truncate the doctype
  slug, then the company slug, in that order, until it fits. Always keep
  the date prefix and the extension.

## What this subskill does NOT do

- It does not move between buckets (already done by `route-to-bucket`).
- It does not write the manifest (next subskill).
- It does not delete or merge files.
- It does not OCR images to derive dates at v0.1.
