# Document aliases — synonym dictionary

A lookup table from common abbreviations, slang, file-name fragments, and
typed-in-a-hurry shorthand → the correct bucket. Used by the
`classify-document` subskill before it falls back to the 5-question model.

The match is **substring, case-insensitive**, against `filename + path`.
Whitespace, hyphens, and underscores are normalized. Match the longest alias
first.

Format: `alias → bucket — note (optional)`.

---

## 01_Corporate_Legal

```
articles of incorporation        → 01_Corporate_Legal
articles of organization         → 01_Corporate_Legal
articles of org                  → 01_Corporate_Legal
articles of inc                  → 01_Corporate_Legal
certificate of incorporation     → 01_Corporate_Legal
certificate of formation         → 01_Corporate_Legal
cert of inc                      → 01_Corporate_Legal
cert-of-inc                      → 01_Corporate_Legal
coi                              → 01_Corporate_Legal — also "certificate of insurance"; check content
operating agreement              → 01_Corporate_Legal
opag                             → 01_Corporate_Legal
op-agreement                     → 01_Corporate_Legal
bylaws                           → 01_Corporate_Legal
shareholders agreement           → 01_Corporate_Legal
stockholders agreement           → 01_Corporate_Legal
sha                              → 01_Corporate_Legal
cap table                        → 01_Corporate_Legal
captable                         → 01_Corporate_Legal
cap-table                        → 01_Corporate_Legal
fully diluted                    → 01_Corporate_Legal
board consent                    → 01_Corporate_Legal
board resolution                 → 01_Corporate_Legal
unanimous written consent        → 01_Corporate_Legal
uwc                              → 01_Corporate_Legal
good standing                    → 01_Corporate_Legal
ein                              → 01_Corporate_Legal
ein-letter                       → 01_Corporate_Legal
w-9                              → 01_Corporate_Legal
w9                               → 01_Corporate_Legal
kyc                              → 01_Corporate_Legal
kyb                              → 01_Corporate_Legal
ofac                             → 01_Corporate_Legal
sanctions screen                 → 01_Corporate_Legal
beneficial ownership             → 01_Corporate_Legal
boi                              → 01_Corporate_Legal — beneficial ownership info
fincen                           → 01_Corporate_Legal
cta                              → 01_Corporate_Legal — Corporate Transparency Act
trademark                        → 01_Corporate_Legal
ip assignment                    → 01_Corporate_Legal
material contract                → 01_Corporate_Legal
msa                              → 01_Corporate_Legal — master services agreement
nda                              → 01_Corporate_Legal
litigation                       → 01_Corporate_Legal
pending matters                  → 01_Corporate_Legal
d&o                              → 01_Corporate_Legal — directors and officers insurance
e&o                              → 01_Corporate_Legal — errors and omissions insurance
cyber insurance                  → 01_Corporate_Legal
gl insurance                     → 01_Corporate_Legal — general liability
certificate of insurance         → 01_Corporate_Legal
acord                            → 01_Corporate_Legal
```

## 02_Financial_Statements

```
audited financials               → 02_Financial_Statements
audit report                     → 02_Financial_Statements
audit fy                         → 02_Financial_Statements
audit_                           → 02_Financial_Statements — common shorthand "audit_2024.pdf"; risk of false hits with "audit committee" (would route to 07) — handled in disambiguation
audited fs                       → 02_Financial_Statements
reviewed financials              → 02_Financial_Statements
compiled financials              → 02_Financial_Statements
gaap                             → 02_Financial_Statements
financial statements             → 02_Financial_Statements
fs                               → 02_Financial_Statements — disambiguate; check content
income statement                 → 02_Financial_Statements
p&l                              → 02_Financial_Statements
profit and loss                  → 02_Financial_Statements
pnl                              → 02_Financial_Statements
balance sheet                    → 02_Financial_Statements
bs                               → 02_Financial_Statements — risk of false hits; check content
statement of cash flows          → 02_Financial_Statements
cash flow statement              → 02_Financial_Statements
cash flows                       → 02_Financial_Statements
trailing 12                      → 02_Financial_Statements
ttm                              → 02_Financial_Statements
ltm                              → 02_Financial_Statements
mtd                              → 02_Financial_Statements
ytd                              → 02_Financial_Statements
bank statement                   → 02_Financial_Statements
bank-stmt                        → 02_Financial_Statements
bank stmts                       → 02_Financial_Statements
bank reconciliation              → 02_Financial_Statements
bank rec                         → 02_Financial_Statements
ar aging                         → 02_Financial_Statements
ap aging                         → 02_Financial_Statements
accounts receivable              → 02_Financial_Statements
accounts payable                 → 02_Financial_Statements
qoe                              → 02_Financial_Statements
quality of earnings              → 02_Financial_Statements
q of e                           → 02_Financial_Statements
management letter                → 02_Financial_Statements
auditor letter                   → 02_Financial_Statements
accounting policy                → 02_Financial_Statements
gaap policy                      → 02_Financial_Statements
```

