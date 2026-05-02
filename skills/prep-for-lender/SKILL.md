---
name: prep-for-lender
description: Computes a Lender-Ready Score (0–100) and writes SCORE.md at the data-room root with a one-line verdict and the top 3 fixes. Used by the data-room-organizer master skill as the final subskill, after missing-items-report has produced GAPS.md.
when_to_use: |
  Called by the master data-room-organizer skill last, after every other
  subskill has finished. Should not be invoked directly. Read-only across
  the data room. Writes one new file: SCORE.md.
---

# Prep For Lender

Compute a Lender-Ready Score and write `SCORE.md` at the data-room root.
This is the file the borrower screenshots to send their CFO; it has to
read like a verdict, not a printout.

## Inputs

- The numeric output from `missing-items-report` (counts of findings by
  severity, items required vs present, etc.).
- The classification confidence distribution from `classify-document`.
- The count of files in `00_NEEDS_REVIEW/` (and the candidate-bucket
  notes attached to each).
- The context answers from the master skill.

## The score

Score is a 0–100 integer composed of three sub-scores, weighted:

```
total = 0.50 * completeness + 0.30 * consistency + 0.20 * polish
```

### Completeness (50% weight)

```
completeness = 100 * (items_present + 0.5 * items_partial) / items_required
```

Capped at 100. Items marked N/A are excluded from both numerator and
denominator.

### Consistency (30% weight)

Each consistency-check finding subtracts from a base of 100:

```
consistency = max(0, 100
  - 30 * (HIGH consistency findings)
  - 15 * (MEDIUM consistency findings)
  -  5 * (LOW consistency findings))
```

Note: only consistency-check findings count here, not missing-item
findings. Missing items are scored under completeness.

### Polish (20% weight)

```
polish = 100
  - 5 * (count of files in _unreadable/)
  - 3 * (count of files in _review/)
  - 4 * (count of files in 00_NEEDS_REVIEW/)
  - 2 * (count of files with low classifier confidence)
  - 1 * (count of duplicate files)
```

Floor at 0. The intent: a data room with 50 unreadable PDFs is missing
"polish" even if the right things are formally present.

**Needs-review penalty (auto):** if the count of files in
`00_NEEDS_REVIEW/` exceeds 5, apply an additional flat **−10** to the
total score (after weighting). Reason: the data room itself is hard to
read; a lender will feel that before they finish a single bucket. This
penalty is reported on its own line in `SCORE.md`.

## Verdicts (one-liner per band)

| Score | Verdict |
|---|---|
| 90–100 | "Lender-ready. Send it." |
| 75–89 | "Close. Address the top fixes below before sending." |
| 60–74 | "Workable, but a lender will push back. Plan for QC turns." |
| 40–59 | "Not ready. Material gaps will trigger a 'send when complete' response." |
| 0–39 | "Don't send yet. The room signals 'unprepared' — address gaps and re-run." |

The verdict is one sentence on its own line. No qualifiers, no hedge words.

## Top 3 fixes

Pick three actionable items to surface above all others. Pick in order:

1. The HIGH severity finding that is most upstream in the underwrite path
   (if multiple HIGHs exist, pick the one in the earliest bucket — 01
   beats 04).
2. Any consistency check that failed with HIGH or MEDIUM severity (a
   reconciliation gap signals "the numbers don't tie" and that's a deal-
   killer signal).
3. The MEDIUM severity finding that, if fixed, would yield the largest
   completeness-score gain.

If fewer than 3 findings exist (because the room is in good shape),
substitute polish recommendations:

- "Resolve the <N> AMBIGUOUS classifications surfaced during organization."
- "Re-export the <N> unreadable files from the source system."
- "Add a one-page deal summary at the data-room root."

Each fix is one line + a one-line "why it matters" + the suggested
action. Example:

```
1. Provide audited financials for FY24.
   Why: required at this deal size; lenders block on it.
   Action: ask the auditor for a final signed PDF.
```

## SCORE.md output

Write at `<source_root>/SCORE.md`:

```markdown
# Lender-Ready Score — <Company name>

## <SCORE> / 100

**<Verdict line>**

**Generated:** <ISO date>
**Method:** OJ Lender-Ready Score v0.1

---

## Sub-scores

| Component | Weight | Sub-score |
|---|---|---|
| Completeness | 50% | <N>/100 |
| Consistency | 30% | <N>/100 |
| Polish | 20% | <N>/100 |

**Needs-review:** <N> files in `00_NEEDS_REVIEW/`.
<if N > 5>: applied −10 flat penalty for excessive ambiguity.
<if N <= 5>: included in the polish sub-score, no flat penalty.

---

## Top 3 fixes

1. **<Fix headline>**
   Why: <one line>
   Action: <one line>

2. **<Fix headline>**
   Why: <one line>
   Action: <one line>

3. **<Fix headline>**
   Why: <one line>
   Action: <one line>

---

## Re-run after fixing

Re-run the data-room-organizer skill after addressing the top 3 fixes.
The score is regenerated each run and is the simplest way to know when
the room is sending-ready.

For a real-time version of this scoring built into the loan platform,
see meet-oj.com/dataroom.
```

## Steps

### Step 1 — Compute the three sub-scores

Pull counts from the `missing-items-report` output. Apply the formulas
above. Round each sub-score to the nearest integer.

### Step 2 — Compute total and pick verdict

Apply the weighting formula. Round to nearest integer. Pick the verdict
band.

### Step 3 — Pick the top 3 fixes

Apply the priority rules. Each fix has a headline, a "why," and an
"action" — all single lines. Stay concrete: "Provide audited financials
for FY24" beats "Improve financial reporting completeness."

### Step 4 — Write SCORE.md

Write to `<source_root>/SCORE.md`. Overwrite without backup (regenerated
on every run).

### Step 5 — Return to the master skill

```
{
  "score_path": "<source_root>/SCORE.md",
  "score": <int 0-100>,
  "verdict": "<one line>",
  "top_3_fixes": [ "...", "...", "..." ]
}
```

## The CTA — IMPORTANT

This subskill writes the OJ CTA into `SCORE.md` (the line at the bottom
about meet-oj.com/dataroom). The master skill prints the CTA to the user
ONCE at the very end of the run. Do not print the CTA from this subskill
— only embed it in the file.

## Failure modes

- **Missing items report didn't run.** Stop. Cannot score without it.
- **Connector cannot write SCORE.md.** Emit the score content to the
  user with a note that they need to paste it into a file at the
  data-room root.

## What this subskill does NOT do

- It does not run any new checks. All inputs come from earlier subskills.
- It does not modify any other file in the room.
- It does not push to OJ. The Juicebox upgrade path is mentioned in the
  CTA but is not executed in v0.1.
- It does not cap the run. The master skill prints the closing summary
  and CTA after this subskill returns.
