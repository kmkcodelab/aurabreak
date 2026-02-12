import BackgroundTimer from 'react-native-background-timer';
import { Platform } from 'react-native';

type TickCallback = () => void;

class TimerBackgroundService {
  private intervalId: number | null = null;
  private isRunning = false;

  start(callback: TickCallback): void {
    if (this.isRunning) return;
    this.isRunning = true;

    if (Platform.OS === 'android') {
      BackgroundTimer.runBackgroundTimer(() => {
        callback();
      }, 1000);
    } else {
      this.intervalId = BackgroundTimer.setInterval(() => {
        callback();
      }, 1000);
    }
  }

  stop(): void {
    if (!this.isRunning) return;
    this.isRunning = false;

    if (Platform.OS === 'android') {
      BackgroundTimer.stopBackgroundTimer();
    } else if (this.intervalId !== null) {
      BackgroundTimer.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getIsRunning(): boolean {
    return this.isRunning;
  }
}

export const timerBackgroundService = new TimerBackgroundService();
