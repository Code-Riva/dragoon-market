// Shared sample dataset for the visual foundation. Not real market data.
// Every coin's displayed price and 24h change are derived from its own series,
// so the table, selected-coin panel and chart always agree.

export const SAMPLE_AS_OF = "2026-10-31T12:00:00Z";
export const SERIES_DAYS = 30;
export const SERIES_PERIOD_LABEL = "30 days, daily closes to 31 Oct 2026";

export const PERIOD_OPTIONS = [
  { key: "7D", label: "7D", days: 7 },
  { key: "14D", label: "14D", days: 14 },
  { key: "30D", label: "30D", days: 30 },
];

const DAY_MS = 24 * 60 * 60 * 1000;

const RAW_COINS = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", price: 68420.35, change24h: 1.84, marketCap: 1352e9, volume24h: 28.4e9, volatility: 0.018 },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", price: 3512.8, change24h: -0.92, marketCap: 422e9, volume24h: 14.1e9, volatility: 0.024 },
  { id: "tether", name: "Tether", symbol: "USDT", price: 1.0, change24h: 0.01, marketCap: 118e9, volume24h: 46.7e9, volatility: 0.0004 },
  { id: "bnb", name: "BNB", symbol: "BNB", price: 582.14, change24h: 0.63, marketCap: 85.9e9, volume24h: 1.9e9, volatility: 0.02 },
  { id: "solana", name: "Solana", symbol: "SOL", price: 164.72, change24h: 3.41, marketCap: 76.2e9, volume24h: 3.6e9, volatility: 0.035 },
  { id: "usd-coin", name: "USD Coin", symbol: "USDC", price: 1.0, change24h: -0.02, marketCap: 34.5e9, volume24h: 5.2e9, volatility: 0.0004 },
  { id: "xrp", name: "XRP", symbol: "XRP", price: 0.5421, change24h: -2.15, marketCap: 30.1e9, volume24h: 1.4e9, volatility: 0.03 },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE", price: 0.1387, change24h: 5.27, marketCap: 20.0e9, volume24h: 1.8e9, volatility: 0.045 },
  { id: "cardano", name: "Cardano", symbol: "ADA", price: 0.4562, change24h: -1.36, marketCap: 16.3e9, volume24h: 0.42e9, volatility: 0.03 },
  { id: "avalanche", name: "Avalanche", symbol: "AVAX", price: 34.91, change24h: 2.08, marketCap: 13.7e9, volume24h: 0.58e9, volatility: 0.035 },
];

// Small deterministic PRNG so the series are identical on server and client.
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildSeries(coin, index) {
  const rand = mulberry32(1000 + index * 97);
  const asOf = new Date(SAMPLE_AS_OF).getTime();
  const prevPrice = coin.price / (1 + coin.change24h / 100);

  // Random walk over the first SERIES_DAYS - 1 points, rescaled so the
  // second-to-last close equals the price implied by the 24h change.
  const walk = [1];
  for (let i = 1; i < SERIES_DAYS - 1; i += 1) {
    walk.push(walk[i - 1] * (1 + (rand() - 0.5) * 2 * coin.volatility));
  }
  const scale = prevPrice / walk[walk.length - 1];
  const closes = walk.map((v) => v * scale);
  closes.push(coin.price);

  return closes.map((close, i) => ({
    time: asOf - (SERIES_DAYS - 1 - i) * DAY_MS,
    price: close,
  }));
}

export const COINS = RAW_COINS.map((coin, index) => ({
  ...coin,
  rank: index + 1,
  series: buildSeries(coin, index),
}));
