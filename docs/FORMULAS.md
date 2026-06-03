# Golden Horizon — Formula Reference

This document describes every formula used in the **Golden Horizon** retirement planner. Variable names match the fields in `src/lib/calculator.ts` and `src/types.ts`.

---

## Variable glossary

| Symbol / name | Code field | Meaning |
|---------------|------------|---------|
| \(A\) | `currentAge` | Your age today (minimum 45) |
| \(A_{ret}\) | `retirementAge` | Age when work income stops (computed by the app) |
| \(A_{end}\) | `PLAN_TO_AGE` (= 90) | Last age in the plan |
| \(P\) | `portfolio` | Liquid corpus (₹) at a point in time |
| \(P_0\) | `totalNetWorth` | Starting liquid net worth |
| \(w_i\) | `allocation[key]` | Percentage of corpus in instrument \(i\) (FD, savings, stocks, equity MF, debt MF) |
| \(r_i\) | `rates[key]` | Expected annual return (%) for instrument \(i\) |
| \(R_{annual}\) | `weightedReturnPct` | Blended annual portfolio return (%) |
| \(r_m\) | `monthlyReturn` | Monthly growth rate applied to corpus |
| \(f_{annual}\) | `inflationPct` | Annual inflation on retirement withdrawals (%) |
| \(f_m\) | `inflationMonthly` | Monthly inflation factor on withdrawals |
| \(g_{annual}\) | `rentalIncrementPct` | Annual rent increase (%) when living in rental |
| \(g_m\) | `rentalMonthlyGrowth` | Monthly rent growth factor |
| \(W\) | `monthlyWithdrawal` | Retirement draw (₹/month); grows with inflation |
| \(R_{rent}\) | `monthlyRent` | Rent paid from corpus (₹/month); 0 if own house |
| \(S\) | `currentSalary` | Monthly salary while working |
| \(E\) | `monthlyExpense` | Monthly living expense while working |
| \(C_{maint}\) | `carMaintenanceMonthly` | Maintenance cost per car per month |
| \(N_{cars}\) | `carsOwned` | Number of cars currently owned (0–3) |
| \(N_{future}\) | `futureCarsToBuy` | Number of future cars to buy (0–3) |
| \(C_1, A_1\) | `car1Cost`, `car1Age` | Lump-sum cost and purchase age for future car 1 |
| \(C_2, A_2\) | `car2Cost`, `car2Age` | Lump-sum cost and purchase age for future car 2 |
| \(T_{base}\) | `bigTravelBaseCost` | First big-travel lump sum (default ₹10L) |
| \(\delta_T\) | `bigTravelCostYoYPct` | Annual cost escalation on big travel (default 10%) |
| \(\Delta\) | `travelIntervalYears` | Years between big trips (default 3) |
| \(W_T\) | `travelWindowYears` | Years from retirement to schedule auto trips (default 25) |
| \(N_{max}\) | `maxBigTravels` | Maximum big trips in the window (default 10) |
| \(A_{travel}\) | `travelStopAutoAtAge` | No auto big trips from this age (default 70) |

---

## Instrument keys (used in allocation formulas)

| Key | Label | Typical \(r_i\) range (%) |
|-----|-------|-----------------------------|
| `fd` | Fixed Deposit | 6–8 |
| `savings` | Savings Account | 3–4 |
| `equityStocks` | Equity Stocks | 10–14 |
| `equityMf` | Equity Mutual Funds | 10–16 |
| `debtMf` | Debt Mutual Funds | 6–8 |

---

## Formula reference

