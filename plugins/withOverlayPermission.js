const { withAndroidManifest } = require('@expo/config-plugins');

const withOverlayPermission = (config) => {
  return withAndroidManifest(config, async (config) => {
    const manifest = config.modResults.manifest;

    // Ensure SYSTEM_ALERT_WINDOW permission
    const permissions = manifest['uses-permission'] || [];
    const hasOverlay = permissions.some(
      (p) => p.$?.['android:name'] === 'android.permission.SYSTEM_ALERT_WINDOW'
    );
    if (!hasOverlay) {
      permissions.push({
        $: { 'android:name': 'android.permission.SYSTEM_ALERT_WINDOW' },
      });
    }

    // Add FOREGROUND_SERVICE permission
    const hasForeground = permissions.some(
      (p) => p.$?.['android:name'] === 'android.permission.FOREGROUND_SERVICE'
    );
    if (!hasForeground) {
      permissions.push({
        $: { 'android:name': 'android.permission.FOREGROUND_SERVICE' },
      });
    }

    // Add FOREGROUND_SERVICE_MEDIA_PLAYBACK for timer
    const hasFSMedia = permissions.some(
      (p) =>
        p.$?.['android:name'] ===
        'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK'
    );
    if (!hasFSMedia) {
      permissions.push({
        $: {
          'android:name':
            'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
        },
      });
    }

    manifest['uses-permission'] = permissions;

    // Add service for background timer
    const application = manifest.application?.[0];
    if (application) {
      if (!application.service) {
        application.service = [];
      }
      application.service.push({
        $: {
          'android:name': '.TimerForegroundService',
          'android:enabled': 'true',
          'android:exported': 'false',
          'android:foregroundServiceType': 'mediaPlayback',
        },
      });
    }

    return config;
  });
};

module.exports = withOverlayPermission;
