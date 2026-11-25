import type { SearchEntry } from '../types';
import { NOTE_SECTIONS, noteSearchText } from './notes';
import { FORMULAS, formulaSearchText } from './formulas';
import { QUESTIONS } from './questions';
import {
  LAB_DEBUG_PAIRS,
  SMART_LED_PINS,
  SMART_LED_STATE_ROWS,
  TMP36_CONNECTIONS,
  TEMP_COMPONENTS,
  WOKWI_ELEMENTS,
  labSearchText,
} from './labs';
import { MODULE_MAP } from './modules';

function makeNoteEntries(): SearchEntry[] {
  return NOTE_SECTIONS.map((section) => ({
    id: `search-note-${section.id}`,
    type: 'note',
    title: section.title,
    snippet:
      section.summary ??
      noteSearchText(section).slice(0, 180) + (noteSearchText(section).length > 180 ? '…' : ''),
    page: section.page,
    route: `/notes#note-${section.id}`,
    moduleId: section.moduleId,
    keywords: noteSearchText(section),
  }));
}

function makeFormulaEntries(): SearchEntry[] {
  return FORMULAS.map((formula) => ({
    id: `search-formula-${formula.id}`,
    type: 'formula',
    title: formula.topic,
    snippet: `${formula.expression} · ${formula.unit}`,
    page: formula.page,
    route: `/formulas#formula-${formula.id}`,
    keywords: formulaSearchText(formula),
  }));
}