| # | Name | Formula | Description |
|---|------|---------|-------------|
| 1 | **Allocation total** | \(\displaystyle \sum_{i} w_i = w_{fd} + w_{savings} + w_{stocks} + w_{equityMf} + w_{debtMf}\) | Sum of allocation percentages across all instruments. The UI requires this to equal approximately 100% before calculation. |
| 2 | **Weighted annual return** | \(\displaystyle R_{annual} = \sum_{i} \frac{w_i}{100} \times r_i\) | Expected portfolio return based on your mix of instruments and their chosen return rates. |
| 3 | **Monthly return rate** | \(\displaystyle r_m = (1 + R_{annual}/100)^{1/12} - 1\) | Converts the blended annual return into an equivalent monthly compounding rate. |
| 4 | **Monthly inflation rate** | \(\displaystyle f_m = (1 + f_{annual}/100)^{1/12} - 1\) | Converts annual withdrawal inflation into a monthly compounding factor. |
| 5 | **Monthly rent growth rate** | \(\displaystyle g_m = (1 + g_{annual}/100)^{1/12} - 1\) | Used only when `housingType === 'rental'`. If you own your house, rent is 0 and this formula is not applied. |
| 6 | **Car maintenance (working years)** | \(\displaystyle M_{cars} = N_{cars} \times C_{maint}\) | Fixed monthly outflow deducted from salary surplus while you are still working. |
| 7 | **Future car lump-sum** | At age \(a\): if \(N_{future} \ge 1\) and \(a = A_1\), add \(C_1\); if \(N_{future} \ge 2\) and \(a = A_2\), add \(C_2\) | One-time deduction from \(P\) at the start of that calendar year (before the monthly loop runs). |
| 7b | **Big travel lump-sum** | Trip at years \(t = 0, \Delta, 2\Delta, \ldots\) from \(A_{ret}\): cost \(T_{base} \times (1 + \delta_T/100)^t\); while \(t < W_T\), trip count \(\le N_{max}\), and \(A_{ret} + t < A_{travel}\) | Deducted once per scheduled year after retirement only. Short trips are excluded. After age \(A_{travel}\), travel is not auto-deducted. |
| 8 | **Monthly corpus growth** | \(\displaystyle P \leftarrow P \times (1 + r_m)\) | Applied every month to the entire liquid portfolio. |
| 9 | **Working-year surplus** | \(\displaystyle \text{surplus} = S - E - R_{rent} - M_{cars}\) | Amount added to the corpus each month while age \(a < A_{ret}\). No salary is included after retirement. |
| 10 | **Working-year portfolio update** | \(\displaystyle P \leftarrow P + \text{surplus}\) | Applied after monthly growth (formula 8) during working years. |
| 11 | **Retired-month outflows** | \(\displaystyle P \leftarrow P - W - R_{rent}\) | Withdrawal and rent are deducted each month after retirement. Rent is skipped when you own your house. |
| 12 | **Withdrawal inflation (monthly)** | \(\displaystyle W \leftarrow W \times (1 + f_m)\) | Applied at the end of each retired month. Twelve steps approximate \(f_{annual}\)% growth per calendar year. |
| 13 | **Rent inflation (monthly)** | \(\displaystyle R_{rent} \leftarrow R_{rent} \times (1 + g_m)\) | Applied only when `housingType === 'rental'`. Twelve steps approximate \(g_{annual}\)% growth per year. |
| 14 | **Year-1 withdrawal (input)** | \(W_0 =\) `monthlyWithdrawal` | The first month of retirement uses the withdrawal amount you enter in the UI. |
| 15 | **Year-2 withdrawal (approximate)** | \(W_{year2} \approx W_0 \times (1 + f_{annual}/100)\) | After 12 monthly inflation steps: \((1 + f_m)^{12} = 1 + f_{annual}/100\). |
| 16 | **Year-3 withdrawal (approximate)** | \(W_{year3} \approx W_0 \times (1 + f_{annual}/100)^2\) | Inflation on withdrawals compounds each calendar year of retirement. |
| 17 | **Displayed withdrawal (year snapshot)** | \(\displaystyle W_{display} = \dfrac{W_{end\,of\,year}}{(1 + f_m)^{12}}\) | Shown in results as the representative monthly withdrawal for that age year. Undoes the last 12 months of compounding for display purposes. |
| 18 | **Feasibility flag** | `feasible = false` if \(P < 0\) at any month | The plan is infeasible if the corpus ever goes negative. |
| 19 | **Retirement age search** | Smallest \(A_{ret}\) from \(\max(45, A)\) to 89 such that the simulation to \(A_{end} = 90\) remains feasible and \(P \ge 0\) at the end | The first feasible age is reported as the earliest full retirement age. |
| 20 | **Can retire now** | `canRetireNow` is true when \(A_{ret} = A\) | True if the earliest feasible retirement age equals your current age. |
| 21 | **Corpus at age 90** | \(P_{90}\) = `portfolio` in the snapshot where `age === 90` | Liquid assets remaining at the end of the plan. |
| 22 | **Withdrawal at age 90** | \(W_{90}\) = `monthlyWithdrawal` in that snapshot | Inflation-adjusted withdrawal rate at age 90 (display-adjusted per formula 17). |
| 23 | **Nominee / successor legacy** | \(\text{nomineeLegacy} = P_{90}\) | Remaining liquid wealth passed to your nominee or legal successor. In a feasible plan this equals the corpus at age 90. |
| 24 | **Non-feasible plan handling** | \(A_{ret} = \text{null}\); simulation still runs with \(A_{ret} = 90\) for the chart | When no early retirement works, the app still shows the projected path using age 90 as the retirement age. |

