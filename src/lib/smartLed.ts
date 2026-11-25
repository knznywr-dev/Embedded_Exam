export type SmartLedOperatingState = 'NORMAL' | 'CAUTION' | 'WARNING';
export type SmartLedVisibleState = SmartLedOperatingState | 'ACKNOWLEDGED';

export interface SmartLedState {
  operating: SmartLedOperatingState;
  acknowledged: boolean;
}

export const INITIAL_SMART_LED_STATE: SmartLedState = {
  operating: 'NORMAL',
  acknowledged: false,
};

export function nextOperatingState(state: SmartLedOperatingState): SmartLedOperatingState {
  switch (state) {
    case 'NORMAL':
      return 'CAUTION';
    case 'CAUTION':
      return 'WARNING';
    case 'WARNING':
      return 'NORMAL';
  }
}

/**
 * The Mode button advances NORMAL → CAUTION → WARNING → NORMAL.
 * Leaving WARNING clears any acknowledgement, per the reviewer.
 */
export function pressMode(state: SmartLedState): SmartLedState {
  return {
    operating: nextOperatingState(state.operating),
    acknowledged: false,
  };
}

/**
 * The Acknowledge button works only in WARNING.
 * It does not clear the warning condition; it only marks it acknowledged.
 */
export function pressAcknowledge(state: SmartLedState): SmartLedState {
  if (state.operating !== 'WARNING') return state;
  return { ...state, acknowledged: true };
}

export function visibleState(state: SmartLedState): SmartLedVisibleState {
  return state.operating === 'WARNING' && state.acknowledged ? 'ACKNOWLEDGED' : state.operating;
}

export function warningConditionActive(state: SmartLedState): boolean {
  return state.operating === 'WARNING';
}

export function pullupReading(pressed: boolean): 'LOW' | 'HIGH' {
  return pressed ? 'LOW' : 'HIGH';
}

export interface DocumentedIndicator {
  led: 'Green LED' | 'Yellow LED' | 'Red LED';
  pin: 'D8' | 'D9' | 'D10';
  animation: 'steady' | 'slow-blink' | 'pattern-blink';
  behavior: string;
}

export function documentedIndicator(state: SmartLedVisibleState): DocumentedIndicator {
  switch (state) {
    case 'NORMAL':
      return {
        led: 'Green LED',
        pin: 'D8',
        animation: 'steady',
        behavior: 'Green LED steadily ON',
      };
    case 'CAUTION':
      return {
        led: 'Yellow LED',
        pin: 'D9',
        animation: 'slow-blink',
        behavior: 'Yellow LED blinks slowly (illustrative timing)',
      };
    case 'WARNING':
      return {
        led: 'Red LED',
        pin: 'D10',
        animation: 'pattern-blink',
        behavior: 'Red LED blinks in a distinctive pattern (illustrative timing)',
      };
    case 'ACKNOWLEDGED':
      return {
        led: 'Red LED',
        pin: 'D10',
        animation: 'steady',
        behavior: 'Red LED steadily ON',
      };
  }
}
