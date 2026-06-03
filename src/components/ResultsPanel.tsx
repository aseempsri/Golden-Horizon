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
import { APP_NAME } from '../constants';
import { formatINR } from '../lib/format';
import type { SimulationResult } from '../types';

interface Props {
  result: SimulationResult | null;
  weightedReturn: number;
}

export function ResultsPanel({ result, weightedReturn }: Props) {
  if (!result) {
    return (
      <div className="sticky-results">
        <div className="panel">
          <p className="hint" style={{ textAlign: 'center', padding: '2rem 0' }}>
            Adjust your inputs and tap Calculate to see when you can retire.
          </p>
        </div>
      </div>
    );
  }

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
        {result.retirementAge != null ? (
          <>
            <div className="result-age">
              {result.retirementAge}
              <span> years</span>
            </div>
            <p className="result-label">
              {result.canRetireNow
                ? 'You can retire today — corpus sustains until 90'
                : `Earliest full retirement age (no further work)`}
            </p>
          </>
        ) : (
          <>
            <div className="result-age" style={{ fontSize: '2rem', color: 'var(--danger)' }}>
              Not feasible
            </div>
            <p className="result-label">Adjust inputs to reach age 90</p>
          </>
        )}
      </motion.div>

      <div className="stat-grid">
        <div className="stat-card">
          <h4>At age 90 — corpus remaining</h4>
          <div className="value">
            {formatINR(result.atAge90?.portfolio ?? 0, true)}
          </div>
          <div className="sub">Liquid assets you would still hold</div>
        </div>
        <div className="stat-card">
          <h4>At age 90 — monthly withdrawal</h4>
          <div className="value">
            {formatINR(result.atAge90?.monthlyWithdrawal ?? 0, true)}
          </div>
          <div className="sub">Inflation-adjusted lifestyle draw</div>
        </div>
        <div className="stat-card">
          <h4>Nominee / legal successor</h4>
          <div className="value" style={{ color: 'var(--success)' }}>
            {formatINR(result.nomineeLegacy, true)}
          </div>
          <div className="sub">Remaining liquid wealth after you</div>
        </div>
        <div className="stat-card">
          <h4>Blended portfolio return</h4>
          <div className="value">{weightedReturn.toFixed(2)}%</div>
          <div className="sub">Weighted by your allocation</div>
        </div>
      </div>

      {result.message && (
        <div className="alert warn">{result.message}</div>
      )}

      <div className="panel" style={{ marginTop: '1rem' }}>
        <h3 className="panel-title">Corpus journey to 90</h3>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="corpusGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f5c842" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#f5c842" stopOpacity={0} />
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
                  background: '#1a1f2e',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                }}
                formatter={(_, __, item) => {
                  const payload = item.payload as { label: string; event?: string };
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
                stroke="#f5c842"
                strokeWidth={2}
                fill="url(#corpusGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="alert info">
        <strong>{APP_NAME}</strong> models only liquid assets. Rental income, pension, and
        business income are excluded. Withdrawals rise each year by your inflation %.
      </div>
    </div>
  );
}
