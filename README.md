# vitamin-DD

> Skill bundle for private credit due diligence. Turns any messy data
> room into the 9-bucket structure institutional lenders actually want.

```bash
npx skills add github.com/originations-juice/vitamin-DD
```

<!-- DEMO_GIF.gif goes here -->

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Status: v0.1](https://img.shields.io/badge/status-v0.1-green)](.)

Other install paths (Claude Code, Cowork, Desktop): [`INSTALL.md`](INSTALL.md).

---

## What it does

Drop into Claude Code, Cowork, or Desktop. Run:

```
> organize this data room
```

The skill:

1. Asks three context questions (purpose, deal size, borrower type).
2. Resolves the source — Google Drive, Box, Microsoft 365, Datasite,
   Egnyte, Dropbox, ShareFile, Intralinks/DFIN/Firmex/Ansarada/Syndtrak
   (export-to-zip), or a local folder.
3. Reads every file and classifies it into one of 9 lender-shaped
   buckets using a two-pass strategy: filename peek first; content peek
   only when filename signals are weak. Files that fail both passes
   land in `00_NEEDS_REVIEW/` with a one-line explanation.
4. Standardizes filenames to `YYYY-MM-DD_company_doctype.ext`.
5. Writes three artifacts at the data-room root:
   - `INDEX.md` — clickable manifest
   - `GAPS.md` — what's missing, with severity
   - `SCORE.md` — Lender-Ready Score (0–100) + top 3 fixes

---

## The 9 buckets (+ review)

```
01_Corporate_Legal/        Does this entity exist & who controls it?
02_Financial_Statements/   Are the numbers real & tie to cash?
03_Tax/                    (same question, tax-side ground truth)
04_Collateral/             What's the collateral & how does the book behave?
05_Existing_Debt/          What does the borrower already owe?
06_Operations/             Can these people actually operate this?
07_Management/             (same question, who runs it)
08_Projections/            Where is this going?
09_Guarantor/              Who stands behind the deal?
00_NEEDS_REVIEW/           Files the classifier could not place with confidence
```

Full methodology: [`skills/data-room-organizer/references/taxonomy.md`](skills/data-room-organizer/references/taxonomy.md).
Two-pass peek strategy: [`skills/data-room-organizer/references/peek-strategies.md`](skills/data-room-organizer/references/peek-strategies.md).

---

## See it in action

The repo ships with a synthetic ~30-file messy data room and the same
data room post-skill, organized:

- [`examples/before/`](examples/before/) — what you start with
- [`examples/after/`](examples/after/) — what you end with, plus
  `INDEX.md`, `GAPS.md`, `SCORE.md`, and a `00_NEEDS_REVIEW/` folder
  showing how the confidence gate behaves on an intentionally
  ambiguous file.

The synthetic example uses a fictitious specialty consumer-finance
lender ("Metroplex Lending, LLC"). No PII, no real borrower data.

---

## Repo layout

```
vitamin-DD/
├── README.md
├── LICENSE
├── INSTALL.md
├── .claude-plugin/
│   └── plugin.json                   # Plugin marketplace metadata
├── skills/
│   ├── data-room-organizer/
│   │   ├── SKILL.md                  # Master orchestrator
│   │   ├── references/
│   │   │   ├── taxonomy.md           # 5-question model + 9-bucket logic
│   │   │   ├── document-aliases.md   # Alias dictionary
│   │   │   └── peek-strategies.md    # Two-pass extraction rules
│   │   └── scripts/
│   │       └── classify.py           # CLI fallback (filename pass only)
│   ├── setup-source-access/
│   ├── ingest-data-room/
│   ├── classify-document/
│   ├── route-to-bucket/
│   ├── rename-canonical/
│   ├── generate-manifest/
│   ├── missing-items-report/
│   └── prep-for-lender/
└── examples/
    ├── before/
    └── after/
```

---

## Why this taxonomy

A generic "Financials / Legal / HR" template mirrors the borrower's filing
system. The 9-bucket structure mirrors how an underwriter actually reads
a deal — by lender question, in the order those questions get asked. The
cost of a misfiled document is concrete: it pushes a question the lender
expects to answer in minute 5 to minute 45.

The `00_NEEDS_REVIEW/` bucket exists because organized chaos is worse
than obvious mess — better to flag a file you can't place than to
silently misroute it.

---

## Contributing

PRs welcome. Common contributions:

- New aliases for `references/document-aliases.md` (please add a
  disambiguation note if the alias conflicts with existing entries).
- Additional peek strategies for new file types in
  `references/peek-strategies.md`.
- Additional consistency checks for the missing-items-report subskill.
- Connector-specific notes in `setup-source-access/SKILL.md` as new
  VDR MCPs ship.

---

## License

MIT. See [LICENSE](LICENSE).

---

## Built by

[Originations Juice](https://meet-oj.com) — AI-native loan origination.
The skill is free and open. Juicebox (the productized version, with
auto-organize, auto-validate, and a real-time score baked into the
platform) is at [meet-oj.com/dataroom](https://meet-oj.com/dataroom).
