import { useId, type ReactNode } from 'react';
import { Icon } from '../../components/Icon';
import { MathText, SourceRef } from '../../components/ui';
import type { CalcResult } from '../../lib/formulas';
import type { PageRef } from '../../types';

export function Field({
  label,
  value,
  onChange,
  unit,
  placeholder,
  hint,
  min,
  step,
  inputMode = 'decimal',
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  unit?: string;
  placeholder?: string;
  hint?: string;
  min?: number;
  step?: number | string;
  inputMode?: 'decimal' | 'numeric';
}) {
  const id = useId();
  const describedBy = hint ? `${id}-hint` : undefined;
  return (
    <label className="field" htmlFor={id}>
      <span className="field-label">
        {label}
        {unit ? <em>({unit})</em> : null}
      </span>
      <span className="field-input-wrap">
        <input
          id={id}
          type="number"
          inputMode={inputMode}
          value={value}
          min={min}
          step={step ?? 'any'}
          placeholder={placeholder}
          aria-describedby={describedBy}
          onChange={(event) => onChange(event.target.value)}
        />
        {unit ? <span className="field-unit">{unit}</span> : null}
      </span>
      {hint ? (
        <span className="field-hint" id={describedBy}>
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function CalcCard({
  id,
  title,
  expression,
  description,
  sourcePage,
  result,
  children,
  onUseExample,
  exampleLabel,
  note,
  footer,
}: {
  id?: string;
  title: string;
  expression: string;
  description?: string;
  sourcePage: PageRef;
  result: CalcResult | null;
  children: ReactNode;
  onUseExample?: () => void;
  exampleLabel?: string;
  note?: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="calc-card" id={id}>
      <div className="calc-head">
        <div>
          <h3>{title}</h3>
          {description ? <p>{description}</p> : null}
        </div>
        <SourceRef page={sourcePage} />
      </div>
      <div className="calc-formula">
        <Icon name="formula" size={16} />
        <MathText text={expression} />
      </div>
      <div className="calc-fields">{children}</div>
      {onUseExample ? (
        <button type="button" className="btn btn-ghost btn-small calc-example-button" onClick={onUseExample}>
          <Icon name="spark" size={14} /> {exampleLabel ?? 'Use the reviewer’s example'}
        </button>
      ) : null}
      <div className="calc-result-region" aria-live="polite">
        {result === null ? (
          <div className="calc-result calc-result-empty">
            <span>Enter the values above to see the substitution and result.</span>
          </div>
        ) : !result.ok ? (
          <div className="calc-result calc-result-error" role="alert">
            <Icon name="warning" size={17} />
            <span>{result.error}</span>
          </div>
        ) : (
          <div className="calc-result">
            <span className="calc-result-label">Result</span>
            <div className="calc-result-value">
              {result.display} <span>{result.unit}</span>
            </div>
            <div className="calc-substitution">
              <code>{result.substitution}</code>
            </div>
            {result.extra ? <p className="calc-extra">{result.extra}</p> : null}
          </div>
        )}
      </div>
      {note ? <div className="calc-note">{note}</div> : null}
      {footer}
    </section>
  );
}
