# Golden Horizon

**Retirement Freedom Planner** — an interactive React app that estimates when you can fully retire (age 45+) using only liquid assets, with projections through age 90.

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Live site (GitHub Pages)

After pushing to `main`, GitHub Actions deploys automatically.

**URL:** [https://aseempsri.github.io/Golden-Horizon/](https://aseempsri.github.io/Golden-Horizon/)

Enable Pages once in repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## What it models

- Portfolio split across FD, savings, equity stocks, equity MF, and debt MF (custom return % per instrument)
- Pre-retirement: salary surplus added to corpus; post-retirement: inflation-adjusted monthly withdrawals
- Own home vs rental (10% annual rent increase by default)
- Current and future car purchases with lump-sum costs at chosen ages
- Big travel plan: up to 10 trips every 3 years for 25 years from retirement (₹10L start, +10% per year from retirement), auto-stops at age 70; short trips excluded
- Nominee legacy (remaining liquid wealth at age 90)

**Excluded:** rental income, pension, business income, and non-liquid assets.

## Formula reference

See [docs/FORMULAS.md](docs/FORMULAS.md) for a full list of variables, formulas, the monthly simulation loop, and assumptions.
