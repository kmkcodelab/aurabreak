import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, TimerState, Task, MoodEntry, DayHistory, UserProfile } from '../types';

const STORAGE_KEYS = {
  PROFILE: '@aura_profile',
  TASKS: '@aura_tasks',
  TASK_SLOTS: '@aura_task_slots',
  MOODS: '@aura_moods',
  MOOD_SLOTS: '@aura_mood_slots',
  HISTORY: '@aura_history',
  TIMER: '@aura_timer',
  LAST_MOOD_LOG: '@aura_last_mood_log',
  CLICK_COUNT: '@aura_click_count',
  LAST_INTERSTITIAL: '@aura_last_interstitial',
  SESSION_START: '@aura_session_start',
  TIME_AD_SHOWN: '@aura_time_ad_shown',
  FIRST_LAUNCH: '@aura_first_launch',
};

class StorageService {
  // Profile
  async getProfile(): Promise<UserProfile | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
    return data ? JSON.parse(data) : null;
  }

  async saveProfile(profile: UserProfile): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }

  // Tasks
  async getTasks(): Promise<Task[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  }

  async saveTasks(tasks: Task[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }

  async getTaskSlots(): Promise<number> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TASK_SLOTS);
    return data ? parseInt(data, 10) : 3;
  }

  async saveTaskSlots(slots: number): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.TASK_SLOTS, slots.toString());
  }

  // Moods
  async getMoods(): Promise<MoodEntry[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.MOODS);
    return data ? JSON.parse(data) : [];
  }

  async saveMoods(moods: MoodEntry[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.MOODS, JSON.stringify(moods));
  }

  async getMoodSlots(): Promise<number> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.MOOD_SLOTS);
    return data ? parseInt(data, 10) : 3;
  }

  async saveMoodSlots(slots: number): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.MOOD_SLOTS, slots.toString());
  }

  // History
  async getHistory(): Promise<DayHistory[]> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.HISTORY);
    return data ? JSON.parse(data) : [];
  }

  async saveHistory(history: DayHistory[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
  }

  // Timer
  async getTimerState(): Promise<TimerState | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TIMER);
    return data ? JSON.parse(data) : null;
  }

  async saveTimerState(state: TimerState): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.TIMER, JSON.stringify(state));
  }

  // Last Mood Log Time
  async getLastMoodLogTime(): Promise<number | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_MOOD_LOG);
    return data ? parseInt(data, 10) : null;
  }

  async saveLastMoodLogTime(time: number): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_MOOD_LOG, time.toString());
  }

  // Click tracker
  async getClickCount(): Promise<number> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CLICK_COUNT);
    return data ? parseInt(data, 10) : 0;
  }

  async saveClickCount(count: number): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.CLICK_COUNT, count.toString());
  }

  // Interstitial time tracker
  async getLastInterstitialTime(): Promise<number> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.LAST_INTERSTITIAL);
    return data ? parseInt(data, 10) : 0;
  }

  async saveLastInterstitialTime(time: number): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LAST_INTERSTITIAL, time.toString());
  }

  // Session start
  async getSessionStart(): Promise<number> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSION_START);
    return data ? parseInt(data, 10) : Date.now();
  }

  async saveSessionStart(time: number): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SESSION_START, time.toString());
  }

  // Time-based ad
  async getHasShownTimeAd(): Promise<boolean> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.TIME_AD_SHOWN);
    return data === 'true';
  }

  async saveHasShownTimeAd(shown: boolean): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.TIME_AD_SHOWN, shown.toString());
  }

  // First launch
  async isFirstLaunch(): Promise<boolean> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.FIRST_LAUNCH);
    return data === null;
  }

  async markFirstLaunchDone(): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.FIRST_LAUNCH, 'done');
  }

  // Clear today's tasks at midnight
  async resetDailyData(): Promise<void> {
    const tasks = await this.getTasks();
    const resetTasks = tasks.map((t) => ({ ...t, completed: false }));
    await this.saveTasks(resetTasks);
  }
}

export const storageService = new StorageService();
