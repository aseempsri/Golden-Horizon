import { MIN_AGE, PLAN_TO_AGE } from '../constants';
import {
  buildBigTravelSchedule,
  formatTravelCostLakhs,
  getBigTravelCostAtAge,
} from './travelPlan';
import type {
  CalculatorInputs,
  InstrumentKey,
  PortfolioAllocation,
  PortfolioRates,
  SimulationResult,
  YearSnapshot,
} from '../types';

const INSTRUMENT_KEYS: InstrumentKey[] = [
  'fd',
  'savings',
  'equityStocks',
  'equityMf',
  'debtMf',
];

export function getWeightedReturn(
  allocation: PortfolioAllocation,
  rates: PortfolioRates,
): number {
  let total = 0;
  for (const key of INSTRUMENT_KEYS) {
    total += (allocation[key] / 100) * rates[key];
  }
  return total;
}

export function allocationTotal(allocation: PortfolioAllocation): number {
  return INSTRUMENT_KEYS.reduce((sum, k) => sum + allocation[k], 0);
}

function getCarCostsAtAge(inputs: CalculatorInputs, age: number): number {
  let cost = 0;
  if (inputs.futureCarsToBuy >= 1 && age === inputs.car1Age) {
    cost += inputs.car1Cost;
  }
  if (inputs.futureCarsToBuy >= 2 && age === inputs.car2Age) {
    cost += inputs.car2Cost;
  }
  return cost;
}

function simulateToAge(
  inputs: CalculatorInputs,
  retirementAge: number,
): { feasible: boolean; snapshots: YearSnapshot[] } {
  const annualReturn = getWeightedReturn(inputs.allocation, inputs.rates) / 100;
  const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;
  const inflationMonthly = Math.pow(1 + inputs.inflationPct / 100, 1 / 12) - 1;
  const rentalMonthlyGrowth = Math.pow(1 + inputs.rentalIncrementPct / 100, 1 / 12) - 1;

  let portfolio = inputs.totalNetWorth;
  let monthlyWithdrawal = inputs.monthlyWithdrawal;
  let monthlyRent = inputs.housingType === 'rental' ? inputs.monthlyRent : 0;
  const carMaintenance =
    inputs.carsOwned * inputs.carMaintenanceMonthly;

  const snapshots: YearSnapshot[] = [];
  let feasible = true;
  let yearsInRetirement = 0;
  const travelSchedule = buildBigTravelSchedule(inputs, retirementAge);

  for (let age = inputs.currentAge; age <= PLAN_TO_AGE; age++) {
    const isRetired = age >= retirementAge;
    let yearStartPortfolio = portfolio;
    let yearEvent: string | undefined;

    if (isRetired && age === retirementAge) {
      yearEvent = 'Retirement begins — full stop on work income';
    }

    const carLumpSum = getCarCostsAtAge(inputs, age);
    if (carLumpSum > 0) {
      portfolio -= carLumpSum;
      yearEvent = `Future car purchase (−${(carLumpSum / 1_00_000).toFixed(0)}L)`;
      if (portfolio < 0) feasible = false;
    }

    if (isRetired) {
      const travel = getBigTravelCostAtAge(travelSchedule, age);
      if (travel) {
        portfolio -= travel.cost;
        const travelLabel = `Big travel #${travel.tripNumber} (−${formatTravelCostLakhs(travel.cost)})`;
        yearEvent = yearEvent ? `${yearEvent}; ${travelLabel}` : travelLabel;
        if (portfolio < 0) feasible = false;
      }
    }

    for (let month = 0; month < 12; month++) {
      portfolio *= 1 + monthlyReturn;

      if (isRetired) {
        portfolio -= monthlyWithdrawal;
        if (inputs.housingType === 'rental') {
          portfolio -= monthlyRent;
        }
      } else {
        const surplus =
          inputs.currentSalary -
          inputs.monthlyExpense -
          monthlyRent -
          carMaintenance;
        portfolio += surplus;
      }

      if (portfolio < 0) {
        feasible = false;
      }

      if (isRetired) {
        monthlyWithdrawal *= 1 + inflationMonthly;
      }
      if (inputs.housingType === 'rental') {
        monthlyRent *= 1 + rentalMonthlyGrowth;
      }
    }

    if (isRetired) {
      yearsInRetirement++;
      if (yearsInRetirement > 0 && yearsInRetirement % 12 === 0) {
        /* yearly inflation already applied monthly */
      }
    }

    snapshots.push({
      age,
      portfolio: Math.max(0, portfolio),
      monthlyWithdrawal: monthlyWithdrawal / Math.pow(1 + inflationMonthly, 12),
      monthlyRent,
      isRetired,
      event: yearEvent,
    });

    yearStartPortfolio = portfolio;
    void yearStartPortfolio;
  }

  return { feasible, snapshots };
}

