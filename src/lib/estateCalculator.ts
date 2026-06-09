import { MIN_AGE, PLAN_TO_AGE } from '../constants';
import { getWeightedReturn } from './calculator';
import type {
  EstateInputs,
  EstateResult,
  EstateYearSnapshot,
  LifestyleBreakdown,
} from '../types/estate';

function inflationFactor(years: number, pct: number): number {
  return Math.pow(1 + pct / 100, years);
}

export function computeLifestyleBreakdown(inputs: EstateInputs): LifestyleBreakdown {
  const staffMonthly =
    inputs.driverMonthly +
    inputs.cookMonthly +
    inputs.cleaningMonthly +
    inputs.estateManagerMonthly;

  const annualLifestyleLumps =
    inputs.extendedFamilyTripsPerYear * inputs.extendedFamilyTripCost +
    inputs.nativeTripsPerYear * inputs.nativeTripCost +
    inputs.minorFurnishingAnnual +
    inputs.gadgetsAnnual +
    inputs.carReplacementCost / inputs.carReplacementIntervalYears +
    inputs.whiteGoodsCost / inputs.whiteGoodsIntervalYears +
    inputs.majorFurnishingCost / inputs.majorFurnishingIntervalYears;

  const bucketPct =
    inputs.bucketInflationOffsetPct +
    inputs.bucketContingencyPct +
    inputs.bucketBigTicketPct;

  const bucketMonthly = inputs.basePassiveIncomeMonthly * (bucketPct / 100);
  const monthlyRecurring = staffMonthly + inputs.houseMaintenanceMonthly;
  const grossMonthlyNeed = monthlyRecurring + annualLifestyleLumps / 12 + bucketMonthly;
  const netMonthlyDrain = monthlyRecurring + annualLifestyleLumps / 12;
  const totalAnnualOutflow = netMonthlyDrain * 12 + annualLifestyleLumps;

  return {
    staffMonthly,
    houseMaintenanceMonthly: inputs.houseMaintenanceMonthly,
    annualLifestyleLumps,
    bucketMonthly,
    grossMonthlyNeed,
    netMonthlyDrain,
    passiveIncomeTarget: inputs.basePassiveIncomeMonthly,
    totalAnnualOutflow,
  };
}

function getYearLumpSums(
  inputs: EstateInputs,
  yearsSinceFreedom: number,
  isFirstFreedomYear: boolean,
): { total: number; events: string[] } {
  if (yearsSinceFreedom < 0) return { total: 0, events: [] };

  const factor = inflationFactor(yearsSinceFreedom, inputs.incomeInflationPct);
  const events: string[] = [];
  let total = 0;

  const add = (amount: number, label: string) => {
    total += amount;
    events.push(label);
  };

  add(
    (inputs.extendedFamilyTripsPerYear * inputs.extendedFamilyTripCost +
      inputs.nativeTripsPerYear * inputs.nativeTripCost +
      inputs.minorFurnishingAnnual +
      inputs.gadgetsAnnual) *
      factor,
    'Annual lifestyle (holidays, native, Diwali, gadgets)',
  );

  if (
    yearsSinceFreedom > 0 &&
    yearsSinceFreedom % inputs.carReplacementIntervalYears === 0
  ) {
    add(
      inputs.carReplacementCost * factor,
      `Car replacement (every ${inputs.carReplacementIntervalYears} yrs)`,
    );
  }

  if (
    yearsSinceFreedom > 0 &&
    yearsSinceFreedom % inputs.whiteGoodsIntervalYears === 0
  ) {
    add(
      inputs.whiteGoodsCost * factor,
      `White goods (every ${inputs.whiteGoodsIntervalYears} yrs)`,
    );
  }

  if (
    yearsSinceFreedom > 0 &&
    yearsSinceFreedom % inputs.majorFurnishingIntervalYears === 0
  ) {
    add(
      inputs.majorFurnishingCost * factor,
      `Major furnishing (every ${inputs.majorFurnishingIntervalYears} yrs)`,
    );
  }

  if (isFirstFreedomYear && !inputs.houseOwned) {
    add(inputs.housePurchaseCost, 'Independent house + outhouse');
  }

  return { total, events };
}

