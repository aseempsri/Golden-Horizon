import { useEffect, useState } from 'react';

type Phase = 'working' | 'retired';

interface MonthStep {
  label: string;
  phase: Phase;
  pStart: number;
  growth: number;
  flow: number;
  flowLabel: string;
  pEnd: number;
  note: string;
}

const STEPS: MonthStep[] = [
  {
    label: 'Month 1 — Working',
    phase: 'working',
    pStart: 5_00_00_000,
    growth: 39_850,
    flow: 1_40_000,
    flowLabel: '+ Salary surplus',
    pEnd: 5_01_79_850,
    note: 'Salary ₹3.6L − Expense ₹2L − Car ₹20K = ₹1.4L saved',
  },
  {
    label: 'Month 2 — Working',
    phase: 'working',
    pStart: 5_01_79_850,
    growth: 40_000,
    flow: 1_40_000,
    flowLabel: '+ Salary surplus',
    pEnd: 5_03_59_850,
    note: 'Corpus keeps compounding — surplus added every month',
  },
  {
    label: 'Month 1 — Retired',
    phase: 'retired',
    pStart: 5_03_59_850,
    growth: 40_140,
    flow: -2_00_000,
    flowLabel: '− Withdrawal',
    pEnd: 5_01_99_990,
    note: 'No salary anymore. ₹2L/month drawn for lifestyle.',
  },
  {
    label: 'Month 2 — Retired',
    phase: 'retired',
    pStart: 5_01_99_990,
    growth: 40_010,
    flow: -2_01_000,
    flowLabel: '− Withdrawal (inflated)',
    pEnd: 5_00_39_000,
    note: 'Withdrawal rose ~0.5% this month (6% annual inflation)',
  },
];

const ANNUAL_RETURN = 10;
const RM_PCT = ((1 + ANNUAL_RETURN / 100) ** (1 / 12) - 1) * 100;

function formatCr(n: number): string {
  return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
}

function formatL(n: number): string {
  const abs = Math.abs(n);
  const sign = n < 0 ? '−' : '+';
  if (abs >= 1_00_000) return `${sign}₹${(abs / 1_00_000).toFixed(2)} L`;
  return `${sign}₹${abs.toLocaleString('en-IN')}`;
}

export function CorpusDemo() {
  const [stepIdx, setStepIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [playing, setPlaying] = useState(true);
  const step = STEPS[stepIdx];

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setStepIdx((i) => (i + 1) % STEPS.length);
      setAnimKey((k) => k + 1);
    }, 4500);
    return () => clearInterval(timer);
  }, [playing]);

  const goToStep = (i: number) => {
    setStepIdx(i);
    setAnimKey((k) => k + 1);
  };

  const maxP = 5_10_00_000;
  const barStart = (step.pStart / maxP) * 100;
  const barEnd = (step.pEnd / maxP) * 100;

  return (
    <div className="corpus-demo">
      <div className="corpus-demo-header">
        <div>
          <span className="corpus-demo-tag">Animated example</span>
          <h3>Watch P change month-by-month</h3>
        </div>
        <div className="corpus-demo-controls">
          <button
            type="button"
            className="corpus-demo-play"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? 'Pause animation' : 'Play animation'}
          >
            {playing ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            type="button"
            className="corpus-demo-step-btn"
            onClick={() => {
              setPlaying(false);
              goToStep((stepIdx - 1 + STEPS.length) % STEPS.length);
            }}
            aria-label="Previous month"
          >
            ‹
          </button>
          {STEPS.map((s, i) => (
            <button
              key={s.label}
              type="button"
              className={`corpus-demo-dot ${i === stepIdx ? 'active' : ''} ${s.phase}`}
              onClick={() => {
                setPlaying(false);
                goToStep(i);
              }}
              aria-label={s.label}
            />
          ))}
          <button
            type="button"
            className="corpus-demo-step-btn"
            onClick={() => {
              setPlaying(false);
              goToStep((stepIdx + 1) % STEPS.length);
            }}
            aria-label="Next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className={`corpus-demo-phase ${step.phase}`}>{step.label}</div>

      <div className="corpus-demo-bar-wrap">
        <div className="corpus-demo-bar-label">
          <span>P (liquid corpus)</span>
          <span key={`start-${animKey}`} className="corpus-demo-value anim-fade">
            {formatCr(step.pStart)}
          </span>
        </div>
        <div className="corpus-demo-bar-track">
          <div
            key={`bar-${animKey}`}
            className="corpus-demo-bar-fill anim-bar"
            style={{ width: `${barStart}%` }}
          />
          <div
            key={`bar-end-${animKey}`}
            className="corpus-demo-bar-fill end anim-bar-delay"
            style={{ width: `${barEnd}%` }}
          />
        </div>
        <div className="corpus-demo-bar-label end">
          <span>After this month</span>
          <span key={`end-${animKey}`} className="corpus-demo-value anim-fade">
            {formatCr(step.pEnd)}
          </span>
        </div>
      </div>

      <div className="corpus-demo-steps anim-slide" key={`steps-${animKey}`}>
        <div className="corpus-demo-step growth">
          <span className="step-icon">📈</span>
          <div>
            <strong>Step 1 — Grow</strong>
            <p>
              P × (1 + r<sub>m</sub>) → investment return
            </p>
            <span className="step-val positive">{formatL(step.growth)}</span>
          </div>
        </div>
        <div className="corpus-demo-step flow">
          <span className="step-icon">{step.flow >= 0 ? '💰' : '🏠'}</span>
          <div>
            <strong>Step 2 — {step.flowLabel}</strong>
            <p>{step.note}</p>
            <span className={`step-val ${step.flow >= 0 ? 'positive' : 'negative'}`}>
              {formatL(step.flow)}
            </span>
          </div>
        </div>
        <div className="corpus-demo-step result">
          <span className="step-icon">=</span>
          <div>
            <strong>New P</strong>
            <p>{step.pEnd >= 0 ? 'Still feasible ✓' : 'Plan breaks ✗'}</p>
            <span className="step-val">{formatCr(step.pEnd)}</span>
          </div>
        </div>
      </div>

      <p className="corpus-demo-assumptions">
        Assumes blended return {ANNUAL_RETURN}%/yr (r<sub>m</sub> ≈ {RM_PCT.toFixed(3)}%/mo),
        starting corpus ₹5 Cr, default salary &amp; expense inputs.
      </p>
    </div>
  );
}

