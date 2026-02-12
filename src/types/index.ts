export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  mood: MoodType;
  gratitude: string;
  timestamp: string;
  date: string;
}

export type MoodType = 'great' | 'good' | 'neutral' | 'productive' | 'tired';

export interface DayHistory {
  date: string;
  tasksCompleted: number;
  totalTasks: number;
  focusSessions: number;
  totalFocusMinutes: number;
  mood?: MoodType;
}

export interface TimerState {
  focusDuration: number; // in minutes
  breakDuration: number; // in minutes
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  isBreak: boolean;
  isAutoLoop: boolean;
  sessionCount: number;
}

export interface UserProfile {
  name: string;
  isOnboarded: boolean;
  firstLaunchDone: boolean;
  installTimestamp: number;
}

export interface AppData {
  profile: UserProfile;
  tasks: Task[];
  taskSlots: number;
  moods: MoodEntry[];
  moodSlots: number;
  history: DayHistory[];
  timerState: TimerState;
  lastMoodLogTime: number | null;
  totalValidClicks: number;
  lastInterstitialTime: number;
  sessionStartTime: number;
  hasShownTimeBasedAd: boolean;
}

export type TabName = 'Focus' | 'Quests' | 'Reflection';
