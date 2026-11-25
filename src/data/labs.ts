import type { ModuleId, PageRef } from '../types';

export interface LabPin {
  component: string;
  pin: string;
  fn: string;
  page: PageRef;
}

export const SMART_LED_PINS: LabPin[] = [
  { component: 'Green LED', pin: 'D8', fn: 'NORMAL indicator', page: 6 },
  { component: 'Yellow LED', pin: 'D9', fn: 'CAUTION indicator', page: 6 },
  { component: 'Red LED', pin: 'D10', fn: 'WARNING indicator', page: 6 },
  { component: 'Mode Button', pin: 'D2', fn: 'Changes the operating state', page: 6 },
  { component: 'Acknowledge Button', pin: 'D3', fn: 'Acknowledges the warning', page: 6 },
];

export const SMART_LED_LED_RESISTOR_NOTE = 'Each external LED uses a 220 Ω resistor to limit current.';

export type SmartLedDisplayState = 'NORMAL' | 'CAUTION' | 'WARNING' | 'ACKNOWLEDGED';

export const SMART_LED_STATE_ROWS: {
  state: SmartLedDisplayState;
  behavior: string;
  page: PageRef;
}[] = [
  { state: 'NORMAL', behavior: 'Green LED steadily ON', page: 6 },
  { state: 'CAUTION', behavior: 'Yellow LED blinks slowly', page: 6 },
  { state: 'WARNING', behavior: 'Red LED blinks in a distinctive pattern', page: 6 },
  { state: 'ACKNOWLEDGED', behavior: 'Red LED steadily ON', page: 6 },
];

export const SMART_LED_ACK_MEANING =
  'When the system is in ACKNOWLEDGED state, the warning condition is still active. The user has only acknowledged the warning; the actual problem has not necessarily been resolved.';

export const SMART_LED_MODE_SEQUENCE = 'NORMAL → CAUTION → WARNING → NORMAL';

export const SMART_LED_ACK_RULES = [
  'Works only when the system is in WARNING state.',
  'Changes the red LED from blinking to steadily ON.',
  'Does not clear the actual warning condition.',
  'Acknowledgement is cleared when the system leaves WARNING.',
];

export const PULLUP_ROWS = [
  { condition: 'Not pressed', reading: 'HIGH' },
  { condition: 'Pressed', reading: 'LOW' },
];

export const WOKWI_ELEMENTS = [
  { element: 'sketch.ino', purpose: 'Contains the Arduino source code', page: 7 as PageRef },
  { element: 'diagram.json', purpose: 'Stores the circuit description', page: 7 as PageRef },
  { element: 'Circuit Editor', purpose: 'Used to add and connect components', page: 7 as PageRef },
  { element: 'Start / Stop', purpose: 'Runs or stops the simulation', page: 7 as PageRef },
  { element: 'Serial Monitor', purpose: 'Displays text output from the program', page: 7 as PageRef },
];

export const TMP36_CONNECTIONS = [
  { component: 'TMP36 Left Pin (+Vs)', connection: '5V', page: 8 as PageRef },
  { component: 'TMP36 Middle Pin (Vout)', connection: 'A0', page: 8 as PageRef },
  { component: 'TMP36 Right Pin (GND)', connection: 'GND', page: 8 as PageRef },
  { component: 'Red LED Anode (+)', connection: 'D9 through 220 Ω resistor', page: 8 as PageRef },
  { component: 'Red LED Cathode (−)', connection: 'GND', page: 8 as PageRef },
  { component: 'Piezo Buzzer Positive (+)', connection: 'D8', page: 8 as PageRef },
  { component: 'Piezo Buzzer Negative (−)', connection: 'GND', page: 8 as PageRef },
];

export const TEMP_COMPONENTS = [
  { component: 'Arduino Uno R3', fn: 'Processes sensor readings and controls outputs', page: 8 as PageRef },
  { component: 'TMP36', fn: 'Measures temperature', page: 8 as PageRef },
  { component: 'Red LED', fn: 'Provides a visual warning', page: 8 as PageRef },
  { component: '220 Ω Resistor', fn: 'Limits LED current', page: 8 as PageRef },
  { component: 'Piezo Buzzer', fn: 'Provides an audible warning', page: 8 as PageRef },
  { component: 'Breadboard', fn: 'Helps organize circuit connections', page: 8 as PageRef },
  { component: 'Connecting Wires', fn: 'Connect the components', page: 8 as PageRef },
];

export const TMP36_EXAMPLES = [
  { temperature: 0, voltage: 0.5, label: '0.50 V', page: 8 as PageRef },
  { temperature: 25, voltage: 0.75, label: '0.75 V', page: 8 as PageRef },
  { temperature: 30, voltage: 0.8, label: '0.80 V', page: 8 as PageRef },
  { temperature: 35, voltage: 0.85, label: '0.85 V', page: 8 as PageRef },
];

export const TEMP_BEHAVIOR_ROWS = [
  {
    temperature: 'Below 30°C',
    led: 'OFF',
    buzzer: 'Silent',
    serial: 'Status: Normal',
    page: 8 as PageRef,
  },
  {
    temperature: '30°C or higher',
    led: 'ON',
    buzzer: '1000 Hz',
    serial: 'WARNING: High Temperature!',
    page: 8 as PageRef,
  },
];

