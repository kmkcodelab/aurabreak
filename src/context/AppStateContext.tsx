import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import {
  Task,
  MoodEntry,
  DayHistory,
  UserProfile,
  MoodType,
} from '../types';
import { useStorage } from '../hooks/useStorage';
import { useClickTracker } from '../hooks/useClickTracker';
import { useAdManager } from '../hooks/useAdManager';
import { useNotificationManager } from '../hooks/useNotificationManager';
import { storageService } from '../services/StorageService';
import { getTodayKey } from '../utils/dateHelpers';

interface AppStateContextType {
  // Profile
  profile: UserProfile | null;
  setProfileData: (p: UserProfile) => Promise<void>;

  // Tasks
  tasks: Task[];
  taskSlots: number;
  addTask: (text: string) => Promise<void>;
  toggleTask: (id: string) => Promise<void>;
  editTask: (id: string, text: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  unlockTaskSlots: () => Promise<boolean>;

  // Moods
  moods: MoodEntry[];
  moodSlots: number;
  logMood: (mood: MoodType, gratitude: string) => Promise<void>;
  unlockMoodSlots: () => Promise<boolean>;

  // History
  history: DayHistory[];

  // Ads
  trackTabSwitch: () => Promise<void>;
  showRewarded: () => Promise<boolean>;
  showAppOpen: () => Promise<boolean>;
  isConnected: boolean;

  // Loading
  isLoading: boolean;
}

const AppStateContext = createContext<AppStateContextType | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const storage = useStorage();
  const clickTracker = useClickTracker();
  const adManager = useAdManager();
  const notifManager = useNotificationManager();

  useEffect(() => {
    clickTracker.initialize();
    adManager.initializeAds();
    notifManager.init();
  }, []);

  // Start reminders when tasks/moods load
  useEffect(() => {
    if (storage.tasks.length > 0) {
      notifManager.startTaskReminders(storage.tasks);
    }
  }, [storage.tasks]);

  // Task functions
  const addTask = useCallback(
    async (text: string) => {
      if (storage.tasks.length >= storage.taskSlots) return;
      const newTask: Task = {
        id: Date.now().toString(),
        text,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      await storage.updateTasks([...storage.tasks, newTask]);
    },
    [storage]
  );

  const toggleTask = useCallback(
    async (id: string) => {
      const updated = storage.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      await storage.updateTasks(updated);
      await updateTodayHistory(updated);
    },
    [storage]
  );

  const editTask = useCallback(
    async (id: string, text: string) => {
      const updated = storage.tasks.map((t) =>
        t.id === id ? { ...t, text } : t
      );
      await storage.updateTasks(updated);
    },
    [storage]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      const updated = storage.tasks.filter((t) => t.id !== id);
      await storage.updateTasks(updated);
    },
    [storage]
  );

  const unlockTaskSlots = useCallback(async (): Promise<boolean> => {
    const rewarded = await adManager.showRewarded();
    if (rewarded) {
      await storage.updateTaskSlots(storage.taskSlots + 2);
      return true;
    }
    return false;
  }, [adManager, storage]);

  // Mood functions
  const logMood = useCallback(
    async (mood: MoodType, gratitude: string) => {
      const entry: MoodEntry = {
        id: Date.now().toString(),
        mood,
        gratitude,
        timestamp: new Date().toISOString(),
        date: getTodayKey(),
      };
      const updated = [...storage.moods, entry];
      await storage.updateMoods(updated);
      await storageService.saveLastMoodLogTime(Date.now());
      notifManager.startMoodReminders(Date.now());
    },
    [storage, notifManager]
  );

  const unlockMoodSlots = useCallback(async (): Promise<boolean> => {
    const rewarded = await adManager.showRewarded();
    if (rewarded) {
      await storage.updateMoodSlots(storage.moodSlots + 2);
      return true;
    }
    return false;
  }, [adManager, storage]);

  // History
  const updateTodayHistory = useCallback(
    async (currentTasks: Task[]) => {
      const todayKey = getTodayKey();
      const existing = storage.history.find((h) => h.date === todayKey);
      const completed = currentTasks.filter((t) => t.completed).length;

      const entry: DayHistory = {
        date: todayKey,
        tasksCompleted: completed,
        totalTasks: currentTasks.length,
        focusSessions: existing?.focusSessions || 0,
        totalFocusMinutes: existing?.totalFocusMinutes || 0,
        mood: existing?.mood,
      };

      const updated = storage.history.filter((h) => h.date !== todayKey);
      // Keep only last 7 days
      const last7 = [...updated, entry].slice(-7);
      await storage.updateHistory(last7);
    },
    [storage]
  );

  // Ad triggers
  const trackTabSwitch = useCallback(async () => {
    const result = await clickTracker.trackClick();
    if (result.shouldShowInterstitial) {
      await adManager.showInterstitial();
    }
  }, [clickTracker, adManager]);

  const value: AppStateContextType = {
    profile: storage.profile,
    setProfileData: storage.updateProfile,
    tasks: storage.tasks,
    taskSlots: storage.taskSlots,
    addTask,
    toggleTask,
    editTask,
    deleteTask,
    unlockTaskSlots,
    moods: storage.moods,
    moodSlots: storage.moodSlots,
    logMood,
    unlockMoodSlots,
    history: storage.history,
    trackTabSwitch,
    showRewarded: adManager.showRewarded,
    showAppOpen: adManager.showAppOpen,
    isConnected: adManager.isConnected,
    isLoading: storage.isLoading,
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be inside AppStateProvider');
  return ctx;
}
