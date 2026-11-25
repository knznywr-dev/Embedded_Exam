import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { SourceRef } from '../../components/ui';

const CHARACTERISTICS = [
  {
    id: 'dedicated',
    title: 'Dedicated / Specific Function',
    meaning: 'Designed to perform one particular task',
    example: 'Automatic door controller',
    icon: 'target' as const,
  },
  {
    id: 'realtime',
    title: 'Real-Time Operation',
    meaning: 'Must respond within a required time limit',
    example: 'Airbag controller',
    icon: 'clock' as const,
  },
  {
    id: 'deterministic',
    title: 'Deterministic Behavior',
    meaning: 'Produces predictable outputs under the same conditions',
    example: 'Traffic light sequence',
    icon: 'refresh' as const,
  },
  {
    id: 'resource',
    title: 'Resource Constraints',
    meaning: 'Has limited memory, processing power, and energy',
    example: 'Fitness band',
    icon: 'progress' as const,
  },
  {
    id: 'integration',
    title: 'Hardware–Software Integration',
    meaning: 'Software works closely with specific hardware',
    example: 'Arduino-based controller',
    icon: 'chip' as const,
  },
  {
    id: 'interaction',
    title: 'Continuous Interaction',
    meaning: 'Constantly reads inputs and controls outputs',
    example: 'Thermostat',
    icon: 'refresh' as const,
  },
  {
    id: 'power',
    title: 'Power and Size Considerations',
    meaning: 'Designed to be compact and energy-efficient',
    example: 'Pacemaker',
    icon: 'bolt' as const,
  },
];

const QUALITY_ATTRIBUTES = [
  ['Reliability', 'Continues working correctly without unexpected failures'],
  ['Maintainability', 'Can be repaired, diagnosed, or updated easily'],
  ['Performance', 'Meets required speed and processing needs'],
  ['Power Efficiency', 'Uses minimal energy'],
  ['Availability', 'Ready to operate when needed'],
  ['Cost', 'Stays within the required budget'],
  ['Safety', 'Does not cause harm, even when something goes wrong'],
  ['Size / Weight', 'Fits the physical requirements of the device'],
  ['Security', 'Protects against unauthorized access or attacks'],
  ['Scalability / Flexibility', 'Can be adapted or extended for different needs'],
];

export function CharacteristicsExplorer() {
  const [tab, setTab] = useState<'core' | 'quality' | 'operation'>('core');
  const [active, setActive] = useState('realtime');
  const selected = CHARACTERISTICS.find((item) => item.id === active) ?? CHARACTERISTICS[0];

  return (
    <div className="characteristics-demo">
      <div className="demo-tabs" role="tablist" aria-label="Characteristics and attributes">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'core'}
          className={tab === 'core' ? 'is-active' : ''}
          onClick={() => setTab('core')}
        >
          Seven characteristics
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'quality'}
          className={tab === 'quality' ? 'is-active' : ''}
          onClick={() => setTab('quality')}
        >
          Quality attributes
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'operation'}
          className={tab === 'operation' ? 'is-active' : ''}
          onClick={() => setTab('operation')}
        >
          Operational vs. non-operational
        </button>
      </div>

      {tab === 'core' ? (
        <div className="characteristics-grid-wrap">
          <div className="characteristics-grid" role="list">
            {CHARACTERISTICS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="listitem"
                className={`characteristic-card ${active === item.id ? 'is-active' : ''}`}
                aria-pressed={active === item.id}
                onClick={() => setActive(item.id)}
              >
                <span className="characteristic-icon">
                  <Icon name={item.icon} size={19} />
                </span>
                <strong>{item.title}</strong>
                <span>{item.example}</span>
              </button>
            ))}
          </div>
          <div className="characteristic-detail" aria-live="polite">
            <span className="detail-kicker">
              <Icon name="pin" size={14} /> Selected characteristic
            </span>
            <h4>{selected.title}</h4>
            <p className="detail-meaning">{selected.meaning}</p>
            <div className="detail-example">
              <span>Example</span>
              <strong>{selected.example}</strong>
            </div>
            <SourceRef page={1} />
          </div>
        </div>
      ) : null}

      {tab === 'quality' ? (
        <div className="quality-list">
          {QUALITY_ATTRIBUTES.map(([title, meaning], index) => (
            <div className="quality-row" key={title}>
              <span className="quality-index">{String(index + 1).padStart(2, '0')}</span>
              <strong>{title}</strong>
              <span>{meaning}</span>
            </div>
          ))}
          <div className="demo-foot">
            <SourceRef page={1} />
            <span>Quality attributes describe how well the system performs its function.</span>
          </div>
        </div>
      ) : null}

      {tab === 'operation' ? (
        <div className="operation-compare">
          <div className="operation-column operation-live">
            <div className="operation-head">
              <Icon name="play" size={18} />
              <div>
                <strong>Operational</strong>
                <span>Observed while the system is running</span>
              </div>
            </div>
            <ul>
              <li>Response time</li>
              <li>Throughput</li>
              <li>Accuracy while operating</li>
              <li>Current consumption during operation</li>
            </ul>
          </div>
          <div className="operation-column operation-life">
            <div className="operation-head">
              <Icon name="clock" size={18} />
              <div>
                <strong>Non-operational</strong>
                <span>Across the system’s lifetime and use</span>
              </div>
            </div>
            <ul>
              <li>Maintainability</li>
              <li>Portability</li>
              <li>Scalability</li>
              <li>Cost</li>
              <li>Usability</li>
              <li>Long-term reliability</li>
            </ul>
          </div>
          <div className="operation-remember">
            <Icon name="bulb" size={17} />
            <span>Operational = while running. Non-operational = across the lifetime.</span>
            <SourceRef page={[1, 2]} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
