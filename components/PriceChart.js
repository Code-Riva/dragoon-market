"use client";

import { useSyncExternalStore } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatAxisPrice, formatDate, formatPrice } from "@/lib/format";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(cb) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", cb);
  return () => mql.removeEventListener("change", cb);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => true,
  );
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-md border border-line bg-black/90 px-3 py-2 text-xs shadow-lg">
      <p className="text-slate-400">{formatDate(point.time, { day: "numeric", month: "short", year: "numeric" })}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-100">{formatPrice(point.price)}</p>
    </div>
  );
}

export default function PriceChart({ coin, series }) {
  const reduceMotion = usePrefersReducedMotion();
  const gradientId = "price-fill";
  const data = series ?? coin.series;
  const prices = data.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const pad = (max - min) * 0.1 || max * 0.001;

  return (
    <div className="h-60 w-full sm:h-72 lg:h-72">
      <ResponsiveContainer width="100%" height="100%" initialDimension={{ width: 800, height: 288 }}>
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#16203a" vertical={false} />
          <XAxis
            dataKey="time"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(t) => formatDate(t)}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "#16203a" }}
            minTickGap={28}
          />
          <YAxis
            domain={[min - pad, max + pad]}
            tickFormatter={(v) => formatAxisPrice(v)}
            tick={{ fill: "#94a3b8", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={54}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#334155" }} />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#60a5fa"
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: "#60a5fa", stroke: "#000" }}
            isAnimationActive={!reduceMotion}
            animationDuration={600}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
