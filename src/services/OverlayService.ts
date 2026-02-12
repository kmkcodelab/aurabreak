import { NativeModules, Platform, Linking } from 'react-native';

class OverlayService {
  async checkPermission(): Promise<boolean> {
    if (Platform.OS !== 'android') return true;

    try {
      const { Settings } = NativeModules;
      if (Settings && Settings.canDrawOverlays) {
        return await Settings.canDrawOverlays();
      }
      // Fallback: assume not granted if native module unavailable
      return false;
    } catch {
      return false;
    }
  }

  async requestPermission(): Promise<void> {
    if (Platform.OS !== 'android') return;

    try {
      // Direct intent to overlay settings for this app
      await Linking.openURL(
        'package:com.kmkcodelab.aurabreak'
      );
    } catch {
      // Fallback to generic overlay settings
      try {
        await Linking.sendIntent(
          'android.settings.action.MANAGE_OVERLAY_PERMISSION',
          [
            {
              key: 'android.intent.extra.PACKAGE_NAME',
              value: 'com.kmkcodelab.aurabreak',
            },
          ]
        );
      } catch {
        await Linking.openSettings();
      }
    }
  }
}

export const overlayService = new OverlayService();
