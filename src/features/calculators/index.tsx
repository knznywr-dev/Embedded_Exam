import { useMemo, useState } from 'react';
import { Field, CalcCard } from './CalcCard';
import { Icon } from '../../components/Icon';
import {
  calcAdcCodes,
  calcAdcLsb,
  calcAdcVoltage,
  calcPwmDuty,
  calcPwmFrequency,
  calcPwmOffTime,
  calcPwmPeriod,
  calcResponseTime,
  calcTimingMargin,
  calcTmp36Temperature,
  parseNumber,
} from '../../lib/formulas';
import type { CalcResult } from '../../lib/formulas';

function numberOrNaN(value: string): number {
  const parsed = parseNumber(value);
  return parsed === null ? Number.NaN : parsed;
}

function hasEmpty(values: string[]): boolean {
  return values.some((value) => value.trim() === '');
}

function liveResult(
  values: string[],
  calculate: () => CalcResult,
): CalcResult | null {
  if (hasEmpty(values)) return null;
  return calculate();
}

export function TimingMarginCalculator() {
  const [deadline, setDeadline] = useState('10');
  const [response, setResponse] = useState('7');
  const result = useMemo(
    () => liveResult([deadline, response], () => calcTimingMargin(numberOrNaN(deadline), numberOrNaN(response))),
    [deadline, response],
  );

  return (
    <CalcCard
      id="calc-timing-margin"
      title="Timing Margin"
      expression="Timing Margin = Deadline − Response Time"
      description="Enter both times in milliseconds. The source example is 10 ms and 7 ms."
      sourcePage={4}
      result={result}
      onUseExample={() => {
        setDeadline('10');
        setResponse('7');
      }}
      exampleLabel="Use the 10 ms / 7 ms example"
      note={
        <p>
          Positive means the deadline is met, zero means the response finishes exactly at the
          deadline, and negative means the deadline is missed. The formula also appears on p. 11.
        </p>
      }
    >
      <Field label="Deadline" unit="ms" value={deadline} onChange={setDeadline} placeholder="10" min={0} />
      <Field
        label="Response Time"
        unit="ms"
        value={response}
        onChange={setResponse}
        placeholder="7"
        min={0}
      />
    </CalcCard>
  );
}

export function ResponseTimeCalculator() {
  const [detection, setDetection] = useState('');
  const [processing, setProcessing] = useState('');
  const [output, setOutput] = useState('');
  const result = useMemo(
    () =>
      liveResult([detection, processing, output], () =>
        calcResponseTime(numberOrNaN(detection), numberOrNaN(processing), numberOrNaN(output)),
      ),
    [detection, processing, output],
  );

  return (
    <CalcCard
      id="calc-response-time"
      title="Response Time"
      expression="Response Time = Detection + Processing + Output"
      description="Add the three time components in milliseconds."
      sourcePage={11}
      result={result}
      note={<p>The reviewer gives the formula and the millisecond unit, but no worked example for this formula.</p>}
    >
      <Field label="Detection" unit="ms" value={detection} onChange={setDetection} placeholder="Enter time" min={0} />
      <Field label="Processing" unit="ms" value={processing} onChange={setProcessing} placeholder="Enter time" min={0} />
      <Field label="Output" unit="ms" value={output} onChange={setOutput} placeholder="Enter time" min={0} />
    </CalcCard>
  );
}

export function AdcCodesCalculator() {
  const [bits, setBits] = useState('10');
  const result = useMemo(
    () => liveResult([bits], () => calcAdcCodes(numberOrNaN(bits))),
    [bits],
  );

  return (
    <CalcCard
      id="calc-adc-codes"
      title="Number of ADC Codes"
      expression="Number of ADC Codes = 2^{N}"
      description="N is the number of bits. Try the reviewer’s 8-, 10-, and 12-bit examples."
      sourcePage={5}
      result={result}
      onUseExample={() => setBits('10')}
      exampleLabel="Use N = 10"
      note={
        <div className="quick-values">
          <span>Source examples:</span>
          <button type="button" className="chip-button" onClick={() => setBits('8')}>
            8-bit = 256
          </button>
          <button type="button" className="chip-button" onClick={() => setBits('10')}>
            10-bit = 1,024
          </button>
          <button type="button" className="chip-button" onClick={() => setBits('12')}>
            12-bit = 4,096
          </button>
        </div>
      }
    >
      <Field label="Number of bits (N)" value={bits} onChange={setBits} placeholder="10" step={1} inputMode="numeric" />
    </CalcCard>
  );
}

