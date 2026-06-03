import type { InstrumentConfig } from './types';

export const APP_NAME = 'Golden Horizon';
export const APP_TAGLINE = 'Retirement Freedom Planner';
export const MIN_AGE = 45;
export const PLAN_TO_AGE = 90;

/** Big-travel plan defaults (v1) */
export const TRAVEL_INTERVAL_YEARS = 3;
export const TRAVEL_WINDOW_YEARS = 25;
export const MAX_BIG_TRAVELS = 10;
export const BIG_TRAVEL_BASE_COST = 10_00_000;
export const BIG_TRAVEL_COST_YOY_PCT = 10;
export const TRAVEL_STOP_AUTO_AT_AGE = 70;

export const INSTRUMENTS: InstrumentConfig[] = [
  {
    key: 'fd',
    label: 'Fixed Deposit',
    shortLabel: 'FD',
    minRate: 6,
    maxRate: 8,
    defaultRate: 7,
    color: '#f59e0b',
  },
  {
    key: 'savings',
    label: 'Savings Account',
    shortLabel: 'Savings',
    minRate: 3,
    maxRate: 4,
    defaultRate: 3.5,
    color: '#38bdf8',
  },
  {
    key: 'equityStocks',
    label: 'Equity Stocks',
    shortLabel: 'Stocks',
    minRate: 10,
    maxRate: 14,
    defaultRate: 12,
    color: '#34d399',
  },
  {
    key: 'equityMf',
    label: 'Equity Mutual Funds',
    shortLabel: 'Equity MF',
    minRate: 10,
    maxRate: 16,
    defaultRate: 13,
    color: '#a78bfa',
  },
  {
    key: 'debtMf',
    label: 'Debt Mutual Funds',
    shortLabel: 'Debt MF',
    minRate: 6,
    maxRate: 8,
    defaultRate: 7,
    color: '#fb7185',
  },
];

export const DEFAULT_INPUTS = {
  currentAge: 45,
  totalNetWorth: 5_00_00_000,
  allocation: { fd: 20, savings: 10, equityStocks: 25, equityMf: 35, debtMf: 10 },
  rates: { fd: 7, savings: 3.5, equityStocks: 12, equityMf: 13, debtMf: 7 },
  housingType: 'own' as const,
  monthlyRent: 80_000,
  rentalIncrementPct: 10,
  carsOwned: 1,
  futureCarsToBuy: 0,
  car1Cost: 30_00_000,
  car1Age: 50,
  car2Cost: 50_00_000,
  car2Age: 60,
  currentSalary: 3_60_000,
  monthlyExpense: 2_00_000,
  monthlyWithdrawal: 2_00_000,
  inflationPct: 6,
  carMaintenanceMonthly: 20_000,
  enableTravelPlan: true,
  travelIntervalYears: TRAVEL_INTERVAL_YEARS,
  travelWindowYears: TRAVEL_WINDOW_YEARS,
  maxBigTravels: MAX_BIG_TRAVELS,
  bigTravelBaseCost: BIG_TRAVEL_BASE_COST,
  bigTravelCostYoYPct: BIG_TRAVEL_COST_YOY_PCT,
  travelStopAutoAtAge: TRAVEL_STOP_AUTO_AT_AGE,
};
