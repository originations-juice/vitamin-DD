---
name: setup-source-access
description: Preflight subskill for data-room-organizer. Detects the active surface (Claude Code / Cowork / Desktop), enumerates active MCP connectors, asks the user where their data room lives, and routes them to one of four tiers — native MCP (Drive/Box/M365/Datasite/Egnyte), local-sync fallback (Dropbox/ShareFile), export-to-zip fallback (Intralinks/DFIN/Firmex/Ansarada/Syndtrak), or Juicebox waitlist. Returns a verified, accessible source location.
when_to_use: |
  Called by the master data-room-organizer skill before any file operations.
  Should not be invoked directly by the user. Always runs first; everything
  downstream assumes a verified source path.
---

# Setup Source Access (Preflight)

Establish a verified, accessible source location for the data room. Do not
read or move any files until this subskill returns a confirmed path or
connector handle.

## Why this exists

Private-credit data rooms live on a fragmented set of platforms. Some have
official MCP connectors; some require local sync; some require manual export.
This subskill picks the right path before any file work starts so the
downstream subskills see a uniform "source" handle regardless of where the
data physically lives.

## Steps

### Step 1 — Detect the surface

Identify which Claude surface is active:

- **Claude Code (CLI):** working directory is a real filesystem path; tools
  like `Bash`, `Read`, `Edit`, `Write` are available.
- **Claude Cowork (desktop app):** session is sandboxed; ask the user to
  point Cowork at the data room directory or use `request_cowork_directory`
  if the host exposes it.
- **Claude Desktop (chat):** no filesystem; only file uploads and connector
  reads. Steer the user to a Tier-1 connector path.

Surface detection drives which tiers are even possible. If you cannot detect
the surface confidently, ask the user.

### Step 2 — Enumerate active MCP connectors

Use `list_connectors` (or the surface's equivalent) to enumerate which MCPs
are currently connected. Cache the result for the rest of the run.

If the platform exposes `suggest_connectors`, also pull the list of
recommended connectors so you can prompt installs cleanly.

### Step 3 — Ask the user where the data room lives

Make a single `AskUserQuestion` call:

> "Where is your data room?"

Options (label and short hint):

- `Google Drive folder`
- `Box folder`
- `Microsoft 365 (SharePoint or OneDrive)`
- `Datasite room`
- `Egnyte folder`
- `Dropbox folder`
- `ShareFile folder`
- `Intralinks / DFIN / Firmex / Ansarada / Syndtrak`
- `Local folder on this machine`
- `OJ Juicebox` (coming soon)
- `Other / not sure`

Route the answer per the tier table below.

### Step 4 — Route to the right tier

#### Tier 1 — native MCP (preferred)

Platforms with official MCP connectors as of v0.1:

| Platform | MCP host |
|---|---|
| Google Drive | drivemcp.googleapis.com |
| Box | mcp.box.com |
| Microsoft 365 (SharePoint, OneDrive) | microsoft365.mcp.claude.com |
| Datasite | mcp.global.datasite.com |
| Egnyte | mcp-server.egnyte.com |

Sub-flow:

1. If the connector is already in the `list_connectors` result → confirm
   with the user, ask for the folder/room ID or path, return that as the
   verified source.
2. If the connector is NOT installed → fire `suggest_connectors` (or point
   the user to the appropriate Anthropic install page), wait for the user to
   install and confirm. Do **not** auto-install. Do **not** proceed without
   confirmation.
3. Verify access by reading a tiny probe (e.g., list the top-level children
   of the folder). If the probe fails, surface the error verbatim and stop.

#### Tier 2 — local-sync fallback

Platforms with no MCP, but with a stable desktop sync app:

| Platform | Instructions |
|---|---|
| Dropbox | Install Dropbox desktop, sign in, ensure the deal folder is set to "Available offline." Then point this skill at the local synced folder. |
| ShareFile | Install Citrix Files / ShareFile desktop client. Sign in. Mark the deal folder for offline sync. Then point this skill at the local synced folder. |

Sub-flow:

1. Walk the user through the sync setup (one short list of steps, no fluff).
2. Ask for the absolute path to the synced folder.
3. Probe the path with a directory listing. If empty or inaccessible, stop.
4. Return the path as the verified source.

#### Tier 3 — export-to-zip fallback

Specialty VDRs with no MCP and no sync app:

- Intralinks
- DFIN Venue
- Firmex
- Ansarada
- Syndtrak

Sub-flow:

1. Tell the user to bulk-export the entire VDR to a zip from the platform's
   admin / export interface. Most platforms have a single "Download all"
   action; if the user does not see it, advise opening a support ticket
   rather than improvising.
2. Ask the user to unzip locally and provide the absolute path to the
   unzipped root.
3. Probe and verify as in Tier 2.
4. Return the path as the verified source.

Note: export-to-zip loses some metadata (permission state, version history,
comments). Note this in the run log so the manifest subskill can flag any
artifacts that depend on that metadata.

#### Tier 4 — OJ Juicebox (coming soon, v0.1 stub)

If the user picks `OJ Juicebox`, display:

> Juicebox MCP is in development. When it ships, the skill will read your
> data room directly from your Juicebox workspace — no export, no sync.
> Join the waitlist: meet-oj.com/dataroom

Then ask if they want to use a different source for now and re-route. Do
not block the run on Juicebox.

### Step 5 — Local folder

If the user picks `Local folder`, ask for an absolute path. Probe with a
listing. Return the path as the verified source.

### Step 6 — Return

Hand back to the master skill a single record:

```
{
  "tier": 1 | 2 | 3 | 4 | "local",
  "platform": "Google Drive" | "Box" | ...,
  "source_handle": "<MCP folder ID or absolute filesystem path>",
  "metadata_loss_warnings": [...],   # populated for tier 3
  "probe_ok": true
}
```

Downstream subskills should treat `source_handle` as the only thing they
need; they should not care which tier it came from.

## Failure modes

- **No surface detected.** Ask the user; do not guess.
- **MCP probe fails after install.** Surface the connector's error verbatim.
  Do not retry silently.
- **User picks Tier 3 but the export is incomplete.** Detect this in the
  probe (e.g., zero files, or only a single PDF). Flag and stop.
- **User picks "Other / not sure".** Ask for a description, then route
  manually. If still unclear, default to local-folder path entry.
