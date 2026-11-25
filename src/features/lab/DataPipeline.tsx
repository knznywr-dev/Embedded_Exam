import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { MathText, SourceRef } from '../../components/ui';

const STAGES = [
  {
    id: 'phenomenon',
    title: 'Physical Phenomenon',
    short: 'The quantity being measured',
    description: 'The quantity being measured, such as temperature, light, or pressure.',
    icon: 'spark' as const,
  },
  {
    id: 'sensor',
    title: 'Sensor',
    short: 'Physical quantity → electrical signal',
    description: 'Converts the physical quantity into an electrical signal.',
    icon: 'pin' as const,
  },
  {
    id: 'conditioning',
    title: 'Signal Conditioning',
    short: 'Amplify, filter, or scale',
    description: 'Amplifies, filters, or scales the signal.',
    icon: 'formula' as const,
  },
  {
    id: 'adc',
    title: 'ADC',
    short: 'Analog → digital value',
    description: 'Converts the analog signal into a digital value.',
    icon: 'code' as const,
  },
  {
    id: 'processor',
    title: 'Processor',
    short: 'Reads and processes',
    description: 'Reads and processes the digital value.',
    icon: 'chip' as const,
  },
  {
    id: 'decision',
    title: 'Data / Decision',
    short: 'Result or action',
    description: 'Produces a result or decides what action to take.',
    icon: 'target' as const,
  },
];

export function DataPipeline() {
  const [active, setActive] = useState('adc');
  const [tab, setTab] = useState<'pipeline' | 'signals' | 'resolution'>('pipeline');
  const selected = STAGES.find((stage) => stage.id === active) ?? STAGES[0];

  return (
    <div className="data-demo">
      <div className="demo-tabs" role="tablist" aria-label="Data acquisition topics">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'pipeline'}
          className={tab === 'pipeline' ? 'is-active' : ''}
          onClick={() => setTab('pipeline')}
        >
          Six-stage pipeline
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'signals'}
          className={tab === 'signals' ? 'is-active' : ''}
          onClick={() => setTab('signals')}
        >
          Analog vs. digital
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'resolution'}
          className={tab === 'resolution' ? 'is-active' : ''}
          onClick={() => setTab('resolution')}
        >
          ADC codes &amp; resolution
        </button>
      </div>

      {tab === 'pipeline' ? (
        <div className="pipeline-wrap">
          <div className="pipeline" role="tablist" aria-label="Data acquisition stages">
            {STAGES.map((stage, index) => (
              <button
                key={stage.id}
                type="button"
                role="tab"
                aria-selected={active === stage.id}
                className={`pipeline-stage ${active === stage.id ? 'is-active' : ''}`}
                onClick={() => setActive(stage.id)}
              >
                <span className="pipeline-number">{index + 1}</span>
                <span className="pipeline-icon">
                  <Icon name={stage.icon} size={18} />
                </span>
                <strong>{stage.title}</strong>
                <span>{stage.short}</span>
                {index < STAGES.length - 1 ? <span className="pipeline-arrow">→</span> : null}
              </button>
            ))}
          </div>
          <div className="pipeline-detail" aria-live="polite">
            <span className="detail-kicker">
              <Icon name="pin" size={14} /> Stage selected
            </span>
            <h4>{selected.title}</h4>
            <p>{selected.description}</p>
            <SourceRef page={5} />
          </div>
        </div>
      ) : null}

      {tab === 'signals' ? (
        <div className="signals-compare">
          <div className="signal-card signal-analog">
            <div className="signal-card-head">
              <Icon name="spark" size={20} />
              <strong>Analog Signal</strong>
            </div>
            <ul>
              <li>Continuous signal</li>
              <li>Changes smoothly over time</li>
              <li>Example: Sensor voltage</li>
            </ul>
            <svg viewBox="0 0 260 80" className="signal-svg" aria-hidden="true">
              <path d="M4 60 C 30 10, 50 10, 72 40 S 112 75, 136 40 S 180 5, 210 36 S 240 60, 256 24" />
            </svg>
          </div>
          <div className="signal-card signal-digital">
            <div className="signal-card-head">
              <Icon name="code" size={20} />
              <strong>Digital Signal</strong>
            </div>
            <ul>
              <li>Discrete numeric values</li>
              <li>Represented by numbers</li>
              <li>Example: ADC reading</li>
            </ul>
            <svg viewBox="0 0 260 80" className="signal-svg" aria-hidden="true">
              <path d="M4 60 H44 V20 H84 V50 H124 V20 H164 V58 H204 V28 H256" />
            </svg>
          </div>
          <div className="demo-foot">
            <SourceRef page={5} />
            <span>The comparison keeps the reviewer’s distinction: continuous vs. discrete numeric values.</span>
          </div>
        </div>
      ) : null}

      {tab === 'resolution' ? (
        <div className="resolution-demo">
          <div className="resolution-formulas">
            <div className="formula-block">
              <Icon name="formula" size={17} />
              <MathText text="Number of Codes = 2^{N}" />
              <SourceRef page={5} />
            </div>
            <div className="formula-block">
              <Icon name="formula" size={17} />
              <MathText text="LSB = V_{ref} / 2^{N}" />
              <SourceRef page={5} />
            </div>
          </div>
          <div className="code-example-grid">
            <div>
              <span>8-bit ADC</span>
              <strong>256 codes</strong>
            </div>
            <div>
              <span>10-bit ADC</span>
              <strong>1,024 codes</strong>
            </div>
            <div>
              <span>12-bit ADC</span>
              <strong>4,096 codes</strong>
            </div>
          </div>
          <div className="resolution-notes">
            <p>
              <strong>LSB</strong> means Least Significant Bit, or the voltage step represented by
              one ADC count. A higher ADC resolution means more detailed digital measurements.
            </p>
            <p>
              <strong>Quantization</strong> is the process of mapping a continuous analog voltage to
              a discrete digital value. The ideal rounding error is approximately ±½ LSB.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
