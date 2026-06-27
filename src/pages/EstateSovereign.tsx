import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { EstateResultsPanel } from '../components/EstateResultsPanel';
import { NumberInput } from '../components/NumberInput';
import { PortfolioAllocator } from '../components/PortfolioAllocator';
import { DEFAULT_ESTATE_INPUTS, ESTATE_PAGE } from '../constants/estate';
import { MIN_AGE } from '../constants';
import { allocationTotal, getWeightedReturn } from '../lib/calculator';
import {
  computeLifestyleBreakdown,
  findFreedomAge,
} from '../lib/estateCalculator';
import { clamp, formatINR } from '../lib/format';
import type { InstrumentKey } from '../types';
import type { EstateInputs, EstateResult } from '../types/estate';

export function EstateSovereign() {
  const [currentAge, setCurrentAge] = useState(DEFAULT_ESTATE_INPUTS.currentAge);
  const [totalNetWorth, setTotalNetWorth] = useState(DEFAULT_ESTATE_INPUTS.totalNetWorth);
  const [allocation, setAllocation] = useState(DEFAULT_ESTATE_INPUTS.allocation);
  const [rates, setRates] = useState(DEFAULT_ESTATE_INPUTS.rates);
  const [currentSalary, setCurrentSalary] = useState(DEFAULT_ESTATE_INPUTS.currentSalary);
  const [preFreedomMonthlyExpense, setPreFreedomMonthlyExpense] = useState(
    DEFAULT_ESTATE_INPUTS.preFreedomMonthlyExpense,
  );

  const [incomeInflationPct, setIncomeInflationPct] = useState(
    DEFAULT_ESTATE_INPUTS.incomeInflationPct,
  );
  const [basePassiveIncomeMonthly, setBasePassiveIncomeMonthly] = useState(
    DEFAULT_ESTATE_INPUTS.basePassiveIncomeMonthly,
  );
  const [bucketInflationOffsetPct, setBucketInflationOffsetPct] = useState(
    DEFAULT_ESTATE_INPUTS.bucketInflationOffsetPct,
  );
  const [bucketContingencyPct, setBucketContingencyPct] = useState(
    DEFAULT_ESTATE_INPUTS.bucketContingencyPct,
  );
  const [bucketBigTicketPct, setBucketBigTicketPct] = useState(
    DEFAULT_ESTATE_INPUTS.bucketBigTicketPct,
  );

  const [extendedFamilyTripsPerYear, setExtendedFamilyTripsPerYear] = useState(
    DEFAULT_ESTATE_INPUTS.extendedFamilyTripsPerYear,
  );
  const [extendedFamilyTripCost, setExtendedFamilyTripCost] = useState(
    DEFAULT_ESTATE_INPUTS.extendedFamilyTripCost,
  );
  const [nativeTripsPerYear, setNativeTripsPerYear] = useState(
    DEFAULT_ESTATE_INPUTS.nativeTripsPerYear,
  );
  const [nativeTripCost, setNativeTripCost] = useState(
    DEFAULT_ESTATE_INPUTS.nativeTripCost,
  );

  const [carReplacementCost, setCarReplacementCost] = useState(
    DEFAULT_ESTATE_INPUTS.carReplacementCost,
  );
  const [carReplacementIntervalYears, setCarReplacementIntervalYears] = useState(
    DEFAULT_ESTATE_INPUTS.carReplacementIntervalYears,
  );
  const [whiteGoodsCost, setWhiteGoodsCost] = useState(DEFAULT_ESTATE_INPUTS.whiteGoodsCost);
  const [whiteGoodsIntervalYears, setWhiteGoodsIntervalYears] = useState(
    DEFAULT_ESTATE_INPUTS.whiteGoodsIntervalYears,
  );
  const [minorFurnishingAnnual, setMinorFurnishingAnnual] = useState(
    DEFAULT_ESTATE_INPUTS.minorFurnishingAnnual,
  );
  const [majorFurnishingCost, setMajorFurnishingCost] = useState(
    DEFAULT_ESTATE_INPUTS.majorFurnishingCost,
  );
  const [majorFurnishingIntervalYears, setMajorFurnishingIntervalYears] = useState(
    DEFAULT_ESTATE_INPUTS.majorFurnishingIntervalYears,
  );

  const [driverMonthly, setDriverMonthly] = useState(DEFAULT_ESTATE_INPUTS.driverMonthly);
  const [cookMonthly, setCookMonthly] = useState(DEFAULT_ESTATE_INPUTS.cookMonthly);
  const [cleaningMonthly, setCleaningMonthly] = useState(
    DEFAULT_ESTATE_INPUTS.cleaningMonthly,
  );
  const [estateManagerMonthly, setEstateManagerMonthly] = useState(
    DEFAULT_ESTATE_INPUTS.estateManagerMonthly,
  );
  const [gadgetsAnnual, setGadgetsAnnual] = useState(DEFAULT_ESTATE_INPUTS.gadgetsAnnual);

  const [houseOwned, setHouseOwned] = useState(DEFAULT_ESTATE_INPUTS.houseOwned);
  const [housePurchaseCost, setHousePurchaseCost] = useState(
    DEFAULT_ESTATE_INPUTS.housePurchaseCost,
  );
  const [houseMaintenanceMonthly, setHouseMaintenanceMonthly] = useState(
    DEFAULT_ESTATE_INPUTS.houseMaintenanceMonthly,
  );

  const [result, setResult] = useState<EstateResult | null>(null);
  const [highlightTick, setHighlightTick] = useState(0);

  const inputs = useMemo(
    (): EstateInputs => ({
      currentAge,
      totalNetWorth,
      allocation,
      rates,
      currentSalary,
      preFreedomMonthlyExpense,
      incomeInflationPct,
      basePassiveIncomeMonthly,
      bucketInflationOffsetPct,
      bucketContingencyPct,
      bucketBigTicketPct,
      extendedFamilyTripsPerYear,
      extendedFamilyTripCost,
      nativeTripsPerYear,
      nativeTripCost,
      carReplacementCost,
      carReplacementIntervalYears,
      whiteGoodsCost,
      whiteGoodsIntervalYears,
      minorFurnishingAnnual,
      majorFurnishingCost,
      majorFurnishingIntervalYears,
      driverMonthly,
      cookMonthly,
      cleaningMonthly,
      estateManagerMonthly,
      gadgetsAnnual,
      houseOwned,
      housePurchaseCost,
      houseMaintenanceMonthly,
    }),
    [
      currentAge,
      totalNetWorth,
      allocation,
      rates,
      currentSalary,
      preFreedomMonthlyExpense,
      incomeInflationPct,
      basePassiveIncomeMonthly,
      bucketInflationOffsetPct,
      bucketContingencyPct,
      bucketBigTicketPct,
      extendedFamilyTripsPerYear,
      extendedFamilyTripCost,
      nativeTripsPerYear,
      nativeTripCost,
      carReplacementCost,
      carReplacementIntervalYears,
      whiteGoodsCost,
      whiteGoodsIntervalYears,
      minorFurnishingAnnual,
      majorFurnishingCost,
      majorFurnishingIntervalYears,
      driverMonthly,
      cookMonthly,
      cleaningMonthly,
      estateManagerMonthly,
      gadgetsAnnual,
      houseOwned,
      housePurchaseCost,
      houseMaintenanceMonthly,
    ],
  );

  const liveBreakdown = useMemo(() => computeLifestyleBreakdown(inputs), [inputs]);
  const weightedReturn = useMemo(
    () => getWeightedReturn(allocation, rates),
    [allocation, rates],
  );
  const allocOk = Math.abs(allocationTotal(allocation) - 100) < 0.5;
  const bucketTotalPct =
    bucketInflationOffsetPct + bucketContingencyPct + bucketBigTicketPct;

  const handleCalculate = useCallback(() => {
    if (!allocOk) return;
    const age = clamp(currentAge, MIN_AGE, 89);
    if (age !== currentAge) setCurrentAge(age);
    setResult(findFreedomAge({ ...inputs, currentAge: age }));
    setHighlightTick((t) => t + 1);
  }, [inputs, allocOk, currentAge]);

  const onAllocationChange = (key: InstrumentKey, value: number) => {
    setAllocation((prev) => ({ ...prev, [key]: value }));
  };

  const onRateChange = (key: InstrumentKey, value: number) => {
    setRates((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="app-inner">
      <header className="hero">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src={`${import.meta.env.BASE_URL}estate-sovereign-logo.png`}
            alt="Estate Sovereign — Lifestyle sovereignty"
            className="hero-logo hero-logo--estate"
          />
          <p>{ESTATE_PAGE.description}</p>
        </motion.div>
      </header>

      <div className="layout">
        <div className="inputs-column">
          <div className="panel">
            <h3 className="panel-title">You & corpus</h3>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="es-age">Current age (45+)</label>
                <NumberInput
                  id="es-age"
                  min={MIN_AGE}
                  max={89}
                  value={currentAge}
                  onChange={setCurrentAge}
                />
              </div>
              <div className="field">
                <label htmlFor="es-networth">Liquid net worth</label>
                <NumberInput
                  id="es-networth"
                  step={100000}
                  value={totalNetWorth}
                  onChange={setTotalNetWorth}
                />
                <span className="hint">{formatINR(totalNetWorth, true)}</span>
              </div>
              <div className="field">
                <label htmlFor="es-salary">Current salary (monthly)</label>
                <NumberInput
                  id="es-salary"
                  step={10000}
                  value={currentSalary}
                  onChange={setCurrentSalary}
                />
              </div>
              <div className="field">
                <label htmlFor="es-pre-expense">Pre-freedom monthly expense</label>
                <NumberInput
                  id="es-pre-expense"
                  step={10000}
                  value={preFreedomMonthlyExpense}
                  onChange={setPreFreedomMonthlyExpense}
                />
                <span className="hint">Spend while still on salary</span>
              </div>
            </div>
          </div>

          <PortfolioAllocator
            allocation={allocation}
            rates={rates}
            onAllocationChange={onAllocationChange}
            onRateChange={onRateChange}
          />

          <div className="panel">
            <h3 className="panel-title">Passive income & buckets</h3>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="es-income">Monthly passive income target</label>
                <NumberInput
                  id="es-income"
                  step={10000}
                  value={basePassiveIncomeMonthly}
                  onChange={setBasePassiveIncomeMonthly}
                />
                <span className="hint">
                  Client brief: ₹2.5–3L/mo — set {formatINR(basePassiveIncomeMonthly, true)}
                </span>
              </div>
              <div className="field">
                <label htmlFor="es-inflation">Annual income inflation (%)</label>
                <NumberInput
                  id="es-inflation"
                  min={5}
                  max={15}
                  step={0.5}
                  value={incomeInflationPct}
                  onChange={setIncomeInflationPct}
                  emptyFallback={5}
                />
                <span className="hint">Minimum 5% inflation protection</span>
              </div>
              <div className="field">
                <label htmlFor="es-b1">Bucket 1 — inflation offset (%)</label>
                <NumberInput
                  id="es-b1"
                  min={0}
                  max={50}
                  value={bucketInflationOffsetPct}
                  onChange={setBucketInflationOffsetPct}
                />
              </div>
              <div className="field">
                <label htmlFor="es-b2">Bucket 2 — contingency (%)</label>
                <NumberInput
                  id="es-b2"
                  min={0}
                  max={50}
                  value={bucketContingencyPct}
                  onChange={setBucketContingencyPct}
                />
              </div>
              <div className="field">
                <label htmlFor="es-b3">Bucket 3 — big-ticket leisure (%)</label>
                <NumberInput
                  id="es-b3"
                  min={0}
                  max={50}
                  value={bucketBigTicketPct}
                  onChange={setBucketBigTicketPct}
                />
              </div>
              <div className="field full">
                <span className="hint">
                  {bucketTotalPct}% of passive income ({formatINR(liveBreakdown.bucketMonthly, true)}
                  /mo) reinvested into corpus today
                </span>
              </div>
            </div>
            <div className="bucket-grid">
              <div className="bucket-card">
                <h4>Inflation offset</h4>
                <p>Long-term corpus growth to beat lifestyle inflation</p>
              </div>
              <div className="bucket-card">
                <h4>Contingency</h4>
                <p>Medical, legal, and unexpected estate shocks</p>
              </div>
              <div className="bucket-card">
                <h4>Big-ticket leisure</h4>
                <p>Extended holidays and emergency lifestyle spends</p>
              </div>
            </div>
          </div>

          <div className="panel">
            <h3 className="panel-title">Travel & inheritance</h3>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="es-holiday-n">Extended-family holidays / year</label>
                <NumberInput
                  id="es-holiday-n"
                  min={0}
                  max={6}
                  value={extendedFamilyTripsPerYear}
                  onChange={setExtendedFamilyTripsPerYear}
                />
              </div>
              <div className="field">
                <label htmlFor="es-holiday-cost">Cost per holiday (₹)</label>
                <NumberInput
                  id="es-holiday-cost"
                  step={50000}
                  value={extendedFamilyTripCost}
                  onChange={setExtendedFamilyTripCost}
                />
                <span className="hint">Min ₹6L per trip</span>
              </div>
              <div className="field">
                <label htmlFor="es-native-n">Native inheritance trips / year</label>
                <NumberInput
                  id="es-native-n"
                  min={0}
                  max={12}
                  value={nativeTripsPerYear}
                  onChange={setNativeTripsPerYear}
                />
              </div>
              <div className="field">
                <label htmlFor="es-native-cost">Cost per native trip (₹)</label>
                <NumberInput
                  id="es-native-cost"
                  step={5000}
                  value={nativeTripCost}
                  onChange={setNativeTripCost}
                />
              </div>
            </div>
          </div>

          <div className="panel">
            <h3 className="panel-title">Estate staff (full-time)</h3>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="es-driver">Driver / month</label>
                <NumberInput
                  id="es-driver"
                  step={1000}
                  value={driverMonthly}
                  onChange={setDriverMonthly}
                />
              </div>
              <div className="field">
                <label htmlFor="es-cook">Cook / month</label>
                <NumberInput
                  id="es-cook"
                  step={1000}
                  value={cookMonthly}
                  onChange={setCookMonthly}
                />
              </div>
              <div className="field">
                <label htmlFor="es-clean">Cleaning / month</label>
                <NumberInput
                  id="es-clean"
                  step={1000}
                  value={cleaningMonthly}
                  onChange={setCleaningMonthly}
                />
              </div>
              <div className="field">
                <label htmlFor="es-manager">Estate manager / month</label>
                <NumberInput
                  id="es-manager"
                  step={1000}
                  value={estateManagerMonthly}
                  onChange={setEstateManagerMonthly}
                />
              </div>
            </div>
            <p className="hint" style={{ marginTop: '0.75rem' }}>
              Staff total: {formatINR(liveBreakdown.staffMonthly, true)} / month
            </p>
          </div>

          <div className="panel">
            <h3 className="panel-title">House & upkeep</h3>
            <div className="toggle-group">
              <button
                type="button"
                className={`toggle-btn ${houseOwned ? 'active' : ''}`}
                onClick={() => setHouseOwned(true)}
              >
                Already own
              </button>
              <button
                type="button"
                className={`toggle-btn ${!houseOwned ? 'active' : ''}`}
                onClick={() => setHouseOwned(false)}
              >
                Buy at freedom age
              </button>
            </div>
            <div className="field-grid" style={{ marginTop: '1rem' }}>
              {!houseOwned && (
                <div className="field full">
                  <label htmlFor="es-house-cost">Independent house + outhouse (₹)</label>
                  <NumberInput
                    id="es-house-cost"
                    step={500000}
                    value={housePurchaseCost}
                    onChange={setHousePurchaseCost}
                  />
                  <span className="hint">Lump sum when salary ends</span>
                </div>
              )}
              <div className="field">
                <label htmlFor="es-house-maint">House maintenance / month</label>
                <NumberInput
                  id="es-house-maint"
                  step={5000}
                  value={houseMaintenanceMonthly}
                  onChange={setHouseMaintenanceMonthly}
                />
              </div>
            </div>
          </div>

          <div className="panel">
            <h3 className="panel-title">Replacements & upgrades</h3>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="es-car-cost">Car replacement cost (₹)</label>
                <NumberInput
                  id="es-car-cost"
                  step={100000}
                  value={carReplacementCost}
                  onChange={setCarReplacementCost}
                />
              </div>
              <div className="field">
                <label htmlFor="es-car-yrs">Car change every (years)</label>
                <NumberInput
                  id="es-car-yrs"
                  min={3}
                  max={10}
                  value={carReplacementIntervalYears}
                  onChange={setCarReplacementIntervalYears}
                  emptyFallback={5}
                />
              </div>
              <div className="field">
                <label htmlFor="es-wg-cost">White goods cycle cost (₹)</label>
                <NumberInput
                  id="es-wg-cost"
                  step={50000}
                  value={whiteGoodsCost}
                  onChange={setWhiteGoodsCost}
                />
              </div>
              <div className="field">
                <label htmlFor="es-wg-yrs">White goods every (years)</label>
                <NumberInput
                  id="es-wg-yrs"
                  min={3}
                  max={15}
                  value={whiteGoodsIntervalYears}
                  onChange={setWhiteGoodsIntervalYears}
                  emptyFallback={7}
                />
              </div>
              <div className="field">
                <label htmlFor="es-minor-furn">Diwali minor furnishing / year (₹)</label>
                <NumberInput
                  id="es-minor-furn"
                  step={10000}
                  value={minorFurnishingAnnual}
                  onChange={setMinorFurnishingAnnual}
                />
              </div>
              <div className="field">
                <label htmlFor="es-gadgets">Gadgets upgrade / year (₹)</label>
                <NumberInput
                  id="es-gadgets"
                  step={10000}
                  value={gadgetsAnnual}
                  onChange={setGadgetsAnnual}
                />
              </div>
              <div className="field">
                <label htmlFor="es-major-furn">Major furnishing cost (₹)</label>
                <NumberInput
                  id="es-major-furn"
                  step={100000}
                  value={majorFurnishingCost}
                  onChange={setMajorFurnishingCost}
                />
              </div>
              <div className="field">
                <label htmlFor="es-major-yrs">Major furnishing every (years)</label>
                <NumberInput
                  id="es-major-yrs"
                  min={3}
                  max={15}
                  value={majorFurnishingIntervalYears}
                  onChange={setMajorFurnishingIntervalYears}
                  emptyFallback={7}
                />
              </div>
            </div>
          </div>

          <div className="panel">
            <h3 className="panel-title">Live cost preview (year 1)</h3>
            <ul className="breakdown-list">
              <li>Staff & house maintenance: {formatINR(liveBreakdown.netMonthlyDrain, true)}/mo</li>
              <li>
                Annual lumps (holidays, native, Diwali, gadgets, cycles):{' '}
                {formatINR(liveBreakdown.annualLifestyleLumps, true)}
              </li>
              <li>Bucket reinvestment: {formatINR(liveBreakdown.bucketMonthly, true)}/mo</li>
              <li>
                <strong>Total annual outflow: {formatINR(liveBreakdown.totalAnnualOutflow, true)}</strong>
              </li>
            </ul>
            <button
              type="button"
              className="calc-btn"
              onClick={handleCalculate}
              disabled={!allocOk}
            >
              {allocOk ? 'Calculate freedom from salary' : 'Fix allocation to 100% first'}
            </button>
          </div>

          <footer className="disclaimer">
            <strong>Estate Sovereign</strong> models liquid corpus only. Bucket savings are
            reinvested. House purchase is a one-time lump at freedom age if not already
            owned. Car, white goods, and major furnishing repeat on their cycles with{' '}
            {incomeInflationPct}% inflation.
          </footer>
        </div>

        <EstateResultsPanel
          result={result}
          weightedReturn={weightedReturn}
          highlightTick={highlightTick}
        />
      </div>
    </div>
  );
}
