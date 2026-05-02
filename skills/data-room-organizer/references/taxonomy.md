# Taxonomy: the 5-question model and the 9 buckets

This is the brain of the skill. Every classification decision flows from it.

## Core principle

> Every document in a private-credit data room exists to answer one of five
> lender questions. Classify by the question, then route to the bucket that
> holds the answer.

The 5 questions are how an underwriter reads a deal. The 9 buckets are the
container shape that institutional lenders expect when they open a data room.
The mapping below is the methodology — internal Originations Juice (OJ) buyer
research, codified.

---

## The 5 questions → 9 buckets

### Q1. "Does this entity exist and who controls it?"

→ Bucket **01_Corporate_Legal**

Anything that proves the borrower is a real legal entity, in good standing,
controlled by identifiable people, and not on a sanctions list.

Typical documents:
- Certificate of incorporation / formation
- Operating agreement / bylaws / shareholders agreement
- Cap table (current + fully-diluted)
- Board consents and resolutions
- Good standing certificates
- EIN letter / W-9
- KYC / KYB packets
- OFAC screens, beneficial ownership disclosures (CTA / FinCEN)
- Trademarks, material IP assignments
- Material contracts (key supplier, key customer, MSAs above a threshold)
- Litigation summary / pending matters
- Insurance certificates (D&O, E&O, GL, cyber)

### Q2. "Are the numbers real and do they tie to cash?"

→ Buckets **02_Financial_Statements** and **03_Tax**

Two buckets because lenders treat tax returns as a separate ground truth.

**02_Financial_Statements** — operating-side numbers:
- Audited financials (3 years)
- Reviewed or compiled financials (when audit unavailable)
- Internal P&L, balance sheet, cash flow (monthly trailing 24 months)
- Bank statements (12–24 months, all operating accounts)
- Bank reconciliations
- AR / AP aging
- Quality of Earnings (QoE) report
- Auditor management letters
- Accounting policy memos

**03_Tax** — tax-side ground truth:
- Federal tax returns (3 years, all entities)
- State tax returns (where material)
- Sales / use tax filings (where material)
- Property tax assessments (where material)
- IRS account transcripts (when available)
- Tax sharing agreements

### Q3. "What is the collateral and how does the book behave?"

→ Buckets **04_Collateral** and **05_Existing_Debt**

This is the heart of a specialty-finance / private-credit underwrite. Two
buckets because the asset side and the liability side are scored separately.

**04_Collateral** — what backs the loan:
- Loan tape (loan-level, all active and recent loans)
- Vintage curves (originations by quarter, performance curves)
- Charge-off curves
- Static pool analysis
- Concentration analysis (top obligor, top state, top industry)
- Roll rates / delinquency migration
- Credit policy / underwriting guidelines
- Collateral schedules (UCC filings, liens, titles)
- Appraisals / valuations (for asset-backed)
- Servicing reports
- Custodial / lockbox reports

**05_Existing_Debt** — what the borrower already owes:
- Current credit agreements, term sheets, indentures
- Amendments and waivers
- Borrowing base certificates
- Compliance certificates
- Intercreditor agreements
- Subordination agreements
- Debt schedule (rolling, all facilities)

### Q4. "Can these people actually operate this?"

→ Buckets **06_Operations** and **07_Management**

**06_Operations** — how the business runs:
- Underwriting policy and procedures manual
- Servicing policy and procedures
- Collections policy
- Compliance program (BSA/AML, CFPB, state licensing)
- State licensing schedule
- Vendor list and key vendor agreements
- Tech stack / system architecture overview
- Disaster recovery / BCP
- Information security policy / SOC reports
- Insurance schedules (operational coverage)
- Employee handbook (when material)

**07_Management** — who runs it:
- Org chart
- Bios of executives and key personnel
- Resumes / LinkedIn snapshots for key seats
- Background-check confirmations (when available)
- Compensation summary / equity plan
- Reference list
- Board composition and committees

### Q5. "Where is this going?"

→ Buckets **08_Projections** and **09_Guarantor**

**08_Projections** — forward-looking story:
- Pro-forma financial model (3–5 year)
- Originations forecast
- Base / upside / downside scenarios
- Sensitivity tables
- Use of proceeds memo
- Capital plan
- Investor presentation / management presentation
- Confidential information memorandum (CIM)
- Market study / industry data

**09_Guarantor** — who stands behind the deal:
- Personal financial statements (PFS) for each guarantor
- Personal tax returns (2–3 years per guarantor)
- Schedule of investments / liquidity proof
- Trust documentation (when applicable)
- Existing personal guarantees
- Net worth verification

---

## Bucket numbering and folder names (canonical)

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

The numeric prefix is intentional — it forces a consistent sort order in any
file system, web UI, or VDR. Keep the underscore-separated names; do not use
spaces or hyphens.

