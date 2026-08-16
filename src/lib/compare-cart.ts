import { createSignal } from "solid-js";
import { compareCompatible } from "./compare-peers";
import { getServiceById } from "./services-seed";

const STORAGE = "nr-compare";
/** Soft cap so a URL dump cannot paste the whole catalog; the table itself is n-column. */
export const COMPARE_MAX = 32;

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

export function firstComparedService() {
  for (const id of compareIds()) {
    const found = getServiceById(id);
    if (found) return found;
  }
}

export function canAddToCompare(id: string) {
  if (isInCompare(id)) return false;
  if (compareIds().length >= COMPARE_MAX) return false;
  const candidate = getServiceById(id);
  if (!candidate) return false;
  const first = firstComparedService();
  if (!first) return true;
  return compareCompatible(first, candidate);
}

export function setCompareFromList(ids: string[]) {
  const next = [...new Set(ids)].slice(0, COMPARE_MAX);
  setCompareIds(next);
  writeStored(next);
}

export function addCompare(id: string) {
  if (!canAddToCompare(id)) return false;
  setCompareFromList([...compareIds(), id]);
  return true;
}

export function toggleCompare(id: string) {
  const cur = compareIds();
  if (cur.includes(id)) {
    setCompareFromList(cur.filter((x) => x !== id));
    return;
  }
  addCompare(id);
}

export function clearCompare() {
  setCompareFromList([]);
}

export { compareIds };
