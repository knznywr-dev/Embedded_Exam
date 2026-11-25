import type { ModuleId, ModuleMeta } from '../types';

export type { ModuleId } from '../types';

export const MODULES: ModuleMeta[] = [
  {
    id: 'm1',
    code: 'Module 1',
    title: 'Characteristics of Embedded Systems',
    shortTitle: 'Embedded Systems',
    subtitle:
      'Definitions, the general-purpose computer comparison, core characteristics, and quality attributes.',
    pages: [1, 2],
    kind: 'lecture',
    accent: 'teal',
  },
  {
    id: 'm2',
    code: 'Module 2',
    title: 'Embedded Programming and Development',
    shortTitle: 'Programming & Development',
    subtitle:
      'Arduino structure, functions and constants, the build process, debugging tools, and low-power modes.',
    pages: [2, 4],
    kind: 'lecture',
    accent: 'indigo',
  },
  {
    id: 'm3',
    code: 'Module 3',
    title: 'Timing, Performance, and Design Decisions',
    shortTitle: 'Timing & Performance',
    subtitle:
      'Real-time systems, timing margin, interrupts, PWM, data acquisition, ADC resolution, sensors, and actuators.',
    pages: [4, 6],
    kind: 'lecture',
    accent: 'amber',
  },
  {
    id: 'm4a',
    code: 'Module 4A',
    title: 'Laboratory: Smart LED Alert System',
    shortTitle: 'Lab 4A · Smart LED',
    subtitle:
      'Wokwi, Arduino Uno, three LEDs, two buttons, INPUT_PULLUP, and blocking versus non-blocking timing.',
    pages: [6, 7],
    kind: 'lab',
    accent: 'rose',
    priority: true,
  },
  {
    id: 'm4b',
    code: 'Module 4B',
    title: 'Laboratory: Temperature Monitoring and Alert System',
    shortTitle: 'Lab 4B · Temperature',
    subtitle:
      'Tinkercad Circuits, Arduino Uno R3, TMP36, ADC conversion, thresholds, Serial Monitor, and debugging.',
    pages: [7, 11],
    kind: 'lab',
    accent: 'red',
    priority: true,
  },
  {
    id: 'm5',
    code: 'Module 5',
    title: 'Important Formulas to Memorize',
    shortTitle: 'Formula Sheet',
    subtitle:
      'The ten computation formulas and the units the reviewer asks you to remember.',
    pages: [11, 11],
    kind: 'reference',
    accent: 'violet',
  },
];

export const MODULE_MAP: Record<ModuleId, ModuleMeta> = Object.fromEntries(
  MODULES.map((module) => [module.id, module]),
) as Record<ModuleId, ModuleMeta>;

export const MODULE_IDS: ModuleId[] = MODULES.map((module) => module.id);

export function moduleLabel(id: ModuleId): string {
  return MODULE_MAP[id].code;
}

export function moduleTitle(id: ModuleId): string {
  return MODULE_MAP[id].title;
}

export function pageLabel(page: number | number[]): string {
  if (Array.isArray(page)) {
    if (page.length === 0) return 'no page';
    if (page.length === 1) return `p. ${page[0]}`;
    const sorted = [...page].sort((a, b) => a - b);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const consecutive = sorted.every((value, index) => index === 0 || value === sorted[index - 1] + 1);
    return consecutive ? `pp. ${first}–${last}` : `pp. ${sorted.join(', ')}`;
  }
  return `p. ${page}`;
}
