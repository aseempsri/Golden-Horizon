import type { EstateInputs } from '../types/estate';
import { DEFAULT_INPUTS } from '../constants';

export const ESTATE_PAGE = {
  name: 'Estate Sovereign',
  tagline: 'Lifestyle & Income Sovereignty',
  description:
    'Model your inflation-proof passive income, three-bucket savings discipline, and full estate lifestyle — then find when salary becomes optional.',
} as const;

export const MERIDIAN_PAGE = {
  name: 'Freedom Meridian',
  tagline: 'Corpus Freedom Planner',
  description:
    'Discover when you can stop working forever. Plan inflation-proof withdrawals, liquid assets only, and what your nominee inherits — through age 90.',
} as const;

export const DEFAULT_ESTATE_INPUTS: EstateInputs = {
  currentAge: 45,
  totalNetWorth: 8_00_00_000,
  allocation: DEFAULT_INPUTS.allocation,
  rates: DEFAULT_INPUTS.rates,
  currentSalary: 5_00_000,
  preFreedomMonthlyExpense: 2_50_000,

  incomeInflationPct: 5,
  basePassiveIncomeMonthly: 2_75_000,

  bucketInflationOffsetPct: 15,
  bucketContingencyPct: 10,
  bucketBigTicketPct: 15,

  extendedFamilyTripsPerYear: 2,
  extendedFamilyTripCost: 6_00_000,
  nativeTripsPerYear: 4,
  nativeTripCost: 75_000,

  carReplacementCost: 50_00_000,
  carReplacementIntervalYears: 5,

  whiteGoodsCost: 5_00_000,
  whiteGoodsIntervalYears: 7,

  minorFurnishingAnnual: 1_00_000,
  majorFurnishingCost: 15_00_000,
  majorFurnishingIntervalYears: 7,

  driverMonthly: 25_000,
  cookMonthly: 20_000,
  cleaningMonthly: 15_000,
  estateManagerMonthly: 40_000,

  gadgetsAnnual: 1_50_000,

  houseOwned: false,
  housePurchaseCost: 5_00_00_000,
  houseMaintenanceMonthly: 35_000,
};
