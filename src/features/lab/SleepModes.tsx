import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { SourceRef } from '../../components/ui';

const MODES = [
  {
    id: 'active',
    title: 'Active',
    description: 'CPU and peripherals are running.',
    icon: 'bolt' as const,
    depth: 0,
  },
  {
    id: 'idle',
    title: 'Idle / Sleep',
    description: 'CPU is halted while clocks and peripherals may continue running.',
    icon: 'pause' as const,
    depth: 1,
  },
  {
    id: 'deep',
    title: 'Deep Sleep / Stop',
    description: 'Most clocks are turned OFF while selected wake-up sources remain available.',
    icon: 'clock' as const,
    depth: 2,
  },
  {
    id: 'standby',
    title: 'Standby',
    description: 'Almost everything is turned OFF; waking up may behave like a reset.',
    icon: 'refresh' as const,
    depth: 3,
  },
];

export function SleepModes() {
  const [active, setActive] = useState('idle');
  const selected = MODES.find((mode) => mode.id === active) ?? MODES[0];

  return (
    <div className="sleep-demo">
      <div className="sleep-cards" role="list">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            role="listitem"
            className={`sleep-card ${active === mode.id ? 'is-active' : ''}`}
            aria-pressed={active === mode.id}
            onClick={() => setActive(mode.id)}
          >
            <span className="sleep-icon">
              <Icon name={mode.icon} size={20} />
            </span>
            <strong>{mode.title}</strong>
            <span className="sleep-depth" aria-hidden="true">
              {Array.from({ length: 4 }).map((_, index) => (
                <span key={index} className={index <= mode.depth ? 'is-filled' : ''} />
              ))}
            </span>
          </button>
        ))}
      </div>
      <div className="sleep-detail" aria-live="polite">
        <div className="sleep-detail-head">
          <span className="detail-kicker">
            <Icon name="pin" size={14} /> Selected mode
          </span>
          <h4>{selected.title}</h4>
        </div>
        <p>{selected.description}</p>
        <div className="sleep-notes">
          <div>
            <Icon name="info" size={16} />
            <span>An interrupt can wake the microcontroller from a low-power state.</span>
          </div>
          <div>
            <Icon name="warning" size={16} />
            <span>
              Deeper sleep generally saves more power but may require more time to wake up.
            </span>
          </div>
        </div>
        <SourceRef page={4} />
        <p className="demo-caveat">
          The bars show relative depth only. The reviewer does not provide current draw or exact
          wake-up times, so none are shown.
        </p>
      </div>
    </div>
  );
}