function makeLabEntries(): SearchEntry[] {
  const entries: SearchEntry[] = [];

  entries.push({
    id: 'search-lab-smartled-overview',
    type: 'lab',
    title: 'Smart LED Alert System — components and pins',
    snippet:
      'Wokwi · Arduino Uno. Green LED D8, yellow LED D9, red LED D10, mode button D2, acknowledge button D3; 220 Ω resistor for each external LED.',
    page: 6,
    route: '/lab#lab-smartled',
    moduleId: 'm4a',
    keywords: labSearchText(),
  });

  for (const pin of SMART_LED_PINS) {
    entries.push({
      id: `search-lab-pin-${pin.pin}`,
      type: 'lab',
      title: `${pin.component} → ${pin.pin}`,
      snippet: `${pin.fn}. ${pin.component === 'Green LED' || pin.component === 'Yellow LED' || pin.component === 'Red LED' ? 'Each external LED uses a 220 Ω resistor.' : ''}`,
      page: pin.page,
      route: '/lab#lab-smartled',
      moduleId: 'm4a',
      keywords: `${pin.component} ${pin.pin} ${pin.fn} smart led alert system`,
    });
  }

  entries.push({
    id: 'search-lab-smartled-states',
    type: 'lab',
    title: 'Smart LED operating states',
    snippet: SMART_LED_STATE_ROWS.map((row) => `${row.state}: ${row.behavior}`).join(' · '),
    page: 6,
    route: '/lab#lab-smartled',
    moduleId: 'm4a',
    keywords: 'NORMAL CAUTION WARNING ACKNOWLEDGED acknowledged warning condition resolved',
  });

  entries.push({
    id: 'search-lab-pullup',
    type: 'lab',
    title: 'INPUT_PULLUP — active-LOW buttons',
    snippet: 'Not pressed = HIGH. Pressed = LOW. The button connects to GND and the internal pull-up keeps the input HIGH.',
    page: 7,
    route: '/lab#lab-smartled',
    moduleId: 'm4a',
    keywords: 'input_pullup button high low active low d2 d3',
  });

  entries.push({
    id: 'search-lab-timing',
    type: 'lab',
    title: 'Blocking vs. non-blocking timing',
    snippet: 'delay() pauses the program; millis() measures elapsed time without blocking.',
    page: 7,
    route: '/lab#lab-smartled',
    moduleId: 'm4a',
    keywords: 'delay millis blocking non-blocking now lastChange interval',
  });

  for (const element of WOKWI_ELEMENTS) {
    entries.push({
      id: `search-lab-wokwi-${element.element}`,
      type: 'lab',
      title: `Wokwi · ${element.element}`,
      snippet: element.purpose,
      page: element.page,
      route: '/lab#lab-smartled',
      moduleId: 'm4a',
      keywords: `wokwi ${element.element} ${element.purpose}`,
    });
  }

  entries.push({
    id: 'search-lab-temp-overview',
    type: 'lab',
    title: 'Temperature Monitoring and Alert System — circuit',
    snippet:
      'Tinkercad Circuits · Arduino Uno R3 · TMP36. Warning at 30°C or higher: red LED ON, buzzer 1000 Hz, Serial Monitor warning.',
    page: 8,
    route: '/lab#lab-temperature',
    moduleId: 'm4b',
    keywords: labSearchText(),
  });

  for (const connection of TMP36_CONNECTIONS) {
    entries.push({
      id: `search-lab-connection-${connection.component}`,
      type: 'lab',
      title: `${connection.component} → ${connection.connection}`,
      snippet: 'Temperature Monitoring and Alert System circuit connection.',
      page: connection.page,
      route: '/lab#lab-temperature',
      moduleId: 'm4b',
      keywords: `${connection.component} ${connection.connection} tmp36 led buzzer`,
    });
  }

  for (const component of TEMP_COMPONENTS) {
    entries.push({
      id: `search-lab-component-${component.component}`,
      type: 'lab',
      title: component.component,
      snippet: component.fn,
      page: component.page,
      route: '/lab#lab-temperature',
      moduleId: 'm4b',
      keywords: `${component.component} ${component.fn} temperature lab`,
    });
  }

  entries.push({
    id: 'search-lab-tmp36',
    type: 'lab',
    title: 'TMP36 temperature formula',
    snippet: 'Vout = 0.5 + 0.01T · Temperature = (Voltage − 0.5) × 100 · 0.80 V = 30°C.',
    page: 8,
    route: '/lab#lab-temperature',
    moduleId: 'm4b',
    keywords: 'tmp36 vout voltage offset 0.5 0.01 temperature 0.80 30',
  });

  entries.push({
    id: 'search-lab-adc',
    type: 'lab',
    title: 'Arduino Uno ADC conversion',
    snippet: '10-bit, 1,024 codes, 0–1023. Voltage = ADC Reading × (5.0 / 1023.0). ADC 153 ≈ 0.748 V.',
    page: 9,
    route: '/lab#lab-temperature',
    moduleId: 'm4b',
    keywords: 'adc 10-bit 1024 1023 5.0 153 0.748 integer division',
  });

  entries.push({
    id: 'search-lab-ifelse',
    type: 'lab',
    title: 'Temperature threshold if-else',
    snippet: 'if (temperature >= 30.0) → LED HIGH, tone 1000 Hz. else → LED LOW, noTone. >= includes exactly 30°C.',
    page: [9, 10],
    route: '/lab#lab-temperature',
    moduleId: 'm4b',
    keywords: 'if else temperature 30.0 threshold led buzzer tone notone',
  });

  for (const pair of LAB_DEBUG_PAIRS) {
    entries.push({
      id: `search-lab-debug-${pair.problem}`,
      type: 'lab',
      title: `Debugging: ${pair.problem}`,
      snippet: `Possible cause: ${pair.cause}.`,
      page: pair.page,
      route: '/lab#lab-debugging',
      moduleId: 'm4b',
      keywords: `${pair.problem} ${pair.cause} debugging troubleshooting`,
    });
  }

  entries.push({
    id: 'search-lab-optimization',
    type: 'lab',
    title: 'Temperature lab optimization challenge',
    snippet:
      'delay(1000) = 1 sample per second, ≈1 s worst-case detection delay. delay(3000) = 0.33 sample per second, ≈3 s. Longer delay is not automatically lower power.',
    page: [10, 11],
    route: '/lab#lab-temperature',
    moduleId: 'm4b',
    keywords: 'optimization delay 1000 3000 sampling frequency detection delay power sleep',
  });

  return entries;
}

function makeQuestionEntries(): SearchEntry[] {
  return QUESTIONS.map((question) => ({
    id: `search-question-${question.id}`,
    type: 'question',
    title: question.prompt,
    snippet: `${MODULE_MAP[question.moduleId].code} · ${question.topic} · Practice this question in the quiz.`,
    page: question.page,
    route: `/quiz?scope=${question.moduleId}`,
    moduleId: question.moduleId,
    keywords: `${question.prompt} ${question.topic} ${MODULE_MAP[question.moduleId].title}`,
  }));
}

export const SEARCH_ENTRIES: SearchEntry[] = [
  ...makeNoteEntries(),
  ...makeFormulaEntries(),
  ...makeLabEntries(),
  ...makeQuestionEntries(),
];

export const SEARCH_TYPE_LABELS: Record<SearchEntry['type'], string> = {
  note: 'Study note',
  formula: 'Formula',
  lab: 'Lab',
  question: 'Practice question',
  term: 'Term',
};
