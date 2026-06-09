import type { PortfolioAllocation, PortfolioRates } from '../types';

export interface EstateInputs {
  currentAge: number;
  totalNetWorth: number;
  allocation: PortfolioAllocation;
  rates: PortfolioRates;
  currentSalary: number;
  preFreedomMonthlyExpense: number;

  incomeInflationPct: number;
  basePassiveIncomeMonthly: number;

  bucketInflationOffsetPct: number;
  bucketContingencyPct: number;
  bucketBigTicketPct: number;

  extendedFamilyTripsPerYear: number;
  extendedFamilyTripCost: number;
  nativeTripsPerYear: number;
  nativeTripCost: number;

  carReplacementCost: number;
  carReplacementIntervalYears: number;

  whiteGoodsCost: number;
  whiteGoodsIntervalYears: number;

  minorFurnishingAnnual: number;
  majorFurnishingCost: number;
  majorFurnishingIntervalYears: number;

  driverMonthly: number;
  cookMonthly: number;
  cleaningMonthly: number;
  estateManagerMonthly: number;

  gadgetsAnnual: number;

  houseOwned: boolean;
  housePurchaseCost: number;
  houseMaintenanceMonthly: number;
}

export interface LifestyleBreakdown {
  staffMonthly: number;
  houseMaintenanceMonthly: number;
  annualLifestyleLumps: number;
  bucketMonthly: number;
  grossMonthlyNeed: number;
  netMonthlyDrain: number;
  passiveIncomeTarget: number;
  totalAnnualOutflow: number;
}

export interface EstateYearSnapshot {
  age: number;
  portfolio: number;
  monthlyLifestyle: number;
  bucketReinvest: number;
  isFree: boolean;
  event?: string;
}

export interface EstateResult {
  freedomAge: number | null;
  canBeFreeNow: boolean;
  breakdown: LifestyleBreakdown;
  snapshots: EstateYearSnapshot[];
  weightedReturnPct: number;
  atAge90: { portfolio: number } | null;
  nomineeLegacy: number;
  message?: string;
}
