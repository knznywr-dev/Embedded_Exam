import { useMemo, useState } from 'react';
import { Icon } from '../../components/Icon';
import { SourceRef } from '../../components/ui';
import {
  calcAdcVoltage,
  calcTmp36Temperature,
  formatValue,
  tmp36Voltage,
  temperatureStatus,
} from '../../lib/formulas';

type Threshold = '>=' | '>';

const PRESETS = [24.78, 29.9, 30, 35.04];

const ADC_PRESETS = [
  { reading: 153, label: '153 · reviewer example' },
  { reading: 164, label: '164 · ≈ 0.80 V' },
  { reading: 512, label: '512 · ≈ 2.5 V' },
  { reading: 1023, label: '1023 · ≈ 5 V' },
];

function statusFor(temperature: number, threshold: Threshold) {
  if (threshold === '>=') return temperatureStatus(temperature);
  return temperature > 30.0 ? 'warning' : 'normal';
}

export function TemperatureSimulator() {
  const [inputMode, setInputMode] = useState<'temperature' | 'adc'>('temperature');
  const [temperatureInput, setTemperatureInput] = useState(24.78);
  const [adcInput, setAdcInput] = useState(153);
  const [threshold, setThreshold] = useState<Threshold>('>=');

  const adcVoltageResult = useMemo(() => calcAdcVoltage(adcInput), [adcInput]);

  const temperature = useMemo(() => {
    if (inputMode === 'temperature') return temperatureInput;
    if (!adcVoltageResult.ok) return null;
    const result = calcTmp36Temperature(adcVoltageResult.value);
    return result.ok ? result.value : null;
  }, [inputMode, temperatureInput, adcVoltageResult]);

  const voutResult = useMemo(
    () => (inputMode === 'temperature' ? tmp36Voltage(temperatureInput) : adcVoltageResult),
    [inputMode, temperatureInput, adcVoltageResult],
  );

  const status = temperature === null ? null : statusFor(temperature, threshold);
  const warning = status === 'warning';
  const serialTemperature =
    temperature === null ? '—' : `Temperature: ${temperature.toFixed(2)} C`;

  const ledOn = warning;
  const buzzerOn = warning;

  const setTemperature = (value: number) => {
    setInputMode('temperature');
    setTemperatureInput(Number(value.toFixed(2)));
  };

  return (
    <div className="temp-demo">
      <div className="temp-toolbar">
        <div className="demo-tabs" role="tablist" aria-label="Sensor input method">
          <button
            type="button"
            role="tab"
            aria-selected={inputMode === 'temperature'}
            className={inputMode === 'temperature' ? 'is-active' : ''}
            onClick={() => setInputMode('temperature')}
          >
            Temperature input
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={inputMode === 'adc'}
            className={inputMode === 'adc' ? 'is-active' : ''}
            onClick={() => setInputMode('adc')}
          >
            ADC input
          </button>
        </div>
        <div className="threshold-switch" role="group" aria-label="Threshold comparison">
          <span>Threshold:</span>
          <button
            type="button"
            className={`chip-button ${threshold === '>=' ? 'is-active' : ''}`}
            aria-pressed={threshold === '>='}
            onClick={() => setThreshold('>=')}
          >
            &gt;= 30.0
          </button>
          <button
            type="button"
            className={`chip-button ${threshold === '>' ? 'is-active' : ''}`}
            aria-pressed={threshold === '>'}
            onClick={() => setThreshold('>')}
          >
            &gt; 30.0
          </button>
        </div>
      </div>

      <div className="temp-main">
        <div className="temp-controls">
          {inputMode === 'temperature' ? (
            <>
              <label className="temp-slider-label" htmlFor="temperature-slider">
                <span>
                  Temperature
                  <strong>{temperatureInput.toFixed(1)} °C</strong>
                </span>
                <input
                  id="temperature-slider"
                  type="range"
                  min={-10}
                  max={50}
                  step={0.1}
                  value={temperatureInput}
                  onChange={(event) => setTemperatureInput(Number(event.target.value))}
                />
                <span className="temp-slider-range">
                  <span>-10 °C</span>
                  <span>30 °C threshold</span>
                  <span>50 °C</span>
                </span>
              </label>
              <div className="preset-row">
                <span>Presets:</span>
                {PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className={`chip-button ${temperatureInput === preset ? 'is-active' : ''}`}
                    onClick={() => setTemperature(preset)}
                  >
                    {preset} °C
                  </button>
                ))}
              </div>
              <div className="temp-note">
                <Icon name="info" size={16} />
                <span>
                  Vout is computed with the reviewer’s relationship V<sub>out</sub> = 0.5 + 0.01T.
                  The ADC reading is not shown in this mode because the reviewer does not give a
                  TMP36-to-ADC example.
                </span>
              </div>
            </>
          ) : (
            <>
              <label className="temp-slider-label" htmlFor="adc-slider">
                <span>
                  Arduino ADC reading
                  <strong>{adcInput}</strong>
                </span>
                <input
                  id="adc-slider"
                  type="range"
                  min={0}
                  max={1023}
                  step={1}
                  value={adcInput}
                  onChange={(event) => setAdcInput(Number(event.target.value))}
                />
                <span className="temp-slider-range">
                  <span>0</span>
                  <span>512</span>
                  <span>1023</span>
                </span>
              </label>
              <div className="preset-row">
                <span>Presets:</span>
                {ADC_PRESETS.map((preset) => (
                  <button
                    key={preset.reading}
                    type="button"
                    className={`chip-button ${adcInput === preset.reading ? 'is-active' : ''}`}
                    onClick={() => setAdcInput(preset.reading)}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="temp-formula-chain">
                <div>
                  <span>ADC → Voltage</span>
                  <code>V = {adcInput} × (5.0 / 1023.0) ≈ {adcVoltageResult.ok ? formatValue(adcVoltageResult.value) : '—'} V</code>
                </div>
                <div>
                  <span>Voltage → Temperature</span>
                  <code>
                    T = ({adcVoltageResult.ok ? formatValue(adcVoltageResult.value) : '—'} − 0.5) × 100 ≈{' '}
                    {temperature === null ? '—' : formatValue(temperature)} °C
                  </code>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="temp-stage">
          <div className="temp-readout">
            <div>
              <span>TMP36 output</span>
              <strong>{voutResult.ok ? `${formatValue(voutResult.value)} V` : '—'}</strong>
            </div>
            <div>
              <span>Temperature</span>
              <strong>{temperature === null ? '—' : `${formatValue(Number(temperature.toFixed(2)))} °C`}</strong>
            </div>
            <div className={`temp-status ${warning ? 'is-warning' : 'is-normal'}`}>
              <span>Status</span>
              <strong>{warning ? 'WARNING' : 'NORMAL'}</strong>
            </div>
          </div>

          <div className="temp-circuit" aria-label="Temperature circuit state">
            <div className="temp-part temp-sensor">
              <span className="temp-part-label">TMP36</span>
              <span className="temp-part-value">A0</span>
            </div>
            <span className="temp-wire" />
            <div className="temp-part temp-board">
              <Icon name="chip" size={26} />
              <span className="temp-part-label">Uno R3</span>
            </div>
            <span className="temp-wire" />
            <div className={`temp-part temp-led ${ledOn ? 'is-on' : ''}`}>
              <span className="temp-led-bulb" />
              <span className="temp-part-label">D9</span>
            </div>
            <div className={`temp-buzzer ${buzzerOn ? 'is-on' : ''}`}>
              <span className="temp-buzzer-body" />
              <span className="temp-part-label">
                D8 · {buzzerOn ? '1000 Hz' : 'silent'}
              </span>
            </div>
          </div>

          <div className="serial-monitor" aria-live="polite">
            <div className="serial-head">
              <span>
                <Icon name="code" size={14} /> Serial Monitor · 9600
              </span>
              <span className="serial-live">live</span>
            </div>
            <pre>
              <code>{serialTemperature}</code>
              <code>{warning ? 'WARNING: High Temperature!' : 'Status: Normal'}</code>
            </pre>
          </div>

          <p className="temp-buzzer-note">
            <Icon name="info" size={14} /> The buzzer is shown as a status only; no sound is played.
            The reviewer specifies 1000 Hz.
          </p>
        </div>
      </div>

      <div className={`temp-boundary ${threshold === '>=' ? 'is-included' : 'is-excluded'}`}>
        <Icon name={threshold === '>=' ? 'check' : 'warning'} size={17} />
        <div>
          <strong>
            {threshold === '>=' ? '30.0°C is included in the warning.' : '30.0°C is excluded from the warning.'}
          </strong>
          <p>
            The reviewer’s program uses <code>temperature &gt;= 30.0</code>. Its note says this
            includes exactly 30°C, while <code>temperature &gt; 30.0</code> does not.
          </p>
        </div>
        <SourceRef page={10} />
      </div>

      <div className="temp-reference-strip">
        <SourceRef page={[8, 9, 10]} />
        <span>
          Expected behavior: below 30°C — LED OFF, buzzer silent, “Status: Normal”. At 30°C or
          higher — LED ON, buzzer 1000 Hz, “WARNING: High Temperature!”.
        </span>
      </div>
    </div>
  );
}
