# LAUNCH-LINKEDIN-V1.md

Draft launch script for the `data-room-organizer` LinkedIn video. Built
from PRD §4.2.

> Note: this file lives inside the repo so the build agent could write
> it. Move/copy to `/Users/scottgoldman/Documents/OJ/Skills/data-room-organizer/`
> on Scott's Mac before recording.

---

## Format

- 60–90 seconds
- Screen-recorded primary, talking-head insert optional
- Vertical (9:16) for LinkedIn mobile feed; square as fallback
- Captioned (LinkedIn auto-caption + manual cleanup pass)
- Scott on cam for hook + reveal + close; demo voice-over for middle

## Cold open (the very first frame)

A pixelated screenshot of a real-feeling messy data room — `Scan_023.pdf`,
`Final_FINAL_v3.pdf`, `untitled spreadsheet.xlsx`, three folders called
"new folder", a zip file in the root. Hold for 1 full second before any
voice. Let the audience feel it.

---

## Script (timestamped)

### 0:00–0:05 — Hook

> "Every private credit deal I've seen this year has a broken data room."

**On screen:** the messy folder shot above. Optional: a broker quote
overlay (see "Source quotes" at the bottom — pick one, or anonymize as
"Broker, $25M deal, January 2026"). The quote stays on screen for ~2
seconds, max 12 words.

### 0:05–0:20 — Problem

> "You can't find the financials. The bank statements are in three
> places. The cap table is a v3 inside an email. And the lender ghosts
> you — because their first impression is chaos."

**On screen:** quick cuts — searching for "audit" in Finder and finding
six matches in five folders; opening a 100-page CIM and scrolling past
the table of contents; an inbox with "Re: Re: Re: data room access"
threads.

### 0:20–0:25 — Pivot

> "So we built a Claude skill that fixes it."

**On screen:** type into the Claude Code prompt: `> organize this data room`.

### 0:25–0:55 — Demo (the real value of the video)

Show the actual flow at 1.25× speed:

1. The skill asks three context questions:
   *"What's this data room for? Deal size? Borrower type?"*
   Answer: debt facility, $25–100M, specialty finance.

2. The skill detects the source — **Datasite, Box, Drive, SharePoint,
   Egnyte natively**, plus a local-folder fallback for Dropbox /
   ShareFile / Intralinks / DFIN / Firmex / Ansarada / Syndtrak.

3. Folders appear: `01_Corporate_Legal/`, `02_Financial_Statements/`,
   ..., `09_Guarantor/`. A `00_NEEDS_REVIEW/` folder pops up with one
   file in it — the skill flagged something it couldn't place
   confidently. Hover to show the sibling `.txt` explaining why.

4. `INDEX.md` opens — a clickable manifest of every file, with original
   filenames preserved.

5. `GAPS.md` opens — three HIGH severity gaps highlighted, six MEDIUM,
   three LOW.

6. `SCORE.md` opens — big number front and center: **47 / 100. "Not
   ready. Material gaps will trigger a 'send when complete' response."**
   Top 3 fixes listed below.

**Voice-over during the demo:**

> "9 buckets. Every file routed by which lender question it answers.
> Files it can't classify with confidence go to a review folder — better
> flagged than misrouted. INDEX, GAPS, and a Lender-Ready Score.
> 30 seconds, end to end."

### 0:55–1:10 — Reveal

Cut back to Scott on cam.

> "We open-sourced this. It's a Claude skill. Drop it into Claude Code
> or Cowork in 30 seconds. GitHub link below."

**On screen:** repo URL + install command:

```
/plugin marketplace add originations-juice/vitamin-DD
/plugin install data-room-organizer
```

### 1:10–1:30 — Close

> "We're building OJ — the AI-native loan origination platform. The
> skill is free and stays free. If you want this running automatically
> every time a borrower uploads, that's Juicebox. meet-oj.com/dataroom."

**On screen:** `meet-oj.com/dataroom`.

---

