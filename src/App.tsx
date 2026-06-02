import { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import './App.css';
import { PortfolioAllocator } from './components/PortfolioAllocator';
import { ResultsPanel } from './components/ResultsPanel';
import { APP_NAME, APP_TAGLINE, DEFAULT_INPUTS, MIN_AGE } from './constants';
import {
  allocationTotal,
  findRetirementAge,
  getWeightedReturn,
} from './lib/calculator';
import { clamp, formatINR } from './lib/format';
import type {
  CalculatorInputs,
  HousingType,
  InstrumentKey,
  SimulationResult,
} from './types';

export default function App() {
  const [currentAge, setCurrentAge] = useState(DEFAULT_INPUTS.currentAge);
  const [totalNetWorth, setTotalNetWorth] = useState(DEFAULT_INPUTS.totalNetWorth);
  const [allocation, setAllocation] = useState(DEFAULT_INPUTS.allocation);
  const [rates, setRates] = useState(DEFAULT_INPUTS.rates);
  const [housingType, setHousingType] = useState<HousingType>(DEFAULT_INPUTS.housingType);
  const [monthlyRent, setMonthlyRent] = useState(DEFAULT_INPUTS.monthlyRent);
  const [rentalIncrementPct, setRentalIncrementPct] = useState(
    DEFAULT_INPUTS.rentalIncrementPct,
  );
  const [carsOwned, setCarsOwned] = useState(DEFAULT_INPUTS.carsOwned);
  const [futureCarsToBuy, setFutureCarsToBuy] = useState(DEFAULT_INPUTS.futureCarsToBuy);
  const [car1Cost, setCar1Cost] = useState(DEFAULT_INPUTS.car1Cost);
  const [car1Age, setCar1Age] = useState(DEFAULT_INPUTS.car1Age);
  const [car2Cost, setCar2Cost] = useState(DEFAULT_INPUTS.car2Cost);
  const [car2Age, setCar2Age] = useState(DEFAULT_INPUTS.car2Age);
  const [currentSalary, setCurrentSalary] = useState(DEFAULT_INPUTS.currentSalary);
  const [monthlyExpense, setMonthlyExpense] = useState(DEFAULT_INPUTS.monthlyExpense);
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(
    DEFAULT_INPUTS.monthlyWithdrawal,
  );
  const [inflationPct, setInflationPct] = useState(DEFAULT_INPUTS.inflationPct);
  const [carMaintenanceMonthly, setCarMaintenanceMonthly] = useState(
    DEFAULT_INPUTS.carMaintenanceMonthly,
  );
  const [result, setResult] = useState<SimulationResult | null>(null);

  const inputs = useMemo(
    (): CalculatorInputs => ({
      currentAge,
      totalNetWorth,
      allocation,
      rates,
      housingType,
      monthlyRent,
      rentalIncrementPct,
      carsOwned,
      futureCarsToBuy,
      car1Cost,
      car1Age,
      car2Cost,
      car2Age,
      currentSalary,
      monthlyExpense,
      monthlyWithdrawal,
      inflationPct,
      carMaintenanceMonthly,
    }),
    [
      currentAge,
      totalNetWorth,
      allocation,
      rates,
      housingType,
      monthlyRent,
      rentalIncrementPct,
      carsOwned,
      futureCarsToBuy,
      car1Cost,
      car1Age,
      car2Cost,
      car2Age,
      currentSalary,
      monthlyExpense,
      monthlyWithdrawal,
      inflationPct,
      carMaintenanceMonthly,
    ],
  );

  const weightedReturn = useMemo(
    () => getWeightedReturn(allocation, rates),
    [allocation, rates],
  );

  const allocOk = Math.abs(allocationTotal(allocation) - 100) < 0.5;

  const handleCalculate = useCallback(() => {
    if (!allocOk) return;
    const age = clamp(currentAge, MIN_AGE, 89);
    if (age !== currentAge) setCurrentAge(age);
    setResult(findRetirementAge({ ...inputs, currentAge: age }));
  }, [inputs, allocOk, currentAge]);

  const onAllocationChange = (key: InstrumentKey, value: number) => {
    setAllocation((prev) => ({ ...prev, [key]: value }));
  };

  const onRateChange = (key: InstrumentKey, value: number) => {
    setRates((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="app">
      <div className="app-inner">
        <header className="hero">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="hero-badge">✦ {APP_TAGLINE}</span>
            <h1>{APP_NAME}</h1>
            <p>
              Discover when you can stop working forever. Plan inflation-proof withdrawals,
              liquid assets only, and what your nominee inherits — through age 90.
            </p>
          </motion.div>
        </header>

        <div className="layout">
          <div className="inputs-column">
            <div className="panel">
              <h3 className="panel-title">You & lifestyle</h3>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="age">Current age (45+)</label>
                  <input
                    id="age"
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
                  <label htmlFor="networth">Total net worth (liquid)</label>
                  <input
                    id="networth"
                    type="number"
                    step={100000}
                    value={totalNetWorth}
                    onChange={(e) => setTotalNetWorth(Number(e.target.value) || 0)}
                  />
                  <span className="hint">{formatINR(totalNetWorth, true)}</span>
                </div>
                <div className="field">
                  <label htmlFor="expense">Monthly living expense</label>
                  <input
                    id="expense"
                    type="number"
                    step={10000}
                    value={monthlyExpense}
                    onChange={(e) => setMonthlyExpense(Number(e.target.value) || 0)}
                  />
                  <span className="hint">Default ₹2L — pre-retirement spend</span>
                </div>
                <div className="field">
                  <label htmlFor="salary">Current salary (monthly)</label>
                  <input
                    id="salary"
                    type="number"
                    step={10000}
                    value={currentSalary}
                    onChange={(e) => setCurrentSalary(Number(e.target.value) || 0)}
                  />
                  <span className="hint">e.g. ₹3.6L — saved until retirement</span>
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
              <h3 className="panel-title">Housing</h3>
              <div className="toggle-group">
                <button
                  type="button"
                  className={`toggle-btn ${housingType === 'own' ? 'active' : ''}`}
                  onClick={() => setHousingType('own')}
                >
                  Own house
                </button>
                <button
                  type="button"
                  className={`toggle-btn ${housingType === 'rental' ? 'active' : ''}`}
                  onClick={() => setHousingType('rental')}
                >
                  Rental
                </button>
              </div>
              {housingType === 'rental' && (
                <div className="field-grid" style={{ marginTop: '1rem' }}>
                  <div className="field">
                    <label htmlFor="rent">Monthly rent today</label>
                    <input
                      id="rent"
                      type="number"
                      step={5000}
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value) || 0)}
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="rent-inc">Annual rent increase (%)</label>
                    <input
                      id="rent-inc"
                      type="number"
                      min={0}
                      max={25}
                      step={0.5}
                      value={rentalIncrementPct}
                      onChange={(e) =>
                        setRentalIncrementPct(Number(e.target.value) || 0)
                      }
                    />
                    <span className="hint">Default 10% yearly</span>
                  </div>
                </div>
              )}
              {housingType === 'own' && (
                <p className="hint" style={{ marginTop: '0.75rem' }}>
                  No rent increment — housing cost excluded from growth.
                </p>
              )}
            </div>

            <div className="panel">
              <h3 className="panel-title">Cars</h3>
              <div className="field-grid">
                <div className="field full">
                  <label>Cars you own now</label>
                  <div className="segmented">
                    {[0, 1, 2, 3].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={carsOwned === n ? 'active' : ''}
                        onClick={() => setCarsOwned(n)}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="car-maint">Maintenance / month (all cars)</label>
                  <input
                    id="car-maint"
                    type="number"
                    step={5000}
                    value={carMaintenanceMonthly}
                    onChange={(e) =>
                      setCarMaintenanceMonthly(Number(e.target.value) || 0)
                    }
                  />
                </div>
                <div className="field full">
                  <label>Future cars to buy</label>
                  <div className="segmented">
                    {[0, 1, 2, 3].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={futureCarsToBuy === n ? 'active' : ''}
                        onClick={() => setFutureCarsToBuy(n)}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                {futureCarsToBuy >= 1 && (
                  <>
                    <div className="field">
                      <label htmlFor="car1-cost">Car 1 cost (₹)</label>
                      <input
                        id="car1-cost"
                        type="number"
                        step={100000}
                        value={car1Cost}
                        onChange={(e) => setCar1Cost(Number(e.target.value) || 0)}
                      />
                      <span className="hint">e.g. ₹30L</span>
                    </div>
                    <div className="field">
                      <label htmlFor="car1-age">Car 1 at age</label>
                      <input
                        id="car1-age"
                        type="number"
                        min={currentAge}
                        max={90}
                        value={car1Age}
                        onChange={(e) => setCar1Age(Number(e.target.value) || 50)}
                      />
                      <span className="hint">e.g. 50 (5 yrs from 45)</span>
                    </div>
                  </>
                )}
                {futureCarsToBuy >= 2 && (
                  <>
                    <div className="field">
                      <label htmlFor="car2-cost">Car 2 cost (₹)</label>
                      <input
                        id="car2-cost"
                        type="number"
                        step={100000}
                        value={car2Cost}
                        onChange={(e) => setCar2Cost(Number(e.target.value) || 0)}
                      />
                      <span className="hint">e.g. ₹50L</span>
                    </div>
                    <div className="field">
                      <label htmlFor="car2-age">Car 2 at age</label>
                      <input
                        id="car2-age"
                        type="number"
                        min={currentAge}
                        max={90}
                        value={car2Age}
                        onChange={(e) => setCar2Age(Number(e.target.value) || 60)}
                      />
                      <span className="hint">e.g. 60</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="panel">
              <h3 className="panel-title">Retirement withdrawals</h3>
              <div className="field-grid">
                <div className="field">
                  <label htmlFor="withdraw">Monthly withdrawal at retirement</label>
                  <input
                    id="withdraw"
                    type="number"
                    step={10000}
                    value={monthlyWithdrawal}
                    onChange={(e) =>
                      setMonthlyWithdrawal(Number(e.target.value) || 0)
                    }
                  />
                  <span className="hint">
                    Year 1: {formatINR(monthlyWithdrawal)} → +{inflationPct}% each year
                  </span>
                </div>
                <div className="field">
                  <label htmlFor="inflation">Annual inflation on withdrawals (%)</label>
                  <input
                    id="inflation"
                    type="number"
                    min={0}
                    max={20}
                    step={0.5}
                    value={inflationPct}
                    onChange={(e) => setInflationPct(Number(e.target.value) || 0)}
                  />
                  <span className="hint">Default 6% — compounds yearly</span>
                </div>
              </div>
              <p className="hint" style={{ marginTop: '0.75rem' }}>
                Example: ₹2L/mo → ~₹2.12L in year 2 → ~₹2.25L in year 3. Set ₹3.6L if
                you want salary-level drawdown.
              </p>
              <button
                type="button"
                className="calc-btn"
                onClick={handleCalculate}
                disabled={!allocOk}
              >
                {allocOk ? 'Calculate retirement age' : 'Fix allocation to 100% first'}
              </button>
            </div>

            <footer className="disclaimer">
              <strong>Assumptions:</strong> Complete retirement means no further salary or
              assignments. Only liquid assets are modeled. We exclude rental income, pension,
              and business income. Pre-retirement, salary surplus (after expenses, rent, car
              upkeep) is added to your portfolio. After retirement, inflation-adjusted
              withdrawals and rent continue until age 90. Your nominee receives whatever
              corpus remains.
            </footer>
          </div>

          <ResultsPanel result={result} weightedReturn={weightedReturn} />
        </div>
      </div>
    </div>
  );
}