---

## Required vs optional buckets by deal context

The user is asked three context questions on first run (purpose, deal size,
borrower type). Use the matrix below to decide which buckets are **required**
(must be present, flag in GAPS.md as severity HIGH if empty) vs **optional**
(skip the gap flag if empty).

### By purpose

| Purpose | Required buckets | Optional buckets |
|---|---|---|
| Capital raise — debt facility | 01, 02, 03, 04, 05, 06, 07, 08, 09 | — (all required) |
| Capital raise — equity | 01, 02, 03, 06, 07, 08 | 04, 05, 09 |
| Acquisition diligence | 01, 02, 03, 04, 05, 06, 07, 08 | 09 |
| Internal cleanup | all 9 — flag completeness, no severity gating | — |

### By borrower type

| Borrower type | Notes |
|---|---|
| Specialty finance / fintech lender | 04 (Collateral) is the most-scrutinized bucket; loan tape and vintage curves are mandatory |
| Operating company | 04 may not apply (no loan tape); flag 04 as N/A, not missing |
| Real estate | 04 holds rent rolls, appraisals, leases; treat the same |
| Other | Default to all 9 |

### By deal size

| Deal size | Threshold notes |
|---|---|
| <$5M | Audited financials are nice-to-have; reviewed/compiled accepted |
| $5–25M | Reviewed minimum; audit preferred |
| $25–100M | Audit required; QoE strongly preferred |
| >$100M | Audit + QoE required; expect intercreditor docs, multiple bank tiers |

These thresholds drive severity in GAPS.md (see missing-items-report subskill).

---

## Classifier decision flow (pseudocode)

```
for each file:
    1. Inspect filename + path + a small content sample (first page / first
       sheet / first 200 lines).
    2. Match against the alias dictionary in document-aliases.md. If a strong
       match: assign the corresponding bucket.
    3. If no alias hit: ask "which of the 5 lender questions does this answer?"
       Map question → bucket.
    4. If multiple buckets are plausible: pick the one most central to the
       document's purpose (e.g., a tax-related side note inside a corporate
       resolution still goes to 01_Corporate_Legal — the resolution is the
       primary artifact).
    5. If still ambiguous after steps 1–4: emit AMBIGUOUS with the top two
       candidate buckets and a one-line reason. The route-to-bucket subskill
       will surface these to the user with AskUserQuestion.
```

---

## Edge cases

**Multi-document PDFs.** If a single PDF clearly contains two distinct
artifacts (e.g., a scan that bundles op agreement + cap table), classify by
the dominant artifact and note the secondary content in INDEX.md.

**Drafts and redlines.** Always keep the latest executed version as the primary
file. Move drafts to a `_drafts/` subfolder inside the matching bucket. Do not
delete.

**Duplicates.** If two files have identical content (hash match), keep the one
with the cleaner filename. Move the other to `_duplicates/` inside the bucket.
Note in INDEX.md.

**Unreadable / corrupted files.** Place in `_unreadable/` at the data-room
root. Flag in GAPS.md with severity MEDIUM (the document might be required —
we just can't tell).

**Personal / non-business documents.** Flag and move to `_review/` at the data
room root. Do not auto-route. Examples: a borrower's personal travel itinerary
that ended up in the upload, scans of unrelated household bills.

**Documents that span buckets.** Some artifacts genuinely cover two questions
(e.g., a board consent that authorizes a debt facility — covers both Q1 and
Q3). Route to the bucket of the dominant question (Q1 here — the consent's
purpose is corporate authorization). Note the cross-reference in INDEX.md.

**Confidential / restricted access.** If the file or folder name suggests
restricted access (`exec-only`, `confidential-board`, `do-not-share`), do not
move it. Flag for user review in GAPS.md with severity LOW and a note.

---

## What is explicitly NOT a bucket

- A "miscellaneous" or "other" folder. If the classifier reaches that, it has
  failed. Use AMBIGUOUS instead and surface the decision.
- A "supporting documents" folder. Every supporting document supports a
  primary question; route to the corresponding bucket.
- Date-based folders (e.g., `2025/`, `2024/`). Dates belong in filenames, not
  folder structure. The bucket is about the lender question, not the calendar.

---

## Why this taxonomy and not a generic 9-folder template

Generic templates organize by document type ("Financials", "Legal", "HR").
That mirrors the borrower's filing system, not the lender's reading order. The
5-question model organizes by the *lender's underwrite path*, which is what
makes a data room feel "lender-ready" instead of "uploaded."

The cost of a misfiled document is concrete: it pushes a question the lender
expects to answer in minute 5 to minute 45, and a tired underwriter starts
asking "why is this hard?" That is what this taxonomy is designed to prevent.
