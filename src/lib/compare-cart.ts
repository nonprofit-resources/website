import { createSignal } from "solid-js";

const STORAGE = "nr-compare";
export const COMPARE_MAX = 8;

function readStored(): string[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function writeStored(ids: string[]) {
  try {
    localStorage.setItem(STORAGE, JSON.stringify(ids));
  } catch {
    /* ignore quota */
  }
}

const [compareIds, setCompareIds] = createSignal<string[]>([]);
let hydrated = false;

export function hydrateCompareCart() {
  if (hydrated) return;
  hydrated = true;
  setCompareIds(readStored());
}

export function getCompareIds() {
  return compareIds();
}

export function compareCount() {
  return compareIds().length;
}

export function isInCompare(id: string) {
  return compareIds().includes(id);
}

export function setCompareFromList(ids: string[]) {
  const next = [...new Set(ids)].slice(0, COMPARE_MAX);
  setCompareIds(next);
  writeStored(next);
}

export function toggleCompare(id: string) {
  const cur = compareIds();
  if (cur.includes(id)) {
    setCompareFromList(cur.filter((x) => x !== id));
    return;
  }
  if (cur.length >= COMPARE_MAX) return;
  setCompareFromList([...cur, id]);
}

export function clearCompare() {
  setCompareFromList([]);
}

export { compareIds };