## 03_Tax

```
tax return                       → 03_Tax
1120                             → 03_Tax
1120s                            → 03_Tax
1065                             → 03_Tax
1040                             → 03_Tax — could be guarantor PFS-related; check content
schedule k-1                     → 03_Tax
schedule k1                      → 03_Tax
k-1                              → 03_Tax
form 990                         → 03_Tax
state tax                        → 03_Tax
sales tax                        → 03_Tax
use tax                          → 03_Tax
property tax                     → 03_Tax
irs transcript                   → 03_Tax
account transcript               → 03_Tax
tax sharing agreement            → 03_Tax
```

## 04_Collateral

```
loan tape                        → 04_Collateral
loan-tape                        → 04_Collateral
loan level                       → 04_Collateral
asset tape                       → 04_Collateral
loan schedule                    → 04_Collateral
collateral schedule              → 04_Collateral
vintage                          → 04_Collateral
vintage curve                    → 04_Collateral
static pool                      → 04_Collateral
charge-off                       → 04_Collateral
chargeoff curve                  → 04_Collateral
co curve                         → 04_Collateral
roll rate                        → 04_Collateral
delinquency                      → 04_Collateral
dq                                → 04_Collateral
dpd                              → 04_Collateral — days past due
concentration                    → 04_Collateral
top obligor                      → 04_Collateral
underwriting guidelines          → 04_Collateral
credit policy                    → 04_Collateral
ucc                              → 04_Collateral
ucc-1                            → 04_Collateral
lien                             → 04_Collateral
lien schedule                    → 04_Collateral
title report                     → 04_Collateral
appraisal                        → 04_Collateral
valuation                        → 04_Collateral
servicing report                 → 04_Collateral
custodial                        → 04_Collateral
lockbox                          → 04_Collateral
borrowing base                   → 04_Collateral — also under 05; primary route here when "report"; if "certificate" → 05
rent roll                        → 04_Collateral — real estate
```

## 05_Existing_Debt

```
credit agreement                 → 05_Existing_Debt
loan agreement                   → 05_Existing_Debt
indenture                        → 05_Existing_Debt
note purchase agreement          → 05_Existing_Debt
amendment                        → 05_Existing_Debt
waiver                           → 05_Existing_Debt
forbearance                      → 05_Existing_Debt
borrowing base certificate       → 05_Existing_Debt
bbc                              → 05_Existing_Debt
compliance certificate           → 05_Existing_Debt
compliance cert                  → 05_Existing_Debt
covenant compliance              → 05_Existing_Debt
intercreditor                    → 05_Existing_Debt
icra                             → 05_Existing_Debt
subordination                    → 05_Existing_Debt
debt schedule                    → 05_Existing_Debt
facility schedule                → 05_Existing_Debt
term sheet                       → 05_Existing_Debt — if for existing debt; if for new deal, may belong in 08
revolver                         → 05_Existing_Debt
warehouse line                   → 05_Existing_Debt
forward flow                     → 05_Existing_Debt
```

## 06_Operations

