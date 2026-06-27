import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { HousingType } from '../types';
import { formatINR } from '../lib/format';

export interface SalaryDisclaimerProps {
  currentAge: number;
  retirementAge: number | null;
  currentSalary: number;
  monthlyExpense: number;
  monthlyWithdrawal: number;
  housingType: HousingType;
  monthlyRent: number;
  carsOwned: number;
  carMaintenanceMonthly: number;
  endLabel?: string;
}

function SalaryDisclaimerContent({
  currentAge,
  retirementAge,
  currentSalary,
  monthlyExpense,
  monthlyWithdrawal,
  housingType,
  monthlyRent,
  carsOwned,
  carMaintenanceMonthly,
  endLabel = 'retirement',
}: SalaryDisclaimerProps) {
  const rentOutflow = housingType === 'rental' ? monthlyRent : 0;
  const carMaint = carsOwned * carMaintenanceMonthly;
  const surplus = currentSalary - monthlyExpense - rentOutflow - carMaint;
  const lastWorkingAge = retirementAge != null ? retirementAge - 1 : null;

  const salaryLine =
    retirementAge != null && lastWorkingAge != null && lastWorkingAge >= currentAge ? (
      <>
        In this app, you are assumed to earn{' '}
        <strong>{formatINR(currentSalary)}/month</strong> salary from age{' '}
        <strong>{currentAge}</strong> through <strong>{lastWorkingAge}</strong>. At{' '}
        <strong>{retirementAge}</strong>, salary stops completely.
      </>
    ) : (
      <>
        While you are still working, this app assumes a fixed salary of{' '}
        <strong>{formatINR(currentSalary)}/month</strong> starting at age{' '}
        <strong>{currentAge}</strong>. Salary ends completely in the year you reach your
        calculated {endLabel} age — run <strong>Calculate</strong> to see that year.
      </>
    );

  return (
    <div className="salary-disclaimer">
      <p className="salary-disclaimer__lead">{salaryLine}</p>

      <h4 className="salary-disclaimer__heading">
        Ages {currentAge}
        {lastWorkingAge != null && lastWorkingAge >= currentAge
          ? `–${lastWorkingAge}`
          : '+'}{' '}
        (still working)
      </h4>
      <p className="salary-disclaimer__text">The model treats your salary as:</p>
      <ul className="salary-disclaimer__list">
        <li>
          <strong>Fixed at {formatINR(currentSalary, true)}/month</strong> — no raises, no
          inflation on salary
        </li>
        <li>
          Paid every month until the year you turn{' '}
          {retirementAge != null ? (
            <strong>{retirementAge}</strong>
          ) : (
            <>your calculated {endLabel} age</>
          )}
        </li>
        <li>
          <strong>Not all of it is saved</strong> — only the surplus goes into your corpus:
          <div className="salary-disclaimer__formula">
            surplus = salary − monthly living expense − rent − car maintenance
          </div>
        </li>
      </ul>

      <p className="salary-disclaimer__text">With your current inputs:</p>
      <table className="salary-disclaimer__table">
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Salary in</td>
            <td>{formatINR(currentSalary)}</td>
          </tr>
          <tr>
            <td>Living expense</td>
            <td>− {formatINR(monthlyExpense)}</td>
          </tr>
          {housingType === 'rental' && (
            <tr>
              <td>Rent</td>
              <td>− {formatINR(monthlyRent)}</td>
            </tr>
          )}
          {carsOwned > 0 && (
            <tr>
              <td>
                Car maintenance ({carsOwned} car{carsOwned !== 1 ? 's' : ''})
              </td>
              <td>− {formatINR(carMaint)}</td>
            </tr>
          )}
          <tr className="salary-disclaimer__total">
            <td>Added to corpus</td>
            <td>
              {surplus >= 0 ? '~' : ''}
              {formatINR(surplus)}/month
            </td>
          </tr>
        </tbody>
      </table>
      <p className="salary-disclaimer__text">
        You still earn your full salary while working — only the leftover after expenses grows
        your liquid net worth.
      </p>

      <h4 className="salary-disclaimer__heading">
        From age {retirementAge ?? `your ${endLabel} age`} ({endLabel})
      </h4>
      <ul className="salary-disclaimer__list">
        <li>
          <strong>Salary = ₹0</strong> — work income ends
        </li>
        <li>
          You live on <strong>portfolio withdrawals</strong> (
          {formatINR(monthlyWithdrawal)}/month at {endLabel}, rising with inflation)
        </li>
        <li>You do not continue receiving {formatINR(currentSalary, true)} from a job</li>
      </ul>

      <h4 className="salary-disclaimer__heading">What this app does not model</h4>
      <ul className="salary-disclaimer__list salary-disclaimer__list--compact">
        <li>Salary increases before {endLabel}</li>
        <li>Partial {endLabel} or freelance income after</li>
        <li>Pension or rental income</li>
      </ul>

      <p className="salary-disclaimer__oneline">
        <strong>In one line:</strong>{' '}
        {retirementAge != null ? (
          <>
            {endLabel.charAt(0).toUpperCase() + endLabel.slice(1)} age{' '}
            <strong>{retirementAge}</strong> means {formatINR(currentSalary, true)} salary until
            you turn {retirementAge}, then zero salary and withdrawals from your corpus. To match
            salary-level spending after {endLabel}, set monthly withdrawal at {endLabel} to{' '}
            <strong>{formatINR(currentSalary)}</strong> (not {formatINR(monthlyWithdrawal, true)}
            ).
          </>
        ) : (
          <>
            Fixed salary until your calculated {endLabel} age, then zero salary and corpus
            withdrawals. For salary-level spending after {endLabel}, set monthly withdrawal to{' '}
            <strong>{formatINR(currentSalary)}</strong>.
          </>
        )}
      </p>
    </div>
  );
}

const PANEL_WIDTH = 541;

/** Circled “i” next to salary label; full disclaimer on hover / focus */
export function SalaryInfoTooltip(props: SalaryDisclaimerProps) {
  const tooltipId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const maxLeft = window.innerWidth - PANEL_WIDTH - 16;
    setCoords({
      top: rect.bottom + 8,
      left: Math.max(16, Math.min(rect.left, maxLeft)),
    });
  }, []);

  const show = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    updatePosition();
    setOpen(true);
  }, [updatePosition]);

  const hide = useCallback(() => {
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onScrollOrResize = () => updatePosition();
    window.addEventListener('scroll', onScrollOrResize, true);
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [open, updatePosition]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  return (
    <span className="info-tooltip">
      <button
        ref={triggerRef}
        type="button"
        className="info-tooltip__trigger"
        aria-label="How salary is modeled in this plan"
        aria-describedby={open ? tooltipId : undefined}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        i
      </button>
      {open &&
        createPortal(
          <div
            id={tooltipId}
            className="info-tooltip__panel info-tooltip__panel--portal"
            style={{ top: coords.top, left: coords.left }}
            role="tooltip"
            onMouseEnter={show}
            onMouseLeave={hide}
          >
            <SalaryDisclaimerContent {...props} />
          </div>,
          document.body,
        )}
    </span>
  );
}

/** @deprecated Use SalaryInfoTooltip */
export const SalaryDisclaimer = SalaryInfoTooltip;
