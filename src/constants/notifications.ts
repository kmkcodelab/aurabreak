export const NOTIFICATION_CONFIG = {
  QUIET_HOUR_START: 23, // 11 PM
  QUIET_HOUR_END: 6,    // 6 AM
  TASK_REMINDER_INTERVAL_MS: 60 * 60 * 1000, // 1 hour
  MOOD_PAUSE_DURATION_MS: 4 * 60 * 60 * 1000, // 4 hours
  MOOD_REMINDER_INTERVAL_MS: 60 * 60 * 1000,  // 1 hour

  CHANNEL_TIMER: 'timer-channel',
  CHANNEL_TASKS: 'task-reminders',
  CHANNEL_MOODS: 'mood-reminders',
} as const;
