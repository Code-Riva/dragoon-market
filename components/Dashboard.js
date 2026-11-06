"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { COINS, PERIOD_OPTIONS, SAMPLE_AS_OF } from "@/lib/sample-data";
import {
  changeTone,
  formatChange,
  formatCompactUsd,
  formatPeriodLabel,
  formatPrice,
  formatTimestamp,
} from "@/lib/format";
import {
  getWatchlistServerSnapshot,
  getWatchlistSnapshot,
  subscribeWatchlist,
  toggleStoredWatchlist,
} from "@/lib/storage";
import PriceChart from "./PriceChart";
import CoinTable from "./CoinTable";

export default function Dashboard() {
  const [selectedId, setSelectedId] = useState(COINS[0].id);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState({ key: "marketCap", dir: "desc" });
  const [tab, setTab] = useState("all");
  const [period, setPeriod] = useState("30D");

  const watchlist = useSyncExternalStore(
    subscribeWatchlist,
    getWatchlistSnapshot,
    getWatchlistServerSnapshot,
  );

  function handleToggleWatchlist(coinId) {
    toggleStoredWatchlist(coinId);
  }

  const selected = COINS.find((c) => c.id === selectedId) ?? COINS[0];

  const currentPeriod = PERIOD_OPTIONS.find((p) => p.key === period) ?? PERIOD_OPTIONS[2];

  const slicedSeries = useMemo(() => {
    return selected.series.slice(-currentPeriod.days);
  }, [selected, currentPeriod]);

  const periodDescription = useMemo(() => {
    return formatPeriodLabel(slicedSeries, currentPeriod.days);
  }, [slicedSeries, currentPeriod]);

  const visible = useMemo(() => {
    const base = tab === "watchlist" ? COINS.filter((c) => watchlist.includes(c.id)) : COINS;
    const q = query.trim().toLowerCase();
    const filtered = q
      ? base.filter((c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q))
      : base;
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...filtered].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      const cmp = typeof av === "string" ? av.localeCompare(bv) : av - bv;
      return cmp * factor;
    });
  }, [tab, watchlist, query, sort]);

  function handleSort(key) {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "name" ? "asc" : "desc" },
    );
  }

  return (
    <>
      <header className="border-b border-line/80">
        <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center px-4 sm:px-6">
          <span className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-slate-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9.25" stroke="#60a5fa" strokeWidth="1.5" />
              <path d="M6.5 14.5l3.5-3.5 3 2.5 4.5-5" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Dragoon Market
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">Market Overview</h1>
          <p role="note" className="text-sm text-slate-400">
            <span className="font-medium text-blue-300">Sample Data</span> · Illustrative values as of{" "}
            <time dateTime={SAMPLE_AS_OF}>{formatTimestamp(SAMPLE_AS_OF)}</time>
          </p>
        </div>

        <section aria-labelledby="selected-heading" className="mt-6 rounded-xl border border-line bg-panel p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 id="selected-heading" className="text-sm text-slate-400">
                <span className="font-medium text-slate-200">{selected.name}</span> · {selected.symbol}
              </h2>
              <p className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1" aria-live="polite">
                <span className="text-3xl font-semibold tabular-nums text-slate-50 sm:text-4xl">
                  {formatPrice(selected.price)}
                </span>
                <span className={`text-base font-medium tabular-nums ${changeTone(selected.change24h)}`}>
                  {formatChange(selected.change24h)}
                  <span className="ml-1.5 text-sm font-normal text-slate-400">24h</span>
                </span>
              </p>
            </div>
            <dl className="flex gap-8 text-sm">
              <div>
                <dt className="text-slate-400">Market cap</dt>
                <dd className="mt-0.5 tabular-nums text-slate-200">{formatCompactUsd(selected.marketCap)}</dd>
              </div>
              <div>
                <dt className="text-slate-400">24h volume</dt>
                <dd className="mt-0.5 tabular-nums text-slate-200">{formatCompactUsd(selected.volume24h)}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400" aria-live="polite">
              Price, USD · {periodDescription}
            </p>
            <div
              role="group"
              aria-label="Chart time period"
              className="inline-flex self-start rounded-lg border border-line bg-black/60 p-0.5 text-xs"
            >
              {PERIOD_OPTIONS.map((opt) => {
                const isSelected = period === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    aria-pressed={isSelected}
                    aria-label={`Show ${opt.days} days chart`}
                    onClick={() => setPeriod(opt.key)}
                    className={`rounded-md px-2.5 py-1 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 ${
                      isSelected
                        ? "border border-blue-500/30 bg-blue-600/25 text-blue-300"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <PriceChart key={`${selected.id}-${period}`} coin={selected} series={slicedSeries} />
        </section>

        <section aria-labelledby="market-heading" className="mt-6 rounded-xl border border-line bg-panel">
          <div className="flex flex-col gap-4 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex flex-wrap items-center gap-4">
              <h2 id="market-heading" className="text-lg font-semibold text-slate-100">
                Markets
              </h2>
              <div role="tablist" aria-label="Market view" className="inline-flex rounded-lg border border-line bg-black/60 p-0.5 text-xs">
                <button
                  type="button"
                  role="tab"
                  id="tab-all"
                  aria-selected={tab === "all"}
                  aria-controls="market-table-region"
                  onClick={() => setTab("all")}
                  className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                    tab === "all"
                      ? "border border-blue-500/30 bg-blue-600/25 text-blue-300"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  All ({COINS.length})
                </button>
                <button
                  type="button"
                  role="tab"
                  id="tab-watchlist"
                  aria-selected={tab === "watchlist"}
                  aria-controls="market-table-region"
                  onClick={() => setTab("watchlist")}
                  className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                    tab === "watchlist"
                      ? "border border-blue-500/30 bg-blue-600/25 text-blue-300"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Watchlist ({watchlist.length})
                </button>
              </div>
            </div>

            <div className="w-full sm:w-72">
              <label htmlFor="coin-search" className="sr-only">
                Search coins by name or symbol
              </label>
              <input
                id="coin-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or symbol"
                autoComplete="off"
                className="w-full rounded-lg border border-line bg-black px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-blue-400"
              />
            </div>
          </div>

          <div id="market-table-region">
            {visible.length > 0 ? (
              <CoinTable
                coins={visible}
                selectedId={selectedId}
                onSelect={setSelectedId}
                sort={sort}
                onSort={handleSort}
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
              />
            ) : tab === "watchlist" && watchlist.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm" role="status">
                <p className="font-medium text-slate-200">Your watchlist is empty</p>
                <p className="mt-1 text-slate-400">
                  Click the star icon next to any coin in the All view to save it here.
                </p>
              </div>
            ) : tab === "watchlist" ? (
              <p className="px-6 py-12 text-center text-sm text-slate-400" role="status">
                No watchlisted coins match “{query.trim()}”.
              </p>
            ) : (
              <p className="px-6 py-12 text-center text-sm text-slate-400" role="status">
                No coins match “{query.trim()}”. Try a different name or symbol.
              </p>
            )}
          </div>
          <p className="sr-only" role="status">
            {visible.length} {visible.length === 1 ? "coin" : "coins"} shown
          </p>
        </section>
      </main>

      <footer className="border-t border-line/80">
        <div className="mx-auto w-full max-w-[1200px] px-4 py-6 text-center text-sm text-slate-400 sm:px-6">
          Independent Portfolio Demo — by Qamra Ariva.
        </div>
      </footer>
    </>
  );
}
