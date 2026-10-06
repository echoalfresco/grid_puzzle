# Dependency Grid

A small logic-puzzle game. Place each item in a slot so every clue is satisfied. Each level has exactly one solution.

## Run locally
    python -m http.server 8000
Open http://localhost:8000 (ES modules need a local server).

## Structure
- `js/levels.js`: level data (10 levels, 4 to 8 items)
- `js/clues.js`: clue text and rule checks (10 clue types)
- `js/solver.js`: backtracking solver that powers the Hint button
- `js/game.js`: UI, input, stars and saved progress

## Add a level
Append `{name, items, clues}` to `js/levels.js`. Verify the clues give exactly one solution before shipping.

## Deploy
Static site, no build step. Import the repo into Vercel.
