import { motion } from 'framer-motion';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ESTATE_PAGE } from '../constants/estate';
import { formatINR } from '../lib/format';
import type { EstateResult } from '../types/estate';

interface Props {
  result: EstateResult | null;
  weightedReturn: number;
}

export function EstateResultsPanel({ result, weightedReturn }: Props) {
  if (!result) {
    return (
      <div className="sticky-results">
        <div className="panel">
          <p className="hint" style={{ textAlign: 'center', padding: '2rem 0' }}>
            Configure your estate lifestyle and tap Calculate to see when salary can end.
          </p>
        </div>
      </div>
    );
  }

  const { breakdown } = result;
  const chartData = result.snapshots.map((s) => ({
    age: s.age,
    corpus: Math.round(s.portfolio / 1_00_000) / 100,
    label: formatINR(s.portfolio, true),
    event: s.event,
  }));

  return (
    <div className="sticky-results">
      <motion.div
        className="result-hero"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {result.freedomAge != null ? (
          <>
            <div className="result-age">
              {result.freedomAge}
              <span> years</span>
            </div>
            <p className="result-label">
              {result.canBeFreeNow
                ? 'You can end salary today — estate lifestyle sustains until 90'
                : 'Earliest age to eliminate salary dependency'}
            </p>
          </>
        ) : (
          <>
            <div className="result-age" style={{ fontSize: '2rem', color: 'var(--danger)' }}>
              Not feasible
            </div>
            <p className="result-label">Adjust estate inputs to reach age 90</p>
          </>
        )}
      </motion.div>

      <div className="stat-grid">
        <div className="stat-card">
          <h4>Monthly lifestyle drain</h4>
          <div className="value">{formatINR(breakdown.netMonthlyDrain, true)}</div>
          <div className="sub">Staff, house, amortized annual lumps</div>
        </div>
        <div className="stat-card">
          <h4>Passive income target</h4>
          <div className="value accent-secondary">
            {formatINR(breakdown.passiveIncomeTarget, true)}
          </div>
          <div className="sub">Inflation-protected floor (+5% yearly)</div>
        </div>
        <div className="stat-card">
          <h4>Three-bucket savings</h4>
          <div className="value">{formatINR(breakdown.bucketMonthly, true)}</div>
          <div className="sub">Reinvested from income each month</div>
        </div>
        <div className="stat-card">
          <h4>Annual lifestyle outflow</h4>
          <div className="value">{formatINR(breakdown.totalAnnualOutflow, true)}</div>
          <div className="sub">Recurring + scheduled lump expenses</div>
        </div>
        <div className="stat-card">
          <h4>At age 90 — corpus</h4>
          <div className="value">{formatINR(result.atAge90?.portfolio ?? 0, true)}</div>
          <div className="sub">Liquid assets remaining</div>
        </div>
        <div className="stat-card">
          <h4>Blended return</h4>
          <div className="value">{weightedReturn.toFixed(2)}%</div>
          <div className="sub">Weighted by allocation</div>
        </div>
      </div>

      {result.message && <div className="alert warn">{result.message}</div>}

      <div className="panel" style={{ marginTop: '1rem' }}>
        <h3 className="panel-title">Corpus journey to 90</h3>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="estateCorpusGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5eead4" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#5eead4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="age"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                label={{ value: 'Age', position: 'insideBottom', offset: -4, fill: '#9ca3af' }}
              />
              <YAxis
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickFormatter={(v) => `₹${v}Cr`}
              />
              <Tooltip
                contentStyle={{
                  background: '#12202a',
                  border: '1px solid rgba(94, 234, 212, 0.2)',
                  borderRadius: 8,
                }}
                formatter={(_, __, item) => {
                  const payload = item.payload as { label: string };
                  return [payload.label, 'Corpus'];
                }}
                labelFormatter={(age, items) => {
                  const event = (items[0]?.payload as { event?: string } | undefined)?.event;
                  return event ? `Age ${age} — ${event}` : `Age ${age}`;
                }}
              />
              <Area
                type="monotone"
                dataKey="corpus"
                stroke="#5eead4"
                strokeWidth={2}
                fill="url(#estateCorpusGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="alert info">
        <strong>{ESTATE_PAGE.name}</strong> models liquid corpus only. Bucket savings are
        reinvested into your portfolio. Short leisure trips outside the plan are self-funded.
      </div>
    </div>
  );
}
