# O.J. — investor demo

Animated phone-screen demo for the "How O.J. works" deck slide. Three steps,
each loopable on its own and embeddable into a slide via iframe, plus a single
rolling page that plays all three back-to-back.

Source design lived in a Claude Design handoff bundle (`How OJ Works.html`).
This repo extracts just the application surface (the phone screen) — the
slide-side caption text was dropped because it belongs on the deck slide
itself.

## Run locally

```sh
python3 -m http.server 8765
# then open http://localhost:8765/
```

`index.html` is the rolling demo (54s, all three steps, with playback
controls). The three `step-*.html` files are the standalone embeds (no
chrome, looped, ready to drop into a slide).

## What's in here

```
investor-demo/
├── index.html                    rolling demo (Step 1 → 2 → 3, with controls)
├── step-1-onboard.html           Step 1 — onboard + underwrite (38s, loop)
├── step-2-notification.html      Step 2 — lock-screen push (5s, loop)
├── step-3-offer.html             Step 3 — offer page + agent chat (11s, loop)
├── assets/
│   ├── colors_and_type.css       OJ design-token CSS variables
│   └── juice-box.png             OJ logomark
└── src/
    ├── animations.jsx            Stage / Sprite / easings (vendored, +embed mode)
    ├── shared.jsx                PhoneFrame, OJ avatar, brand color constants
    ├── components.jsx            PhoneSlot, Bubble, PhoneHeader, PROVIDERS
    ├── auth.jsx                  Consent + Plaid/Puzzle/TransUnion auth sheets
    └── scenes.jsx                Step1, Step2, Step3
```

## Embedding a step in a slide

Each `step-*.html` is a self-contained looping autoplay. Drop into a slide via
iframe:

```html
<iframe src="step-1-onboard.html"
        width="440" height="820"
        style="border:0;background:#FAF8F5"
        allow="autoplay"></iframe>
```

The stage is **440×820** (a 360×740 phone with 40px padding). Resize the
iframe — Stage auto-scales to fit while preserving aspect.

If your deck tool doesn't allow iframes (e.g. some Canva tiers, Keynote),
screen-record the page with QuickTime / OBS / loom and import the mp4
instead.

## Step durations

| Step | File                          | Duration |
| ---- | ----------------------------- | -------- |
| 1    | `step-1-onboard.html`         | 38s      |
| 2    | `step-2-notification.html`    | 5s       |
| 3    | `step-3-offer.html`           | 11s      |
|      | `index.html` (all three)      | 54s      |

Loop is on by default. To make a step play once and freeze, edit the
`<Stage loop={false}>` prop in the corresponding HTML.

## How it works

- React 18 + Babel-standalone in the browser. No build step.
- A tiny `Stage` / `Sprite` runtime drives a single playhead via
  `requestAnimationFrame`. Each scene reads `localTime` from `useSprite()`
  and renders DOM accordingly.
- All visual states are derived purely from time — no event handlers, no
  state machines per scene. Edits to a beat = adjust the `appearAt` numbers
  in `src/scenes.jsx`.
- Embed pages pass `controls={false}` to `Stage`, which hides the playback
  bar, drops the dark chrome, and skips localStorage time-resume so each
  fresh load starts at t=0.

## Editing copy

All chat copy + scope lines are inline strings in `src/scenes.jsx`
(Bubbles) and `src/auth.jsx` (consent screens). Change a string, refresh
the page, done. No re-export, no rebuild.

## Why React + CSS, not Rive

Considered Rive. Skipped it because:

- The demo is mostly real text — chat copy, scope lines, $250k / 8.9% APR
  / 4.2× DSCR / FICO / tool summaries — and product copy iterates a lot.
  In Rive that means round-tripping through the editor for every word
  change. In code it's an inline string.
- The branded auth screens (Plaid Link, TransUnion verify, Puzzle OAuth)
  are dense UI mocks with lists, forms, scrolling and slide-up sheets.
  Rive can do that, but the cost is high and the result is less editable.
- React + CSS gives us shadows, blurs, system fonts, real DOM scrolling,
  and a tiny tween runtime that's already understood by the team.

Where Rive *could* still earn a slot: small ornamental loops — the
juice-box logo bounce, the typing dots — as a `.riv` dropped in alongside
a normal `<img>`. Not the scenes themselves.
