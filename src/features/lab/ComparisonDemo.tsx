import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { SourceRef } from '../../components/ui';

const ROWS = [
  { label: 'Applications', left: 'Runs many applications', right: 'Performs a dedicated function' },
  { label: 'Memory & storage', left: 'Usually has more memory and storage', right: 'Has limited memory and resources' },
  { label: 'Software', left: 'Software can be changed by users', right: 'Software is often fixed for the device' },
  { label: 'Timing', left: 'Timing is generally flexible', right: 'Timing can be critical' },
  { label: 'Example', left: 'Laptop', right: 'Washing machine controller' },
];

export function ComparisonDemo() {
  const [focus, setFocus] = useState<'left' | 'right'>('right');

  return (
    <div className="comparison-demo">
      <div className="comparison-cards">
        <button
          type="button"
          className={`comparison-card comparison-left ${focus === 'left' ? 'is-focused' : 'is-dimmed'}`}
          onClick={() => setFocus('left')}
          aria-pressed={focus === 'left'}
        >
          <span className="comparison-icon">
            <Icon name="cards" size={26} />
          </span>
          <span className="comparison-kicker">General-purpose computer</span>
          <strong>Many applications, flexible use</strong>
          <span className="comparison-example">Example: Laptop</span>
          <span className="comparison-cue">
            <Icon name="arrow-right" size={14} /> Select to focus
          </span>
        </button>
        <button
          type="button"
          className={`comparison-card comparison-right ${focus === 'right' ? 'is-focused' : 'is-dimmed'}`}
          onClick={() => setFocus('right')}
          aria-pressed={focus === 'right'}
        >
          <span className="comparison-icon">
            <Icon name="chip" size={26} />
          </span>
          <span className="comparison-kicker">Embedded system</span>
          <strong>One dedicated function</strong>
          <span className="comparison-example">Example: Washing machine controller</span>
          <span className="comparison-cue">
            <Icon name="target" size={14} /> Select to focus
          </span>
        </button>
      </div>

      <div className="comparison-table" role="table" aria-label="Embedded system and general-purpose computer comparison">
        <div className="comparison-row comparison-head-row" role="row">
          <span role="columnheader">Property</span>
          <span role="columnheader" className={focus === 'left' ? 'is-focused-cell' : ''}>
            General-purpose computer
          </span>
          <span role="columnheader" className={focus === 'right' ? 'is-focused-cell' : ''}>
            Embedded system
          </span>
        </div>
        {ROWS.map((row) => (
          <div className="comparison-row" role="row" key={row.label}>
            <span className="comparison-property" role="rowheader">
              {row.label}
            </span>
            <span className={focus === 'left' ? 'is-focused-cell' : ''} role="cell">
              {row.left}
            </span>
            <span className={focus === 'right' ? 'is-focused-cell' : ''} role="cell">
              {row.right}
            </span>
          </div>
        ))}
      </div>
      <div className="demo-foot">
        <SourceRef page={1} />
        <span>No additional examples are introduced.</span>
      </div>
    </div>
  );
}
