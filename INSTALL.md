# Install — `data-room-organizer`

Three install paths, one skill. Pick whichever matches how you run Claude.

---

## Claude Code (CLI)

```bash
/plugin marketplace add originations-juice/vitamin-DD
/plugin install data-room-organizer
```

Then in any folder with a messy data room:

```
> organize this data room
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

## Vercel `npx add-skill`

```bash
npx add-skill https://github.com/originations-juice/vitamin-DD
```

or:

```bash
npx skills add https://github.com/originations-juice/vitamin-DD --skill data-room-organizer
```

---

## Verify the install

After installing, run:

```
> what skills do you have available?
```

You should see `data-room-organizer` listed. If it doesn't appear, check:

1. The plugin marketplace entry resolved (Claude Code: `/plugin list`;
   Cowork: settings → Marketplaces → confirm `originations-juice/vitamin-DD`
   is listed and the plugin shows as installed).
2. For Desktop: re-upload the skill file via the desktop app's skill UI.

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
