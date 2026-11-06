# Dragoon Market — Crypto Market Dashboard

An interactive, responsive cryptocurrency market overview and analytics dashboard built with **Next.js (App Router)**, **React 19**, **Tailwind CSS v4**, and **Recharts**.

> **Independent Portfolio Demo — by Qamra Ariva.**

---

## Overview

Dragoon Market provides a clean, focused interface for tracking cryptocurrency prices, volume, market capitalization, and historical price movements. The dashboard is designed with high visual fidelity, full responsiveness across mobile and desktop viewports, and accessible UI interactions.

### Key Features

- **Interactive Price Chart**: Smooth area chart visualizing historical daily closes with selectable timeframes (7D, 14D, and 30D), custom tooltips, formatted currency axes, and `prefers-reduced-motion` detection.
- **Sortable Market Table**: Dynamic column sorting for Coin Name, Price, 24h Change, Market Cap, and 24h Volume with ascending/descending indicators and ARIA sort attributes.
- **Instant Search**: Real-time filtering across coin names and ticker symbols with immediate empty-state feedback.
- **Persistent Watchlist**: Star favorite coins to maintain a dedicated Watchlist view. Watchlist state is persisted across browser sessions via `localStorage` with cross-tab synchronization and SSR-safe external store hydration (`useSyncExternalStore`).
- **Responsive & Accessible**: Optimized for mobile, tablet, and desktop viewports with horizontal table scroll, high-contrast dark theme, keyboard navigation, and semantic HTML landmarks.

---

## Data Sources

This release uses a self-contained, deterministic sample dataset ([`lib/sample-data.js`](lib/sample-data.js)) benchmarked as of **31 October 2026, 12:00 UTC**.

- **Consistency**: Every coin's current price, 24-hour percentage change, and historical chart series are mathematically derived and aligned.
- **Deterministic Generation**: Historical series are generated using a seeded PRNG (`mulberry32`), guaranteeing identical output across server-side rendering (SSR) and client hydration without layout shifts or hydration errors.
- **Pluggable Architecture**: The data layer is decoupled from UI components, making it straightforward to swap the sample data adapter with live REST or WebSocket feeds (e.g., CoinGecko, CoinMarketCap, or Binance API).

---

## Environment Variables

**No environment variables or API keys are required** to run or build this project. The application works out of the box with zero external configuration.

---

## Getting Started

### Prerequisites

- **Node.js**: v18.18.0 or newer (v20+ recommended)
- **npm** (or yarn, pnpm, bun)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/Code-Riva/dragoon-market.git
cd dragoon-market
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Linting

Run ESLint to check code quality:

```bash
npm run lint
```

### Production Build

Create an optimized production build:

```bash
npm run build
```

Start the production server locally:

```bash
npm run start
```

---

## Deployment to Vercel

Dragoon Market is optimized for deployment on [Vercel](https://vercel.com):

1. Import the repository `Code-Riva/dragoon-market` into Vercel.
2. Vercel automatically detects the **Next.js** framework preset.
3. Build Settings (defaults apply):
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build` (or `next build`)
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
4. **Environment Variables**: None required.
5. Click **Deploy**.

---

## License & Attribution

Independent Portfolio Demo created and maintained by **Qamra Ariva**.
All code is provided for portfolio demonstration purposes.
