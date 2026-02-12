import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  ReactNode,
} from 'react';
import { TimerState } from '../types';
import { useBackgroundTimer } from '../hooks/useBackgroundTimer';
import { storageService } from '../services/StorageService';
import { notificationService } from '../services/NotificationService';
import { haptic } from '../utils/haptics';

interface TimerContextType {
  timerState: TimerState;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  updateSettings: (focus: number, breakDur: number) => void;
  toggleAutoLoop: () => void;
  onBreakComplete: () => void;
  showBreakScreen: boolean;
  setShowBreakScreen: (v: boolean) => void;
}

const DEFAULT_TIMER: TimerState = {
  focusDuration: 25,
  breakDuration: 5,
  remainingSeconds: 25 * 60,
  isRunning: false,
  isPaused: false,
  isBreak: false,
  isAutoLoop: false,
  sessionCount: 0,
};

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
  const [timerState, setTimerState] = useState<TimerState>(DEFAULT_TIMER);
  const [showBreakScreen, setShowBreakScreen] = useState(false);
  const { startBackgroundTimer, stopBackgroundTimer } = useBackgroundTimer();
  const stateRef = useRef(timerState);
  const notifIdRef = useRef<string | null>(null);

  // Keep ref in sync
  useEffect(() => {
    stateRef.current = timerState;
  }, [timerState]);

  // Load saved state
  useEffect(() => {
    (async () => {
      const saved = await storageService.getTimerState();
      if (saved) {
        setTimerState({ ...saved, isRunning: false, isPaused: false });
      }
    })();
  }, []);

  // Save state changes
  useEffect(() => {
    storageService.saveTimerState(timerState);
  }, [timerState]);

  const tick = useCallback(() => {
    const current = stateRef.current;
    if (!current.isRunning) return;

    if (current.remainingSeconds <= 1) {
      // Timer complete
      stopBackgroundTimer();
      haptic.success();

      if (current.isBreak) {
        // Break complete
        setTimerState((prev) => ({
          ...prev,
          isRunning: false,
          isPaused: false,
          isBreak: false,
          remainingSeconds: prev.focusDuration * 60,
        }));
        setShowBreakScreen(false);

        if (current.isAutoLoop) {
          // Auto-start next focus
          setTimeout(() => {
            startTimerInternal();
          }, 500);
        }
      } else {
        // Focus complete -> start break
        notificationService.showTimerCompleteNotification();
        setTimerState((prev) => ({
          ...prev,
          isRunning: false,
          isPaused: false,
          isBreak: true,
          remainingSeconds: prev.breakDuration * 60,
          sessionCount: prev.sessionCount + 1,
        }));
        setShowBreakScreen(true);

        // Auto-start break
        setTimeout(() => {
          startBreakInternal();
        }, 300);
      }
      return;
    }

    setTimerState((prev) => ({
      ...prev,
      remainingSeconds: prev.remainingSeconds - 1,
    }));

    // Update notification every 5 seconds
    if (current.remainingSeconds % 5 === 0) {
      notificationService.showTimerNotification(
        current.remainingSeconds - 1,
        true
      );
    }
  }, [stopBackgroundTimer]);

  const startTimerInternal = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      isBreak: false,
    }));
    startBackgroundTimer(tick);
  }, [startBackgroundTimer, tick]);

  const startBreakInternal = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      isRunning: true,
      isPaused: false,
    }));
    startBackgroundTimer(tick);
  }, [startBackgroundTimer, tick]);

  const startTimer = useCallback(() => {
    const current = stateRef.current;
    setTimerState((prev) => ({
      ...prev,
      isRunning: true,
      isPaused: false,
      remainingSeconds: prev.isPaused
        ? prev.remainingSeconds
        : prev.focusDuration * 60,
    }));
    startBackgroundTimer(tick);
    haptic.medium();

    notificationService.showTimerNotification(
      current.isPaused
        ? current.remainingSeconds
        : current.focusDuration * 60,
      true
    );
  }, [startBackgroundTimer, tick]);

  const pauseTimer = useCallback(() => {
    stopBackgroundTimer();
    setTimerState((prev) => ({
      ...prev,
      isRunning: false,
      isPaused: true,
    }));
    haptic.light();

    notificationService.showTimerNotification(stateRef.current.remainingSeconds, false);
  }, [stopBackgroundTimer]);

  const resetTimer = useCallback(() => {
    stopBackgroundTimer();
    setTimerState((prev) => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      isBreak: false,
      remainingSeconds: prev.focusDuration * 60,
    }));
    haptic.warning();
    notificationService.dismissAll();
  }, [stopBackgroundTimer]);

  const updateSettings = useCallback(
    (focus: number, breakDur: number) => {
      setTimerState((prev) => ({
        ...prev,
        focusDuration: focus,
        breakDuration: breakDur,
        remainingSeconds: prev.isRunning
          ? prev.remainingSeconds
          : focus * 60,
      }));
    },
    []
  );

  const toggleAutoLoop = useCallback(() => {
    setTimerState((prev) => ({
      ...prev,
      isAutoLoop: !prev.isAutoLoop,
    }));
    haptic.light();
  }, []);

  const onBreakComplete = useCallback(() => {
    stopBackgroundTimer();
    setShowBreakScreen(false);
    setTimerState((prev) => ({
      ...prev,
      isRunning: false,
      isPaused: false,
      isBreak: false,
      remainingSeconds: prev.focusDuration * 60,
    }));
  }, [stopBackgroundTimer]);

  return (
    <TimerContext.Provider
      value={{
        timerState,
        startTimer,
        pauseTimer,
        resetTimer,
        updateSettings,
        toggleAutoLoop,
        onBreakComplete,
        showBreakScreen,
        setShowBreakScreen,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimer must be inside TimerProvider');
  return ctx;
}
