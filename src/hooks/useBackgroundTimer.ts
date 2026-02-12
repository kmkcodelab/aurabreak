import { useRef, useCallback } from 'react';
import { timerBackgroundService } from '../services/TimerBackgroundService';

export function useBackgroundTimer() {
  const callbackRef = useRef<(() => void) | null>(null);

  const startBackgroundTimer = useCallback((onTick: () => void) => {
    callbackRef.current = onTick;
    timerBackgroundService.start(() => {
      callbackRef.current?.();
    });
  }, []);

  const stopBackgroundTimer = useCallback(() => {
    timerBackgroundService.stop();
    callbackRef.current = null;
  }, []);

  return { startBackgroundTimer, stopBackgroundTimer };
}