function simulateToFreedom(
  inputs: EstateInputs,
  freedomAge: number,
): { feasible: boolean; snapshots: EstateYearSnapshot[] } {
  const annualReturn = getWeightedReturn(inputs.allocation, inputs.rates) / 100;
  const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;
  let portfolio = inputs.totalNetWorth;
  const snapshots: EstateYearSnapshot[] = [];
  let feasible = true;

  for (let age = inputs.currentAge; age <= PLAN_TO_AGE; age++) {
    const isFree = age >= freedomAge;
    const yearsSinceFreedom = isFree ? age - freedomAge : -1;
    const factor = isFree
      ? inflationFactor(yearsSinceFreedom, inputs.incomeInflationPct)
      : 1;

    let yearEvent: string | undefined;
    if (isFree && age === freedomAge) {
      yearEvent = 'Salary ends — estate lifestyle begins';
    }

    const staffMonthly =
      (inputs.driverMonthly +
        inputs.cookMonthly +
        inputs.cleaningMonthly +
        inputs.estateManagerMonthly) *
      factor;
    const houseMaint = inputs.houseMaintenanceMonthly * factor;
    const monthlyLifestyle = staffMonthly + houseMaint;

    const bucketPct =
      inputs.bucketInflationOffsetPct +
      inputs.bucketContingencyPct +
      inputs.bucketBigTicketPct;
    const bucketReinvest =
      inputs.basePassiveIncomeMonthly * (bucketPct / 100) * factor;

    if (isFree) {
      const lumps = getYearLumpSums(
        inputs,
        yearsSinceFreedom,
        age === freedomAge,
      );
      if (lumps.total > 0) {
        portfolio -= lumps.total;
        yearEvent = yearEvent
          ? `${yearEvent}; ${lumps.events.join('; ')}`
          : lumps.events.join('; ');
        if (portfolio < 0) feasible = false;
      }
    }

    for (let month = 0; month < 12; month++) {
      portfolio *= 1 + monthlyReturn;

      if (isFree) {
        portfolio -= monthlyLifestyle;
      } else {
        portfolio += inputs.currentSalary - inputs.preFreedomMonthlyExpense;
      }

      if (portfolio < 0) feasible = false;
    }

    snapshots.push({
      age,
      portfolio: Math.max(0, portfolio),
      monthlyLifestyle,
      bucketReinvest,
      isFree,
      event: yearEvent,
    });
  }

  return { feasible, snapshots };
}

export function findFreedomAge(inputs: EstateInputs): EstateResult {
  const weightedReturnPct = getWeightedReturn(inputs.allocation, inputs.rates);
  const breakdown = computeLifestyleBreakdown(inputs);
  const startAge = Math.max(MIN_AGE, inputs.currentAge);

  let freedomAge: number | null = null;
  let bestSnapshots: EstateYearSnapshot[] = [];

  for (let candidate = startAge; candidate <= PLAN_TO_AGE - 1; candidate++) {
    const { feasible, snapshots } = simulateToFreedom(inputs, candidate);
    if (feasible && snapshots[snapshots.length - 1]?.portfolio >= 0) {
      freedomAge = candidate;
      bestSnapshots = snapshots;
      break;
    }
  }

  if (freedomAge === null) {
    const { snapshots } = simulateToFreedom(inputs, PLAN_TO_AGE);
    const at90 = snapshots.find((s) => s.age === PLAN_TO_AGE);
    return {
      freedomAge: null,
      canBeFreeNow: false,
      breakdown,
      snapshots,
      weightedReturnPct,
      atAge90: at90 ? { portfolio: at90.portfolio } : null,
      nomineeLegacy: at90?.portfolio ?? 0,
      message:
        'With this estate lifestyle, liquid assets may not sustain until age 90. Consider a later freedom age, higher corpus, or adjusting lifestyle inputs.',
    };
  }

  const at90 = bestSnapshots.find((s) => s.age === PLAN_TO_AGE);
  return {
    freedomAge,
    canBeFreeNow: freedomAge === inputs.currentAge,
    breakdown,
    snapshots: bestSnapshots,
    weightedReturnPct,
    atAge90: at90 ? { portfolio: at90.portfolio } : null,
    nomineeLegacy: at90?.portfolio ?? 0,
  };
}
