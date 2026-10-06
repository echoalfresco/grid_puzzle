export const text = (c) => ({
  pos: () => `${c.a} is in slot ${c.n}.`,
  notpos: () => `${c.a} is not in slot ${c.n.join(", ")}.`,
  end: () => `${c.a} is at one of the two ends.`,
  parity: () => `${c.a} is in an ${c.n} slot.`,
  left: () => `${c.a} is somewhere left of ${c.b}.`,
  immleft: () => `${c.a} is directly left of ${c.b}.`,
  adj: () => `${c.a} is next to ${c.b}.`,
  notadj: () => `${c.a} is not next to ${c.b}.`,
  apart: () => `${c.a} and ${c.b} are exactly ${c.n} slots apart.`,
  between: () => `${c.a} is somewhere between ${c.b} and ${c.c}.`,
}[c.t]());

// pos: map of name -> 0-based slot. Returns true/false, or null if a needed item is unplaced.
export function check(c, pos, n) {
  const names = [c.a, c.b, c.c].filter(Boolean);
  if (names.some((x) => pos[x] == null)) return null;
  const A = pos[c.a], B = pos[c.b], C = pos[c.c];
  switch (c.t) {
    case "pos": return A === c.n - 1;
    case "notpos": return !c.n.includes(A + 1);
    case "end": return A === 0 || A === n - 1;
    case "parity": return (A + 1) % 2 === (c.n === "odd" ? 1 : 0);
    case "left": return A < B;
    case "immleft": return A + 1 === B;
    case "adj": return Math.abs(A - B) === 1;
    case "notadj": return Math.abs(A - B) !== 1;
    case "apart": return Math.abs(A - B) === c.n;
    case "between": return Math.min(B, C) < A && A < Math.max(B, C);
  }
}
