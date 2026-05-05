# Install — `data-room-organizer`

Pick the path that matches how you run Claude. The Vercel `npx skills`
form below is the recommended front-door — it works across every Claude
surface (Code, Cowork, Desktop) plus Cursor, Cline, Zed, and the other
agent runtimes the Vercel CLI supports.

---

## Recommended: `npx skills`

```bash
npx skills add github.com/originations-juice/vitamin-DD
```

The CLI lists the available skills in this repo and prompts you to pick
which to install and which agent(s) to install them into. Pick at least
`data-room-organizer` (the master orchestrator). The eight subskills
(setup-source-access, ingest-data-room, classify-document,
route-to-bucket, rename-canonical, generate-manifest,
missing-items-report, prep-for-lender) are loaded by the master at
runtime — install them all if you want every step to resolve cleanly.

Non-interactive variants:

```bash
# Install everything (master + 8 subskills) into the current project:
npx skills add github.com/originations-juice/vitamin-DD --skill '*' -y

# Install globally (~/.claude/skills) instead of project-local:
npx skills add github.com/originations-juice/vitamin-DD --skill '*' -g -y

# Install everything into every detected agent runtime:
npx skills add github.com/originations-juice/vitamin-DD --all
```

Then in any folder with a messy data room:

```
> organize this data room
```

---

## Claude Code (CLI) — plugin marketplace

```bash
/plugin marketplace add originations-juice/vitamin-DD
/plugin install data-room-organizer
```

---

## Claude Cowork (desktop app)

Install via the marketplace:

1. Open Cowork settings.
2. Add the marketplace `originations-juice/vitamin-DD`.
3. Install the `data-room-organizer` plugin.

Then in a session pointed at the data room directory:

```
> organize this data room
```

Cowork manages where skills live on disk (temp plugin caches, RPM
marketplace cache, knowledge-work plugin cache). There is no
user-writable drop-in path that Cowork scans, so a manual `git clone`
into a session folder will not load — install through the marketplace.

---

## Claude Desktop (chat)

Skills run inside chat. Upload the `skills/data-room-organizer/SKILL.md`
file (and the `references/` files alongside) via the desktop app's skill
upload UI, then ask Claude to organize a folder you can share via a
connected MCP source (Drive, Box, M365, Datasite, Egnyte).

Local-folder paths are not supported in Desktop chat — use Claude Code
or Cowork for local data rooms.

---

## Verify the install

After installing, run:

```
> what skills do you have available?
```

You should see `data-room-organizer` listed. If it doesn't appear, check:

1. For npx installs: `npx skills list` (project) or
   `npx skills list -g` (global) lists everything the CLI placed.
2. For Claude Code marketplace installs: `/plugin list` confirms the
   plugin is enabled.
3. For Cowork: settings → Marketplaces → confirm
   `originations-juice/vitamin-DD` is listed and the plugin shows as
   installed.
4. For Desktop: re-upload the skill file via the desktop app's skill UI.

---

## Source-access setup (preflight)

The first time you run the skill, it will ask where your data room lives.

| Source | What you need |
|---|---|
| Google Drive | Drive MCP connector installed (one-click in Claude UI) |
| Box | Box MCP connector installed |
| Microsoft 365 (SharePoint, OneDrive) | Microsoft 365 MCP connector installed |
| Datasite | Datasite MCP connector installed |
| Egnyte | Egnyte MCP connector installed |
| Dropbox | Desktop sync app, deal folder set to "Available offline" |
| ShareFile | ShareFile / Citrix Files desktop client, deal folder synced |
| Intralinks / DFIN / Firmex / Ansarada / Syndtrak | Bulk export the VDR to a zip from the platform's admin UI, unzip locally |
| Local folder | Absolute path to the folder |

The skill walks you through each option on first run. You don't need to
pre-configure anything beyond what's listed above.

---

## Optional: CLI fallback (`classify.py`)

Inside the skill bundle:

```bash
python3 skills/data-room-organizer/scripts/classify.py /path/to/data/room
python3 skills/data-room-organizer/scripts/classify.py /path/to/data/room --json
python3 skills/data-room-organizer/scripts/classify.py /path/to/data/room --move
python3 skills/data-room-organizer/scripts/classify.py --self-test
```

This is a filename-only heuristic classifier. It's useful for batch
pre-processing before you open Claude. The full skill (running inside
Claude) does substantially more — content sampling, consistency checks,
gap analysis, scoring.
