import { NativeModules, Platform } from 'react-native';

class AudioKillService {
  async muteMedia(): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
      // Use SystemSetting to control volume
      const SystemSetting = require('react-native-system-setting').default;
      // Store current volume
      const currentVolume = await SystemSetting.getVolume('music');
      await SystemSetting.setVolume(0, { type: 'music', showUI: false });
      // Store for restoration
      this._previousVolume = currentVolume;
    } catch (error) {
      console.warn('AudioKill: Could not mute media', error);
    }
  }

  async restoreMedia(): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
      const SystemSetting = require('react-native-system-setting').default;
      if (this._previousVolume !== undefined) {
        await SystemSetting.setVolume(this._previousVolume, {
          type: 'music',
          showUI: false,
        });
        this._previousVolume = undefined;
      }
    } catch (error) {
      console.warn('AudioKill: Could not restore media', error);
    }
  }

  private _previousVolume?: number;
}

export const audioKillService = new AudioKillService();
