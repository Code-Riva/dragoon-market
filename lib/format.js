const compact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 2,
});

export function formatPrice(value) {
  const digits = value >= 100 ? 2 : value >= 1 ? 2 : 4;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatCompactUsd(value) {
  return compact.format(value);
}

// Shortened for axis labels: "$68k", "$3.5k", "$582", "$0.54"
export function formatAxisPrice(value) {
  if (value == null || Number.isNaN(value)) return "";
  if (value >= 1e6) {
    const v = value / 1e6;
    const formatted = v >= 10 ? v.toFixed(1) : v.toFixed(2);
    return "$" + formatted.replace(/\.?0+$/, "") + "M";
  }
  if (value >= 1e3) {
    const v = value / 1e3;
    const formatted = v >= 100 ? v.toFixed(0) : v >= 10 ? v.toFixed(1) : v.toFixed(2);
    return "$" + formatted.replace(/\.?0+$/, "") + "k";
  }
  if (value >= 100) {
    return "$" + Math.round(value);
  }
  if (value >= 10) {
    return "$" + Number(value.toFixed(1));
  }
  return "$" + Number(value.toFixed(4));
}

// Always signed: "+1.84%", "-0.92%", "0.00%".
export function formatChange(value) {
  const rounded = Math.round(value * 100) / 100;
  const sign = rounded > 0 ? "+" : rounded < 0 ? "-" : "";
  return `${sign}${Math.abs(rounded).toFixed(2)}%`;
}

export function changeTone(value) {
  const rounded = Math.round(value * 100) / 100;
  if (rounded > 0) return "text-emerald-400";
  if (rounded < 0) return "text-red-400";
  return "text-slate-300";
}

export function formatDate(ms, options = { day: "numeric", month: "short" }) {
  return new Intl.DateTimeFormat("en-GB", { ...options, timeZone: "UTC" }).format(ms);
}

export function formatPeriodLabel(series, days) {
  if (!series || series.length === 0) {
    return `${days} days, daily closes`;
  }
  const start = formatDate(series[0].time, { day: "numeric", month: "short" });
  const end = formatDate(series[series.length - 1].time, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  return `${days} days, daily closes (${start} – ${end})`;
}

export function formatTimestamp(iso) {
  return (
    new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    }).format(new Date(iso)) + " UTC"
  );
}
