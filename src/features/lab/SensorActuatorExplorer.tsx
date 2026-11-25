import { useState } from 'react';
import { Icon } from '../../components/Icon';
import { SourceRef } from '../../components/ui';

const SENSORS = [
  { name: 'Temperature Sensor', application: 'Thermostat', icon: 'bolt' as const },
  { name: 'Light Sensor', application: 'Automatic streetlight', icon: 'bulb' as const },
  { name: 'Pressure Sensor', application: 'Tire pressure monitoring', icon: 'progress' as const },
  { name: 'Proximity Sensor', application: 'Automatic door', icon: 'pin' as const },
  { name: 'Accelerometer', application: 'Fitness tracker', icon: 'spark' as const },
  { name: 'Humidity Sensor', application: 'Greenhouse monitoring', icon: 'refresh' as const },
];

const ACTUATORS = [
  { name: 'Motor', application: 'Fan or conveyor belt', icon: 'refresh' as const },
  { name: 'Relay', application: 'Switching electrical loads', icon: 'bolt' as const },
  { name: 'Solenoid', application: 'Door lock', icon: 'target' as const },
  { name: 'Servo Motor', application: 'Robotic arm', icon: 'chip' as const },
  { name: 'Buzzer', application: 'Alarm', icon: 'warning' as const },
  { name: 'LED', application: 'Visual indicator', icon: 'bulb' as const },
];

const LOOP = [
  { title: 'Sense', text: 'Read the physical quantity through a sensor.' },
  { title: 'Process', text: 'The processor reads and processes the value.' },
  { title: 'Decide', text: 'The program checks the value against a target.' },
  { title: 'Act', text: 'An actuator produces the physical response.' },
];

const FAN_STEPS = [
  'The temperature sensor detects room temperature.',
  'The processor reads the temperature.',
  'The program checks the temperature against a target.',
  'The motor adjusts the fan speed.',
];

export function SensorActuatorExplorer() {
  const [tab, setTab] = useState<'sensors' | 'actuators'>('sensors');
  const [loopIndex, setLoopIndex] = useState(0);
  const items = tab === 'sensors' ? SENSORS : ACTUATORS;
  const activeLoop = LOOP[loopIndex];

  return (
    <div className="sensor-demo">
      <div className="sensor-tabs">
        <div className="demo-tabs" role="tablist" aria-label="Sensors and actuators">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'sensors'}
            className={tab === 'sensors' ? 'is-active' : ''}
            onClick={() => setTab('sensors')}
          >
            Sensors · 6 examples
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'actuators'}
            className={tab === 'actuators' ? 'is-active' : ''}
            onClick={() => setTab('actuators')}
          >
            Actuators · 6 examples
          </button>
        </div>
        <div className="sensor-grid">
          {items.map((item) => (
            <div className="sensor-card" key={item.name}>
              <span className="sensor-icon">
                <Icon name={item.icon} size={19} />
              </span>
              <strong>{item.name}</strong>
              <span className="sensor-arrow">
                <Icon name="arrow-right" size={14} />
              </span>
              <span>{item.application}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="loop-demo">
        <div className="loop-head">
          <div>
            <span className="detail-kicker">Sensor–processor–actuator loop</span>
            <h4>Sense → Process → Decide → Act</h4>
          </div>
          <SourceRef page={6} />
        </div>
        <div className="loop-track" role="tablist" aria-label="Sensor loop stages">
          {LOOP.map((stage, index) => (
            <button
              key={stage.title}
              type="button"
              role="tab"
              aria-selected={loopIndex === index}
              className={`loop-stage ${loopIndex === index ? 'is-active' : ''}`}
              onClick={() => setLoopIndex(index)}
            >
              <span className="loop-number">{index + 1}</span>
              <strong>{stage.title}</strong>
            </button>
          ))}
          <span className="loop-repeat">
            <Icon name="refresh" size={14} /> repeats
          </span>
        </div>
        <div className="loop-detail" aria-live="polite">
          <Icon name="target" size={18} />
          <span>{activeLoop.text}</span>
        </div>
      </div>

      <div className="fan-demo">
        <div className="fan-head">
          <div>
            <span className="detail-kicker">Example</span>
            <h4>Automatic Fan</h4>
          </div>
          <SourceRef page={6} />
        </div>
        <ol className="fan-steps">
          {FAN_STEPS.map((step, index) => (
            <li key={step}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
        <p className="fan-repeat">
          <Icon name="refresh" size={15} /> This process repeats continuously.
        </p>
      </div>
    </div>
  );
}
