import { describe, expect, it } from 'vitest';
import {
  INITIAL_SMART_LED_STATE,
  documentedIndicator,
  nextOperatingState,
  pressAcknowledge,
  pressMode,
  pullupReading,
  visibleState,
  warningConditionActive,
} from './smartLed';

describe('Smart LED state machine', () => {
  it('cycles NORMAL → CAUTION → WARNING → NORMAL', () => {
    expect(nextOperatingState('NORMAL')).toBe('CAUTION');
    expect(nextOperatingState('CAUTION')).toBe('WARNING');
    expect(nextOperatingState('WARNING')).toBe('NORMAL');
  });

  it('starts in NORMAL with acknowledgement cleared', () => {
    expect(INITIAL_SMART_LED_STATE).toEqual({ operating: 'NORMAL', acknowledged: false });
  });

  it('only acknowledges in WARNING', () => {
    expect(pressAcknowledge(INITIAL_SMART_LED_STATE)).toEqual(INITIAL_SMART_LED_STATE);

    const warning = { operating: 'WARNING' as const, acknowledged: false };
    const acknowledged = pressAcknowledge(warning);
    expect(acknowledged.acknowledged).toBe(true);
    expect(warningConditionActive(acknowledged)).toBe(true);
    expect(visibleState(acknowledged)).toBe('ACKNOWLEDGED');
  });

  it('does not clear the underlying warning condition on acknowledge', () => {
    const acknowledged = pressAcknowledge({ operating: 'WARNING', acknowledged: false });
    expect(warningConditionActive(acknowledged)).toBe(true);
    expect(documentedIndicator('ACKNOWLEDGED').behavior).toBe('Red LED steadily ON');
  });

  it('clears acknowledgement when leaving WARNING', () => {
    const acknowledged = { operating: 'WARNING' as const, acknowledged: true };
    const backToNormal = pressMode(acknowledged);
    expect(backToNormal).toEqual({ operating: 'NORMAL', acknowledged: false });
    expect(visibleState(backToNormal)).toBe('NORMAL');
  });

  it('shows only the documented LED for each visible state', () => {
    expect(documentedIndicator('NORMAL')).toMatchObject({ pin: 'D8', led: 'Green LED' });
    expect(documentedIndicator('CAUTION')).toMatchObject({ pin: 'D9', led: 'Yellow LED' });
    expect(documentedIndicator('WARNING')).toMatchObject({ pin: 'D10', led: 'Red LED' });
  });

  it('treats INPUT_PULLUP as active-LOW', () => {
    expect(pullupReading(false)).toBe('HIGH');
    expect(pullupReading(true)).toBe('LOW');
  });
});
