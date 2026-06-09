import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { EstateResultsPanel } from '../components/EstateResultsPanel';
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
                <input
                  id="es-age"
                  type="number"
                  min={MIN_AGE}
                  max={89}
                  value={currentAge}
                  onChange={(e) =>
                    setCurrentAge(clamp(Number(e.target.value), MIN_AGE, 89))
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="es-networth">Liquid net worth</label>
                <input
                  id="es-networth"
                  type="number"
                  step={100000}
                  value={totalNetWorth}
                  onChange={(e) => setTotalNetWorth(Number(e.target.value) || 0)}
                />
                <span className="hint">{formatINR(totalNetWorth, true)}</span>
              </div>
              <div className="field">
                <label htmlFor="es-salary">Current salary (monthly)</label>
                <input
                  id="es-salary"
                  type="number"
                  step={10000}
                  value={currentSalary}
                  onChange={(e) => setCurrentSalary(Number(e.target.value) || 0)}
                />
              </div>
              <div className="field">
                <label htmlFor="es-pre-expense">Pre-freedom monthly expense</label>
                <input
                  id="es-pre-expense"
                  type="number"
                  step={10000}
                  value={preFreedomMonthlyExpense}
                  onChange={(e) =>
                    setPreFreedomMonthlyExpense(Number(e.target.value) || 0)
                  }
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
                <input
                  id="es-income"
                  type="number"
                  step={10000}
                  value={basePassiveIncomeMonthly}
                  onChange={(e) =>
                    setBasePassiveIncomeMonthly(Number(e.target.value) || 0)
                  }
                />
                <span className="hint">
                  Client brief: ₹2.5–3L/mo — set {formatINR(basePassiveIncomeMonthly, true)}
                </span>
              </div>
              <div className="field">
                <label htmlFor="es-inflation">Annual income inflation (%)</label>
                <input
                  id="es-inflation"
                  type="number"
                  min={5}
                  max={15}
                  step={0.5}
                  value={incomeInflationPct}
                  onChange={(e) => setIncomeInflationPct(Number(e.target.value) || 5)}
                />
                <span className="hint">Minimum 5% inflation protection</span>
              </div>
              <div className="field">
                <label htmlFor="es-b1">Bucket 1 — inflation offset (%)</label>
                <input
                  id="es-b1"
                  type="number"
                  min={0}
                  max={50}
                  value={bucketInflationOffsetPct}
                  onChange={(e) =>
                    setBucketInflationOffsetPct(Number(e.target.value) || 0)
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="es-b2">Bucket 2 — contingency (%)</label>
                <input
                  id="es-b2"
                  type="number"
                  min={0}
                  max={50}
                  value={bucketContingencyPct}
                  onChange={(e) => setBucketContingencyPct(Number(e.target.value) || 0)}
                />
              </div>
              <div className="field">
                <label htmlFor="es-b3">Bucket 3 — big-ticket leisure (%)</label>
                <input
                  id="es-b3"
                  type="number"
                  min={0}
                  max={50}
                  value={bucketBigTicketPct}
                  onChange={(e) => setBucketBigTicketPct(Number(e.target.value) || 0)}
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
                <input
                  id="es-holiday-n"
                  type="number"
                  min={0}
                  max={6}
                  value={extendedFamilyTripsPerYear}
                  onChange={(e) =>
                    setExtendedFamilyTripsPerYear(Number(e.target.value) || 0)
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="es-holiday-cost">Cost per holiday (₹)</label>
                <input
                  id="es-holiday-cost"
                  type="number"
                  step={50000}
                  value={extendedFamilyTripCost}
                  onChange={(e) =>
                    setExtendedFamilyTripCost(Number(e.target.value) || 0)
                  }
                />
                <span className="hint">Min ₹6L per trip</span>
              </div>
              <div className="field">
                <label htmlFor="es-native-n">Native inheritance trips / year</label>
                <input
                  id="es-native-n"
                  type="number"
                  min={0}
                  max={12}
                  value={nativeTripsPerYear}
                  onChange={(e) => setNativeTripsPerYear(Number(e.target.value) || 0)}
                />
              </div>
              <div className="field">
                <label htmlFor="es-native-cost">Cost per native trip (₹)</label>
                <input
                  id="es-native-cost"
                  type="number"
                  step={5000}
                  value={nativeTripCost}
                  onChange={(e) => setNativeTripCost(Number(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          <div className="panel">
            <h3 className="panel-title">Estate staff (full-time)</h3>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="es-driver">Driver / month</label>
                <input
                  id="es-driver"
                  type="number"
                  step={1000}
                  value={driverMonthly}
                  onChange={(e) => setDriverMonthly(Number(e.target.value) || 0)}
                />
              </div>
              <div className="field">
                <label htmlFor="es-cook">Cook / month</label>
                <input
                  id="es-cook"
                  type="number"
                  step={1000}
                  value={cookMonthly}
                  onChange={(e) => setCookMonthly(Number(e.target.value) || 0)}
                />
              </div>
              <div className="field">
                <label htmlFor="es-clean">Cleaning / month</label>
                <input
                  id="es-clean"
                  type="number"
                  step={1000}
                  value={cleaningMonthly}
                  onChange={(e) => setCleaningMonthly(Number(e.target.value) || 0)}
                />
              </div>
              <div className="field">
                <label htmlFor="es-manager">Estate manager / month</label>
                <input
                  id="es-manager"
                  type="number"
                  step={1000}
                  value={estateManagerMonthly}
                  onChange={(e) => setEstateManagerMonthly(Number(e.target.value) || 0)}
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
                  <input
                    id="es-house-cost"
                    type="number"
                    step={500000}
                    value={housePurchaseCost}
                    onChange={(e) => setHousePurchaseCost(Number(e.target.value) || 0)}
                  />
                  <span className="hint">Lump sum when salary ends</span>
                </div>
              )}
              <div className="field">
                <label htmlFor="es-house-maint">House maintenance / month</label>
                <input
                  id="es-house-maint"
                  type="number"
                  step={5000}
                  value={houseMaintenanceMonthly}
                  onChange={(e) =>
                    setHouseMaintenanceMonthly(Number(e.target.value) || 0)
                  }
                />
              </div>
            </div>
          </div>

          <div className="panel">
            <h3 className="panel-title">Replacements & upgrades</h3>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="es-car-cost">Car replacement cost (₹)</label>
                <input
                  id="es-car-cost"
                  type="number"
                  step={100000}
                  value={carReplacementCost}
                  onChange={(e) => setCarReplacementCost(Number(e.target.value) || 0)}
                />
              </div>
              <div className="field">
                <label htmlFor="es-car-yrs">Car change every (years)</label>
                <input
                  id="es-car-yrs"
                  type="number"
                  min={3}
                  max={10}
                  value={carReplacementIntervalYears}
                  onChange={(e) =>
                    setCarReplacementIntervalYears(Number(e.target.value) || 5)
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="es-wg-cost">White goods cycle cost (₹)</label>
                <input
                  id="es-wg-cost"
                  type="number"
                  step={50000}
                  value={whiteGoodsCost}
                  onChange={(e) => setWhiteGoodsCost(Number(e.target.value) || 0)}
                />
              </div>
              <div className="field">
                <label htmlFor="es-wg-yrs">White goods every (years)</label>
                <input
                  id="es-wg-yrs"
                  type="number"
                  min={3}
                  max={15}
                  value={whiteGoodsIntervalYears}
                  onChange={(e) =>
                    setWhiteGoodsIntervalYears(Number(e.target.value) || 7)
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="es-minor-furn">Diwali minor furnishing / year (₹)</label>
                <input
                  id="es-minor-furn"
                  type="number"
                  step={10000}
                  value={minorFurnishingAnnual}
                  onChange={(e) =>
                    setMinorFurnishingAnnual(Number(e.target.value) || 0)
                  }
                />
              </div>
              <div className="field">
                <label htmlFor="es-gadgets">Gadgets upgrade / year (₹)</label>
                <input
                  id="es-gadgets"
                  type="number"
                  step={10000}
                  value={gadgetsAnnual}
                  onChange={(e) => setGadgetsAnnual(Number(e.target.value) || 0)}
                />
              </div>
              <div className="field">
                <label htmlFor="es-major-furn">Major furnishing cost (₹)</label>
                <input
                  id="es-major-furn"
                  type="number"
                  step={100000}
                  value={majorFurnishingCost}
                  onChange={(e) => setMajorFurnishingCost(Number(e.target.value) || 0)}
                />
              </div>
              <div className="field">
                <label htmlFor="es-major-yrs">Major furnishing every (years)</label>
                <input
                  id="es-major-yrs"
                  type="number"
                  min={3}
                  max={15}
                  value={majorFurnishingIntervalYears}
                  onChange={(e) =>
                    setMajorFurnishingIntervalYears(Number(e.target.value) || 7)
                  }
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

        <EstateResultsPanel result={result} weightedReturn={weightedReturn} />
      </div>
    </div>
  );
}