export function AdcLsbCalculator() {
  const [vref, setVref] = useState('');
  const [bits, setBits] = useState('');
  const result = useMemo(
    () => liveResult([vref, bits], () => calcAdcLsb(numberOrNaN(vref), numberOrNaN(bits))),
    [vref, bits],
  );

  return (
    <CalcCard
      id="calc-adc-lsb"
      title="ADC Resolution (LSB)"
      expression="ADC Resolution (LSB) = V_{ref} / 2^{N}"
      description="Ideal ADC only. Vref is the reference voltage and N is the number of bits."
      sourcePage={5}
      result={result}
      onUseExample={() => {
        setVref('5');
        setBits('10');
      }}
      exampleLabel="Use Arduino Uno values (5 V, 10-bit)"
      note={
        <p>
          This is the ideal ADC resolution formula. It is separate from the Arduino Uno voltage
          conversion formula <strong>ADC Reading × (5.0 / 1023.0)</strong>. The reviewer gives the
          Uno’s 5 V and 10-bit facts but does not print a worked LSB example.
        </p>
      }
    >
      <Field label="Reference voltage (Vref)" unit="V" value={vref} onChange={setVref} placeholder="e.g. 5" min={0} />
      <Field label="Number of bits (N)" value={bits} onChange={setBits} placeholder="e.g. 10" step={1} inputMode="numeric" />
    </CalcCard>
  );
}

export function PwmDutyCalculator() {
  const [onTime, setOnTime] = useState('5');
  const [period, setPeriod] = useState('10');
  const result = useMemo(
    () => liveResult([onTime, period], () => calcPwmDuty(numberOrNaN(onTime), numberOrNaN(period))),
    [onTime, period],
  );

  return (
    <CalcCard
      id="calc-pwm-duty"
      title="PWM Duty Cycle"
      expression="PWM Duty Cycle = (ON Time / Period) × 100"
      description="Use the same time unit for ON time and period; the unit cancels in the ratio."
      sourcePage={5}
      result={result}
      onUseExample={() => {
        setOnTime('5');
        setPeriod('10');
      }}
      exampleLabel="Use the 5 ms / 10 ms example"
      note={
        <p>
          The source example uses 5 ms ON time and a 10 ms period, giving 50%. A higher duty cycle
          generally means more average power to the load; for an LED, greater brightness.
        </p>
      }
    >
      <Field label="ON Time" unit="ms" value={onTime} onChange={setOnTime} placeholder="5" min={0} />
      <Field label="Period" unit="ms" value={period} onChange={setPeriod} placeholder="10" min={0} />
    </CalcCard>
  );
}

export function PwmFrequencyCalculator() {
  const [period, setPeriod] = useState('10');
  const [unit, setUnit] = useState<'ms' | 's'>('ms');
  const result = useMemo(() => {
    if (period.trim() === '') return null;
    const parsed = numberOrNaN(period);
    const periodSeconds = unit === 'ms' ? parsed / 1000 : parsed;
    return calcPwmFrequency(periodSeconds);
  }, [period, unit]);

  return (
    <CalcCard
      id="calc-pwm-frequency"
      title="PWM Frequency"
      expression="PWM Frequency = 1 / Period"
      description="The formula requires the period in seconds. Choose the unit you are entering; the calculator converts it."
      sourcePage={5}
      result={result}
      onUseExample={() => {
        setPeriod('10');
        setUnit('ms');
      }}
      exampleLabel="Use the 10 ms period example"
      note={
        <p>
          Using the reviewer’s 10 ms period: f = 1 / 0.010 s = 100 Hz. The reviewer gives the
          formula and the period value, but does not print this frequency result.
        </p>
      }
    >
      <Field label="Period" value={period} onChange={setPeriod} placeholder="10" min={0} />
      <label className="field" htmlFor="pwm-frequency-unit">
        <span className="field-label">Period unit</span>
        <select
          id="pwm-frequency-unit"
          value={unit}
          onChange={(event) => setUnit(event.target.value as 'ms' | 's')}
        >
          <option value="ms">milliseconds (ms)</option>
          <option value="s">seconds (s)</option>
        </select>
      </label>
    </CalcCard>
  );
}

