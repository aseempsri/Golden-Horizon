import { INSTRUMENTS } from '../constants';
import { NumberInput } from './NumberInput';
import type { InstrumentKey, PortfolioAllocation, PortfolioRates } from '../types';
import { allocationTotal } from '../lib/calculator';

interface Props {
  allocation: PortfolioAllocation;
  rates: PortfolioRates;
  onAllocationChange: (key: InstrumentKey, value: number) => void;
  onRateChange: (key: InstrumentKey, value: number) => void;
}

export function PortfolioAllocator({
  allocation,
  rates,
  onAllocationChange,
  onRateChange,
}: Props) {
  const total = allocationTotal(allocation);
  const isValid = Math.abs(total - 100) < 0.5;

  return (
    <div className="panel">
      <h3 className="panel-title">Liquid assets allocation</h3>
      <div className="allocation-bar">
        {INSTRUMENTS.map((inst) => (
          <span
            key={inst.key}
            style={{
              width: `${allocation[inst.key]}%`,
              background: inst.color,
            }}
            title={`${inst.shortLabel}: ${allocation[inst.key]}%`}
          />
        ))}
      </div>
      <p className={`allocation-total ${isValid ? 'ok' : 'warn'}`}>
        Total: {total.toFixed(0)}% {isValid ? '✓' : '— should equal 100%'}
      </p>

      {INSTRUMENTS.map((inst) => (
        <div key={inst.key} className="instrument-row">
          <div className="instrument-label">
            <span className="instrument-dot" style={{ background: inst.color }} />
            {inst.label}
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={allocation[inst.key]}
            onChange={(e) =>
              onAllocationChange(inst.key, Number(e.target.value))
            }
            aria-label={`${inst.label} allocation`}
          />
          <NumberInput
            compact
            suffix="%"
            value={allocation[inst.key]}
            min={0}
            max={100}
            step={1}
            onChange={(v) => onAllocationChange(inst.key, v)}
            ariaLabel={`${inst.label} allocation percent`}
          />
        </div>
      ))}

      <p className="hint" style={{ marginTop: '1rem' }}>
        Expected annual return per instrument (%)
      </p>
      {INSTRUMENTS.map((inst) => (
        <div key={`rate-${inst.key}`} className="instrument-row">
          <span className="instrument-label" style={{ fontSize: '0.85rem' }}>
            {inst.shortLabel} ({inst.minRate}–{inst.maxRate}%)
          </span>
          <input
            type="range"
            min={inst.minRate}
            max={inst.maxRate}
            step={0.5}
            value={rates[inst.key]}
            onChange={(e) => onRateChange(inst.key, Number(e.target.value))}
            aria-label={`${inst.label} return rate`}
          />
          <NumberInput
            compact
            suffix="%"
            value={rates[inst.key]}
            min={inst.minRate}
            max={inst.maxRate}
            step={0.5}
            onChange={(v) => onRateChange(inst.key, v)}
            ariaLabel={`${inst.label} return rate percent`}
          />
        </div>
      ))}
    </div>
  );
}
