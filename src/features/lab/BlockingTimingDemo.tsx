import { useEffect, useRef, useState } from 'react';
import { Icon } from '../../components/Icon';
import { SourceRef } from '../../components/ui';

type Mode = 'delay' | 'millis';

const DURATION = 3000;
const INTERVAL = 1000;

function delayDetection(pressAt: number): number | null {
  // The blocking loop only returns to check the buttons when delay() ends.
  const checks = [0, INTERVAL, INTERVAL * 2, DURATION];
  return checks.find((check) => check >= pressAt) ?? null;
}

export function BlockingTimingDemo() {
  const [mode, setMode] = useState<Mode>('delay');
  const [pressAt, setPressAt] = useState<number | null>(null);
  const [clock, setClock] = useState(0);
  const [running, setRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    timerRef.current = window.setInterval(() => {
      setClock((current) => {
        if (current >= DURATION) {
          setRunning(false);
          return DURATION;
        }
        return current + 60;
      });
    }, 60);
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, [running]);

  const detectedAt =
    pressAt === null ? null : mode === 'delay' ? delayDetection(pressAt) : pressAt;
  const delayMs = pressAt !== null && detectedAt !== null ? Math.max(0, detectedAt - pressAt) : null;

  const reset = () => {
    setRunning(false);
    setClock(0);
    setPressAt(null);
  };

  const pressNow = () => {
    setPressAt(Math.min(clock, DURATION));
  };

  return (
    <div className="timing-demo">
      <div className="timing-head">
        <div>
          <span className="detail-kicker">
            <Icon name="clock" size={14} /> Blocking vs. non-blocking
          </span>
          <h4>Why delay() can miss a button press</h4>
          <p>
            Both timelines use the reviewer’s 1,000 ms interval. The diagram is an illustration of
            the reviewer’s explanation, not a capture of real hardware timing.
          </p>
        </div>
        <SourceRef page={7} />
      </div>

      <div className="timing-mode-switch" role="group" aria-label="Timing technique">
        <button
          type="button"
          className={`timing-mode ${mode === 'delay' ? 'is-active' : ''}`}
          aria-pressed={mode === 'delay'}
          onClick={() => {
            setMode('delay');
            reset();
          }}
        >
          <strong>delay()</strong>
          <span>Pauses the program — blocking</span>
        </button>
        <button
          type="button"
          className={`timing-mode ${mode === 'millis' ? 'is-active' : ''}`}
          aria-pressed={mode === 'millis'}
          onClick={() => {
            setMode('millis');
            reset();
          }}
        >
          <strong>millis()</strong>
          <span>Measures elapsed time — non-blocking</span>
        </button>
      </div>

      <div className="timing-stage">
        <div className="timing-stage-head">
          <span>0 ms</span>
          <span>1,000 ms</span>
          <span>2,000 ms</span>
          <span>3,000 ms</span>
        </div>
        <div className="timing-track" aria-hidden="true">
          {mode === 'delay' ? (
            <>
              <span className="timing-block" style={{ left: '0%', width: '33.33%' }}>
                delay(1000)
              </span>
              <span className="timing-block" style={{ left: '33.33%', width: '33.33%' }}>
                delay(1000)
              </span>
              <span className="timing-block" style={{ left: '66.66%', width: '33.34%' }}>
                delay(1000)
              </span>
            </>
          ) : (
            <>
              {Array.from({ length: 7 }).map((_, index) => (
                <span
                  key={index}
                  className="timing-check"
                  style={{ left: `${(index / 6) * 100}%` }}
                />
              ))}
              <span className="timing-block timing-block-light" style={{ left: '0%', width: '100%' }}>
                loop() keeps running
              </span>
            </>
          )}
          {mode === 'delay'
            ? [0, 33.33, 66.66, 100].map((left) => (
                <span key={left} className="timing-boundary" style={{ left: `${left}%` }} />
              ))
            : null}
          {pressAt !== null ? (
            <span
              className="timing-press"
              style={{ left: `${(pressAt / DURATION) * 100}%` }}
              title={`Button pressed at ${pressAt} ms`}
            />
          ) : null}
          <span className="timing-playhead" style={{ left: `${(clock / DURATION) * 100}%` }} />
        </div>

        <div className="timing-controls">
          <button
            type="button"
            className="btn btn-primary btn-small"
            onClick={() => {
              setRunning((value) => !value);
            }}
          >
            <Icon name={running ? 'pause' : 'play'} size={14} /> {running ? 'Pause' : 'Run'}
          </button>
          <button type="button" className="btn btn-secondary btn-small" onClick={pressNow}>
            <Icon name="target" size={14} /> Press the button now
          </button>
          <button type="button" className="btn btn-ghost btn-small" onClick={reset}>
            <Icon name="refresh" size={14} /> Reset
          </button>
          <span className="timing-clock">{Math.round(clock)} ms</span>
        </div>
      </div>

      <div className="timing-result" aria-live="polite">
        {pressAt === null ? (
          <p className="timing-idle">
            Run the timeline, then press the button to see when the loop can react.
          </p>
        ) : (
          <>
            <div className="timing-result-item">
              <span>Button pressed</span>
              <strong>{Math.round(pressAt)} ms</strong>
            </div>
            <div className="timing-result-item">
              <span>{mode === 'delay' ? 'Next button check' : 'Detected by the loop'}</span>
              <strong>{detectedAt === null ? 'after 3,000 ms' : `${Math.round(detectedAt)} ms`}</strong>
            </div>
            <div className={`timing-result-item ${mode === 'delay' && (delayMs ?? 0) > 0 ? 'is-warning' : 'is-good'}`}>
              <span>Reaction delay</span>
              <strong>{delayMs === null ? '—' : `${Math.round(delayMs)} ms`}</strong>
            </div>
          </>
        )}
      </div>

      <div className="timing-notes">
        <div>
          <Icon name="warning" size={17} />
          <span>
            <strong>delay():</strong> while the program is waiting, it cannot continue checking the
            pushbuttons in the normal loop.
          </span>
        </div>
        <div>
          <Icon name="check" size={17} />
          <span>
            <strong>millis():</strong> the program can continue checking the buttons while the LEDs
            are blinking.
          </span>
        </div>
      </div>
    </div>
  );
}
