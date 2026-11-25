import { describe, expect, it } from 'vitest';
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
  temperatureStatus,
  tmp36Voltage,
} from './formulas';

function expectOk(result: ReturnType<typeof calcResponseTime>) {
  expect(result.ok).toBe(true);
  if (!result.ok) throw new Error(result.error);
  return result;
}

describe('response time and timing margin', () => {
  it('adds detection, processing, and output time', () => {
    const result = expectOk(calcResponseTime(2, 3, 5));
    expect(result.value).toBe(10);
    expect(result.unit).toBe('ms');
  });

  it('computes the reviewer example 10 ms deadline - 7 ms response', () => {
    const result = expectOk(calcTimingMargin(10, 7));
    expect(result.value).toBe(3);
    expect(result.extra).toContain('Positive');
  });

  it('treats a zero margin as meeting the deadline exactly', () => {
    const result = expectOk(calcTimingMargin(10, 10));
    expect(result.value).toBe(0);
    expect(result.extra).toContain('Zero');
  });

  it('reports a missed deadline when response time exceeds the deadline', () => {
    const result = expectOk(calcTimingMargin(10, 12));
    expect(result.value).toBe(-2);
    expect(result.extra).toContain('missed');
  });
});

describe('ADC formulas', () => {
  it('computes 2^N codes', () => {
    expect(expectOk(calcAdcCodes(8)).value).toBe(256);
    expect(expectOk(calcAdcCodes(10)).value).toBe(1024);
  });

  it('keeps the ideal LSB formula separate from the Uno conversion', () => {
    const ideal = expectOk(calcAdcLsb(5, 8));
    expect(ideal.value).toBeCloseTo(5 / 256, 12);
    expect(ideal.unit).toBe('V');

    const uno = expectOk(calcAdcVoltage(153));
    expect(uno.value).toBeCloseTo(153 * (5.0 / 1023.0), 12);
    // The two methods are deliberately different.
    expect(uno.value).not.toBeCloseTo(ideal.value, 3);
  });

  it('rejects non-integer or out-of-range Uno ADC readings', () => {
    expect(calcAdcVoltage(1.5).ok).toBe(false);
    expect(calcAdcVoltage(-1).ok).toBe(false);
    expect(calcAdcVoltage(1024).ok).toBe(false);
  });

  it('uses decimal operands in 5.0 / 1023.0, unlike C++ integer division', () => {
    // In C++ with integer operands, 5 / 1023 truncates to 0. JavaScript always
    // produces a fraction, so emulate the reviewer's integer division explicitly.
    const integerDivision = Math.trunc(5 / 1023);
    expect(integerDivision).toBe(0);
    expect(5.0 / 1023.0).toBeGreaterThan(0);
    expect(expectOk(calcAdcVoltage(1023)).value).toBeCloseTo(5, 12);
  });
});

describe('PWM formulas', () => {
  it('computes duty cycle from ON time and period', () => {
    expect(expectOk(calcPwmDuty(25, 100)).value).toBe(25);
  });

  it('rejects ON time greater than the period', () => {
    expect(calcPwmDuty(120, 100).ok).toBe(false);
  });

  it('computes OFF time as period - ON time', () => {
    const result = expectOk(calcPwmOffTime(25, 100));
    expect(result.value).toBe(75);
    expect(result.unit).toBe('ms');
  });

  it('computes frequency from a period in seconds', () => {
    expect(expectOk(calcPwmFrequency(0.02)).value).toBeCloseTo(50, 10);
    expect(calcPwmFrequency(0).ok).toBe(false);
  });

  it('computes period from frequency and shows the ms equivalent', () => {
    const result = expectOk(calcPwmPeriod(50));
    expect(result.value).toBeCloseTo(0.02, 12);
    expect(result.extra).toContain('20');
  });
});

describe('temperature formulas and the 30°C boundary', () => {
  it('converts TMP36 voltage to temperature', () => {
    expect(expectOk(calcTmp36Temperature(0.75)).value).toBeCloseTo(25, 10);
    expect(expectOk(calcTmp36Temperature(0.8)).value).toBeCloseTo(30, 10);
  });

  it('computes Vout = 0.5 + 0.01T', () => {
    expect(expectOk(tmp36Voltage(25)).value).toBeCloseTo(0.75, 10);
    expect(expectOk(tmp36Voltage(30)).value).toBeCloseTo(0.8, 10);
  });

  it('includes exactly 30.0°C in the warning because >= is used', () => {
    expect(temperatureStatus(29.9)).toBe('normal');
    expect(temperatureStatus(30)).toBe('warning');
    expect(temperatureStatus(30.1)).toBe('warning');
  });
});