export const SERIAL_EXAMPLES = [
  { temperature: 'Temperature: 24.78 C', status: 'Status: Normal' },
  { temperature: 'Temperature: 35.04 C', status: 'WARNING: High Temperature!' },
];

export const TEMP_VARIABLES = [
  { variable: 'tempPin', purpose: 'Stores the TMP36 analog pin', type: 'int', page: 9 as PageRef },
  { variable: 'ledPin', purpose: 'Stores the LED pin', type: 'int', page: 9 as PageRef },
  { variable: 'buzzerPin', purpose: 'Stores the buzzer pin', type: 'int', page: 9 as PageRef },
  { variable: 'sensorValue', purpose: 'Stores the raw ADC reading', type: 'int', page: 9 as PageRef },
  { variable: 'voltage', purpose: 'Stores the converted voltage', type: 'float', page: 9 as PageRef },
  { variable: 'temperature', purpose: 'Stores the computed temperature', type: 'float', page: 9 as PageRef },
];

export const TEMP_FUNCTIONS = [
  { fn: 'analogRead(tempPin)', purpose: 'Reads the TMP36 analog value', page: 10 as PageRef },
  { fn: 'digitalWrite(ledPin, HIGH)', purpose: 'Turns the red LED ON', page: 10 as PageRef },
  { fn: 'digitalWrite(ledPin, LOW)', purpose: 'Turns the red LED OFF', page: 10 as PageRef },
  { fn: 'tone(buzzerPin, 1000)', purpose: 'Produces a 1000 Hz buzzer sound', page: 10 as PageRef },
  { fn: 'noTone(buzzerPin)', purpose: 'Stops the buzzer', page: 10 as PageRef },
  { fn: 'Serial.begin(9600)', purpose: 'Starts serial communication', page: 10 as PageRef },
  { fn: 'Serial.print()', purpose: 'Prints without automatically adding a new line', page: 10 as PageRef },
  { fn: 'Serial.println()', purpose: 'Prints and adds a new line', page: 10 as PageRef },
  { fn: 'delay(1000)', purpose: 'Waits for one second', page: 10 as PageRef },
];

export const OPERATORS = [
  { operator: '>', meaning: 'Greater than', page: 10 as PageRef },
  { operator: '<', meaning: 'Less than', page: 10 as PageRef },
  { operator: '>=', meaning: 'Greater than or equal to', page: 10 as PageRef },
  { operator: '<=', meaning: 'Less than or equal to', page: 10 as PageRef },
  { operator: '==', meaning: 'Equal to', page: 10 as PageRef },
];

export interface DebugPair {
  problem: string;
  cause: string;
  page: PageRef;
  moduleId: ModuleId;
}

export const LAB_DEBUG_PAIRS: DebugPair[] = [
  {
    problem: 'Incorrect temperature reading',
    cause: 'Incorrect TMP36 wiring or orientation',
    page: 10,
    moduleId: 'm4b',
  },
  {
    problem: 'LED does not turn ON',
    cause: 'Wrong pin, reversed LED, or missing connection',
    page: 10,
    moduleId: 'm4b',
  },
  {
    problem: 'Buzzer produces no sound',
    cause: 'Incorrect buzzer wiring',
    page: 10,
    moduleId: 'm4b',
  },
  {
    problem: 'Serial Monitor is empty',
    cause: 'Missing Serial.begin() or simulation not running',
    page: 10,
    moduleId: 'm4b',
  },
  {
    problem: 'Warning does not activate',
    cause: 'Incorrect temperature threshold',
    page: 10,
    moduleId: 'm4b',
  },
  {
    problem: 'Alarm does not turn OFF',
    cause: 'Incorrect or missing else condition',
    page: 10,
    moduleId: 'm4b',
  },
];

export const OPTIMIZATION_ROWS = [
  {
    delay: '1000 ms',
    sampling: '1 sample per second',
    detection: '1 second',
    page: 11 as PageRef,
  },
  {
    delay: '3000 ms',
    sampling: '0.33 sample per second',
    detection: '3 seconds',
    page: 11 as PageRef,
  },
];

export function labSearchText(): string {
  const rows: string[] = [];
  rows.push(...SMART_LED_PINS.flatMap((row) => [row.component, row.pin, row.fn]));
  rows.push(...SMART_LED_STATE_ROWS.flatMap((row) => [row.state, row.behavior]));
  rows.push(...TMP36_CONNECTIONS.flatMap((row) => [row.component, row.connection]));
  rows.push(...TEMP_COMPONENTS.flatMap((row) => [row.component, row.fn]));
  rows.push(...LAB_DEBUG_PAIRS.flatMap((row) => [row.problem, row.cause]));
  rows.push(...WOKWI_ELEMENTS.flatMap((row) => [row.element, row.purpose]));
  rows.push(...TEMP_VARIABLES.flatMap((row) => [row.variable, row.purpose, row.type]));
  rows.push(...TEMP_FUNCTIONS.flatMap((row) => [row.fn, row.purpose]));
  rows.push(...OPERATORS.flatMap((row) => [row.operator, row.meaning]));
  return rows.join(' ').replace(/\s+/g, ' ').trim();
}
