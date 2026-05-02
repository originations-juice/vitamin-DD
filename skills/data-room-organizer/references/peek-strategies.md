# Peek strategies — two-pass classification

The classifier never reads whole files. It uses the smallest excerpt that
gets the job done. This reference documents how each pass works and how
to peek into each common file type.

---

## Two-pass strategy

```
For each file in the inventory:

  PASS 1 — filename peek (cheap, run on every file)
    ├─ Extension + filename keyword match against
    │   references/document-aliases.md
    ├─ Path-segment hints (e.g., "guarantor/", "tax/", "_drafts/")
    ├─ Disambiguation rules (1040, borrowing-base, term-sheet, audit)
    └─ Output: { bucket, confidence_pct, signals_used }

  if confidence_pct >= 80:
      → commit the bucket, skip Pass 2

  PASS 2 — content peek (only when Pass 1 is weak)
    ├─ Extract MINIMUM bytes per file type (see table below)
    ├─ Reason over the excerpt using the 5-question model in
    │   references/taxonomy.md
    └─ Output: { bucket, confidence_pct, signals_used }

  CONFIDENCE GATE
    if confidence_pct >= 70:
        → route to assigned bucket
    else:
        → route to 00_NEEDS_REVIEW/ with a sibling .txt note
          ("ambiguous — saw <signals>, couldn't decide between
            <bucket A> and <bucket B>")
```

Two principles:

1. **Cheap before expensive.** Filename peek costs ~0 tokens; content
   peek costs real tokens. Skip the content peek when the filename is
   already conclusive.
2. **Better flagged than misrouted.** A file in `00_NEEDS_REVIEW/` is a
    5-second human triage. A file in the wrong bucket is a 5-minute
   confused-lender moment that costs trust.

---

## Confidence scoring (Pass 1)

```
high signal       confidence_pct
──────────────────────────────────
exact alias hit (substring, len >= 8 chars)         95
exact alias hit (short, len < 8) + path corroboration 85
exact alias hit (short, len < 8) alone              70
multiple aliases all → same bucket                  90
multiple aliases → different buckets, longest wins  60
disambiguation rule fired (1040, borrowing-base...) 85
no alias hit, but path segment hint                 50
no alias hit, no path hint                          0
```

Anything ≥ 80 → commit. Anything 50–79 → run Pass 2 to corroborate or
pivot. Below 50 → run Pass 2 with no priors.

---

## Confidence scoring (Pass 2)

```
content signal                                       contribution
──────────────────────────────────────────────────────────────────
explicit document title in first 1-2 pages          +50
named entity (borrower, guarantor, lender) match    +20
form number / regulatory header (1120, 1065, K-1)   +30
column headers match a canonical schema (loan tape) +30
"As of <date>" with consistent borrower name        +10
```

Sum the contributions. Cap at 95. Compare with the Pass 1 confidence — if
Pass 2 arrives at the **same** bucket as Pass 1 with > 50% combined
confidence, commit at the higher of the two.

If Pass 2 disagrees with Pass 1: take Pass 2's bucket (content beats
filename), but cap confidence at 75 — disagreement is itself a signal
that the file is mis-named or mis-located, and a human may want to look.

---

## Per-file-type peek commands

The skill runs inside Claude. The "command" here is the actual tool
invocation — Claude's native multimodal/file tools first, shell tools
second. Token budgets are per-file caps; if the budget would be exceeded
the peek truncates and notes truncation in `signals_used`.

### PDF

```
Tool: Read with pages: "1-2"
Token budget: ≤ 1500 tokens
Signals: title block, "Independent Auditors' Report", form numbers,
         "Operating Agreement of <Entity>", "As of <date>"
Failure mode: encrypted / password-protected / corrupted →
              route to 00_NEEDS_REVIEW with reason "pdf-unreadable"
```

For scanned PDFs (image-only), Claude's multimodal Read handles the
first 1-2 pages natively. If the scan is too poor to OCR, treat as
unreadable.

### XLSX

