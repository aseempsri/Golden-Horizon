export type HousingType = 'own' | 'rental';

export type InstrumentKey =
  | 'fd'
  | 'savings'
  | 'equityStocks'
  | 'equityMf'
  | 'debtMf';

export interface InstrumentConfig {
  key: InstrumentKey;
  label: string;
  shortLabel: string;
  minRate: number;
  maxRate: number;
  defaultRate: number;
  color: string;
}

export interface PortfolioAllocation {
  fd: number;
  savings: number;
  equityStocks: number;
  equityMf: number;
  debtMf: number;
}

export interface PortfolioRates {
  fd: number;
  savings: number;
  equityStocks: number;
  equityMf: number;
  debtMf: number;
}

export interface CalculatorInputs {
  currentAge: number;
  totalNetWorth: number;
  allocation: PortfolioAllocation;
  rates: PortfolioRates;
  housingType: HousingType;
  monthlyRent: number;
  rentalIncrementPct: number;
  carsOwned: number;
  futureCarsToBuy: number;
  car1Cost: number;
  car1Age: number;
  car2Cost: number;
  car2Age: number;
  currentSalary: number;
  monthlyExpense: number;
  monthlyWithdrawal: number;
  inflationPct: number;
  carMaintenanceMonthly: number;
}

export interface YearSnapshot {
  age: number;
  portfolio: number;
  monthlyWithdrawal: number;
  monthlyRent: number;
  isRetired: boolean;
  event?: string;
}

export interface SimulationResult {
  retirementAge: number | null;
  canRetireNow: boolean;
  snapshots: YearSnapshot[];
  atAge90: {
    portfolio: number;
    monthlyWithdrawal: number;
    monthlyRent: number;
  } | null;
  weightedReturnPct: number;
  nomineeLegacy: number;
  message?: string;
}
