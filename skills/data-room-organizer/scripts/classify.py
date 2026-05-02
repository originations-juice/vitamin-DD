#!/usr/bin/env python3
"""
classify.py — filename-based classifier fallback for data-room-organizer.

Use this when you want to run the bucket assignment outside Claude (e.g.,
as part of a CI script, a batch rename, or a quick sanity check on a folder
before opening Claude). It uses only the filename + path; it does not read
file content.

This is a heuristic v0.1 fallback. The real classifier lives inside the
Claude skill and uses content samples + LLM reasoning. Use this script when
you can't run the skill and need a "good enough" first pass.

Confidence scale: this CLI returns coarse strings ("high" / "medium" /
"low"). The full skill (classify-document/SKILL.md, peek-strategies.md)
uses 0-100 percentages with a 70% gate to 00_NEEDS_REVIEW. The CLI's
NEEDS_REVIEW return corresponds to "below 70%" in the full skill — files
the CLI flags here are exactly the files the full skill would route to
00_NEEDS_REVIEW for content-peek triage.

Usage:
    python classify.py /path/to/data/room
    python classify.py /path/to/data/room --json
    python classify.py /path/to/data/room --move   # actually move files
    python classify.py --self-test

Stdlib only. Optional: pypdf (not used at v0.1).
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import sys
from dataclasses import dataclass, asdict
from pathlib import Path

# ---------------------------------------------------------------------------
# Bucket constants
# ---------------------------------------------------------------------------

BUCKETS = [
    "01_Corporate_Legal",
    "02_Financial_Statements",
    "03_Tax",
    "04_Collateral",
    "05_Existing_Debt",
    "06_Operations",
    "07_Management",
    "08_Projections",
    "09_Guarantor",
]

REVIEW = "_review"
UNREADABLE = "_unreadable"
NEEDS_REVIEW = "NEEDS_REVIEW"

# ---------------------------------------------------------------------------
# Alias table — substring match on normalized filename + path
#
# Entries are (alias, bucket). Order matters for tiebreakers — earlier
# entries with longer aliases win. The ALIAS_TABLE is sorted by length
# descending at module load.
# ---------------------------------------------------------------------------

_RAW_ALIASES: list[tuple[str, str]] = [
    # 01_Corporate_Legal
    ("articles of incorporation", "01_Corporate_Legal"),
    ("articles of organization", "01_Corporate_Legal"),
    ("articles of org", "01_Corporate_Legal"),
    ("articles of inc", "01_Corporate_Legal"),
    ("certificate of incorporation", "01_Corporate_Legal"),
    ("certificate of formation", "01_Corporate_Legal"),
    ("certificate of insurance", "01_Corporate_Legal"),
    ("operating agreement", "01_Corporate_Legal"),
    ("op-agreement", "01_Corporate_Legal"),
    ("op_agreement", "01_Corporate_Legal"),
    ("opag", "01_Corporate_Legal"),
    ("bylaws", "01_Corporate_Legal"),
    ("shareholders agreement", "01_Corporate_Legal"),
    ("stockholders agreement", "01_Corporate_Legal"),
    ("cap table", "01_Corporate_Legal"),
    ("captable", "01_Corporate_Legal"),
    ("cap-table", "01_Corporate_Legal"),
    ("fully diluted", "01_Corporate_Legal"),
    ("board consent", "01_Corporate_Legal"),
    ("board resolution", "01_Corporate_Legal"),
    ("unanimous written consent", "01_Corporate_Legal"),
    ("good standing", "01_Corporate_Legal"),
    ("ein-letter", "01_Corporate_Legal"),
    ("ein letter", "01_Corporate_Legal"),
    ("w-9", "01_Corporate_Legal"),
    ("kyc", "01_Corporate_Legal"),
    ("kyb", "01_Corporate_Legal"),
    ("ofac", "01_Corporate_Legal"),
    ("sanctions screen", "01_Corporate_Legal"),
    ("beneficial ownership", "01_Corporate_Legal"),
    ("fincen", "01_Corporate_Legal"),
    ("trademark", "01_Corporate_Legal"),
    ("ip assignment", "01_Corporate_Legal"),
    ("material contract", "01_Corporate_Legal"),
    ("d&o", "01_Corporate_Legal"),
    ("e&o", "01_Corporate_Legal"),
    ("cyber insurance", "01_Corporate_Legal"),
    ("acord", "01_Corporate_Legal"),
    ("nda", "01_Corporate_Legal"),
    ("litigation", "01_Corporate_Legal"),
    # 02_Financial_Statements
    ("audited financials", "02_Financial_Statements"),
    ("audit report", "02_Financial_Statements"),
    ("audit fy", "02_Financial_Statements"),
    ("audit ", "02_Financial_Statements"),
    ("reviewed financials", "02_Financial_Statements"),
    ("compiled financials", "02_Financial_Statements"),
    ("financial statements", "02_Financial_Statements"),
    ("income statement", "02_Financial_Statements"),
    ("p&l", "02_Financial_Statements"),
    ("profit and loss", "02_Financial_Statements"),
    ("pnl", "02_Financial_Statements"),
    ("balance sheet", "02_Financial_Statements"),
    ("cash flow statement", "02_Financial_Statements"),
    ("statement of cash flows", "02_Financial_Statements"),
    ("trailing 12", "02_Financial_Statements"),
    ("ttm", "02_Financial_Statements"),
    ("ltm", "02_Financial_Statements"),
    ("bank statement", "02_Financial_Statements"),
    ("bank-stmt", "02_Financial_Statements"),
    ("bank stmt", "02_Financial_Statements"),
    ("bank reconciliation", "02_Financial_Statements"),
    ("ar aging", "02_Financial_Statements"),
    ("ap aging", "02_Financial_Statements"),
    ("accounts receivable", "02_Financial_Statements"),
    ("accounts payable", "02_Financial_Statements"),
    ("qoe", "02_Financial_Statements"),
    ("quality of earnings", "02_Financial_Statements"),
    ("management letter", "02_Financial_Statements"),
    # 03_Tax
    ("tax return", "03_Tax"),
    ("1120s", "03_Tax"),
    ("1120", "03_Tax"),
    ("1065", "03_Tax"),
    ("1040", "03_Tax"),
    ("k-1", "03_Tax"),
    ("schedule k-1", "03_Tax"),
    ("schedule k1", "03_Tax"),
    ("form 990", "03_Tax"),
    ("state tax", "03_Tax"),
    ("sales tax", "03_Tax"),
    ("use tax", "03_Tax"),
    ("property tax", "03_Tax"),
    ("irs transcript", "03_Tax"),
    ("account transcript", "03_Tax"),
    ("tax sharing", "03_Tax"),
    # 04_Collateral
    ("loan tape", "04_Collateral"),
    ("loan-tape", "04_Collateral"),
    ("loan_tape", "04_Collateral"),
    ("asset tape", "04_Collateral"),
    ("loan schedule", "04_Collateral"),
    ("collateral schedule", "04_Collateral"),
    ("vintage curve", "04_Collateral"),
    ("vintage", "04_Collateral"),
    ("static pool", "04_Collateral"),
    ("charge-off", "04_Collateral"),
    ("chargeoff", "04_Collateral"),
    ("roll rate", "04_Collateral"),
    ("delinquency", "04_Collateral"),
    ("concentration", "04_Collateral"),
    ("top obligor", "04_Collateral"),
    ("underwriting guidelines", "04_Collateral"),
    ("credit policy", "04_Collateral"),
    ("ucc-1", "04_Collateral"),
    ("ucc1", "04_Collateral"),
    ("lien schedule", "04_Collateral"),
    ("title report", "04_Collateral"),
    ("appraisal", "04_Collateral"),
    ("valuation", "04_Collateral"),
    ("servicing report", "04_Collateral"),
    ("custodial", "04_Collateral"),
    ("lockbox", "04_Collateral"),
    ("rent roll", "04_Collateral"),
    # 05_Existing_Debt
    ("credit agreement", "05_Existing_Debt"),
    ("loan agreement", "05_Existing_Debt"),
    ("indenture", "05_Existing_Debt"),
    ("note purchase agreement", "05_Existing_Debt"),
    ("amendment", "05_Existing_Debt"),
    ("waiver", "05_Existing_Debt"),
    ("forbearance", "05_Existing_Debt"),
    ("borrowing base certificate", "05_Existing_Debt"),
    ("compliance certificate", "05_Existing_Debt"),
    ("compliance cert", "05_Existing_Debt"),
    ("covenant compliance", "05_Existing_Debt"),
    ("intercreditor", "05_Existing_Debt"),
    ("subordination", "05_Existing_Debt"),
    ("debt schedule", "05_Existing_Debt"),
    ("facility schedule", "05_Existing_Debt"),
    ("term sheet", "05_Existing_Debt"),
    ("revolver", "05_Existing_Debt"),
    ("warehouse line", "05_Existing_Debt"),
    ("forward flow", "05_Existing_Debt"),
    # 06_Operations
    ("underwriting policy", "06_Operations"),
    ("uw policy", "06_Operations"),
    ("uw manual", "06_Operations"),
    ("servicing policy", "06_Operations"),
    ("collections policy", "06_Operations"),
    ("bsa", "06_Operations"),
    ("aml", "06_Operations"),
    ("cfpb", "06_Operations"),
    ("state license", "06_Operations"),
    ("licensing schedule", "06_Operations"),
    ("nmls", "06_Operations"),
    ("vendor list", "06_Operations"),
    ("vendor agreement", "06_Operations"),
    ("soc 1", "06_Operations"),
    ("soc 2", "06_Operations"),
    ("soc1", "06_Operations"),
    ("soc2", "06_Operations"),
    ("disaster recovery", "06_Operations"),
    ("business continuity", "06_Operations"),
    ("infosec", "06_Operations"),
    ("information security", "06_Operations"),
    ("info security", "06_Operations"),
    ("employee handbook", "06_Operations"),
    # 07_Management
    ("org chart", "07_Management"),
    ("organizational chart", "07_Management"),
    ("resume", "07_Management"),
    ("biographies", "07_Management"),
    ("background check", "07_Management"),
    ("compensation", "07_Management"),
    ("equity plan", "07_Management"),
    ("references", "07_Management"),
    ("board composition", "07_Management"),
    ("committee charter", "07_Management"),
    # 08_Projections
    ("pro forma", "08_Projections"),
    ("proforma", "08_Projections"),
    ("financial model", "08_Projections"),
    ("forecast", "08_Projections"),
    ("projection", "08_Projections"),
    ("base case", "08_Projections"),
    ("upside case", "08_Projections"),
    ("downside case", "08_Projections"),
    ("sensitivity", "08_Projections"),
    ("use of proceeds", "08_Projections"),
    ("capital plan", "08_Projections"),
    ("investor presentation", "08_Projections"),
    ("investor deck", "08_Projections"),
    ("management presentation", "08_Projections"),
    ("market study", "08_Projections"),
    ("industry report", "08_Projections"),
    ("cim", "08_Projections"),
    ("sim", "08_Projections"),
    ("teaser", "08_Projections"),
    # 09_Guarantor
    ("personal financial statement", "09_Guarantor"),
    ("personal tax return", "09_Guarantor"),
    ("personal guaranty", "09_Guarantor"),
    ("guarantor", "09_Guarantor"),
    ("schedule of investments", "09_Guarantor"),
    ("liquidity proof", "09_Guarantor"),
    ("trust documentation", "09_Guarantor"),
    ("net worth", "09_Guarantor"),
    ("pfs", "09_Guarantor"),
]

ALIAS_TABLE: list[tuple[str, str]] = sorted(
    _RAW_ALIASES, key=lambda p: -len(p[0])
)

# Word-boundary aliases — too short to substring-match safely
WB_ALIASES: list[tuple[str, str]] = [
    ("fs", "02_Financial_Statements"),
    ("bs", "02_Financial_Statements"),
    ("cf", "02_Financial_Statements"),
    ("dq", "04_Collateral"),
    ("dpd", "04_Collateral"),
    ("bbc", "05_Existing_Debt"),
    ("uop", "08_Projections"),
    ("pg", "09_Guarantor"),
    ("nwc", "09_Guarantor"),
]

REVIEW_HINTS = (
    "vacation",
    "wedding",
    "house-bills",
    "kids-school",
    "personal-trip",
)

UNREADABLE_EXTS = {".zip", ".rar", ".7z"}


def _normalize(s: str) -> str:
    """Lowercase, replace path separators / hyphens / underscores with spaces."""
    s = s.lower()
    return re.sub(r"[\\/_-]+", " ", s)


@dataclass
class Classification:
    relative_path: str
    bucket: str
    confidence: str
    reason: str


# ---------------------------------------------------------------------------
# Disambiguation rules
# ---------------------------------------------------------------------------

def _disambig_1040(path_norm: str) -> str:
    """1040 → 09 if 'guarantor' / 'personal' / 'pfs' in path; else 03."""
    if any(t in path_norm for t in ("guarantor", "personal", "pfs")):
        return "09_Guarantor"
    return "03_Tax"


def _disambig_borrowing_base(path_norm: str) -> str:
    """'borrowing base report' → 04, 'borrowing base certificate' → 05."""
    if "certificate" in path_norm:
        return "05_Existing_Debt"
    return "04_Collateral"


# ---------------------------------------------------------------------------
# Classifier
# ---------------------------------------------------------------------------

def classify(relative_path: str) -> Classification:
    """Return a Classification for a single relative path."""
    path_norm = _normalize(relative_path)
    ext = Path(relative_path).suffix.lower()

    # Unreadable archives
    if ext in UNREADABLE_EXTS:
        return Classification(
            relative_path=relative_path,
            bucket=REVIEW,
            confidence="high",
            reason="archive — user must unzip first",
        )

    # Personal-life hints
    for hint in REVIEW_HINTS:
        if hint in path_norm:
            return Classification(
                relative_path=relative_path,
                bucket=REVIEW,
                confidence="high",
                reason=f"non-business hint: {hint}",
            )

    # Special-case disambiguation BEFORE the generic alias loop, so longer
    # generic aliases ("borrowing base certificate") naturally win the
    # length-sort but the routing is still right.
    if "1040" in path_norm:
        bucket = _disambig_1040(path_norm)
        return Classification(
            relative_path=relative_path,
            bucket=bucket,
            confidence="medium",
            reason=f"1040 routed to {bucket} via disambiguation",
        )

    if "borrowing base" in path_norm:
        bucket = _disambig_borrowing_base(path_norm)
        return Classification(
            relative_path=relative_path,
            bucket=bucket,
            confidence="high",
            reason=f"borrowing base routed to {bucket}",
        )

    # Substring alias loop, longest first
    hits: list[tuple[str, str]] = []
    for alias, bucket in ALIAS_TABLE:
        if alias in path_norm:
            hits.append((alias, bucket))

    # Word-boundary aliases (short tokens — too short for safe substring match)
    for alias, bucket in WB_ALIASES:
        if re.search(rf"(?:^|[^a-z0-9]){re.escape(alias)}(?:$|[^a-z0-9])", path_norm):
            hits.append((alias, bucket))

    if not hits:
        return Classification(
            relative_path=relative_path,
            bucket=NEEDS_REVIEW,
            confidence="low",
            reason="no alias hit; needs LLM classifier (run inside Claude)",
        )

    # Reduce: if all hits agree on a bucket, return it.
    buckets = {b for _, b in hits}
    if len(buckets) == 1:
        alias, bucket = hits[0]
        return Classification(
            relative_path=relative_path,
            bucket=bucket,
            confidence="high",
            reason=f"alias: {alias}",
        )

    # Multiple buckets matched. Pick the one matched by the longest alias
    # — this is a heuristic, not always right; flag confidence accordingly.
    longest = max(hits, key=lambda p: len(p[0]))
    return Classification(
        relative_path=relative_path,
        bucket=longest[1],
        confidence="medium",
        reason=f"multiple aliases hit; chose {longest[0]}",
    )


# ---------------------------------------------------------------------------
# Walk + apply
# ---------------------------------------------------------------------------

def walk_and_classify(root: Path) -> list[Classification]:
    out: list[Classification] = []
    for dirpath, _, filenames in os.walk(root):
        for fn in filenames:
            if fn in {".DS_Store", "Thumbs.db"} or fn.startswith("~$"):
                continue
            full = Path(dirpath) / fn
            rel = full.relative_to(root).as_posix()
            out.append(classify(rel))
    out.sort(key=lambda c: c.relative_path)
    return out


def move_files(root: Path, classifications: list[Classification]) -> None:
    """Actually create bucket folders and move files."""
    for c in classifications:
        if c.bucket == NEEDS_REVIEW:
            print(f"  SKIP (ambiguous): {c.relative_path}", file=sys.stderr)
            continue
        src = root / c.relative_path
        dest_dir = root / c.bucket
        dest_dir.mkdir(parents=True, exist_ok=True)
        dest = dest_dir / src.name
        if dest.exists():
            stem = dest.stem
            n = 1
            while dest.exists():
                dest = dest_dir / f"{stem}__{n}{dest.suffix}"
                n += 1
        shutil.move(str(src), str(dest))


# ---------------------------------------------------------------------------
# Self-test
# ---------------------------------------------------------------------------

SELF_TEST_CASES: list[tuple[str, str]] = [
    ("Articles_of_Org_Final.pdf", "01_Corporate_Legal"),
    ("operating-agreement-2024.pdf", "01_Corporate_Legal"),
    ("acme_cap_table_v3.xlsx", "01_Corporate_Legal"),
    ("OFAC-screen-2025-04.pdf", "01_Corporate_Legal"),
    ("audit_report_FY24.pdf", "02_Financial_Statements"),
    ("Bank_Stmts_Chase_Dec2025.pdf", "02_Financial_Statements"),
    ("QoE-final-Acme.pdf", "02_Financial_Statements"),
    ("2024_form_1120_acme.pdf", "03_Tax"),
    ("guarantor/john_smith_form_1040.pdf", "09_Guarantor"),
    ("loan_tape_2025-12.csv", "04_Collateral"),
    ("vintage-curves-q4.xlsx", "04_Collateral"),
    ("borrowing-base-report-Dec.xlsx", "04_Collateral"),
    ("borrowing-base-certificate-2025-12.pdf", "05_Existing_Debt"),
    ("Credit_Agreement_executed.pdf", "05_Existing_Debt"),
    ("uw_policy_v4.pdf", "06_Operations"),
    ("nmls-licensing-schedule.xlsx", "06_Operations"),
    ("org-chart-2025.png", "07_Management"),
    ("ceo_resume.pdf", "07_Management"),
    ("pro-forma-model-acme-3yr.xlsx", "08_Projections"),
    ("CIM_Acme_Final.pdf", "08_Projections"),
    ("personal_financial_statement_jane_doe.pdf", "09_Guarantor"),
    ("vacation-photos-2024.zip", "_review"),  # archive AND personal hint
]


def self_test() -> int:
    failures = 0
    for path, want in SELF_TEST_CASES:
        got = classify(path).bucket
        status = "OK" if got == want else "FAIL"
        if got != want:
            failures += 1
        print(f"  [{status}] {path:50s} → {got} (want {want})")
    print()
    if failures:
        print(f"{failures} self-test failure(s)")
        return 1
    print("self-tests passed")
    return 0


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main(argv: list[str]) -> int:
    p = argparse.ArgumentParser(description=__doc__.split("\n")[1])
    p.add_argument("root", nargs="?", help="path to data room")
    p.add_argument("--json", action="store_true", help="emit JSON")
    p.add_argument("--move", action="store_true", help="actually move files")
    p.add_argument("--self-test", action="store_true", help="run self-test")
    args = p.parse_args(argv)

    if args.self_test:
        return self_test()

    if not args.root:
        p.error("root path required (or pass --self-test)")

    root = Path(args.root).resolve()
    if not root.is_dir():
        print(f"not a directory: {root}", file=sys.stderr)
        return 2

    results = walk_and_classify(root)

    if args.json:
        print(json.dumps([asdict(c) for c in results], indent=2))
    else:
        for c in results:
            print(f"{c.bucket:24s}  {c.confidence:6s}  {c.relative_path}")

    if args.move:
        move_files(root, results)
        print(f"\nMoved {sum(1 for c in results if c.bucket != NEEDS_REVIEW)} files.")

    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
