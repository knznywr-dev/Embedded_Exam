import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { SourceRef } from '../../components/ui';

const STEPS = [
  {
    title: 'Preprocessing',
    description: 'Expands directives such as #include and #define.',
    icon: 'code' as const,
  },
  {
    title: 'Compilation',
    description: 'Converts source code into lower-level instructions.',
    icon: 'formula' as const,
  },
  {
    title: 'Assembly',
    description: 'Produces object files.',
    icon: 'chip' as const,
  },
  {
    title: 'Linking',
    description: 'Combines object files and arranges code and data.',
    icon: 'list' as const,
  },
  {
    title: 'Firmware Generation',
    description: 'Produces the firmware image, such as .hex or .bin.',
    icon: 'notes' as const,
  },
  {
    title: 'Downloading / Flashing',
    description: 'Writes firmware into the microcontroller’s flash memory.',
    icon: 'bolt' as const,
  },
];

export function BuildProcessStepper() {
  const [active, setActive] = useState(0);
  const step = STEPS[active];

  return (
    <div className="build-stepper">
      <div className="build-track" role="tablist" aria-label="Build process steps">
        {STEPS.map((item, index) => (
          <button
            key={item.title}
            type="button"
            role="tab"
            aria-selected={active === index}
            className={`build-step ${active === index ? 'is-active' : ''} ${index < active ? 'is-done' : ''}`}
            onClick={() => setActive(index)}
          >
            <span className="build-step-number">{index + 1}</span>
            <span className="build-step-title">{item.title}</span>
          </button>
        ))}
      </div>
      <div className="build-detail" aria-live="polite">
        <span className="build-detail-icon">
          <Icon name={step.icon} size={24} />
        </span>
        <div className="build-detail-copy">
          <span className="detail-kicker">
            Step {active + 1} of {STEPS.length}
          </span>
          <h4>{step.title}</h4>
          <p>{step.description}</p>
          <SourceRef page={3} />
        </div>
        <div className="build-nav">
          <button
            type="button"
            className="icon-button"
            aria-label="Previous build step"
            disabled={active === 0}
            onClick={() => setActive((current) => Math.max(0, current - 1))}
          >
            <Icon name="arrow-left" size={18} />
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="Next build step"
            disabled={active === STEPS.length - 1}
            onClick={() => setActive((current) => Math.min(STEPS.length - 1, current + 1))}
          >
            <Icon name="arrow-right" size={18} />
          </button>
        </div>
      </div>
      <div className="build-output">
        <span>Output at the end of the process</span>
        <code>.hex / .bin firmware image written to flash memory</code>
      </div>
    </div>
  );
}