export function PwmPeriodCalculator() {
  const [frequency, setFrequency] = useState('100');
  const result = useMemo(
    () => liveResult([frequency], () => calcPwmPeriod(numberOrNaN(frequency))),
    [frequency],
  );

  return (
    <CalcCard
      id="calc-pwm-period"
      title="PWM Period"
      expression="PWM Period = 1 / Frequency"
      description="Enter a frequency in Hertz. The result is shown in seconds and milliseconds."
      sourcePage={11}
      result={result}
      onUseExample={() => setFrequency('100')}
      exampleLabel="Use 100 Hz (from the 10 ms period)"
      note={<p>100 Hz is the frequency derived from the reviewer’s 10 ms period example; the period formula itself is listed on p. 11.</p>}
    >
      <Field label="Frequency" unit="Hz" value={frequency} onChange={setFrequency} placeholder="100" min={0} />
    </CalcCard>
  );
}

export function PwmOffTimeCalculator() {
  const [onTime, setOnTime] = useState('5');
  const [period, setPeriod] = useState('10');
  const result = useMemo(
    () => liveResult([onTime, period], () => calcPwmOffTime(numberOrNaN(onTime), numberOrNaN(period), 'ms')),
    [onTime, period],
  );

  return (
    <CalcCard
      id="calc-pwm-off-time"
      title="PWM OFF Time"
      expression="PWM OFF Time = Period − ON Time"
      description="Use the same time unit for both inputs."
      sourcePage={5}
      result={result}
      onUseExample={() => {
        setOnTime('5');
        setPeriod('10');
      }}
      exampleLabel="Use the 5 ms / 10 ms example"
      note={<p>This is a direct substitution of the reviewer’s 5 ms ON time and 10 ms period.</p>}
    >
      <Field label="Period" unit="ms" value={period} onChange={setPeriod} placeholder="10" min={0} />
      <Field label="ON Time" unit="ms" value={onTime} onChange={setOnTime} placeholder="5" min={0} />
    </CalcCard>
  );
}

export function Tmp36TemperatureCalculator() {
  const [voltage, setVoltage] = useState('0.80');
  const result = useMemo(
    () => liveResult([voltage], () => calcTmp36Temperature(numberOrNaN(voltage))),
    [voltage],
  );

  return (
    <CalcCard
      id="calc-tmp36-temperature"
      title="TMP36 Temperature"
      expression="TMP36 Temperature = (Voltage − 0.5) × 100"
      description="Enter the TMP36 output voltage in volts."
      sourcePage={8}
      result={result}
      onUseExample={() => setVoltage('0.80')}
      exampleLabel="Use the 0.80 V example"
      note={
        <p>
          Subtract 0.5 to remove the voltage offset. Multiply by 100 because the TMP36 changes its
          output by 0.01 V for every 1°C.
        </p>
      }
    >
      <Field label="Voltage" unit="V" value={voltage} onChange={setVoltage} placeholder="0.80" />
    </CalcCard>
  );
}

export function AdcVoltageCalculator() {
  const [reading, setReading] = useState('153');
  const result = useMemo(
    () => liveResult([reading], () => calcAdcVoltage(numberOrNaN(reading))),
    [reading],
  );

  return (
    <CalcCard
      id="calc-adc-voltage"
      title="ADC Voltage Conversion"
      expression="ADC Voltage Conversion = ADC Reading × (5.0 / 1023.0)"
      description="Arduino Uno ADC reading from 0 to 1023. The result is in volts."
      sourcePage={9}
      result={result}
      onUseExample={() => setReading('153')}
      exampleLabel="Use ADC reading 153"
      note={
        <div>
          <p>
            The reviewer states the approximate result for 153 as <strong>0.748 V</strong>.
          </p>
          <p>
            Use <code>5.0 / 1023.0</code>, not <code>5 / 1023</code>. The second expression uses
            integer division and produces zero; decimal operands retain the fractional result.
          </p>
        </div>
      }
    >
      <Field
        label="ADC Reading"
        value={reading}
        onChange={setReading}
        placeholder="153"
        min={0}
        step={1}
        inputMode="numeric"
        hint="Whole number from 0 to 1023."
      />
    </CalcCard>
  );
}

export function AdcReadingExplainer() {
  return (
    <div className="adc-integer-demo">
      <div className="adc-integer-row">
        <code>5 / 1023</code>
        <span className="adc-integer-result bad">= 0</span>
        <span>Integer division</span>
      </div>
      <div className="adc-integer-row">
        <code>5.0 / 1023.0</code>
        <span className="adc-integer-result good">≈ 0.00489</span>
        <span>Decimal operands retain the fractional result</span>
      </div>
      <p>
        <Icon name="warning" size={15} /> Use <code>5.0 / 1023.0</code> in the Arduino Uno voltage
        conversion. <span className="source-inline">Reviewer PDF · p. 9</span>
      </p>
    </div>
  );
}
