---
name: route-to-bucket
description: Creates the 9-bucket folder structure inside the data-room source and moves each classified file to its assigned bucket. Also creates 00_NEEDS_REVIEW (a 10th destination for low-confidence files), plus _drafts, _duplicates, _unreadable, _review subfolders as needed. Used by the data-room-organizer master skill after classify-document has produced bucket assignments for every file.
when_to_use: |
  Called by the master data-room-organizer skill after every file in the
  inventory has a bucket assignment. Should not be invoked directly. This
  is the first subskill that mutates the source — confirm the user is OK
  with in-place reorganization before running.
---

# Route To Bucket

Create the 9-bucket folder structure and move each file to its assigned
bucket. This is the first subskill that **mutates** the data-room source.

## Inputs

- The classification array from `classify-document` (one record per file).
- The verified `source_handle` from `setup-source-access`.
- The context answers from the master skill (used to decide which empty
  required buckets to materialize).

## Pre-flight: confirm with the user

This subskill writes to the data room. Before doing so, present a one-line
confirmation:

> "Ready to reorganize <N> files into the 9-bucket structure. Files will be
> moved in place inside <source>. Continue?"

Get explicit confirmation. If the user says no, stop and return without
mutating anything.

For Tier 1 (MCP) sources where in-place mutation may not be supported,
substitute "moved" with "organized via the connector." For Tier 3
(export-to-zip) sources, mutation is always local — proceed without extra
caveat.

## Steps

### Step 1 — Determine which buckets to create

- All buckets that contain at least one assigned file → create.
- Required-but-empty buckets (per the matrix in `taxonomy.md`) → create
  empty. The presence of an empty `04_Collateral/` is itself a signal in
  GAPS.md.
- Optional-and-empty buckets → do not create.

Plus these utility / review folders, only if they have content:

- `00_NEEDS_REVIEW/` — at the data-room root. Holds files the classifier
  could not place with confidence ≥ 70 after both passes. Each file in
  this folder gets a sibling `<filename>.txt` containing the reason
  (signals seen, candidate buckets, suggested next step). This is a
  10th destination, sorted to the top by the `00_` prefix so a human
  triages it first.
- `_drafts/` — created INSIDE a bucket, not at the root, when a draft
  and an executed version of the same artifact both exist.
- `_duplicates/` — created INSIDE a bucket when two files are
  byte-for-byte identical.
- `_unreadable/` — at the data-room root, holds files the classifier
  could not read at all (encrypted, corrupt, password-protected). The
  reason is documented in the sibling `.txt` (same convention as
  `00_NEEDS_REVIEW/`).
- `_review/` — at the data-room root, holds files the classifier
  identified as personal / non-business (e.g., vacation photos, household
  bills) that the user must triage manually.

### Step 2 — Create the structure

Use the canonical folder names exactly:

```
01_Corporate_Legal/
02_Financial_Statements/
03_Tax/
04_Collateral/
05_Existing_Debt/
06_Operations/
07_Management/
08_Projections/
09_Guarantor/
```

Numeric prefix is mandatory. Underscores, not spaces, not hyphens.

### Step 3 — Move files

For each classified file:

1. Compute the destination: `<source_root>/<bucket>/<filename>` (renaming
   happens in the next subskill, so keep the original filename here).
2. Detect collisions with already-moved files. If two files would land at
   the same destination path:
   - If their content hashes match → keep one, move the other to
     `<bucket>/_duplicates/`.
   - If their content hashes differ → append a short suffix (`__1`, `__2`)
     to the second file's basename. Note in INDEX.md.
3. Detect drafts:
   - If the filename matches `*_draft*` or `*_v[0-9]*` AND a non-draft
     sibling exists in the same bucket → move the draft to
     `<bucket>/_drafts/`. Keep the executed version at the bucket root.
4. Move via the surface's native operation:
   - Local: `mv` / file system move.
   - Tier 1 MCPs: the connector's move/relocate operation if supported.
     If the connector is read-only, fall back to a "copy + virtual layout"
     mode: write a `LAYOUT.md` describing the recommended structure and a
     `INDEX.md` that links to original files in place. Note this clearly
     in the run log.

### Step 4 — Handle special destinations

- `00_NEEDS_REVIEW` → create the folder if not already present. Move the
  file using its **original filename** (do not rename — the original
  name is the most useful triage signal). Write a sibling
  `<filename>.txt` next to it with the exact format documented in
  `peek-strategies.md` ("Failure modes (file-level)"):

  ```
  File: <original relative path>
  Reason: <reason code>
  Pass 1 confidence: <int>
  Pass 2 confidence: <int>     (omit if Pass 2 was not run)
  Signals used: <comma-separated list>
  Suggested next step: <one line>
  ```

- `_review` and `_unreadable` → move to root-level utility folders. For
  `_unreadable`, write a sibling `.txt` using the same template as
  `00_NEEDS_REVIEW`. For `_review`, do not write a sibling — the
  filename usually says enough.

### Step 5 — Preserve original-path metadata

For every moved file, append to a run-local `_moves.log` (kept in memory,
written to `INDEX.md` by the next-but-one subskill):

```
<original relative path>  →  <new relative path>  (bucket, confidence, reason)
```

The user must be able to reconstruct any move. Never silently drop history.

## Output

```
{
  "moves": [
    { "from": "...", "to": "...", "bucket": "...", "confidence": "...", "reason": "..." },
    ...
  ],
  "buckets_created": ["01_Corporate_Legal", ...],
  "needs_review_count": <int>,
  "utility_folders_created": ["00_NEEDS_REVIEW", "_drafts", "_unreadable", ...],
  "skipped": [
    { "path": "...", "reason": "user declined", ... }
  ]
}
```

## Failure modes

- **Connector is read-only.** Fall back to "virtual layout" mode (see step
  3.4). Tell the user explicitly.
- **Move fails mid-batch.** Stop. Do not continue moving. Surface what's
  done, what's pending, and what blocked it.
- **Disk full / quota exceeded.** Stop. The data room will be in a partial
  state — surface that to the user with clear next steps.
- **00_NEEDS_REVIEW backlog grows large.** If more than 10% of files
  land in `00_NEEDS_REVIEW`, surface a warning to the user — the source
  may have export issues, foreign-language content, or another
  systemic problem worth fixing before continuing.

## What this subskill does NOT do

- It does not rename files (next subskill).
- It does not write `INDEX.md` (subskill 5 / `generate-manifest`).
- It does not score or audit (subskills 6 and 7).
- It never deletes a file. Duplicates go to `_duplicates/`, not the trash.
