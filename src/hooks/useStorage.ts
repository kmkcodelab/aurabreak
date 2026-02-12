import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services/StorageService';
import { Task, MoodEntry, DayHistory, UserProfile, TimerState } from '../types';

export function useStorage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskSlots, setTaskSlots] = useState(3);
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [moodSlots, setMoodSlots] = useState(3);
  const [history, setHistory] = useState<DayHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadAll = useCallback(async () => {
    try {
      const [p, t, ts, m, ms, h] = await Promise.all([
        storageService.getProfile(),
        storageService.getTasks(),
        storageService.getTaskSlots(),
        storageService.getMoods(),
        storageService.getMoodSlots(),
        storageService.getHistory(),
      ]);
      setProfile(p);
      setTasks(t);
      setTaskSlots(ts);
      setMoods(m);
      setMoodSlots(ms);
      setHistory(h);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const updateProfile = useCallback(async (p: UserProfile) => {
    await storageService.saveProfile(p);
    setProfile(p);
  }, []);

  const updateTasks = useCallback(async (t: Task[]) => {
    await storageService.saveTasks(t);
    setTasks(t);
  }, []);

  const updateTaskSlots = useCallback(async (s: number) => {
    await storageService.saveTaskSlots(s);
    setTaskSlots(s);
  }, []);

  const updateMoods = useCallback(async (m: MoodEntry[]) => {
    await storageService.saveMoods(m);
    setMoods(m);
  }, []);

  const updateMoodSlots = useCallback(async (s: number) => {
    await storageService.saveMoodSlots(s);
    setMoodSlots(s);
  }, []);

  const updateHistory = useCallback(async (h: DayHistory[]) => {
    await storageService.saveHistory(h);
    setHistory(h);
  }, []);

  return {
    profile,
    tasks,
    taskSlots,
    moods,
    moodSlots,
    history,
    isLoading,
    updateProfile,
    updateTasks,
    updateTaskSlots,
    updateMoods,
    updateMoodSlots,
    updateHistory,
    reload: loadAll,
  };
}