---

## Monthly simulation loop

For each age \(a\) from `currentAge` (\(A\)) to `PLAN_TO_AGE` (\(A_{end} = 90\)), and for each month \(m = 1 \ldots 12\):

```
1. If a lump-sum car purchase occurs at this age → P = P − car cost
1b. If retired and a scheduled big travel occurs at this age → P = P − travel cost
2. P = P × (1 + r_m)                         // investment growth on full corpus
3. If retired (a ≥ A_ret):
       P = P − W − R_rent (if rental)
       W = W × (1 + f_m)
       R_rent = R_rent × (1 + g_m)            // only if housingType === 'rental'
   Else (still working):
       P = P + (S − E − R_rent − M_cars)
4. If P < 0 → mark plan as infeasible
```

At the end of each calendar year, a snapshot is stored with:

- `portfolio` = max(0, P)
- `monthlyWithdrawal` = display-adjusted withdrawal (formula 17)
- `monthlyRent` = current rent amount
- `isRetired` = whether \(a \ge A_{ret}\)

---

## Worked example — inflation-adjusted withdrawals

If `monthlyWithdrawal` \(W_0 = ₹2{,}00{,}000\) and `inflationPct` \(f_{annual} = 6\%\):

| Retirement year | Approximate average monthly draw |
|-----------------|----------------------------------|
| Year 1 | ₹2.00 L |
| Year 2 | ₹2.00 L × 1.06 ≈ ₹2.12 L |
| Year 3 | ₹2.00 L × 1.06² ≈ ₹2.25 L |

The app uses monthly compounding via \(f_m\) rather than a single annual step mid-year, so exact values may differ slightly from the rounded figures above.

---

## Assumptions and exclusions

The following are **not** included in any formula:

| Excluded item | Notes |
|---------------|-------|
| Rental **income** | Not modeled |
| Pension | Not modeled |
| Business income | Not modeled |
| Non-liquid assets (e.g. owned house value) | Only liquid `totalNetWorth` is used |
| Salary after \(A_{ret}\) | Complete retirement means zero work income |
| House price appreciation | Own house = no rent line in the simulation |
| Short / leisure travel | Self-funded; not in corpus |
| Big travel after age 70 | Customer choice; not auto-deducted in v1 |

---

## Source files

| File | Role |
|------|------|
| `src/lib/calculator.ts` | Core simulation and retirement-age search |
| `src/lib/travelPlan.ts` | Big-travel schedule builder |
| `src/types.ts` | Input and result type definitions |
| `src/constants.ts` | Default values, instrument config, `MIN_AGE` (45), `PLAN_TO_AGE` (90) |
