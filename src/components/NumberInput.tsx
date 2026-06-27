export interface NumberInputProps {
  id?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  ariaLabel?: string;
  className?: string;
  /** Shown after the field (e.g. "%") */
  suffix?: string;
  /** Compact width for allocation rows */
  compact?: boolean;
  /** Value used when the field is cleared on blur */
  emptyFallback?: number;
}

function roundToStep(n: number, step: number): number {
  const decimals = String(step).includes('.') ? String(step).split('.')[1].length : 0;
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}

function applyBounds(
  value: number,
  min?: number,
  max?: number,
): number {
  let result = value;
  if (min !== undefined) result = Math.max(min, result);
  if (max !== undefined) result = Math.min(max, result);
  return result;
}

function parseValue(
  raw: string,
  min: number | undefined,
  max: number | undefined,
  emptyFallback: number | undefined,
): number {
  const parsed = parseFloat(raw);
  const fallback = emptyFallback ?? min ?? 0;
  const base = Number.isNaN(parsed) ? fallback : parsed;
  return applyBounds(base, min, max);
}

export function NumberInput({
  id,
  value,
  min,
  max,
  step = 1,
  onChange,
  ariaLabel,
  className,
  suffix,
  compact = false,
  emptyFallback,
}: NumberInputProps) {
  const stepUp = () => {
    onChange(applyBounds(roundToStep(value + step, step), min, max));
  };

  const stepDown = () => {
    onChange(applyBounds(roundToStep(value - step, step), min, max));
  };

  const wrapClass = [
    compact ? 'number-input-wrap number-input-wrap--compact' : 'number-input-wrap',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={wrapClass}>
      <div className="number-input-field">
        <input
          id={id}
          type="number"
          className="number-input"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const raw = e.target.value;
            if (raw === '' || raw === '-') return;
            onChange(parseValue(raw, min, max, emptyFallback));
          }}
          onBlur={(e) => {
            onChange(parseValue(e.target.value, min, max, emptyFallback));
          }}
          aria-label={ariaLabel}
        />
        <div className="number-stepper" aria-hidden="true">
          <button type="button" className="number-stepper__btn" onClick={stepUp} tabIndex={-1}>
            ▲
          </button>
          <button type="button" className="number-stepper__btn" onClick={stepDown} tabIndex={-1}>
            ▼
          </button>
        </div>
      </div>
      {suffix ? (
        <span className="number-input-suffix" aria-hidden="true">
          {suffix}
        </span>
      ) : null}
    </div>
  );
}
