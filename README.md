# IPL 14-0 Engine

A single-page drafting and tournament-simulation game, in the spirit of the NBA-based fan game *82-0*. Spin your way through a 12-round draft across every IPL franchise and era, then find out if your all-time squad can go a perfect 14-0.

> **Can you go 14-0?**

---

## Table of Contents

- [Game Modes](#game-modes)
- [How to Play](#how-to-play)
- [Draft Rules](#draft-rules)
- [Tournament Simulation](#tournament-simulation)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Customizing the Data](#customizing-the-data)
- [Known Limitations](#known-limitations)

---

## Game Modes

Pick a mode from the Start Screen before every campaign:

| Mode | What you see | What it tests |
|---|---|---|
| **Classic** | Full stats — AVG, SR (strike rate), WKT (wicket rate) and ECN (economy) on every card | Informed, stats-driven drafting |
| **Ball Knowledge** | Name, role, and franchise only. No stats, no match count | Pure cricket memory and instinct |

In Ball Knowledge mode, sorting is locked to alphabetical (never by an underlying stat) so nothing leaks through card order either. What you see really is all you get until the season simulation reveals how good your calls actually were.

---

## How to Play

1. **Choose a mode** on the Start Screen.
2. **Press SPIN.** The engine locks in a random franchise + era combination for the round.
3. **Draft one player** from the resulting pool by clicking their card. Each pick auto-slots into the correct position in your XI.
4. Repeat for all **12 rounds**.
5. On your 12th pick, the **season simulation** runs automatically and grades your squad.

You get **one Team re-roll and one Era re-roll per campaign** — use them to swap out a franchise or era you don't like without losing the round. If a role you still need has genuinely run dry across the entire dataset, the engine automatically relaxes the search (and tells you so) rather than leaving you stuck.

---

## Draft Rules

Your final XII must fill these slots:

- **4** Batters
- **1** Wicketkeeper
- **4** Bowlers
- **2** All-Rounders
- **1** Impact Player (12th man — a free player you can pick, not limited to any dedicated role)

**Overseas quota:** a maximum of **4 overseas players** per squad, enforced live — the counter turns red at 4/4 and overseas cards become unselectable once you're at the cap. The draft engine also accounts for this quota when generating candidate pools, so you'll never get spun into a round where the only available player is one you're not legally allowed to pick.

---

## Tournament Simulation

Once your 12-man squad is locked, the engine simulates a 14-match season:

- **Batting Execution (B)** and **Bowling Defense (D)** are calculated from your top 5 contributors in each discipline, weighted by a match-volume credibility factor and run through a soft compression curve above 85 (so a 99 rating means something).
- **Squad Balance & Depth (F)** averages B and D, then applies a capped penalty for low-sample "liability" picks — weighted by how good they actually were in their limited appearances, not just raw match count.
- **Overall Squad Power (S)** = 40% Batting + 40% Bowling + 20% Balance.
- Each of the 14 fixtures resolves via a logistic win-probability formula against a fixed opponent difficulty rating, with a random roll deciding the result.

Final record maps to a tier:

| Record | Tier | Verdict |
|---|---|---|
| 14–0 | S+ | Undisputed Champions |
| 12–13 wins | S | Dynasty Apex Squad |
| 10–11 wins | A | Elite Playoff Contender |
| 9 wins | B | Solid Mid-Table Core |
| 8 wins | C | Competitive Challenger |
| 7 wins | D | Balanced Average Camp |
| 4–6 wins | E | Underperforming Unit |
| 0–3 wins | F | Wooden Spoon Rebuild |

From the results screen you can **Share Result** — it renders your tier, record, ratings, and final XII as a downloadable/shareable PNG.

---

## Tech Stack

- **React** (function components + hooks, no external state library)
- **Vite** for dev/build tooling
- Plain **inline styles + one injected `<style>` block** — no Tailwind, no component library
- **Google Fonts**: Chakra Petch (scores, HUD, headings) + Inter (body/data)
- **`localStorage`** for in-progress campaign persistence
- Canvas API for the shareable result image (no extra dependency)
- Zero backend — everything runs client-side against a static player dataset

---

## Getting Started

```bash
npm create vite@latest ipl-14-0-engine -- --template react
cd ipl-14-0-engine
npm install
```

Then drop in this project's files (see [Project Structure](#project-structure) below) and run:

```bash
npm run dev
```

---

## Project Structure

```
src/
├── App.jsx                  # entire game — components, styles, draft & sim logic
├── App.css                  # base Vite scaffold styles
├── assets/
│   ├── 140icon.jpeg         # badge/logo used in the header and Start Screen
│   └── 140background.jpeg   # stadium photo backdrop on the Start Screen
└── data/
    └── players.json         # player dataset (name, role, team, era, stats, is_overseas)
```

---

## Customizing the Data

`src/data/players.json` is a flat array of player records:

```json
{
  "id": "unique_id_team_era",
  "playerId": "unique_player_id",
  "name": "Player Name",
  "role": "Batter | Bowler | All-Rounder | Wicketkeeper",
  "team": "Franchise abbreviation",
  "era": "2008-2012 | 2013-2017 | 2018-2022 | 2023-2026",
  "matches": 0,
  "batting_avg": 0,
  "batting_sr": 0,
  "bowling_econ": 0,
  "wickets": 0,
  "dismissals": 0,
  "is_overseas": true/false
}
```

Add, remove, or re-stat players freely — the draft engine, simulation, and both game modes all read directly from this file with no other configuration needed. Just make sure every role has reasonable coverage across most team/era combinations, or thin roles (All-Rounders especially) can occasionally force the engine's fallback behavior late in a draft.

---

## Known Limitations

- No backend — campaigns persist only in the current browser's `localStorage`, not across devices.
- The Start Screen's stadium photo is a single static image; very short/narrow viewports may crop it more aggressively than intended.
- Tier balancing is tuned by feel against the current dataset — adding a large number of new elite players could shift what a "99 rating" actually requires.
