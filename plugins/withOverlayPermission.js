const { withAndroidManifest, withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withOverlayPermission = (config) => {
  // ১. Android Manifest এডিট করা
  config = withAndroidManifest(config, async (config) => {
    const manifest = config.modResults.manifest;

    // পারমিশন যোগ করা
    const permissions = manifest['uses-permission'] || [];
    const requiredPermissions = [
      'android.permission.SYSTEM_ALERT_WINDOW',
      'android.permission.FOREGROUND_SERVICE',
      'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
      'android.permission.WAKE_LOCK'
    ];

    requiredPermissions.forEach(perm => {
      if (!permissions.some(p => p.$?.['android:name'] === perm)) {
        permissions.push({ $: { 'android:name': perm } });
      }
    });

    manifest['uses-permission'] = permissions;

    // সার্ভিস রেজিস্ট্রি করা
    const application = manifest.application?.[0];
    if (application) {
      if (!application.service) application.service = [];
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

  // ২. স্বয়ংক্রিয়ভাবে TimerForegroundService.kt ফাইলটি তৈরি করা
  return withDangerousMod(config, [
    'android',
    async (config) => {
      const packageName = config.android?.package || 'com.kmkcodelab.aurabreak';
      const packagePath = packageName.replace(/\./g, '/');
      const filePath = path.join(
        config.modRequest.projectRoot,
        'android/app/src/main/java',
        packagePath,
        'TimerForegroundService.kt'
      );

      const serviceCode = `package ${packageName}

import android.app.*
import android.content.Intent
import android.os.IBinder
import android.os.Build
import androidx.core.app.NotificationCompat

class TimerForegroundService : Service() {
    override fun onBind(intent: Intent): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        createNotificationChannel()
        val notification = NotificationCompat.Builder(this, "timer_channel")
            .setContentTitle("Aura Break")
            .setContentText("Focus session is active")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
            .setOngoing(true)
            .build()

        startForeground(1, notification)
        return START_STICKY
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            const val channelId = "timer_channel"
            val channelName = "Timer Service"
            val chan = NotificationChannel(channelId, channelName, NotificationManager.IMPORTANCE_LOW)
            val manager = getSystemService(NotificationManager::class.java)
            manager.createNotificationChannel(chan)
        }
    }
}`;

      // ফোল্ডার তৈরি এবং ফাইল রাইট করা
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, serviceCode);

      return config;
    },
  ]);
};

module.exports = withOverlayPermission;
