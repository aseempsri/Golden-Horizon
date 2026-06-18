import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CorpusDemo,
  MonthlyLoopAnimation,
  SymbolsExplainer,
} from '../components/guide/CorpusDemo';
import '../styles/guide.css';

type Tab = 'overview' | 'meridian' | 'estate';

export function UserGuide() {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <div className="guide-page">
      <header className="guide-hero">
        <h1>How to Use Golden Horizon</h1>
        <p>
          A visual guide to both calculators — what every field means, why it exists,
          how panels are ordered, and exactly how your numbers become a retirement age
          or freedom-from-salary age.
        </p>
      </header>

      <div className="guide-tabs">
        {(
          [
            ['overview', 'Overview'],
            ['meridian', 'Freedom Meridian'],
            ['estate', 'Estate Sovereign'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`guide-tab ${tab === id ? `active ${id === 'estate' ? 'estate' : 'meridian'}` : ''}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'overview' && <OverviewSection />}
      {tab === 'meridian' && <MeridianSection />}
      {tab === 'estate' && <EstateSection />}

      <div className="guide-cta">
        <strong>Ready to run your numbers?</strong>
        <div className="guide-cta-links">
          <Link to="/" className="meridian">
            Open Freedom Meridian
          </Link>
          <Link to="/estate-sovereign" className="estate">
            Open Estate Sovereign
          </Link>
        </div>
      </div>
    </div>
  );
}

function OverviewSection() {
  return (
    <>
      <section className="guide-section">
        <div className="guide-section-title">
          <span className="guide-badge gold">?</span>
          <h2>Two calculators, one suite</h2>
        </div>
        <div className="guide-compare">
          <div className="guide-compare-col meridian">
            <h3>Freedom Meridian</h3>
            <ul>
              <li>
                <strong>Question:</strong> At what age can I stop working?
              </li>
              <li>You set a fixed monthly withdrawal at retirement</li>
              <li>Models cars, rent, and big travel as lump sums</li>
              <li>Gold theme — corpus countdown to age 90</li>
            </ul>
          </div>
          <div className="guide-compare-col estate">
            <h3>Estate Sovereign</h3>
            <ul>
              <li>
                <strong>Question:</strong> When can I live my full estate lifestyle
                without salary?
              </li>
              <li>Builds lifestyle cost from staff, travel, replacements</li>
              <li>Three-bucket savings discipline from passive income</li>
              <li>Teal theme — lifestyle sovereignty planner</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="guide-section">
        <div className="guide-section-title">
          <span className="guide-badge teal">↻</span>
          <h2>Shared simulation engine</h2>
        </div>
        <p style={{ color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
          Both calculators use the same core loop: month-by-month from your current age
          to <strong style={{ color: 'var(--text)' }}>age 90</strong>. Only{' '}
          <strong style={{ color: 'var(--text)' }}>liquid assets</strong> are modeled.
        </p>
        <div className="guide-timeline">
          <div className="guide-timeline-seg">
            <div className="guide-timeline-dot work">Work</div>
            <span>
              Salary surplus
              <br />
              added to corpus
            </span>
          </div>
          <div className="guide-timeline-seg">
            <div className="guide-timeline-dot retire">Free</div>
            <span>
              Withdrawals &amp;
              <br />
              lifestyle costs
            </span>
          </div>
          <div className="guide-timeline-seg">
            <div className="guide-timeline-dot end">90</div>
            <span>
              Nominee legacy
              <br />
              remaining corpus
            </span>
          </div>
        </div>
        <div className="guide-formula gold">
          Every month: Portfolio grows → inflows or outflows applied → check if corpus
          &lt; 0
          <br />
          <br />
          Blended return = Σ (allocation% × instrument return%)
          <br />
          Monthly rate r<sub>m</sub> = (1 + annual return)<sup>1/12</sup> − 1
        </div>
        <MonthlyLoopAnimation />
      </section>

      <section className="guide-section">
        <div className="guide-section-title">
          <span className="guide-badge gold">P</span>
          <h2>Understanding P and r<sub>m</sub> — with examples</h2>
        </div>
        <SymbolsExplainer />
        <CorpusDemo />
        <div className="guide-callout info">
          <strong>Quick read:</strong> P is your liquid money pot. r<sub>m</sub> is how fast
          it grows from investments each month (~0.8% at 10% annual return). Salary surplus
          adds to P while working; withdrawals and lifestyle costs drain P after
          retirement. The app runs this 540 times (45 years × 12 months) to find your
          freedom age.
        </div>
      </section>

      <section className="guide-section">
        <div className="guide-section-title">
          <span className="guide-badge gold">1</span>
          <h2>Page layout (both calculators)</h2>
        </div>
        <div className="guide-card-grid">
          <div className="guide-card gold">
            <h3>Left column — Inputs</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>
              Scroll top-to-bottom. Each panel builds on the previous. Fix portfolio
              allocation to 100% before calculating.
            </p>
          </div>
          <div className="guide-card teal">
            <h3>Right column — Results</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>
              Sticky on desktop. Shows earliest feasible age, stat cards, and corpus
              journey chart to age 90.
            </p>
          </div>
        </div>
        <div className="guide-callout warn">
          <strong>Not modeled:</strong> rental income, pension, business income, or
          non-liquid assets (e.g. owned house value). Complete retirement = zero salary
          after freedom/retirement age.
        </div>
      </section>
    </>
  );
}

function MeridianSection() {
  return (
    <>
      <section className="guide-section">
        <div className="guide-section-title">
          <span className="guide-badge gold">◎</span>
          <h2>Freedom Meridian — panel order &amp; why</h2>
        </div>
        <ol className="guide-panel-order">
          <li>
            <strong>You &amp; lifestyle</strong> — age, corpus, pre-retirement spend &amp;
            salary
          </li>
          <li>
            <strong>Liquid assets allocation</strong> — how corpus is invested &amp;
            expected returns
          </li>
          <li>
            <strong>Housing</strong> — own (no rent) vs rental with annual increase
          </li>
          <li>
            <strong>Cars</strong> — maintenance while working; future purchase lump sums
          </li>
          <li>
            <strong>Big travel plan</strong> — scheduled post-retirement trips
          </li>
          <li>
            <strong>Retirement withdrawals</strong> — monthly draw + inflation → Calculate
          </li>
        </ol>
      </section>

      <section className="guide-section">
        <div className="guide-section-title">
          <span className="guide-badge gold">2</span>
          <h2>How the calculation works</h2>
        </div>
        <div className="guide-flow">
          {[
            [
              'Try each retirement age',
              'From max(45, your age) up to 89, the app tests candidate ages one by one until corpus stays ≥ 0 through age 90.',
            ],
            [
              'Year-start lump sums',
              'Car purchases and big travel deduct from corpus once at the start of that calendar year.',
            ],
            [
              '12 monthly steps per year',
              'Corpus compounds monthly. While working: add salary surplus. After retirement: subtract withdrawal + rent.',
            ],
            [
              'Inflation compounds monthly',
              'Withdrawals and rent grow each month to match your annual inflation / rent-increase %.',
            ],
            [
              'First feasible age wins',
              'The earliest age that never hits zero is your Freedom Meridian — when salary becomes optional.',
            ],
          ].map(([title, body], i) => (
            <div key={title} className="guide-flow-step">
              <div className="guide-flow-num gold">{i + 1}</div>
              <div className="guide-flow-body">
                <h4>{title}</h4>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="guide-section">
        <div className="guide-section-title">
          <span className="guide-badge gold">3</span>
          <h2>Every input explained</h2>
        </div>
        <div className="guide-card-grid">
          <FieldCard
            theme="gold"
            title="Current age (45+)"
            mock="45"
            what="Your age today."
            why="Simulation runs from this age to 90."
            calc="Minimum 45. Earliest retirement cannot be below current age."
          />
          <FieldCard
            theme="gold"
            title="Total net worth (liquid)"
            mock="₹5.00 Cr"
            what="Cash, FDs, stocks, MFs — anything you can sell or draw from."
            why="Starting corpus P₀ for the entire journey."
            calc="Portfolio at age 45 = this number, then grows/shrinks monthly."
          />
          <FieldCard
            theme="gold"
            title="Monthly living expense"
            mock="₹2,00,000"
            what="What you spend each month while still working."
            why="Reduces salary surplus before retirement."
            calc="Surplus = Salary − Expense − Rent − Car maintenance"
          />
          <FieldCard
            theme="gold"
            title="Current salary (monthly)"
            mock="₹3,60,000"
            what="Take-home or gross monthly income while employed."
            why="Only added to corpus during working years."
            calc="Stops completely at retirement age — no partial work."
          />
          <FieldCard
            theme="gold"
            title="Portfolio allocation"
            mock="FD 20% · Equity MF 35% · …"
            what="Percentage split across 5 liquid instruments."
            why="Determines blended return — higher equity = higher growth, more risk."
            calc="Weighted return = Σ (weight × rate). Must total 100%."
          />
          <FieldCard
            theme="gold"
            title="Monthly withdrawal at retirement"
            mock="₹2,00,000"
            what="First-year monthly lifestyle draw from corpus after retiring."
            why="Core lifestyle cost the plan must sustain for 45+ years."
            calc="Grows by inflation % every month after retirement."
          />
          <FieldCard
            theme="gold"
            title="Annual inflation on withdrawals"
            mock="6%"
            what="How much your draw increases each year."
            why="Protects purchasing power — ₹2L today ≠ ₹2L at age 75."
            calc="Year 2 ≈ ₹2L × 1.06. Applied as 12 monthly steps."
          />
          <FieldCard
            theme="gold"
            title="Big travel plan"
            mock="Every 3 yrs · ₹10L start · +10%/yr"
            what="Up to 10 scheduled post-retirement trips in 25 years."
            why="Large lump sums that can push retirement age later."
            calc="Trip cost = 10L × 1.10^years since retirement. Stops auto at age 70."
          />
        </div>
      </section>

      <section className="guide-section">
        <div className="guide-section-title">
          <span className="guide-badge gold">4</span>
          <h2>Key formulas — what P and r<sub>m</sub> mean</h2>
        </div>
        <div className="guide-formula gold">
          <strong>Working years (each month):</strong>
          <br />
          P = P × (1 + r<sub>m</sub>) + (Salary − Expense − Rent − Car maint)
          <br />
          <br />
          <strong>Retired years (each month):</strong>
          <br />
          P = P × (1 + r<sub>m</sub>) − Withdrawal − Rent
          <br />
          Withdrawal ← Withdrawal × (1 + inflation<sub>m</sub>)
          <br />
          <br />
          <strong>Feasible</strong> if P never drops below 0 before age 90
        </div>
        <div className="guide-worked-example">
          <h4>Worked example — one working month with default inputs</h4>
          <table className="symbol-table">
            <tbody>
              <tr>
                <td>Starting P</td>
                <td>₹5.00 Cr (your liquid net worth)</td>
              </tr>
              <tr>
                <td>r<sub>m</sub> at 10% annual return</td>
                <td>≈ 0.797% → growth ≈ ₹3.99 L</td>
              </tr>
              <tr>
                <td>Salary surplus</td>
                <td>₹3.6L − ₹2L − ₹20K car = <strong>+₹1.4 L</strong></td>
              </tr>
              <tr className="total">
                <td>New P after 1 month</td>
                <td>₹5.00 Cr + ₹3.99 L + ₹1.4 L ≈ <strong>₹5.18 Cr</strong></td>
              </tr>
            </tbody>
          </table>
          <h4>Same corpus — first retired month (₹2L withdrawal, own house)</h4>
          <table className="symbol-table">
            <tbody>
              <tr>
                <td>Starting P</td>
                <td>₹5.18 Cr</td>
              </tr>
              <tr>
                <td>Investment growth</td>
                <td>≈ +₹4.13 L</td>
              </tr>
              <tr>
                <td>Withdrawal</td>
                <td>−₹2.00 L</td>
              </tr>
              <tr className="total">
                <td>New P</td>
                <td>≈ <strong>₹5.20 Cr</strong> (corpus still growing if return &gt; draw)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.88rem', marginBottom: '1rem' }}>
          See the <strong style={{ color: 'var(--text)' }}>Overview → P and r<sub>m</sub></strong>{' '}
          tab for the animated month-by-month demo and allocation breakdown table.
        </p>
        <div className="guide-callout info">
          <strong>Results panel:</strong> &quot;At age 90 — corpus remaining&quot; is what
          your nominee inherits. &quot;Can retire today&quot; appears when your current age
          is already feasible.
        </div>
      </section>
    </>
  );
}

function EstateSection() {
  return (
    <>
      <section className="guide-section">
        <div className="guide-section-title">
          <span className="guide-badge teal">♛</span>
          <h2>Estate Sovereign — panel order &amp; why</h2>
        </div>
        <ol className="guide-panel-order">
          <li>
            <strong>You &amp; corpus</strong> — age, liquid net worth, salary, pre-freedom
            expense
          </li>
          <li>
            <strong>Liquid assets allocation</strong> — same 5 instruments as Meridian
          </li>
          <li>
            <strong>Passive income &amp; buckets</strong> — income floor + 3 savings buckets
          </li>
          <li>
            <strong>Travel &amp; inheritance</strong> — holidays + native trips per year
          </li>
          <li>
            <strong>Estate staff</strong> — driver, cook, cleaning, estate manager
          </li>
          <li>
            <strong>House &amp; upkeep</strong> — purchase at freedom or already owned
          </li>
          <li>
            <strong>Replacements &amp; upgrades</strong> — car, white goods, furnishing,
            gadgets
          </li>
          <li>
            <strong>Live cost preview</strong> — year-1 totals → Calculate freedom age
          </li>
        </ol>
      </section>

      <section className="guide-section">
        <div className="guide-section-title">
          <span className="guide-badge teal">2</span>
          <h2>Three-bucket savings model</h2>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          From your passive income target (default ₹2.75L/mo), a portion is earmarked for
          three buckets. These are tracked for planning — lifestyle drain is what actually
          reduces corpus each month.
        </p>
        <div className="guide-bucket-viz">
          <span className="b1">Inflation 15%</span>
          <span className="b2">Contingency 10%</span>
          <span className="b3">Big-ticket 15%</span>
          <span className="spend">Lifestyle spend ~60%</span>
        </div>
        <div className="guide-card-grid">
          <div className="guide-card teal">
            <h3>Bucket 1 — Inflation offset</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>
              Long-term corpus growth to beat lifestyle inflation over decades.
            </p>
          </div>
          <div className="guide-card copper">
            <h3>Bucket 2 — Contingency</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>
              Medical, legal, and unexpected estate shocks.
            </p>
          </div>
          <div className="guide-card teal">
            <h3>Bucket 3 — Big-ticket leisure</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>
              Extended holidays and emergency lifestyle spends beyond the schedule.
            </p>
          </div>
        </div>
      </section>

      <section className="guide-section">
        <div className="guide-section-title">
          <span className="guide-badge teal">3</span>
          <h2>How lifestyle cost is built</h2>
        </div>
        <div className="guide-form-map">
          <div className="guide-form-row">
            <span className="label">Monthly recurring</span>
            <span className="value">
              Staff salaries + house maintenance
              <span className="arrow"> → deducted every month after freedom</span>
            </span>
          </div>
          <div className="guide-form-row">
            <span className="label">Annual lumps (year 1)</span>
            <span className="value">
              2× family holidays + 4× native trips + Diwali furnishing + gadgets
              <span className="arrow"> → deducted once per year</span>
            </span>
          </div>
          <div className="guide-form-row">
            <span className="label">Cycle replacements</span>
            <span className="value">
              Car (5 yr) · White goods (7 yr) · Major furnishing (7 yr)
              <span className="arrow"> → lump sum in cycle years</span>
            </span>
          </div>
          <div className="guide-form-row">
            <span className="label">House purchase</span>
            <span className="value">
              One-time at freedom age if not already owned
              <span className="arrow"> → year 1 lump only</span>
            </span>
          </div>
          <div className="guide-form-row">
            <span className="label">Inflation (5%+)</span>
            <span className="value">
              All lifestyle costs × (1.05)<sup>years since freedom</sup>
              <span className="arrow"> → rises each year</span>
            </span>
          </div>
        </div>
        <div className="guide-formula teal">
          <strong>Year-1 preview (live panel):</strong>
          <br />
          Net monthly drain = Staff + House maint + (Annual lumps ÷ 12)
          <br />
          Total annual outflow = (Net monthly × 12) + Annual lumps
          <br />
          <br />
          <strong>Freedom age search:</strong> same as Meridian — try each age until corpus
          survives to 90 with full lifestyle.
        </div>
      </section>

      <section className="guide-section">
        <div className="guide-section-title">
          <span className="guide-badge teal">4</span>
          <h2>Every input explained</h2>
        </div>
        <div className="guide-card-grid">
          <FieldCard
            theme="teal"
            title="Passive income target"
            mock="₹2,75,000 / mo"
            what="Minimum inflation-protected income floor (client brief: ₹2.5–3L/mo)."
            why="Anchors bucket savings percentages."
            calc="Bucket monthly = target × (bucket1% + bucket2% + bucket3%)"
          />
          <FieldCard
            theme="teal"
            title="Extended-family holidays"
            mock="2 trips × ₹6L"
            what="Large trips with extended family each year."
            why="Major annual lump — default ₹12L/year."
            calc="Deducted once per year, inflated from freedom age."
          />
          <FieldCard
            theme="teal"
            title="Native inheritance trips"
            mock="4 trips × ₹75K"
            what="Trips to manage property/inheritance at native place."
            why="Recurring annual cost separate from big holidays."
            calc="4 × cost × inflation factor, yearly lump."
          />
          <FieldCard
            theme="teal"
            title="Estate staff"
            mock="Driver · Cook · Cleaning · Manager"
            what="Full-time help monthly salaries."
            why="Core recurring estate running cost."
            calc="Sum of 4 salaries × inflation, every month after freedom."
          />
          <FieldCard
            theme="teal"
            title="Car replacement"
            mock="₹50L every 5 years"
            what="New car purchase on a fixed cycle."
            why="Large periodic lump — not every year."
            calc="Deducted in years 5, 10, 15… after freedom (not year 0)."
          />
          <FieldCard
            theme="teal"
            title="Pre-freedom monthly expense"
            mock="₹2,50,000"
            what="Living costs while still on salary."
            why="Reduces how much salary adds to corpus before freedom."
            calc="Surplus = Salary − Pre-freedom expense (monthly)"
          />
        </div>
      </section>

      <section className="guide-section">
        <div className="guide-section-title">
          <span className="guide-badge teal">5</span>
          <h2>Results panel metrics</h2>
        </div>
        <div className="guide-card-grid">
          <div className="guide-card teal">
            <h3>Freedom age</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>
              Earliest age salary can end while sustaining your full estate lifestyle to
              90.
            </p>
          </div>
          <div className="guide-card teal">
            <h3>Monthly lifestyle drain</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>
              Recurring staff + house + amortized annual costs (year-1 equivalent).
            </p>
          </div>
          <div className="guide-card copper">
            <h3>Annual lifestyle outflow</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>
              Total yearly cost including all lumps — the true estate budget.
            </p>
          </div>
          <div className="guide-card teal">
            <h3>Corpus at 90</h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--muted)' }}>
              What remains for your nominee if the plan is feasible.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function FieldCard({
  theme,
  title,
  mock,
  what,
  why,
  calc,
}: {
  theme: 'gold' | 'teal' | 'copper';
  title: string;
  mock: string;
  what: string;
  why: string;
  calc: string;
}) {
  return (
    <div className={`guide-card ${theme}`}>
      <h3>{title}</h3>
      <div className="field-mock">{mock}</div>
      <dl>
        <dt>What</dt>
        <dd>{what}</dd>
        <dt>Why it&apos;s here</dt>
        <dd>{why}</dd>
        <dt>In the calculation</dt>
        <dd>{calc}</dd>
      </dl>
    </div>
  );
}