export function SymbolsExplainer() {
  return (
    <div className="symbols-grid">
      <div className="symbol-card gold">
        <div className="symbol-letter anim-pulse">P</div>
        <h3>Portfolio — your liquid corpus</h3>
        <p className="symbol-plain">
          Think of <strong>P</strong> as one big bank balance holding all your sellable
          wealth — FDs, savings, stocks, mutual funds.
        </p>
        <div className="symbol-includes">
          <span className="yes">✓ FDs &amp; savings</span>
          <span className="yes">✓ Stocks &amp; MFs</span>
          <span className="no">✗ House value</span>
          <span className="no">✗ Pension</span>
        </div>
        <dl className="symbol-dl">
          <dt>Code name</dt>
          <dd>
            <code>portfolio</code> — starts as your &quot;Total net worth (liquid)&quot; input
          </dd>
          <dt>At age 90</dt>
          <dd>Whatever P remains → nominee legacy in results</dd>
          <dt>Plan fails when</dt>
          <dd>P drops below ₹0 in any month before 90</dd>
        </dl>
      </div>

      <div className="symbol-card teal">
        <div className="symbol-letter anim-pulse">r<sub>m</sub></div>
        <h3>Monthly return rate</h3>
        <p className="symbol-plain">
          <strong>r<sub>m</sub></strong> is how much your entire portfolio grows each month
          from investments — before salary or withdrawals.
        </p>
        <div className="symbol-formula-box">
          <div>Annual blended return R = 10%</div>
          <div className="symbol-arrow">↓ convert to monthly</div>
          <div>
            r<sub>m</sub> = (1 + 10/100)<sup>1/12</sup> − 1 ≈ <strong>0.797%</strong> per
            month
          </div>
        </div>
        <table className="symbol-table">
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Alloc</th>
              <th>Rate</th>
              <th>Contribution</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Fixed Deposit', '20%', '7%', '1.40%'],
              ['Savings', '10%', '3.5%', '0.35%'],
              ['Equity Stocks', '25%', '12%', '3.00%'],
              ['Equity MF', '35%', '13%', '4.55%'],
              ['Debt MF', '10%', '7%', '0.70%'],
            ].map(([name, alloc, rate, contrib]) => (
              <tr key={name}>
                <td>{name}</td>
                <td>{alloc}</td>
                <td>{rate}</td>
                <td>{contrib}</td>
              </tr>
            ))}
            <tr className="total">
              <td colSpan={3}>Blended annual return R</td>
              <td>10.00%</td>
            </tr>
          </tbody>
        </table>
        <p className="symbol-note">
          On ₹5 Cr, one month of growth ≈ ₹5,00,00,000 × 0.797% ≈{' '}
          <strong>₹3.99 L</strong> — before any salary or withdrawal.
        </p>
      </div>
    </div>
  );
}

export function MonthlyLoopAnimation() {
  const [active, setActive] = useState(0);
  const loopSteps = [
    { icon: '🔄', title: 'Grow', desc: 'P × (1 + r_m)' },
    { icon: '➕', title: 'Working?', desc: 'Add salary surplus' },
    { icon: '➖', title: 'Retired?', desc: 'Subtract withdrawal + rent' },
    { icon: '📊', title: 'Check', desc: 'Is P ≥ 0?' },
    { icon: '🔁', title: 'Repeat', desc: 'Next month × 540 months' },
  ];

  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % loopSteps.length), 1200);
    return () => clearInterval(t);
  }, [loopSteps.length]);

  return (
    <div className="loop-animation">
      {loopSteps.map((s, i) => (
        <div
          key={s.title}
          className={`loop-step ${i === active ? 'active' : ''} ${i < active ? 'done' : ''}`}
        >
          <span className="loop-icon">{s.icon}</span>
          <strong>{s.title}</strong>
          <span>{s.desc}</span>
        </div>
      ))}
    </div>
  );
}
