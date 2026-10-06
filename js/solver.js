import { check } from "./clues.js";

// Backtracking solver. Returns the first full assignment consistent with the clues
// and with any placements already made (fixed), or null.
export function solve(level, fixed = {}) {
  const n = level.items.length, pos = { ...fixed };
  const used = new Set(Object.values(pos));
  const todo = level.items.filter((x) => pos[x] == null);
  function rec(i) {
    if (i === todo.length) return true;
    for (let s = 0; s < n; s++) {
      if (used.has(s)) continue;
      pos[todo[i]] = s; used.add(s);
      if (level.clues.every((c) => check(c, pos, n) !== false) && rec(i + 1)) return true;
      delete pos[todo[i]]; used.delete(s);
    }
    return false;
  }
  return rec(0) ? pos : null;
}
