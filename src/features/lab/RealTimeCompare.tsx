import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { SourceRef } from '../../components/ui';

const SYSTEMS = {
  hard: {
    title: 'Hard Real-Time',
    definition: 'Missing a deadline is considered a system failure, even if it happens only once.',
    examples: ['Airbag deployment controller', 'Industrial emergency shutdown controller'],
    icon: 'warning' as const,
  },
  soft: {
    title: 'Soft Real-Time',
    definition: 'Missing a deadline reduces the quality of the output, but the system can continue operating.',
    examples: ['Video streaming', 'Media playback', 'Non-critical display updates'],
    icon: 'play' as const,
  },
};

export function RealTimeCompare() {
  const [selected, setSelected] = useState<'hard' | 'soft'>('hard');
  const [outcome, setOutcome] = useState<'met' | 'late'>('met');

  return (
    <div className="realtime-demo">
      <div className="realtime-cards">
        {(Object.keys(SYSTEMS) as Array<'hard' | 'soft'>).map((key) => {
          const item = SYSTEMS[key];
          return (
            <button
              key={key}
              type="button"
              className={`realtime-card realtime-${key} ${selected === key ? 'is-active' : ''}`}
              aria-pressed={selected === key}
              onClick={() => setSelected(key)}
            >
              <span className="realtime-icon">
                <Icon name={item.icon} size={22} />
              </span>
              <strong>{item.title}</strong>
              <p>{item.definition}</p>
              <ul>
                {item.examples.map((example) => (
                  <li key={example}>{example}</li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="realtime-timeline">
        <div className="timeline-controls" role="group" aria-label="Outcome scenario">
          <button
            type="button"
            className={`chip-button ${outcome === 'met' ? 'is-active' : ''}`}
            aria-pressed={outcome === 'met'}
            onClick={() => setOutcome('met')}
          >
            Deadline met
          </button>
          <button
            type="button"
            className={`chip-button ${outcome === 'late' ? 'is-active' : ''}`}
            aria-pressed={outcome === 'late'}
            onClick={() => setOutcome('late')}
          >
            Deadline missed
          </button>
        </div>
        <div className="timeline-track">
          <span className="timeline-start">Event</span>
          <span className={`timeline-response ${outcome === 'late' ? 'is-late' : ''}`}>Response</span>
          <span className="timeline-deadline">Deadline</span>
          <span className="timeline-line" />
        </div>
        <div className={`timeline-outcome ${outcome === 'late' ? 'is-bad' : 'is-good'}`} aria-live="polite">
          <Icon name={outcome === 'late' ? 'warning' : 'check'} size={17} />
          <div>
            <strong>{selected === 'hard' ? 'Hard real-time consequence' : 'Soft real-time consequence'}</strong>
            <span>
              {outcome === 'met'
                ? 'The deadline is met. This demonstration only shows the reviewer’s definitions.'
                : selected === 'hard'
                  ? 'Missing the deadline is considered a system failure, even if it happens only once.'
                  : 'Missing the deadline reduces the quality of the output, but the system can continue operating.'}
            </span>
          </div>
        </div>
      </div>
      <div className="demo-foot">
        <SourceRef page={4} />
        <span>Only the definitions and examples from the reviewer are used.</span>
      </div>
    </div>
  );
}
