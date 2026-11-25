import type { FormulaDef } from '../types';

export const FORMULAS: FormulaDef[] = [
  {
    id: 'response-time',
    topic: 'Response Time',
    expression: 'Response Time = Detection + Processing + Output',
    variables: ['Detection', 'Processing', 'Output'],
    unit: 'milliseconds (ms)',
    page: 11,
    note: 'The reviewer gives the formula and the unit. No worked example is provided for this formula.',
    calculatorId: 'response-time',
  },
  {
    id: 'timing-margin',
    topic: 'Timing Margin',
    expression: 'Timing Margin = Deadline − Response Time',
    variables: ['Deadline', 'Response Time'],
    unit: 'milliseconds (ms)',
    page: 11,
    example: 'Deadline 10 ms, Response Time 7 ms → 3 ms. Positive means the deadline is met.',
    note: 'Worked example appears on p. 4. Zero means the response finishes exactly at the deadline; negative means the deadline is missed.',
    calculatorId: 'timing-margin',
  },
  {
    id: 'adc-codes',
    topic: 'Number of ADC Codes',
    expression: 'Number of ADC Codes = 2^{N}',
    variables: ['N = number of bits'],
    unit: 'codes',
    page: 11,
    example: '8-bit = 256 codes; 10-bit = 1,024 codes; 12-bit = 4,096 codes.',
    note: 'Code examples appear on p. 5.',
    calculatorId: 'adc-codes',
  },
  {
    id: 'adc-lsb',
    topic: 'ADC Resolution (LSB)',
    expression: 'ADC Resolution (LSB) = V_{ref} / 2^{N}',
    variables: ['Vref = reference voltage', 'N = number of bits'],
    unit: 'Volts (V)',
    page: 11,
    note: 'Ideal ADC formula. LSB is the voltage step represented by one ADC count. Keep this separate from the Arduino Uno voltage conversion formula.',
    calculatorId: 'adc-lsb',
  },
  {
    id: 'pwm-duty',
    topic: 'PWM Duty Cycle',
    expression: 'PWM Duty Cycle = (ON Time / Period) × 100',
    variables: ['ON Time', 'Period'],
    unit: 'percentage (%)',
    page: 11,
    example: 'ON time 5 ms, period 10 ms → 50%.',
    note: 'Worked example appears on p. 5. A higher duty cycle generally means more average power delivered to the load; for an LED, greater brightness.',
    calculatorId: 'pwm-duty',
  },
  {
    id: 'pwm-frequency',
    topic: 'PWM Frequency',
    expression: 'PWM Frequency = 1 / Period',
    variables: ['Period'],
    unit: 'Hertz (Hz)',
    page: 11,
    note: 'Period must be expressed in seconds when using this form. The reviewer’s PWM example uses a 10 ms period.',
    calculatorId: 'pwm-frequency',
  },
  {
    id: 'pwm-period',
    topic: 'PWM Period',
    expression: 'PWM Period = 1 / Frequency',
    variables: ['Frequency'],
    unit: 'seconds (s) or milliseconds (ms)',
    page: 11,
    note: 'Frequency is in Hertz (cycles per second).',
    calculatorId: 'pwm-period',
  },
  {
    id: 'pwm-off-time',
    topic: 'PWM OFF Time',
    expression: 'PWM OFF Time = Period − ON Time',
    variables: ['Period', 'ON Time'],
    unit: 'same time unit as the inputs',
    page: 11,
    example: 'Using the reviewer’s PWM values: 10 ms period − 5 ms ON time = 5 ms OFF time.',
    note: 'The reviewer lists the formula but does not separately print the 5 ms result. The 5 ms OFF time is a direct substitution of the reviewer’s 5 ms ON / 10 ms period values.',
    calculatorId: 'pwm-off-time',
  },
  {
    id: 'tmp36-temp',
    topic: 'TMP36 Temperature',
    expression: 'TMP36 Temperature = (Voltage − 0.5) × 100',
    variables: ['Voltage = TMP36 output voltage in volts'],
    unit: 'degrees Celsius (°C)',
    page: 11,
    example: '0.80 V → (0.80 − 0.5) × 100 = 30°C.',
    note: 'Worked example appears on p. 8. Subtract 0.5 to remove the voltage offset; multiply by 100 because the output changes by 0.01 V per 1°C.',
    calculatorId: 'tmp36-temp',
  },
  {
    id: 'adc-voltage',
    topic: 'ADC Voltage Conversion',
    expression: 'ADC Voltage Conversion = ADC Reading × (5.0 / 1023.0)',
    variables: ['ADC Reading = 0 to 1023 on the Arduino Uno'],
    unit: 'Volts (V)',
    page: 11,
    example: 'ADC reading 153 → 153 × (5.0 / 1023.0) ≈ 0.748 V.',
    note: 'Worked example appears on p. 9. Use 5.0 / 1023.0, not 5 / 1023: integer division produces zero.',
    calculatorId: 'adc-voltage',
  },
];

export const FORMULA_MAP = Object.fromEntries(
  FORMULAS.map((formula) => [formula.id, formula]),
) as Record<string, FormulaDef>;

export function formulaSearchText(formula: FormulaDef): string {
  return [
    formula.topic,
    formula.expression,
    ...formula.variables,
    formula.unit,
    formula.example ?? '',
    formula.note ?? '',
  ]
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
