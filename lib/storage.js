import { COINS } from "./sample-data.js";

export const WATCHLIST_STORAGE_KEY = "dragoon_market_watchlist";

const VALID_COIN_IDS = new Set(COINS.map((c) => c.id));
const EMPTY_LIST = [];

let listeners = [];
let cachedRaw = null;
let cachedSnapshot = EMPTY_LIST;

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeWatchlist(listener) {
  listeners.push(listener);
  const handleStorage = (event) => {
    if (event.key === WATCHLIST_STORAGE_KEY) {
      cachedRaw = null;
      emitChange();
    }
  };

  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }

  return () => {
    listeners = listeners.filter((l) => l !== listener);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

export function getWatchlistSnapshot() {
  if (typeof window === "undefined") {
    return EMPTY_LIST;
  }

  try {
    const raw = window.localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (raw === cachedRaw) {
      return cachedSnapshot;
    }
    cachedRaw = raw;
    if (!raw) {
      cachedSnapshot = EMPTY_LIST;
      return cachedSnapshot;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      cachedSnapshot = EMPTY_LIST;
      return cachedSnapshot;
    }
    cachedSnapshot = parsed.filter((id) => typeof id === "string" && VALID_COIN_IDS.has(id));
    return cachedSnapshot;
  } catch {
    // Return last valid in-memory snapshot if storage is restricted
    return cachedSnapshot;
  }
}

export function getWatchlistServerSnapshot() {
  return EMPTY_LIST;
}

export function toggleStoredWatchlist(coinId) {
  const current = getWatchlistSnapshot();
  const next = current.includes(coinId)
    ? current.filter((id) => id !== coinId)
    : [...current, coinId];

  cachedSnapshot = next;
  cachedRaw = JSON.stringify(next);

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(WATCHLIST_STORAGE_KEY, cachedRaw);
    } catch {
      // In-memory update still succeeds if localStorage throws QuotaExceeded or SecurityError
    }
  }

  emitChange();
  return next;
}
