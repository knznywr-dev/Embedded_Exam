import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { SourceRef } from '../../components/ui';
import { Field } from '../calculators/CalcCard';
import {
  calcPwmDuty,
  calcPwmFrequency,
  calcPwmOffTime,
  formatValue,
  parseNumber,
} from '../../lib/formulas';

function Waveform({ onProportion }: { onProportion: number }) {
  const width = 640;
  const height = 180;
  const padX = 24;
  const highY = 48;
  const lowY = 132;
  const cycles = 2;
  const cycleWidth = (width - padX * 2) / cycles;
  const highWidth = cycleWidth * onProportion;
  let x = padX;
  let d = `M ${x} ${highY}`;
  for (let cycle = 0; cycle < cycles; cycle += 1) {
    x += highWidth;
    d += ` H ${x}`;
    d += ` V ${lowY}`;
    x += cycleWidth - highWidth;
    d += ` H ${x}`;
    if (cycle < cycles - 1) d += ` V ${highY}`;
  }

  return (
    <div className="pwm-wave-wrap">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="pwm-wave"
        role="img"
        aria-label={`PWM waveform with ${formatValue(onProportion * 100)} percent duty cycle`}
      >
        <defs>
          <linearGradient id="pwm-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.01" />
          </linearGradient>
        </defs>
        <line x1={padX} y1={highY} x2={width - padX} y2={highY} className="pwm-guide" />
        <line x1={padX} y1={lowY} x2={width - padX} y2={lowY} className="pwm-guide" />
        <text x={padX - 12} y={highY + 4} className="pwm-axis-label" textAnchor="end">
          HIGH
        </text>
        <text x={padX - 12} y={lowY + 4} className="pwm-axis-label" textAnchor="end">
          LOW
        </text>
        <path d={`${d} V ${highY}`} className="pwm-fill" fill="url(#pwm-fill)" />
        <path d={d} className="pwm-line" />
        <line x1={padX + cycleWidth} y1={20} x2={padX + cycleWidth} y2={160} className="pwm-period-line" />
        <text x={padX + cycleWidth / 2} y={16} className="pwm-period-label" textAnchor="middle">
          period
        </text>
        {onProportion > 0.04 ? (
          <text
            x={padX + highWidth / 2}
            y={highY - 10}
            className="pwm-on-label"
            textAnchor="middle"
          >
            ON
          </text>
        ) : null}
        {onProportion < 0.96 ? (
          <text
            x={padX + highWidth + (cycleWidth - highWidth) / 2}
            y={lowY + 24}
            className="pwm-off-label"
            textAnchor="middle"
          >
            OFF
          </text>
        ) : null}
      </svg>
      <span className="pwm-scan-line" aria-hidden="true" />
    </div>
  );
}

export function PwmVisualizer() {
  const [onTime, setOnTime] = useState('5');
  const [period, setPeriod] = useState('10');

  const on = parseNumber(onTime);
  const t = parseNumber(period);
  const dutyResult =
    on === null || t === null || onTime.trim() === '' || period.trim() === ''
      ? null
      : calcPwmDuty(on, t);
  const offResult =
    on === null || t === null || onTime.trim() === '' || period.trim() === ''
      ? null
      : calcPwmOffTime(on, t, 'ms');
  const frequencyResult =
    t === null || period.trim() === '' || t <= 0 ? null : calcPwmFrequency(t / 1000);

  const valid = Boolean(dutyResult?.ok && offResult?.ok);
  const onProportion = valid && dutyResult?.ok ? dutyResult.value / 100 : 0.5;
  const error = dutyResult && !dutyResult.ok ? dutyResult.error : null;

  const quickExample = () => {
    setOnTime('5');
    setPeriod('10');
  };

  return (
    <div className="pwm-demo">
      <div className="pwm-controls">
        <Field label="ON Time" unit="ms" value={onTime} onChange={setOnTime} placeholder="5" min={0} />
        <Field label="Period" unit="ms" value={period} onChange={setPeriod} placeholder="10" min={0} />
        <div className="pwm-control-actions">
          <button type="button" className="btn btn-secondary btn-small" onClick={quickExample}>
            <Icon name="spark" size={14} /> Use 5 ms / 10 ms
          </button>
        </div>
      </div>

      <div className="pwm-wave-panel">
        <div className="pwm-wave-head">
          <span>
            <Icon name="formula" size={15} /> Waveform for the entered values
          </span>
          <SourceRef page={5} />
        </div>
        {valid ? (
          <Waveform onProportion={onProportion} />
        ) : (
          <div className={`pwm-wave-empty ${error ? 'is-error' : ''}`}>
            <Icon name={error ? 'warning' : 'info'} size={22} />
            <span>{error ?? 'Enter ON time and period values to draw the waveform.'}</span>
          </div>
        )}
        <p className="pwm-caveat">
          Visual representation of the entered values only. This is not a claim about a particular
          Arduino board’s PWM frequency.
        </p>
      </div>

      <div className="pwm-results" aria-live="polite">
        <div className="pwm-result-card">
          <span>Duty Cycle</span>
          <strong>{valid && dutyResult?.ok ? `${formatValue(dutyResult.value)}%` : '—'}</strong>
          <small>Duty Cycle = (ON Time / Period) × 100</small>
        </div>
        <div className="pwm-result-card">
          <span>OFF Time</span>
          <strong>{valid && offResult?.ok ? `${formatValue(offResult.value)} ms` : '—'}</strong>
          <small>OFF Time = Period − ON Time</small>
        </div>
        <div className="pwm-result-card">
          <span>Frequency</span>
          <strong>
            {valid && frequencyResult?.ok ? `${formatValue(frequencyResult.value)} Hz` : '—'}
          </strong>
          <small>Frequency = 1 / Period (period converted to seconds)</small>
        </div>
      </div>

      {valid && dutyResult?.ok ? (
        <div className="pwm-substitution">
          <code>{dutyResult.substitution}</code>
          {offResult?.ok ? <code>{offResult.substitution}</code> : null}
          {frequencyResult?.ok ? <code>{frequencyResult.substitution}</code> : null}
        </div>
      ) : null}

      <div className="pwm-notes">
        <div>
          <Icon name="bulb" size={17} />
          <span>
            A higher duty cycle generally means more average power delivered to the load. For an
            LED, this means greater brightness.
          </span>
        </div>
        <div>
          <Icon name="info" size={17} />
          <span>
            The reviewer’s source example is 5 ms ON time with a 10 ms period, giving a 50% duty
            cycle.
          </span>
        </div>
      </div>
    </div>
  );
}
