# PRD: `data-room-organizer` — Claude Skill, Lead Magnet, & LinkedIn Spike

**Owner:** Scott Goldman (OJ)
**Author:** Claude (research + spec)
**Date:** May 1, 2026
**Status:** Draft for handoff to Claude Code
**Target ship date:** v0.1 GitHub-public + first LinkedIn post within 7 days

---

## 0. TL;DR

Ship `data-room-organizer` — a Claude skill bundle that organizes any private-credit data room (Drive / Box / Dropbox / local / Datasite / Egnyte / etc.) into the 9-bucket structure institutional lenders expect. Distribute open on GitHub, surface via LinkedIn video + skill marketplaces, drive lead capture through `crushthedataroom.com` → OJ funnel. The methodology is OJ's, codified from direct buyer research with brokers and lenders in the lower-middle-market private credit segment.

**The bet:** indie-creator skill virality is real (GSD: 31k stars; Superpowers: featured everywhere). No vertical skill owns "data room sanity" yet. OJ does, with first-party buyer evidence. Ship a *mini-bundle* (not a single file), make it look serious, and let it serve as the top-of-funnel for an AI-native data room product story.

---

## 1. Strategic rationale

### Why a skill, why now
- **Skills are the cheapest, fastest-to-distribute primitive in the Claude ecosystem.** ~30–50 tokens loaded on demand, single git URL to install, runs in Claude Code AND Claude Cowork AND Desktop with no code change. Compared to MCP (50k+ tokens, OAuth, server hosting, $55/mo at 10k ops) or CLI (npm packaging, isolated from Claude unless wrapped), a skill is a markdown file you push to GitHub. ([source 1](https://www.morphllm.com/claude-code-skills-mcp-plugins), [source 2](https://milvus.io/blog/is-mcp-dead-cli-and-skills-for-ai-agents.md))
- **The community treats skills like indie hacker products.** Hasan Toor's roundup tweets, Hacker News threads, Substack reviews, multiple marketplaces ([skillsmp.com](https://skillsmp.com), [claudemarketplaces.com](https://claudemarketplaces.com), [claudeskills.info](https://claudeskills.info), [Lobehub](https://lobehub.com/skills), [Anthropic official](https://github.com/anthropics/claude-plugins-official)). A well-positioned vertical skill from a founder gets discovery for free.
- **The Wire just published the painpoint piece.** *"The Data Room Is Your First Impression"* (Apr 30) is live. The lead-magnet checklist is live at meet-oj.com/checklist. The narrative is loaded; the skill is the executable companion to it.

### Why the data-room angle wins
We have **first-party buyer testimony** that this is a real, paid-for problem:

> "We always have a data room for every single deal… most of the data room material is the same. The same folders at least." — Blake, Fusion Network, Jan 6 sync

> "Removing the step for us to create a folder. Saying these are the corporate formation docs, and these are the bank statements and these are the data tapes. For your system to figure out how to do that." — Blake, Jan 16 sync

> "Sometimes they'll give us a 100 page SIM, a 60 page Q of E, maybe 300 page market study, and then a VDR with 100 files… give me an update on everything that's in there." — Chester (Midcap Financial), Feb 20

> "There's an 11th file that has one line on page 46 that might change the originator's mind on his interest in the deal." — Chester

> "What kind of data do I need to request? I can kind of automate that myself because I've built a request list… but how they interpret it and deal with it is a different story. How forthcoming a borrower is with information, with answering questions correctly, things like that. That's frustrating." — Dillon Lounsbury (Legacy, Bain Capital-backed ABL, $5–200M deals), Feb 6, 2026

> "Your system could automatically reject it and send them a note. You know what I mean?" — Dillon, on the as-of-date-mismatch validation case

> "For me, I have to kind of figure out if it's an argument worth fighting. Like, do I want to piss them off and have them re-upload stuff?" — Dillon, on why a lender lets bad data through

The skill exists to solve the problem these three are describing. **Dillon's "is it worth a fight" insight is the positioning wedge:** the skill is the "bad cop" the lender doesn't want to be — it enforces document quality upstream so the lender doesn't burn relationship capital on QC fights.

That's defensible authenticity no generic skill creator can match.

### Why mini-bundle (not single .md)
- **Surface area for content.** 6-8 subskills = 6-8 LinkedIn posts ("here's how the classifier subskill works", "here's how the missing-items report works"), not a one-and-done announcement.
- **Looks like a serious project.** GSD-2 and Superpowers both ship as bundles with subskill folders; that's the pattern the community recognizes. ([GSD-2 skills system](https://deepwiki.com/gsd-build/gsd-2/8.5-skills-system))
- **Composability.** Power users will fork subskills. The bundle structure invites contribution.
- **Token economics.** Top-level SKILL.md stays ~500 tokens; subskills load on-demand only when relevant.

---

## 2. The audience & the trigger

**Primary audience (lead-magnet target):**
- Specialty finance / fintech founders preparing for private credit
- Brokers like Blake who package deals for multiple lenders
- Junior/mid analysts at lenders dealing with VDR sprawl
- Founder-CFOs at lower-middle-market borrowers

**Secondary audience (founder-visibility target):**
- AI early-adopter dev community (Hacker News, X, LinkedIn AI builders)
- The "Claude skill collectors" — people building their .claude/skills/ library
- Vertical SaaS founders studying GTM motions

**Activation trigger:** user installs the skill, runs Claude in any folder containing a messy data room, says *"organize this data room"*. The skill takes over from there.

---

## 3. The skill — full spec

### 3.1 Naming & repo

- **Skill slug:** `data-room-organizer`
- **GitHub repo:** `originations-juice/data-room-organizer` (confirmed — same org as `originations-juice/OJ`)
- **License:** MIT
- **Vanity URL:** `crushthedataroom.com` → redirect to GitHub repo with UTM params
- **Lead-capture page:** Tally form (or similar) at `meet-oj.com/dataroom` that gates the OJ Data Room Checklist PDF (already published at `meet-oj.com/checklist`), captures email, then shows the GitHub link. The skill itself stays open.

### 3.2 Repo structure

```
data-room-organizer/
├── README.md                          # GitHub front-door, badges, install one-liner, GIF demo
├── LICENSE                            # MIT
├── SKILL.md                           # Top-level skill — what it does, when to fire
├── INSTALL.md                         # One-page install for CC / Cowork / Desktop
├── .claude-plugin/
│   └── plugin.json                    # Plugin marketplace metadata
├── skills/
│   ├── data-room-organizer/
│   │   ├── SKILL.md                   # Master skill — orchestrator
│   │   ├── references/
│   │   │   ├── taxonomy.md            # The 9-bucket classification logic + 5-question model
│   │   │   └── document-aliases.md    # Synonyms (e.g. "ofac" → corporate/legal; "qoe" → financials)
│   │   └── scripts/
│   │       └── classify.py            # Optional: CLI fallback for filename-only classification
│   ├── setup-source-access/
│   │   └── SKILL.md                   # Subskill 0 (preflight): detect mounted folder + installed MCPs, suggest + install Drive/Box/Dropbox MCP if missing, fall back to local-sync instructions
│   ├── ingest-data-room/
│   │   └── SKILL.md                   # Subskill 1: read the source (Drive / Box / Dropbox / local) — assumes setup-source-access has been run
│   ├── classify-document/
│   │   └── SKILL.md                   # Subskill 2: classify a single doc using methodology
│   ├── route-to-bucket/
│   │   └── SKILL.md                   # Subskill 3: place in correct folder
│   ├── rename-canonical/
│   │   └── SKILL.md                   # Subskill 4: standardize filename (date_company_doctype)
│   ├── generate-manifest/
│   │   └── SKILL.md                   # Subskill 5: write README.md / INDEX.md inside data room
│   ├── missing-items-report/
│   │   └── SKILL.md                   # Subskill 6: cross-check against 80-item institutional checklist + consistency checks
│   └── prep-for-lender/
│       └── SKILL.md                   # Subskill 7: final QC pass + "ready to share" verdict
└── examples/
    ├── before/                        # Sample messy data room (synthetic, no PII)
    └── after/                         # Same data room post-skill, organized
```

### 3.3 The methodology — what makes the classifier non-generic

The OJ model — synthesized internally from buyer-research interviews:

> Every document in a private-credit data room exists to answer one of five lender questions. Classify by the question, then bucket by the format.

| Underlying question | Bucket | Example documents |
|---|---|---|
| "Does this entity exist & who controls it?" | **Corporate & Legal** | Cert of Inc, op agreement, cap table, OFAC, KYC, board consents |
| "Are the numbers real & tie to cash?" | **Financial Statements** + **Tax** | Audited / reviewed financials, P&L, BS, CF, bank statements, tax returns, QoE |
| "What's the collateral & how does the book behave?" | **Collateral** + **Existing Debt** | Loan tape, vintage curves, charge-off curves, concentration analysis, lien schedules, term sheets of existing facilities |
| "Can these people actually operate this?" | **Operations** + **Management** | Underwriting guidelines, servicing reports, org chart, bios, references |
| "Where is this going?" | **Projections** + **Guarantor** | Pro-forma model, originations forecast, base/down scenarios, personal financial statements of guarantors |

**This is the skill's brain.** The classifier asks: "What lender question does this document answer?" — then maps to bucket. That's the methodology; the 9 buckets are the *output*.

### 3.4 User-facing flow

```
User: "Organize this data room"
       (in Claude Code or Cowork, with target folder selected or specified)

Skill (data-room-organizer/SKILL.md fires):
  1. ASKS USER context (one AskUserQuestion call):
     - Q1: "What's this data room for?"
       Options: [Capital raise (debt facility), Capital raise (equity), Acquisition diligence, Internal cleanup, Other]
     - Q2: "Roughly what deal size?"
       Options: [<$5M, $5–25M, $25–100M, >$100M] — drives which buckets are required vs nice-to-have
     - Q3: "Borrower type?"
       Options: [Specialty finance / fintech lender, Operating company, Real estate, Other] — affects whether collateral/loan tape buckets apply
  2. Loads setup-source-access subskill (PREFLIGHT — runs before any file ops):
     - Determines surface (Claude Code / Cowork / Desktop)
     - Checks what MCPs are currently active (uses list_connectors / suggest_connectors)
     - Asks: "Where is your data room?" → 3 tiers:

       **TIER 1 (native MCP available):**
       Google Drive, Box, Microsoft SharePoint/OneDrive, Datasite, Egnyte
       → If MCP not connected, suggest_connectors + walk through install. Wait for confirmation.

       **TIER 2 (no MCP yet — local-sync fallback):**
       Dropbox, ShareFile
       → Instruct user to use the platform's desktop sync app, then point skill at local folder. Use request_cowork_directory or absolute path.

       **TIER 3 (specialty VDRs, no MCP — export fallback):**
       Intralinks, DFIN Venue, Firmex, Ansarada, Syndtrak
       → Instruct user to bulk-export the VDR to a zip, unzip locally, then point skill at local folder.

       **TIER 4 (future — OJ Juicebox):**
       Use OJ MCP when shipped. v0.1 displays "coming soon" with email-capture link.

     - Returns: a verified, accessible source location to the next subskill
  3. Loads ingest-data-room subskill → builds file inventory from the verified source
  4. For each file, fires classify-document subskill (uses the 5-question methodology)
  5. route-to-bucket subskill creates 9-bucket folders + moves files
  6. rename-canonical subskill standardizes names (date_company_doctype.ext)
  7. generate-manifest subskill writes INDEX.md
  8. missing-items-report subskill cross-checks against the 80-item institutional checklist AND runs consistency checks (as-of date mismatches across statements, bank-stmt-to-P&L reconciliation, vintage curve completeness, cross-document references that don't resolve), flags gaps with severity
  9. prep-for-lender subskill outputs a "Lender-Ready Score" + top 3 fixes
  10. Final output:
      - Reorganized folder
      - INDEX.md (clickable manifest)
      - GAPS.md (missing-items report with severity)
      - SCORE.md (lender-ready verdict + 3 actions)
      - One-line CTA: "This skill ports OJ's native data-room logic out to any folder. The full version lives inside Juicebox (OJ's loan-origination platform) — auto-organized, auto-validated, no install. → meet-oj.com/dataroom"
```

### 3.5 Top-level SKILL.md (draft frontmatter + body)

```markdown
---
name: data-room-organizer
description: Organizes a private-credit data room (Google Drive, Box, Dropbox, or local folder) into the 9-bucket structure that institutional lenders actually want. Use when the user has a messy data room, is preparing for a lender call, is a broker packaging a deal, or asks to "clean up", "organize", or "audit" a folder containing financial / legal / collateral documents for a private credit, debt facility, warehouse line, forward-flow, or acquisition diligence process.
when_to_use: |
  Trigger on: "organize my data room", "clean up this VDR", "prep this for a lender",
  "audit my data room", "what am I missing in this data room",
  or any folder containing a mix of financials, formation docs, loan tapes,
  bank statements, tax returns, or term sheets.
---

# Data Room Organizer

You are organizing a private-credit data room. The user wants it lender-ready.

## Method

Apply the methodology (see references/taxonomy.md): every document
answers one of five lender questions. Classify by the question, route to the
matching bucket, standardize the filename, generate a manifest, then run a
missing-items check against the 80-item institutional checklist.

## Steps

1. Ask the user three context questions (purpose, deal size, borrower type) using
   the AskUserQuestion tool. DO NOT skip this — context drives which buckets are
   required vs optional.
2. Load and execute subskills in this order:
   - ingest-data-room
   - classify-document (per file)
   - route-to-bucket
   - rename-canonical
   - generate-manifest
   - missing-items-report
   - prep-for-lender
3. Produce three artifacts: INDEX.md, GAPS.md, SCORE.md.
4. Close with the OJ CTA exactly once at the end. Don't repeat it.

## References

- references/taxonomy.md — the 9-bucket logic and the underlying 5-question model
- references/document-aliases.md — common synonyms and abbreviations
```

### 3.6 Compatibility matrix

| Surface | Supported? | Install |
|---|---|---|
| Claude Code (CLI) | ✅ Primary target | `/plugin marketplace add originations-juice/data-room-organizer` then `/plugin install data-room-organizer` |
| Claude Cowork (desktop) | ✅ Auto-loads when dropped into `~/Library/Application Support/Claude/local-agent-mode-sessions/.../skills/` or via plugin install | One-click install via marketplace UI once approved |
| Claude Desktop (chat) | ✅ Skills run in chat per Anthropic | Manual upload via UI |
| Vercel `npx add-skill` | ✅ Bonus surface | `npx add-skill https://github.com/originations-juice/data-room-organizer` |
| `npx skills add` (Vercel labs) | ✅ | `npx skills add https://github.com/originations-juice/data-room-organizer --skill data-room-organizer` |

**No platform-specific code paths.** Same SKILL.md, same subskills, same behavior across all three surfaces. ([Anthropic skills doc](https://support.claude.com/en/articles/12512180-use-skills-in-claude))

---

## 4. Distribution & GTM

### 4.1 Channel matrix

| Channel | Effort | Reach | Lead capture | Priority |
|---|---|---|---|---|
| LinkedIn video (Scott on cam) | Medium | High (warm + cold) | Vanity URL CTA | **P0 — week 1** |
| GitHub repo (open, MIT) | Already required | Compounds | Repo stars proxy | **P0 — week 1** |
| skillsmp.com submission | Low (PR + YAML) | Medium | None direct | P1 — week 1 |
| claudemarketplaces.com | Low | Medium | None direct | P1 — week 1 |
| anthropics/claude-plugins-official | Low (PR), slow review | High once approved | None direct | **P1 — submit week 1, ride approval** |
| Hacker News "Show HN" | Low | High variance | Repo stars + UTM | P2 — week 2, only if v1 is polished |
| Wire (Blake's voice — organic mention) | Low | Targeted at buyer ICP | Indirect | **P0 — Wire #3 mentions the skill in context, not a launch piece** |
| Freshly Squeezed (OJ's voice — launch piece) | Low | Targeted at OJ ICP | Direct | **P0 — Freshly Squeezed is the official launch announcement** |
| Lobehub, claudeskills.info | Low | Long-tail SEO | None | P2 — week 2 |
| Niche newsletters (ABF Journal, fintech) | Medium | Targeted | Direct | P2 — outreach week 2 |

### 4.2 The LinkedIn video (the spike)

**Format:** 60–90 seconds, screen-recorded, vertical or square, captioned.

**Script outline:**
1. **Hook (0–5s):** "Every private credit deal I've seen this year has a broken data room." (Cut to messy folder of mixed PDFs / xlsx / images, Blake's quote on screen.)
2. **Problem (5–20s):** "You can't find the financials. The bank statements are in three places. The lender ghosts you because their first impression is chaos."
3. **Demo (20–60s):** Type `claude organize this data room` → skill fires → AskUserQuestion → folders appear → INDEX.md auto-written → SCORE.md says "78/100, here are 3 fixes."
4. **Reveal (60–75s):** "We open-sourced this. It's a Claude skill. Drop it into Claude Code or Cowork in 30 seconds. GitHub link below."
5. **Close (75–90s):** "We're building OJ — the AI-native loan origination platform. Skill is free. If you want OJ to do this automatically every time, link in bio."

**Caption:** Lead with the Chester quote ("100 page SIM, 60 page Q of E, 300 page market study…"), drop the GitHub link, drop the vanity URL.

### 4.3 Follow-up content series (one per subskill)

Plan 6-week LinkedIn cadence — one post per subskill — each showing a specific moment of the workflow:
- Week 1: launch video (above)
- Week 2: "The classifier subskill — how Claude figures out where a document goes" (with the 5-question model graphic)
- Week 3: "The missing-items report — what an institutional lender expects to find"
- Week 4: "Renaming convention: why `2025-12_acme_bank-stmts.pdf` beats `Scan023.pdf`"
- Week 5: "Lender-Ready Score — we benchmarked it on 10 real (anonymized) data rooms"
- Week 6: "What's next: connecting the skill to the OJ MCP for live data room management"

### 4.3.1 Launch hook — ride the Datasite MCP wave

Datasite shipped its MCP server **April 28, 2026** — the first VDR provider to do so. ([source](https://www.globenewswire.com/news-release/2026/04/28/3282724/0/en/Datasite-Becomes-the-First-VDR-Provider-to-Connect-AI-Assistants-Directly-to-Live-Deal-Content-with-MCP-Server-Launch.html)) Our skill ships within days of that launch. Lead with this in launch comms:

> "Datasite just connected their VDR to Claude. The other 6 VDR platforms haven't. We open-sourced a skill that organizes a data room — Datasite, Box, Drive, SharePoint, Egnyte natively, plus a local-sync path for Dropbox, Intralinks, DFIN, Firmex, Ansarada, Syndtrak. The methodology is the same regardless of platform."

Why this works: positions OJ as moving in lockstep with the most credible VDR (Datasite/Bain) AND filling the gap they don't address (the rest of the market). Aligns with the broader "AI-native data room" narrative without competing with Datasite directly — we're complementary tools, not VDR replacements.

### 4.4 Newsletter strategy — Wire vs Freshly Squeezed (this matters)

OJ runs two newsletters with different voices and we need to honor that:

- **The Wire** ([fusionnetwork.beehiiv.com](https://fusionnetwork.beehiiv.com/)) — Blake Coler-Dark's voice. We manage publication for him. Audience: borrowers, brokers, lenders. Editorial tone is broker/operator-first. The skill is referenced *organically* here, in Blake's voice ("a tool I've been using to keep my own data rooms tight"). NOT a launch announcement. Wire #3 should be a topical follow-up to Issue #2 (e.g., "What I look for in the first 10 minutes of a data room"), with the skill as a sidebar mention and a footer CTA.

- **Freshly Squeezed** ([fs.meet-oj.com](https://fs.meet-oj.com/)) — OJ's voice (Scott / OJ team). Audience: commercial loan originators, fintech operators, AI-curious founders. **This is where the founder-voice deep-dive lives.** Title: *"We Open-Sourced the Data Room Methodology"* or *"How a 9-Bucket Folder Tree Replaced 100 Diligence Emails."* Cross-link to the Wire as the source of the methodology. Cross-link to Juicebox as the productized version. Drop the GitHub link, the vanity URL, the LinkedIn video.

**Sequencing (week 1):**
- Mon AM: Freshly Squeezed launch post goes live
- Mon noon: LinkedIn video posts (links Freshly Squeezed + GitHub)
- Tue: Wire Issue #3 hits subscriber inboxes (Blake's voice, organic mention)
- Wed–Fri: marketplace submissions land, Show HN if v1 is polished

**Why this matters:** if "we built the tool" appears in Blake's newsletter, we damage Blake's editorial credibility — readers know him as a broker, not a software vendor. Keep the voices clean. The skill is OJ's product, the methodology is universal, Blake gets to be the practitioner who uses it.

### 4.5 Lead-capture flow

```
LinkedIn video → click vanity URL (crushthedataroom.com)
   → landing page with:
     • 30-second loom of the skill in action
     • Two CTAs:
        [GET THE SKILL] → GitHub (no email required, frictionless, builds stars)
        [GET THE PLAYBOOK] → Tally form (email + role + company size)
                            → emails the OJ Data Room Checklist PDF + a 5-min loom from Scott
                            → adds to OJ nurture sequence
   → Outbound: every 2 weeks, valuable content (Wire articles, skill updates)
   → Conversion: invitation to OJ demo when "AI-native data room" is enabled product-side
```

**Important:** the skill is open. The lead capture is on the *playbook PDF*, not the skill. This avoids looking gated/lame to the AI dev audience while still capturing the buyer audience.

---

## 5. Success metrics

| Metric | 30-day target | 90-day target | Source of truth |
|---|---|---|---|
| GitHub stars | 100 | 1,000 | Repo |
| Repo unique visitors | 1,000 | 10,000 | GitHub Insights |
| Marketplace listings live | 3 (skillsmp, claudemarketplaces, Lobehub) | 4 (+ Anthropic official) | Manual |
| LinkedIn video views | 5,000 | 25,000 | LinkedIn analytics |
| `crushthedataroom.com` sessions | 500 | 5,000 | UTM tracking |
| Email captures via playbook funnel | 50 | 500 | Tally → CRM |
| Demo requests citing the skill | 5 | 30 | OJ CRM source field |
| Wire subscriber lift | +10% | +30% | Beehiiv |

**The KPI that matters most:** demo requests citing the skill as the source. That's the only number that justifies the build. Everything else is leading indicator.

---

## 6. Implementation handoff for Claude Code

### 6.1 Build order (sequential, do not skip)

1. **Init repo.** `gh repo create originations-juice/data-room-organizer --public --license mit`. Set up README skeleton, LICENSE, .gitignore.
2. **Write `references/taxonomy.md`.** This is the brain. Encode the 5-question model, the 9 buckets, the mapping logic, edge cases (ambiguous documents → ask user). Source: this PRD section 3.3 + the full Granola quotes pulled in research.
3. **Write `references/document-aliases.md`.** Build a dictionary of common abbreviations and synonyms used in private credit. (Examples: QoE = quality of earnings = financials/audit; OFAC = corporate/compliance; cap table = corporate; loan tape = collateral; KYC = corporate/legal; etc.) Aim for 100+ aliases at v1.
5. **Write `skills/data-room-organizer/SKILL.md`.** Use the draft in section 3.5 as the starting point. Refine wording. Test that the `description` field is concrete enough to auto-trigger.
6. **Write each subskill SKILL.md** in order:
   - **setup-source-access** (PREFLIGHT — most important new subskill). Detects surface (CC/Cowork/Desktop), enumerates active MCPs via `list_connectors` / `suggest_connectors`, asks user where their data room lives, routes to one of 4 tiers:
     - **Tier 1 (native MCP, verified May 2026):** Google Drive, Box, Microsoft 365 (SharePoint + OneDrive), Datasite, Egnyte. If MCP not installed, fire `suggest_connectors`, link to Anthropic docs, wait for user confirmation. Do NOT auto-install.
     - **Tier 2 (no MCP yet, local-sync fallback):** Dropbox, ShareFile. Skill instructs user how to set up desktop sync, then takes a local path.
     - **Tier 3 (specialty VDR, no MCP, export fallback):** Intralinks, DFIN Venue, Firmex, Ansarada, Syndtrak. Skill instructs export-to-zip → unzip → local path.
     - **Tier 4 (OJ Juicebox, v1.0):** displays "coming soon" with email capture for waitlist.
     References live data: Datasite shipped MCP April 28, 2026 (3 days before this skill ships) — first VDR to do so. The skill should treat that as a positive signal and explicitly call out Datasite support in the launch.
   - **ingest-data-room** — reads source contents recursively, builds a flat inventory.
   - **classify-document** — applies the 5-question methodology to each file.
   - **route-to-bucket** — creates 9-category folders, moves files.
   - **rename-canonical** — standardizes naming (date_company_doctype.ext).
   - **generate-manifest** — writes INDEX.md.
   - **missing-items-report** — checks against the 80-item institutional checklist + consistency checks (as-of dates, bank↔P&L recon, vintage curves, cross-doc references).
   - **prep-for-lender** — outputs SCORE.md with verdict + top 3 fixes.

   Each subskill is ~150-300 lines. Each follows the Anthropic skill pattern: frontmatter (`name`, `description`, `when_to_use`), then body with explicit steps.
7. **Write `scripts/classify.py`.** Optional fallback that runs filename-based heuristic classification when used outside Claude (e.g., as part of a CI / batch script). 200 lines max. Pure stdlib + maybe pypdf.
8. **Build `examples/before/` and `examples/after/`.** Hand-craft a synthetic 30-file messy data room for a fictitious specialty finance company. No PII. Run the skill against it; commit both versions.
9. **Write `INSTALL.md`.** One page. Three install paths: Claude Code (`/plugin marketplace add` + `/plugin install`), Cowork (drop in skills folder OR plugin), Vercel (`npx add-skill`).
10. **Write `README.md`.** Front-door. Demo GIF (use Quicktime → ffmpeg → loop), badges (license, stars), one-liner pitch, 60-second install, link to INSTALL.md, link to OJ at `meet-oj.com`. No external article citations.
11. **Write `.claude-plugin/plugin.json`.** Marketplace metadata: name, version, description, author, repository, skills array, MCP requirements (none for v1).
12. **QA pass.** Run the skill in Claude Code AND Cowork against the synthetic data room. Verify outputs are correct, the AskUserQuestion fires, the SCORE.md computes, the CTA appears once and only at the end.
13. **Submit to marketplaces.** PRs to `anthropics/claude-plugins-official`, skillsmp.com, claudemarketplaces.com, Lobehub.
14. **Build vanity-URL landing page.** Likely Tally + Vercel or Netlify, redirecting from `crushthedataroom.com`. Ship the playbook PDF download flow.
15. **Record the LinkedIn video** (script in 4.2). Schedule for Tuesday or Wednesday morning.
16. **Day-of launch:** post LinkedIn, push HN as "Show HN" only if marketplace approvals or a clean v1.0 landed, alert Wire subscriber list, post in 2-3 relevant Slack/Discord communities.

### 6.2 Acceptance criteria (v0.1 ship gate)

- [ ] Repo is public on GitHub with MIT license
- [ ] README has working demo GIF and install instructions
- [ ] Skill triggers correctly in both Claude Code and Cowork on the synthetic example
- [ ] **setup-source-access subskill correctly handles all 4 tiers:**
  - Tier 1: detects + suggests Google Drive, Box, Microsoft 365, Datasite, Egnyte MCPs
  - Tier 2: gives correct local-sync instructions for Dropbox and ShareFile
  - Tier 3: gives correct export-to-zip instructions for Intralinks, DFIN, Firmex, Ansarada, Syndtrak
  - Tier 4: displays Juicebox waitlist CTA
- [ ] AskUserQuestion fires on first run (don't skip context-gathering)
- [ ] Output produces all three artifacts: INDEX.md, GAPS.md, SCORE.md
- [ ] CTA appears once at end, not repeatedly
- [ ] At least one marketplace listing is live (skillsmp.com is fastest)
- [ ] Vanity URL resolves to a landing page with both CTAs
- [ ] LinkedIn video is recorded and queued

### 6.3 Out of scope for v0.1 (explicit ICEBOX) vs in scope

**IN scope for v0.1:**
- MCP *discovery + install instructions* (the setup-source-access subskill teaches users how to wire up Drive/Box/Dropbox MCPs — but doesn't host or run the connectors itself)
- Local folder + Cowork mounted-folder paths
- All 9 buckets, the 5-question methodology, the missing-items + score outputs

**OUT of scope (ICEBOX, deferred to v0.2 / v1.0):**
- Building / hosting our own Drive/Box/Dropbox connectors (we ride on the official Anthropic-listed MCPs)
- Multi-user enterprise auth
- Real ML classifier (v0.1 is LLM-classification + heuristic; that's enough)
- Web UI for the skill (the skill is a skill — no separate UI)
- Persistence between runs

### 6.4 v1.0 north star — Juicebox integration

The skill is the public, open-source proof of the methodology. The **end-state** is that the same logic runs natively inside Juicebox (OJ's Laravel app), where:
- Documents are auto-classified on upload
- The 9-bucket structure is the default data-room layout
- The lender-ready score is a real-time dashboard widget
- The missing-items report drives the broker's "what to ask the borrower for" task list
- The Juicebox MCP exposes "organize this data room" / "score this data room" / "what's missing" as tools the skill can call

Building the Juicebox MCP is a separate workstream. The skill's `setup-source-access` subskill must include a "Use OJ Juicebox" branch as a stub today, so when the Juicebox MCP ships, users get an "upgrade your skill — it now talks to OJ directly" moment. That moment becomes a second LinkedIn launch.

### 6.5 Known risks & mitigations

| Risk | Mitigation |
|---|---|
| Marketplace review takes too long | Don't gate launch on Anthropic official; ship to skillsmp first (instant) |
| Skill doesn't auto-trigger reliably | Test the `description` field with 5+ phrasings; iterate |
| LinkedIn video flops | Plan to repost edited cuts; have 6-week content series ready |
| Someone clones and reskins it | We have first-party buyer testimony and an integrated product (Juicebox); the brand wins |
| AI-skill audience finds it generic | The 5-question methodology + the consistency checks (Dillon's wedge) are the moat. Lean on them explicitly. |
| User confuses skill with the OJ product | Be ruthless about positioning: skill is free + open; OJ is the automated version |

---

## 7. Open questions for Scott to resolve before kick-off

1. **Repo home:** `meet-oj` or `originations-juice` GitHub org? Match where existing public OJ assets live.
2. **Vanity URL:** is `crushthedataroom.com` available + brand-acceptable, or do we want `dataroomsanity.com` / `lenderready.io` / something else? Buy in bulk if checking.
3. **Lead-capture stack:** Tally + Beehiiv + which CRM? Need a single source of truth on captured emails.
4. **Wire #3 timing:** does Blake have bandwidth to write the companion Wire issue in week 1? If not, slip skill launch to align.
5. **Brent's role:** he replied "I like the latter [not the live event]" and said he isn't a data-room expert. Is he comfortable being on-camera secondary? Or is this Scott solo for v1?
6. **Dillon Lounsbury (Legacy ABL):** identified — Feb 6, 2026 intro call. Quotes folded into section 1. Worth a follow-up to ask if he'd be willing to give a quote we can use in the LinkedIn launch. He's friendly, gave permission to circle back ("I would love to see in the news some crazy company that you built").
7. **OJ MCP roadmap:** when is the OJ MCP shipping? The skill should be designed to *gracefully upgrade* once the MCP is live (the prep-for-lender subskill becomes "send to OJ" instead of "save locally").

---

## 7a. MCP availability matrix (verified May 1, 2026)

| Platform | MCP exists? | URL / Notes | v0.1 path |
|---|---|---|---|
| Google Drive | ✅ Official | drivemcp.googleapis.com | Tier 1 — native MCP |
| Box | ✅ Official | mcp.box.com | Tier 1 — native MCP |
| Microsoft 365 (SharePoint, OneDrive) | ✅ Official | microsoft365.mcp.claude.com | Tier 1 — native MCP |
| Datasite | ✅ Shipped Apr 28, 2026 (first VDR) | mcp.global.datasite.com | Tier 1 — native MCP |
| Egnyte | ✅ Official | mcp-server.egnyte.com | Tier 1 — native MCP |
| Dropbox | ❌ No MCP | — | Tier 2 — local-sync fallback |
| ShareFile | ❌ No MCP | — | Tier 2 — local-sync fallback |
| Intralinks | ❌ No MCP | — | Tier 3 — export-to-zip fallback |
| DFIN Venue | ❌ No MCP | — | Tier 3 — export-to-zip fallback |
| Firmex | ❌ No MCP | — | Tier 3 — export-to-zip fallback |
| Ansarada | ❌ No MCP | — | Tier 3 — export-to-zip fallback |
| Syndtrak | ❌ No MCP | — | Tier 3 — export-to-zip fallback |
| OJ Juicebox | 🛠️ In development | — | Tier 4 — waitlist CTA |

**Strategic note for v0.2 / v1.0:** every Tier 2 and Tier 3 platform is a potential OJ MCP positioning opportunity. The Juicebox MCP, when it ships, can offer a "bring your own VDR" path that ingests from any of these via export → upload, which is something even Datasite's MCP doesn't do (Datasite locks you to Datasite).

## 8. Source appendix

### Internal sources
- Granola: Chester (Midcap Financial) <> Scott G, Feb 20, 2026
- Granola: OJ <> Fusion - Weekly Synch (Jan 6, Jan 16, Jan 21, Feb 17, 2026) — Blake Coler-Dark
- Granola: [Intro: Scott <> Dillon Lounsbury (Legacy ABL)](https://notes.granola.ai/t/04766f33-8637-4175-9614-c8738055c184-00b881l8), Feb 6, 2026
- Beehiiv: [The Wire, Issue #2 — "The Data Room Is Your First Impression"](https://fusionnetwork.beehiiv.com/p/the-data-room-is-your-first-impression) (Apr 30, 2026)
- Slack: #marketing thread, Scott + Brent, May 1, 2026

### MCP availability sources (verified via Anthropic registry + web, May 1, 2026)
- [Datasite MCP launch announcement (Apr 28, 2026)](https://www.globenewswire.com/news-release/2026/04/28/3282724/0/en/Datasite-Becomes-the-First-VDR-Provider-to-Connect-AI-Assistants-Directly-to-Live-Deal-Content-with-MCP-Server-Launch.html)
- [What is Datasite MCP](https://www.datasite.com/en/resources/faqs/mcp-what-is-datasite-mcp)
- Anthropic MCP registry searches confirmed: Drive, Box, M365, Datasite, Egnyte have official MCPs. Dropbox, Intralinks, DFIN, Firmex, Ansarada, Syndtrak, ShareFile do not.

### External research sources
- [github.com/gsd-build/gsd-2](https://github.com/gsd-build/gsd-2) — GSD framework
- [github.com/gsd-build/get-shit-done](https://github.com/gsd-build/get-shit-done) — original GSD
- [github.com/anthropics/skills](https://github.com/anthropics/skills) — Anthropic skills repo
- [github.com/anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) — official plugin marketplace
- [Use Skills in Claude — Anthropic Help Center](https://support.claude.com/en/articles/12512180-use-skills-in-claude)
- [Extend Claude with skills — Claude Code Docs](https://code.claude.com/docs/en/skills)
- [Superpowers, GSD, and gstack — Pulumi Blog](https://www.pulumi.com/blog/claude-code-orchestration-frameworks/)
- [Claude Code Skills vs MCP vs Plugins — Morphllm](https://www.morphllm.com/claude-code-skills-mcp-plugins)
- [Is MCP Dead? CLI vs Skills for AI Agents — Milvus](https://milvus.io/blog/is-mcp-dead-cli-and-skills-for-ai-agents.md)
- [Hasan Toor roundup tweet](https://x.com/hasantoxr/status/2035312729427480840)
- [GSD-2 Skills System — DeepWiki](https://deepwiki.com/gsd-build/gsd-2/8.5-skills-system)
- [skillsmp.com](https://skillsmp.com), [claudemarketplaces.com](https://claudemarketplaces.com), [claudeskills.info](https://claudeskills.info), [Lobehub Skills](https://lobehub.com/skills)
- [Vercel Add-Skill walkthrough](https://medium.com/vibe-coding/the-easiest-way-to-extend-claude-code-cloudflare-complicates-it-4995e8b4cab3)

---

## 9. Handoff prompt for Claude Code

Paste this into a fresh Claude Code session:

```
Read /Users/scottgoldman/Documents/OJ/data-room-skill-PRD.md from start to finish.

Then build the skill exactly as specified in section 6.1, in order. Stop after step 12 (QA pass) and report:
- The repo path you initialized
- A diff summary of every file you wrote
- Output of running the skill against examples/before/

Do NOT skip the references/ files. Do NOT skip the AskUserQuestion step in the master SKILL.md. Do NOT add features beyond v0.1 scope (section 6.3).

Use Anthropic's official skill format from github.com/anthropics/skills as the canonical reference. When in doubt about file structure, mirror github.com/gsd-build/gsd-2.

When the build is complete, prepare a draft of the LinkedIn video script using section 4.2 as the starting point and the Granola quotes in section 1 as raw material. Save as LAUNCH-LINKEDIN-V1.md in the same directory.

Stop at that point. Do not push to GitHub. Do not submit to marketplaces. Scott will review and ship.
```

---

**End of PRD.**
