---
name: vitamin-dd
description: Bundle entry point for vitamin-DD — private credit due diligence skills. Currently ships one skill, data-room-organizer, which organizes a messy data room (Google Drive, Box, Dropbox, SharePoint, Datasite, Egnyte, or local folder) into the 9-bucket structure institutional lenders expect. Use when the user mentions a data room, VDR, lender prep, due diligence folder, debt facility raise, warehouse line, forward flow, acquisition diligence, or asks to clean up / audit / organize / score a folder containing financial / legal / collateral documents.
when_to_use: |
  Trigger when the user mentions any of: "data room", "VDR",
  "due diligence folder", "lender prep", "debt facility raise",
  "warehouse line", "forward flow", "acquisition diligence",
  "lender-ready", "score this folder", "clean up this VDR",
  "audit my data room", or any request involving a folder with a mix
  of financial / legal / collateral documents.
---

# vitamin-DD — Private Credit Due Diligence

This bundle ships skills for private-credit deal preparation. Currently
one skill is shipped:

- **data-room-organizer** — turns any messy data room into the 9-bucket
  structure institutional lenders want, with a missing-items report and
  a Lender-Ready Score.

## How to invoke

The master skill is `data-room-organizer`. When the user asks to organize,
clean up, audit, or score a data room (or any folder full of diligence
artifacts), load `skills/data-room-organizer/SKILL.md` and follow it.

`data-room-organizer` orchestrates eight subskills (preflight + ingest +
classify + route + rename + manifest + gaps + score). Do not invoke the
subskills directly — let the master orchestrator drive.

## References

- `skills/data-room-organizer/SKILL.md` — master orchestrator
- `skills/data-room-organizer/references/taxonomy.md` — the methodology
- `skills/data-room-organizer/references/document-aliases.md` — alias dictionary
- `skills/data-room-organizer/references/peek-strategies.md` — two-pass
  classification logic (filename peek + content peek)