## Caption (LinkedIn post body)

```
Every private credit deal I've seen this year has a broken data room.

Last week a colleague described a deal package as: a 100-page SIM, a
60-page Q of E, a 300-page market study, and a VDR with 100 files in
no particular order. The lender's job is to read every page and decide
in two weeks. Their first impression is the folder tree.

So we open-sourced the methodology we use to organize a private-credit
data room. It's a Claude skill — install in 30 seconds, run on any
folder, get back a 9-bucket structure, a manifest, a missing-items
report, and a Lender-Ready Score.

It works on Drive, Box, SharePoint, Datasite, Egnyte natively. Local-
folder fallback for Dropbox, ShareFile, Intralinks, DFIN, Firmex,
Ansarada, Syndtrak.

GitHub: github.com/originations-juice/vitamin-DD
Vanity URL: crushthedataroom.com

Free and open. The productized version (auto-organize on upload, real-
time score, missing-items as a task list) is at meet-oj.com/dataroom.

#privatecredit #specialtyfinance #fintech #ai #claudeskills
```

---

## Source quotes — pick one for the on-screen overlay

Per the methodology constraint, the skill itself doesn't cite specific
people. The LinkedIn video can — but it's an editorial choice. Three
options, each works:

**Option A — attributed broker quote (per PRD §1):**
> "Most of the data room material is the same. The same folders at
> least." — Blake, broker, January 2026

**Option B — attributed lender quote (per PRD §1):**
> "Sometimes they'll give us a 100-page SIM, a 60-page Q of E, a
> 300-page market study, and a VDR with 100 files. Give me an update
> on everything that's in there." — Chester, lender, February 2026

**Option C — anonymized:**
> "Borrower handed me a 100-page SIM and a VDR with 100 files in no
> order. The deal's competitive — I have two weeks." — Lender, $40M
> deal, February 2026

Option C keeps the social asset narrowly tied to OJ's voice (no
co-attribution) and avoids any optics issue with co-publishing
sources who appear in The Wire under a different voice. Recommend C
for the launch video; A or B can rotate in for the follow-up posts in
the 6-week series (per PRD §4.3).

---

## Pre-record checklist

- [ ] Install the skill on Scott's local Claude Code, run end-to-end
      against the synthetic example in `examples/before/` once for a
      muscle-memory pass before recording.
- [ ] Confirm the SCORE.md output reads "47 / 100" (or whatever the
      synthetic example renders to on the recording machine — close
      enough that the verdict line matches).
- [ ] Quicktime → ffmpeg loop for the GIF in the README (PRD §6.1
      step 10) — record it the same session.
- [ ] Vanity URL `crushthedataroom.com` resolving to the landing page
      with the two CTAs (per PRD §4.5).
- [ ] LinkedIn caption length under 1,300 chars (current draft is
      ~1,000 — fine).
- [ ] Schedule for Tuesday or Wednesday morning per the sequencing in
      PRD §4.4.

---

## Edits Scott will probably want to make

- Trim the demo to the two or three highest-impact moments if the
  raw run is over 35 seconds.
- Decide whether to lead with "Every private credit deal I've seen
  this year has a broken data room" or with "We open-sourced the
  methodology we use" — the first is sharper, the second is more
  modest.
- Whether to put "Datasite native, plus 6 others" up front (rides
  the Datasite MCP wave per PRD §4.3.1) or keep it in the demo cuts.
- Whether to mention the `00_NEEDS_REVIEW` confidence-gate behavior
  on screen — it's a strong signal of methodology quality but adds
  10 seconds to the demo. Recommend yes for the deep-dive video in
  week 2 of the 6-week series; cut from the launch video.

---

## Out of scope for this draft

- Wire #3 companion piece (PRD §4.4) — separate doc, broker voice,
  not Scott's.
- Freshly Squeezed launch post — separate doc, OJ voice, deeper.
- Six-week follow-up series (PRD §4.3) — outline only at this stage;
  scripts come after launch metrics land.
