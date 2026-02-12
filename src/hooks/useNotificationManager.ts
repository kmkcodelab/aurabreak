import { useCallback, useRef, useEffect } from 'react';
import { notificationService } from '../services/NotificationService';
import { Task } from '../types';
import { NOTIFICATION_CONFIG } from '../constants/notifications';

export function useNotificationManager() {
  const taskReminderInterval = useRef<NodeJS.Timeout | null>(null);
  const moodReminderInterval = useRef<NodeJS.Timeout | null>(null);
  const taskIndex = useRef(0);

  const init = useCallback(async () => {
    await notificationService.initialize();
  }, []);

  const startTaskReminders = useCallback((tasks: Task[]) => {
    if (taskReminderInterval.current) {
      clearInterval(taskReminderInterval.current);
    }
    taskIndex.current = 0;

    taskReminderInterval.current = setInterval(() => {
      if (!notificationService.isWithinNotificationWindow()) return;

      const incompleteTasks = tasks.filter((t) => !t.completed);
      if (incompleteTasks.length === 0) return;

      const idx = taskIndex.current % incompleteTasks.length;
      notificationService.scheduleTaskReminder(
        incompleteTasks[idx].text,
        idx
      );
      taskIndex.current += 1;
    }, NOTIFICATION_CONFIG.TASK_REMINDER_INTERVAL_MS);
  }, []);

  const stopTaskReminders = useCallback(() => {
    if (taskReminderInterval.current) {
      clearInterval(taskReminderInterval.current);
      taskReminderInterval.current = null;
    }
  }, []);

  const startMoodReminders = useCallback((lastLogTime: number | null) => {
    if (moodReminderInterval.current) {
      clearInterval(moodReminderInterval.current);
    }

    moodReminderInterval.current = setInterval(() => {
      if (!notificationService.isWithinNotificationWindow()) return;

      if (lastLogTime) {
        const elapsed = Date.now() - lastLogTime;
        if (elapsed < NOTIFICATION_CONFIG.MOOD_PAUSE_DURATION_MS) return;
      }

      notificationService.scheduleMoodReminder();
    }, NOTIFICATION_CONFIG.MOOD_REMINDER_INTERVAL_MS);
  }, []);

  const stopMoodReminders = useCallback(() => {
    if (moodReminderInterval.current) {
      clearInterval(moodReminderInterval.current);
      moodReminderInterval.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      stopTaskReminders();
      stopMoodReminders();
    };
  }, [stopTaskReminders, stopMoodReminders]);

  return {
    init,
    startTaskReminders,
    stopTaskReminders,
    startMoodReminders,
    stopMoodReminders,
  };
}