```
underwriting policy              → 06_Operations
uw policy                        → 06_Operations
uw manual                        → 06_Operations
servicing policy                 → 06_Operations
collections policy               → 06_Operations
bsa                              → 06_Operations — bank secrecy act
aml                              → 06_Operations
cfpb                             → 06_Operations
state license                    → 06_Operations
licensing schedule               → 06_Operations
nmls                             → 06_Operations
vendor list                      → 06_Operations
vendor agreement                 → 06_Operations
soc 1                            → 06_Operations
soc 2                            → 06_Operations
soc1                             → 06_Operations
soc2                             → 06_Operations
disaster recovery                → 06_Operations
business continuity              → 06_Operations
bcp                              → 06_Operations
infosec                          → 06_Operations
information security             → 06_Operations
info security                    → 06_Operations
employee handbook                → 06_Operations
tech stack                       → 06_Operations
system architecture              → 06_Operations
```

## 07_Management

```
org chart                        → 07_Management
organizational chart             → 07_Management
bio                              → 07_Management
bios                             → 07_Management
resume                           → 07_Management
cv                               → 07_Management
linkedin                         → 07_Management
background check                 → 07_Management
compensation                     → 07_Management
equity plan                      → 07_Management
references                       → 07_Management
board composition                → 07_Management
committee charter                → 07_Management
```

## 08_Projections

```
pro forma                        → 08_Projections
proforma                         → 08_Projections
financial model                  → 08_Projections
fin model                        → 08_Projections
forecast                         → 08_Projections
projection                       → 08_Projections
scenario                         → 08_Projections
base case                        → 08_Projections
upside                           → 08_Projections
downside                         → 08_Projections
sensitivity                      → 08_Projections
use of proceeds                  → 08_Projections
uop                              → 08_Projections
capital plan                     → 08_Projections
investor presentation            → 08_Projections
investor deck                    → 08_Projections
mgmt presentation                → 08_Projections
management presentation          → 08_Projections
cim                              → 08_Projections
sim                              → 08_Projections — confidential / strictly information memo
teaser                           → 08_Projections
market study                     → 08_Projections
industry report                  → 08_Projections
```

## 09_Guarantor

```
personal financial statement     → 09_Guarantor
pfs                              → 09_Guarantor
personal tax return              → 09_Guarantor
ptr                              → 09_Guarantor
guarantor                        → 09_Guarantor
guaranty                         → 09_Guarantor
personal guaranty                → 09_Guarantor
schedule of investments          → 09_Guarantor
liquidity proof                  → 09_Guarantor
trust documentation              → 09_Guarantor
net worth                        → 09_Guarantor
nwc                              → 09_Guarantor — net worth certification
```

---

## Disambiguation rules

Some aliases hit multiple buckets. Apply these tiebreakers:

1. **`coi`** — "certificate of insurance" (01) vs "certificate of incorporation" (01). Both land in 01. No conflict.
2. **`1040`** — IRS form 1040. If the path includes "guarantor" / "personal" / "pfs" → 09. Otherwise → 03.
3. **`borrowing base`** — "borrowing base **report**" → 04 (asset detail). "Borrowing base **certificate**" → 05 (compliance artifact).
4. **`term sheet`** — for an existing facility → 05. For the new deal being raised → 08.
5. **`fs`**, **`bs`**, **`pnl`** — these are short and risk false hits inside other words. Require word-boundary match (e.g., `_fs_`, `-fs.`, `/fs/`) before triggering.
6. **`bio` / `bios`** — must be a person's bio, not "biotech" or "biology". If the path includes "team" / "leadership" / "management" / a person's name → 07. Otherwise sample content.

---

## Pattern-based hints (when no alias matches)

```
*-statements-*.pdf with month-name pattern (e.g., jan, feb)  → 02 (likely bank or P&L)
*tape*.csv | *tape*.xlsx                                     → 04 (loan tape)
yyyy-mm-dd_*.pdf where the doc is a single page agreement    → 01 or 05 — sample content
*_executed.pdf | *_signed.pdf                                → keep filename, route by content
*_draft_v[0-9]*.pdf                                          → route by content; place in _drafts/ inside target bucket
```

---

## Adding aliases

When you encounter a new abbreviation in real use:

1. Add the alias under the correct bucket section above.
2. Add a disambiguation rule if it conflicts with an existing alias.
3. Bump the `version` field in `.claude-plugin/plugin.json` (patch-level for
   alias additions).

The dictionary should grow with usage. Aim for 200+ aliases by v0.2.