```
Tool: Bash + python (openpyxl)
Command (template):
    python3 -c "
    from openpyxl import load_workbook
    wb = load_workbook('<path>', read_only=True, data_only=True)
    for s in wb.sheetnames[:3]:
        ws = wb[s]
        print(f'## {s}')
        for row in ws.iter_rows(min_row=1, max_row=5, values_only=True):
            print(row)
    "
Token budget: ≤ 1500 tokens (3 sheets × 5 rows × 10 cols × small values)
Signals: sheet names ('Loan Tape', 'Cap Table', 'Vintage Curves'),
         column headers (loan_id, origination_date, principal_balance →
         loan tape; member, units, % → cap table)
Failure mode: password-protected → 00_NEEDS_REVIEW reason "xlsx-locked"
```

### DOCX

```
Tool: Bash + python (python-docx)
Command (template):
    python3 -c "
    from docx import Document
    d = Document('<path>')
    print('\\n'.join(p.text for p in d.paragraphs[:30])[:1000])
    "
Token budget: ≤ 1000 tokens
Signals: first paragraph titles, section headers
Failure mode: corrupted → 00_NEEDS_REVIEW reason "docx-unreadable"
```

### PPTX

```
Tool: Bash + python (python-pptx)
Command (template):
    python3 -c "
    from pptx import Presentation
    p = Presentation('<path>')
    for s in p.slides[:2]:
        for sh in s.shapes:
            if sh.has_text_frame:
                print(sh.text_frame.text)
    "
Token budget: ≤ 800 tokens
Signals: deck title slide, "Investor Presentation", "Confidential
         Information Memorandum"
Failure mode: corrupted → 00_NEEDS_REVIEW reason "pptx-unreadable"
```

### CSV / TXT / MD

```
Tool: Read with offset: 0, limit: 100
Token budget: ≤ 1500 tokens
Signals: column headers, first few rows
Failure mode: empty file → 00_NEEDS_REVIEW reason "empty"
```

### Images (PNG / JPG / TIFF)

```
Tool: Read (Claude reads natively — multimodal)
Token budget: image budget (whatever the surface allows; cap 1 image)
Signals: org chart layout, signed cover page, "OFFICIAL" stamp
Failure mode: low resolution or unrelated content → use filename only;
              if filename is also weak → 00_NEEDS_REVIEW reason
              "image-no-signal"
```

### Email (.eml / .msg)

```
Tool: Bash + grep on Subject + first 200 chars of body
Token budget: ≤ 500 tokens
Signals: subject line, who-from
Failure mode: encrypted → 00_NEEDS_REVIEW reason "email-encrypted"
```

### Archive (.zip / .rar / .7z)

```
Do not extract. Do not peek.
Route directly to _review/ with reason
"archive — user must unzip to organize the contents"
```

### Unknown extension

```
Magic-number sniff:
    %PDF        → treat as PDF
    PK\x03\x04  → ZIP (might be xlsx / docx / pptx / generic zip — try
                  treating as the latest-modified Office format if size
                  matches; else archive)
Otherwise → 00_NEEDS_REVIEW reason "unknown-type"
```

---

## Token budget per run

Total peek tokens should stay under:

```
peek_tokens_total ≈ files_in_inventory × 1500 (avg)
```

For a 200-file data room, that's ≤ 300K tokens of peek. If a room
exceeds 500 files, the master skill should batch in groups and warn the
user about cost before continuing.

---

## Failure modes (file-level)

When a peek fails, route the file to `00_NEEDS_REVIEW/` with a sibling
`<filename>.txt` containing exactly:

```
File: <original relative path>
Reason: <one of: pdf-unreadable | xlsx-locked | docx-unreadable |
                 pptx-unreadable | image-no-signal | email-encrypted |
                 unknown-type | empty | low-confidence>
Pass 1 confidence: <int>
Pass 2 confidence: <int>  (omit if Pass 2 was not run)
Signals used: <comma-separated list>
Suggested next step: <one line — e.g., "Re-export from source", "Open
                     and identify the document type, then re-run">
```

Do not lose the original file. The route subskill moves it; the
sibling .txt explains it.

---

## What this reference does NOT cover

- Heavy OCR of scanned-only PDFs at v0.1 (multimodal Read handles
  cover-page-level scans; deep OCR is out of scope for v0.1 — flag and
  send to `00_NEEDS_REVIEW/`).
- Foreign-language documents (v0.1 is English-only; non-English files
  → `00_NEEDS_REVIEW/` with reason `non-english`).
- Documents inside encrypted archives. Always handle archives at the
  zip-file level, not by extracting.
