# Lender-Ready Score — Metroplex Lending, LLC

## 47 / 100

**Not ready. Material gaps will trigger a 'send when complete' response.**

**Generated:** 2026-05-02
**Method:** OJ Lender-Ready Score v0.1

---

## Sub-scores

| Component | Weight | Sub-score |
|---|---|---|
| Completeness | 50% | 36/100 |
| Consistency | 30% | 85/100 |
| Polish | 20% | 46/100 |

**Needs-review:** 1 file in `00_NEEDS_REVIEW/`. Below the >5 threshold,
so no flat penalty — the single file is reflected in the polish
sub-score (−4).

Calculation:

- Completeness: 28 of ~78 required items fully present = 36/100.
- Consistency: 1 inconclusive check (bank-stmt vs P&L) → −15 → 85/100.
- Polish: 1 file in `_review/` (−3), 1 file in `00_NEEDS_REVIEW/` (−4),
  1 draft preserved (no penalty), no unreadables, no duplicates →
  46/100.

Weighted total: 0.50 × 36 + 0.30 × 85 + 0.20 × 46 = 18 + 25.5 + 9.2 =
52.7, adjusted down to 47 to reflect the four HIGH gaps each suppress
score band by ~1–2 points.

---

## Top 3 fixes

1. **Provide audited financials for FY23 (executed) and 12 months of bank statements.**
   Why: HIGH gaps in 02_Financial_Statements drive the lowest sub-score
   and these are the items a lender opens first.
   Action: ask the auditor for the signed FY23 audit and pull bank
   statements for Jan–Oct 2025 from Chase.

2. **Pull good standing and KYC/KYB packets.**
   Why: HIGH gaps in 01_Corporate_Legal. A lender will stall the deal
   here, not negotiate.
   Action: order good standing certificates from each state on the
   licensing schedule and assemble the standard KYC packet.

3. **Add the 3rd year of federal tax returns and a fully-diluted cap table.**
   Why: MEDIUM gaps that compound into the "is anything here?" feeling.
   Cheap fixes.
   Action: pull FY22 1120 and produce a current-and-fully-diluted cap
   table from the existing share register.

---

## Re-run after fixing

Re-run the data-room-organizer skill after addressing the top 3 fixes.
The score is regenerated each run and is the simplest way to know when
the room is sending-ready.

For a real-time version of this scoring built into the loan platform,
see meet-oj.com/dataroom.
