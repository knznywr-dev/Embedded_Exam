export interface CalcSuccess {
  ok: true;
  value: number;
  display: string;
  unit: string;
  substitution: string;
  extra?: string;
}

export interface CalcError {
  ok: false;
  error: string;
}

export type CalcResult = CalcSuccess | CalcError;

const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 8,
});

export function formatNumber(value: number, maximumFractionDigits = 8): string {
  if (!Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits,
  }).format(value);
}

export function formatValue(value: number): string {
  return numberFormatter.format(value);
}

export function parseNumber(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const normalized = trimmed.replace(/,/g, '');
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}

function finiteError(name: string, value: number): string | null {
  if (!Number.isFinite(value)) return `Enter a valid number for ${name}.`;
  return null;
}

function negativeError(name: string, value: number): string | null {
  if (!Number.isFinite(value)) return `Enter a valid number for ${name}.`;
  if (value < 0) return `${name} cannot be negative.`;
  return null;
}

function positiveError(name: string, value: number): string | null {
  if (!Number.isFinite(value)) return `Enter a valid number for ${name}.`;
  if (value <= 0) return `${name} must be greater than zero.`;
  return null;
}

function bitsError(bits: number): string | null {
  if (!Number.isFinite(bits)) return 'Enter a valid number of bits.';
  if (!Number.isInteger(bits)) return 'Number of bits must be a whole number.';
  if (bits < 1 || bits > 32) return 'Use a whole number of bits from 1 to 32.';
  return null;
}

function timeUnitSuffix(unit: string): string {
  return unit === 's' ? 's' : 'ms';
}

export function calcResponseTime(
  detection: number,
  processing: number,
  output: number,
): CalcResult {
  const error =
    negativeError('Detection time', detection) ??
    negativeError('Processing time', processing) ??
    negativeError('Output time', output);
  if (error) return { ok: false, error };

  const value = detection + processing + output;
  return {
    ok: true,
    value,
    display: formatValue(value),
    unit: 'ms',
    substitution: `RT = ${formatValue(detection)} + ${formatValue(processing)} + ${formatValue(output)} = ${formatValue(value)} ms`,
  };
}

export function calcTimingMargin(deadline: number, responseTime: number): CalcResult {
  const error = finiteError('Deadline', deadline) ?? negativeError('Response time', responseTime);
  if (error) return { ok: false, error };

  const value = deadline - responseTime;
  let classification: string;
  if (value > 0) classification = 'Positive timing margin — the deadline is met.';
  else if (value === 0) classification = 'Zero timing margin — the response finishes exactly at the deadline.';
  else classification = 'Negative timing margin — the deadline is missed.';

  return {
    ok: true,
    value,
    display: formatValue(value),
    unit: 'ms',
    substitution: `TM = ${formatValue(deadline)} − ${formatValue(responseTime)} = ${formatValue(value)} ms`,
    extra: classification,
  };
}

export function calcAdcCodes(bits: number): CalcResult {
  const error = bitsError(bits);
  if (error) return { ok: false, error };

  const value = 2 ** bits;
  return {
    ok: true,
    value,
    display: formatValue(value),
    unit: 'codes',
    substitution: `2^${bits} = ${formatValue(value)} codes`,
  };
}

export function calcAdcLsb(vref: number, bits: number): CalcResult {
  const error = positiveError('Reference voltage', vref) ?? bitsError(bits);
  if (error) return { ok: false, error };

  const value = vref / 2 ** bits;
  return {
    ok: true,
    value,
    display: formatValue(value),
    unit: 'V',
    substitution: `LSB = ${formatValue(vref)} / 2^${bits} = ${formatValue(value)} V`,
  };
}

export function calcPwmDuty(onTime: number, period: number): CalcResult {
  const error =
    negativeError('ON time', onTime) ??
    positiveError('Period', period) ??
    (onTime > period ? 'ON time cannot be greater than the period.' : null);
  if (error) return { ok: false, error };

  const value = (onTime / period) * 100;
  return {
    ok: true,
    value,
    display: formatValue(value),
    unit: '%',
    substitution: `DC = (${formatValue(onTime)} / ${formatValue(period)}) × 100 = ${formatValue(value)}%`,
  };
}

export function calcPwmFrequency(periodSeconds: number): CalcResult {
  const error = positiveError('Period', periodSeconds);
  if (error) return { ok: false, error };

  const value = 1 / periodSeconds;
  return {
    ok: true,
    value,
    display: formatValue(value),
    unit: 'Hz',
    substitution: `f = 1 / ${formatValue(periodSeconds)} s = ${formatValue(value)} Hz`,
  };
}

export function calcPwmPeriod(frequency: number): CalcResult {
  const error = positiveError('Frequency', frequency);
  if (error) return { ok: false, error };

  const seconds = 1 / frequency;
  return {
    ok: true,
    value: seconds,
    display: formatValue(seconds),
    unit: 's',
    substitution: `T = 1 / ${formatValue(frequency)} Hz = ${formatValue(seconds)} s`,
    extra: `Equivalent to ${formatValue(seconds * 1000)} ms.`,
  };
}

export function calcPwmOffTime(onTime: number, period: number, unit = 'ms'): CalcResult {
  const error =
    negativeError('ON time', onTime) ??
    positiveError('Period', period) ??
    (onTime > period ? 'ON time cannot be greater than the period.' : null);
  if (error) return { ok: false, error };

  const value = period - onTime;
  const suffix = timeUnitSuffix(unit);
  return {
    ok: true,
    value,
    display: formatValue(value),
    unit: suffix,
    substitution: `OFF = ${formatValue(period)} − ${formatValue(onTime)} = ${formatValue(value)} ${suffix}`,
  };
}

export function calcTmp36Temperature(voltage: number): CalcResult {
  const error = finiteError('Voltage', voltage);
  if (error) return { ok: false, error };

  const value = (voltage - 0.5) * 100;
  return {
    ok: true,
    value,
    display: formatValue(value),
    unit: '°C',
    substitution: `T = (${formatValue(voltage)} − 0.5) × 100 = ${formatValue(value)}°C`,
  };
}

export function calcAdcVoltage(reading: number): CalcResult {
  const error = finiteError('ADC reading', reading);
  if (error) return { ok: false, error };
  if (!Number.isInteger(reading)) return { ok: false, error: 'ADC reading must be a whole number.' };
  if (reading < 0 || reading > 1023) {
    return { ok: false, error: 'Use an ADC reading from 0 to 1023 for the Arduino Uno.' };
  }

  const value = reading * (5.0 / 1023.0);
  return {
    ok: true,
    value,
    display: formatValue(value),
    unit: 'V',
    substitution: `V = ${formatValue(reading)} × (5.0 / 1023.0) = ${formatValue(value)} V`,
  };
}

export function tmp36Voltage(temperature: number): CalcResult {
  const error = finiteError('Temperature', temperature);
  if (error) return { ok: false, error };

  const value = 0.5 + 0.01 * temperature;
  return {
    ok: true,
    value,
    display: formatValue(value),
    unit: 'V',
    substitution: `Vout = 0.5 + 0.01 × ${formatValue(temperature)} = ${formatValue(value)} V`,
  };
}

export function temperatureStatus(temperature: number): 'normal' | 'warning' {
  return temperature >= 30.0 ? 'warning' : 'normal';
}

export function msToSeconds(ms: number): number {
  return ms / 1000;
}

export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}
