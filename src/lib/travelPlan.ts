import type { CalculatorInputs } from '../types';

export interface BigTravelEvent {
  age: number;
  cost: number;
  tripNumber: number;
  yearsSinceRetirement: number;
}

/** Build scheduled big-travel lump sums from retirement through the 25-year window. */
export function buildBigTravelSchedule(
  inputs: CalculatorInputs,
  retirementAge: number,
): BigTravelEvent[] {
  if (!inputs.enableTravelPlan) return [];

  const events: BigTravelEvent[] = [];
  let tripNumber = 0;

  for (
    let years = 0;
    years < inputs.travelWindowYears && tripNumber < inputs.maxBigTravels;
    years += inputs.travelIntervalYears
  ) {
    const age = retirementAge + years;
    if (age >= inputs.travelStopAutoAtAge) break;

    const cost =
      inputs.bigTravelBaseCost *
      Math.pow(1 + inputs.bigTravelCostYoYPct / 100, years);

    tripNumber += 1;
    events.push({
      age,
      cost,
      tripNumber,
      yearsSinceRetirement: years,
    });
  }

  return events;
}

export function getBigTravelCostAtAge(
  schedule: BigTravelEvent[],
  age: number,
): BigTravelEvent | undefined {
  return schedule.find((e) => e.age === age);
}

export function formatTravelCostLakhs(cost: number): string {
  return `${(cost / 1_00_000).toFixed(1)}L`;
}
