---
name: ingest-data-room
description: Reads a verified data-room source (returned by setup-source-access) and produces a flat inventory of every file. Inventory rows include relative path, filename, size, last-modified date, content-type sniff, and a small content sample where readable. Used by the data-room-organizer master skill before classification.
when_to_use: |
  Called by the master data-room-organizer skill after setup-source-access
  has returned a verified source. Should not be invoked directly. Operates
  read-only — never moves, renames, or deletes anything in this step.
---

# Ingest Data Room

Build a flat inventory of every file in the data room. Read-only. Do not
mutate the source.

## Inputs

A `source_handle` from `setup-source-access`:

- For Tier 1 (MCP): a connector folder ID.
- For Tier 2 / Tier 3 / local: an absolute filesystem path.

## Steps

### Step 1 — Walk the source

Recursively enumerate every file under the source handle. Skip:

- OS metadata files: `.DS_Store`, `Thumbs.db`, `~$*.tmp`
- Lock files: `*.lock`, `.~lock.*`
- Empty directories (record them, but do not descend further)

Do not skip:

- Hidden files that the user clearly intended to upload (no leading-dot
  filter beyond the OS metadata list above)
- Files inside subfolders the user already created (preserve original path
  in the inventory; the route step will decide whether to flatten)

### Step 2 — Capture metadata

For each file, capture:

```
- relative_path          # path from source root, forward-slash normalized
- filename               # basename
- ext                    # lowercased extension, empty string if none
- size_bytes
- mtime_iso              # ISO 8601 last-modified (UTC if available)
- content_type_sniff     # see step 3
- sample_text            # see step 4 (may be empty)
- readable               # bool
```

### Step 3 — Sniff content type

Light-touch type detection. In order:

1. Map by extension (`.pdf` → `pdf`, `.xlsx` → `excel`, `.docx` → `word`,
   `.csv` → `csv`, `.txt` / `.md` → `text`, `.png` / `.jpg` / `.tiff` →
   `image`, `.eml` / `.msg` → `email`, `.zip` → `archive`).
2. For unknown extensions, peek at the first ~16 bytes (magic number) and
   match against common signatures (PDF `%PDF`, ZIP/Office `PK\x03\x04`, etc.).
3. Anything still unknown → `unknown`.

Mark `readable = false` for `archive` (never auto-extract — surface the zip
itself to the user) and for any file whose extension or magic number does
not match a recognized type.

### Step 4 — Pull a sample

Extract a small text sample to feed the classifier. **Cap the sample so
ingestion stays cheap** — never dump entire documents:

| Type | Sample |
|---|---|
| pdf | First 500 chars of extracted text from page 1; if page 1 is image-only, OCR not required at v0.1 — leave sample empty |
| excel | Sheet names + the first 20 rows of the first sheet (cell values, not formulas) |
| word | First 500 chars of body text |
| csv | First 20 rows |
| text | First 500 chars |
| image | Filename only (no OCR at v0.1) |
| email | Subject line + first 200 chars of body |
| archive | Filename only |
| unknown | Filename only |

Truncate aggressively. The classifier mostly relies on filename + path; the
sample is a tiebreaker.

### Step 5 — Build the inventory

Return an array of inventory rows in deterministic order: sort by
`relative_path` ascending. Stable sort matters because the user will see
this order reflected in `INDEX.md` and downstream logs.

### Step 6 — Sanity report

Before returning, summarize for the user (one short paragraph, no header):

- Total file count
- Total size (rounded to MB or GB)
- Count by type (pdf, excel, word, etc.)
- Count of unreadable / unknown files
- Largest file (path + size)

If the inventory is empty, stop and tell the master skill — do not return an
empty inventory and let downstream subskills run on nothing.

## Output

```
{
  "source_handle": <unchanged>,
  "file_count": <int>,
  "total_size_bytes": <int>,
  "files": [ <inventory row>, ... ]
}
```

## Failure modes

- **Permission denied on a subfolder.** Skip it, log a warning, continue.
  Surface the list of skipped folders in the sanity report so the user can
  fix permissions and re-run if any were unexpected.
- **A file is locked or in-use.** Treat as unreadable. Continue.
- **Source handle is no longer accessible mid-walk.** Stop. Surface the
  error to the master skill.

## What this subskill does NOT do

- It does not classify. That's `classify-document`.
- It does not move or rename. That's `route-to-bucket` and `rename-canonical`.
- It does not extract zip archives. Surface them as files in the inventory;
  the user should unzip first if they want the contents organized.
- It does not OCR images at v0.1. Image content is filename-only.
