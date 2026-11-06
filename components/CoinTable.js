"use client";

import { changeTone, formatChange, formatCompactUsd, formatPrice } from "@/lib/format";

const COLUMNS = [
  { key: "name", label: "Coin", align: "left" },
  { key: "price", label: "Price", align: "right" },
  { key: "change24h", label: "24h change", align: "right" },
  { key: "marketCap", label: "Market cap", align: "right" },
  { key: "volume24h", label: "24h volume", align: "right" },
];

function SortHeader({ column, sort, onSort }) {
  const active = sort.key === column.key;
  const ariaSort = active ? (sort.dir === "asc" ? "ascending" : "descending") : "none";
  const right = column.align === "right";
  return (
    <th scope="col" aria-sort={ariaSort} className={`px-4 py-3 font-medium ${right ? "text-right" : "text-left"}`}>
      <button
        type="button"
        onClick={() => onSort(column.key)}
        className={`inline-flex items-center gap-1 rounded px-1 py-0.5 text-xs uppercase tracking-wide transition-colors hover:text-slate-100 ${
          active ? "text-blue-300" : "text-slate-400"
        } ${right ? "flex-row-reverse" : ""}`}
      >
        {column.label}
        <span aria-hidden="true" className="w-3 text-center">
          {active ? (sort.dir === "asc" ? "▲" : "▼") : ""}
        </span>
      </button>
    </th>
  );
}

export default function CoinTable({
  coins,
  selectedId,
  onSelect,
  sort,
  onSort,
  watchlist = [],
  onToggleWatchlist,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <caption className="sr-only">
          Cryptocurrency market data. Select a coin name to show it in the chart above, or click the star to toggle its watchlist status.
        </caption>
        <thead className="border-b border-line">
          <tr>
            {COLUMNS.map((c) => (
              <SortHeader key={c.key} column={c} sort={sort} onSort={onSort} />
            ))}
          </tr>
        </thead>
        <tbody>
          {coins.map((coin) => {
            const selected = coin.id === selectedId;
            const isStarred = watchlist.includes(coin.id);

            return (
              <tr
                key={coin.id}
                onClick={() => onSelect(coin.id)}
                className={`cursor-pointer border-b border-line/60 transition-colors last:border-0 hover:bg-blue-500/5 ${
                  selected ? "bg-blue-500/10" : ""
                }`}
              >
                <th scope="row" className="px-4 py-3 text-left font-normal">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onToggleWatchlist) {
                          onToggleWatchlist(coin.id);
                        }
                      }}
                      aria-pressed={isStarred}
                      aria-label={
                        isStarred
                          ? `Remove ${coin.name} (${coin.symbol}) from watchlist`
                          : `Add ${coin.name} (${coin.symbol}) to watchlist`
                      }
                      className={`-ml-1 rounded p-1 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-400 ${
                        isStarred
                          ? "text-blue-400 hover:text-blue-300"
                          : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={isStarred ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(coin.id);
                      }}
                      aria-pressed={selected}
                      aria-label={`Show ${coin.name} chart`}
                      className="flex items-center gap-2 rounded text-left"
                    >
                      <span className="font-medium text-slate-100">{coin.name}</span>
                      <span className="text-xs text-slate-400">{coin.symbol}</span>
                    </button>
                  </div>
                </th>
                <td className="px-4 py-3 text-right tabular-nums text-slate-100">{formatPrice(coin.price)}</td>
                <td className={`px-4 py-3 text-right tabular-nums ${changeTone(coin.change24h)}`}>
                  {formatChange(coin.change24h)}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-300">{formatCompactUsd(coin.marketCap)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-300">{formatCompactUsd(coin.volume24h)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
