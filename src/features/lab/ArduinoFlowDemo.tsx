import { useEffect, useMemo, useState } from 'react';
import { Icon } from '../../components/Icon';
import { SourceRef } from '../../components/ui';

const CODE_LINES = [
  'void setup() {',
  '    pinMode(13, OUTPUT);',
  '}',
  '',
  'void loop() {',
  '    digitalWrite(13, HIGH);',
  '    delay(1000);',
  '',
  '    digitalWrite(13, LOW);',
  '    delay(1000);',
  '}',
];

const STEPS = [
  {
    label: 'setup() runs once',
    detail: 'pinMode(13, OUTPUT) configures pin 13 as an output.',
    lines: [0, 1, 2],
    ledOn: false,
  },
  {
    label: 'Turn LED ON',
    detail: 'digitalWrite(13, HIGH) turns the LED ON.',
    lines: [5],
    ledOn: true,
  },
  {
    label: 'Wait one second',
    detail: 'delay(1000) pauses for 1,000 milliseconds.',
    lines: [6],
    ledOn: true,
  },
  {
    label: 'Turn LED OFF',
    detail: 'digitalWrite(13, LOW) turns the LED OFF.',
    lines: [8],
    ledOn: false,
  },
  {
    label: 'Wait one second',
    detail: 'delay(1000) pauses for another 1,000 milliseconds.',
    lines: [9],
    ledOn: false,
  },
  {
    label: 'loop() repeats',
    detail: 'The loop() function automatically repeats while the board is powered.',
    lines: [4],
    ledOn: false,
  },
];

export function ArduinoFlowDemo() {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setStep((current) => (current + 1) % STEPS.length);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [running]);

  const current = STEPS[step];
  const highlighted = useMemo(() => new Set(current.lines), [current]);

  return (
    <div className="arduino-flow">
      <div className="flow-top">
        <div className="flow-diagram" aria-label="Program flow: setup runs once, loop repeats">
          <div className={`flow-node ${step === 0 ? 'is-active' : ''}`}>
            <span className="flow-node-icon">
              <Icon name="play" size={16} />
            </span>
            <div>
              <strong>setup()</strong>
              <span>Runs once at startup or reset</span>
            </div>
          </div>
          <span className="flow-arrow">
            <Icon name="arrow-right" size={18} />
          </span>
          <div className={`flow-node flow-loop ${step >= 1 && step <= 5 ? 'is-active' : ''}`}>
            <span className="flow-node-icon">
              <Icon name="refresh" size={16} />
            </span>
            <div>
              <strong>loop()</strong>
              <span>Repeats while powered</span>
            </div>
          </div>
          <span className="flow-loopback">
            <Icon name="refresh" size={15} /> repeats
          </span>
        </div>
        <div className="flow-controls">
          <button
            type="button"
            className="btn btn-primary btn-small"
            onClick={() => setRunning((value) => !value)}
            aria-pressed={running}
          >
            <Icon name={running ? 'pause' : 'play'} size={14} />
            {running ? 'Pause' : 'Play'}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={() => {
              setRunning(false);
              setStep((currentStep) => (currentStep + 1) % STEPS.length);
            }}
          >
            <Icon name="step" size={14} /> Step
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-small"
            onClick={() => {
              setRunning(false);
              setStep(0);
            }}
          >
            <Icon name="refresh" size={14} /> Reset
          </button>
        </div>
      </div>

      <div className="flow-main">
        <div className="flow-code" aria-label="LED blink code from the reviewer">
          <div className="flow-code-head">
            <span>LED blink example</span>
            <SourceRef page={2} />
          </div>
          <pre>
            {CODE_LINES.map((line, index) => (
              <div
                key={index}
                className={`code-line ${highlighted.has(index) ? 'is-highlighted' : ''}`}
              >
                <span className="code-line-number">{index + 1}</span>
                <code>{line || ' '}</code>
              </div>
            ))}
          </pre>
        </div>
        <div className="flow-stage">
          <div className={`flow-led ${current.ledOn ? 'is-on' : ''}`} aria-label={current.ledOn ? 'LED is ON' : 'LED is OFF'}>
            <span className="flow-led-glow" />
            <span className="flow-led-bulb" />
            <span className="flow-led-base" />
          </div>
          <div className="flow-stage-copy" aria-live="polite">
            <span className="detail-kicker">
              Step {step + 1} of {STEPS.length}
            </span>
            <h4>{current.label}</h4>
            <p>{current.detail}</p>
            <span className={`state-pill ${current.ledOn ? 'state-on' : 'state-off'}`}>
              LED {current.ledOn ? 'ON' : 'OFF'}
            </span>
          </div>
        </div>
      </div>

      <div className="demo-foot">
        <SourceRef page={[2, 3]} />
        <span>
          Teaching visualization of the reviewer’s PDF example. The ON and OFF intervals shown are
          the reviewer’s delay(1000) values.
        </span>
      </div>
    </div>
  );
}
