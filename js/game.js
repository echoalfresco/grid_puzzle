import { LEVELS } from "./levels.js";
import { text, check } from "./clues.js";
import { solve } from "./solver.js";

const $ = (id) => document.getElementById(id);
const save = JSON.parse(localStorage.getItem("dg-save") || '{"unlocked":0,"stars":{}}');
let li = 0, place = {}, hints = 0, moves = 0, done = false;
const persist = () => localStorage.setItem("dg-save", JSON.stringify(save));

function levelBar() {
  $("levelbar").innerHTML = "";
  LEVELS.forEach((_, i) => {
    const b = document.createElement("button");
    const s = save.stars[i];
    b.textContent = i + 1 + (s ? " " + "\u2605".repeat(s) : "");
    b.disabled = i > save.unlocked;
    b.className = i === li ? "active" : "";
    b.onclick = () => load(i);
    $("levelbar").append(b);
  });
}

function load(i) {
  li = i; place = {}; hints = 0; moves = 0; done = false;
  $("next").hidden = true; $("msg").textContent = "";
  const L = LEVELS[i], n = L.items.length;
  $("levelname").textContent = `Level ${i + 1}: ${L.name} (${n} items)`;
  $("clues").innerHTML = L.clues.map((c, k) => `<li id="c${k}">${text(c)}</li>`).join("");
  const g = $("grid"); g.innerHTML = "";
  const cols = `100px repeat(${n}, 1fr)`;
  const head = document.createElement("div");
  head.className = "gr"; head.style.gridTemplateColumns = cols;
  head.innerHTML = "<span></span>" + L.items.map((_, s) => `<span class="hd">${s + 1}</span>`).join("");
  g.append(head);
  L.items.forEach((name) => {
    const r = document.createElement("div");
    r.className = "gr"; r.style.gridTemplateColumns = cols;
    r.innerHTML = `<span class="lbl">${name}</span>`;
    for (let s = 0; s < n; s++) {
      const b = document.createElement("button");
      b.className = "cell"; b.dataset.n = name; b.dataset.s = s;
      b.onclick = () => click(name, s);
      r.append(b);
    }
    g.append(r);
  });
  levelBar(); render();
}

function click(name, s) {
  if (done) return;
  moves++;
  if (place[name] === s) delete place[name];
  else {
    for (const k in place) if (place[k] === s) delete place[k];
    place[name] = s;
  }
  render();
}

function hint() {
  if (done) return;
  const L = LEVELS[li];
  // Drop placements that cannot lead to a solution, then reveal one correct item.
  let sol = solve(L, place);
  if (!sol) {
    for (const k of Object.keys(place)) {
      const rest = { ...place }; delete rest[k];
      if (solve(L, rest)) { delete place[k]; break; }
    }
    sol = solve(L, place) || solve(L);
  }
  const target = L.items.find((x) => place[x] == null);
  if (!target) return;
  const s = sol[target];
  for (const k in place) if (place[k] === s) delete place[k];
  place[target] = s; hints++;
  $("msg").textContent = `Hint: ${target} goes in slot ${s + 1}.`;
  render();
}

function render() {
  const L = LEVELS[li], n = L.items.length;
  document.querySelectorAll(".cell").forEach((b) => {
    const on = place[b.dataset.n] === Number(b.dataset.s);
    b.classList.toggle("on", on); b.textContent = on ? "\u25A0" : "";
  });
  let good = 0;
  L.clues.forEach((c, k) => {
    const r = check(c, place, n), el = $("c" + k);
    el.className = r === true ? "ok" : r === false ? "bad" : "";
    if (r) good++;
  });
  $("bar").style.width = (100 * good / L.clues.length) + "%";
  $("moves").textContent = `Moves: ${moves}  Hints: ${hints}`;
  if (Object.keys(place).length === n && good === L.clues.length) win();
}

function win() {
  done = true;
  document.querySelectorAll(".cell.on").forEach((b) => b.classList.add("solved"));
  const n = LEVELS[li].items.length;
  const stars = hints > 1 ? 1 : hints === 1 ? 2 : moves <= n * 2 ? 3 : 2;
  save.stars[li] = Math.max(save.stars[li] || 0, stars);
  $("msg").textContent = `Solved! ${"\u2605".repeat(stars)}`;
  if (li + 1 < LEVELS.length) {
    save.unlocked = Math.max(save.unlocked, li + 1);
    $("next").hidden = false;
  } else $("msg").textContent += " You cleared every level!";
  persist(); levelBar();
}

$("reset").onclick = () => load(li);
$("hint").onclick = hint;
$("next").onclick = () => load(li + 1);
load(0);
