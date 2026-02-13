import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { NOTIFICATION_CONFIG } from '../constants/notifications';

class NotificationService {
  async initialize(): Promise<void> {
    if (!Device.isDevice) return;

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(
        NOTIFICATION_CONFIG.CHANNEL_TIMER,
        {
          name: 'Focus Timer',
          importance: Notifications.AndroidImportance.HIGH,
          sound: 'default',
          vibrationPattern: [0, 250, 250, 250],
          lockscreenVisibility:
            Notifications.AndroidNotificationVisibility.PUBLIC,
        }
      );

      await Notifications.setNotificationChannelAsync(
        NOTIFICATION_CONFIG.CHANNEL_TASKS,
        {
          name: 'Task Reminders',
          importance: Notifications.AndroidImportance.DEFAULT,
          sound: 'default',
        }
      );

      await Notifications.setNotificationChannelAsync(
        NOTIFICATION_CONFIG.CHANNEL_MOODS,
        {
          name: 'Mood Check-in',
          importance: Notifications.AndroidImportance.DEFAULT,
          sound: 'default',
        }
      );
    }
  }

  isWithinNotificationWindow(): boolean {
    const hour = new Date().getHours();
    return (
      hour >= NOTIFICATION_CONFIG.QUIET_HOUR_END &&
      hour < NOTIFICATION_CONFIG.QUIET_HOUR_START
    );
  }

  async showTimerNotification(
    remainingSeconds: number,
    isRunning: boolean
  ): Promise<string> {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: '⚡ Focus Session Active',
        body: `Time remaining: ${timeStr}`,
        data: { type: 'timer' },
        sticky: isRunning,
        ...(Platform.OS === 'android' && {
          channelId: NOTIFICATION_CONFIG.CHANNEL_TIMER,
        }),
      },
      trigger: null,
    });

    return id;
  }

  async showTimerCompleteNotification(): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: '✅ Focus Session Complete!',
        body: 'Great work! Time for a break.',
        data: { type: 'timer-complete' },
        sound: 'default',
        ...(Platform.OS === 'android' && {
          channelId: NOTIFICATION_CONFIG.CHANNEL_TIMER,
        }),
      },
      trigger: null,
    });
  }

  async scheduleTaskReminder(taskText: string, index: number): Promise<void> {
    if (!this.isWithinNotificationWindow()) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '📋 Task Reminder',
        body: `Don't forget: ${taskText}`,
        data: { type: 'task', index },
        ...(Platform.OS === 'android' && {
          channelId: NOTIFICATION_CONFIG.CHANNEL_TASKS,
        }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: NOTIFICATION_CONFIG.TASK_REMINDER_INTERVAL_MS / 1000,
        repeats: false,
      },
    });
  }

  async scheduleMoodReminder(): Promise<void> {
    if (!this.isWithinNotificationWindow()) return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '😊 How are you feeling?',
        body: 'Take a moment to check in with yourself.',
        data: { type: 'mood' },
        ...(Platform.OS === 'android' && {
          channelId: NOTIFICATION_CONFIG.CHANNEL_MOODS,
        }),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: NOTIFICATION_CONFIG.MOOD_REMINDER_INTERVAL_MS / 1000,
        repeats: false,
      },
    });
  }

  async cancelAll(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async dismissAll(): Promise<void> {
    await Notifications.dismissAllNotificationsAsync();
  }
}

export const notificationService = new NotificationService();