export function findRetirementAge(inputs: CalculatorInputs): SimulationResult {
  const weightedReturnPct = getWeightedReturn(inputs.allocation, inputs.rates);
  const startAge = Math.max(MIN_AGE, inputs.currentAge);

  let retirementAge: number | null = null;
  let bestSnapshots: YearSnapshot[] = [];

  for (let candidate = startAge; candidate <= PLAN_TO_AGE - 1; candidate++) {
    const { feasible, snapshots } = simulateToAge(inputs, candidate);
    if (feasible && snapshots[snapshots.length - 1]?.portfolio >= 0) {
      retirementAge = candidate;
      bestSnapshots = snapshots;
      break;
    }
  }

  if (retirementAge === null) {
    const { snapshots } = simulateToAge(inputs, PLAN_TO_AGE);
    return {
      retirementAge: null,
      canRetireNow: false,
      snapshots,
      atAge90: snapshots.find((s) => s.age === PLAN_TO_AGE)
        ? {
            portfolio: snapshots.find((s) => s.age === PLAN_TO_AGE)!.portfolio,
            monthlyWithdrawal: snapshots.find((s) => s.age === PLAN_TO_AGE)!
              .monthlyWithdrawal,
            monthlyRent: snapshots.find((s) => s.age === PLAN_TO_AGE)!.monthlyRent,
          }
        : null,
      weightedReturnPct,
      nomineeLegacy: snapshots[snapshots.length - 1]?.portfolio ?? 0,
      message:
        'With current inputs, liquid assets may not sustain inflation-adjusted withdrawals until age 90. Consider retiring later, lowering withdrawals, or growing your portfolio.',
    };
  }

  const canRetireNow = retirementAge === inputs.currentAge;
  const at90 = bestSnapshots.find((s) => s.age === PLAN_TO_AGE);

  return {
    retirementAge,
    canRetireNow,
    snapshots: bestSnapshots,
    atAge90: at90
      ? {
          portfolio: at90.portfolio,
          monthlyWithdrawal: at90.monthlyWithdrawal,
          monthlyRent: at90.monthlyRent,
        }
      : null,
    weightedReturnPct,
    nomineeLegacy: at90?.portfolio ?? 0,
  };
}

export function runSimulationAtRetirementAge(
  inputs: CalculatorInputs,
  retirementAge: number,
): SimulationResult {
  const weightedReturnPct = getWeightedReturn(inputs.allocation, inputs.rates);
  const { feasible, snapshots } = simulateToAge(inputs, retirementAge);

  const at90 = snapshots.find((s) => s.age === PLAN_TO_AGE);

  return {
    retirementAge: feasible ? retirementAge : null,
    canRetireNow: retirementAge === inputs.currentAge && feasible,
    snapshots,
    atAge90: at90
      ? {
          portfolio: at90.portfolio,
          monthlyWithdrawal: at90.monthlyWithdrawal,
          monthlyRent: at90.monthlyRent,
        }
      : null,
    weightedReturnPct,
    nomineeLegacy: at90?.portfolio ?? 0,
    message: feasible
      ? undefined
      : 'This retirement age depletes your corpus before age 90.',
  };
}
