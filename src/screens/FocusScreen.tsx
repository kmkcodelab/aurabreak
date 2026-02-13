import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';
import { useTimer } from '../context/TimerContext';
import { useAppState } from '../context/AppStateContext';
import { useOverlayPermission } from '../hooks/useOverlayPermission';
import { CircularTimer } from '../components/focus/CircularTimer';
import { TimerControls } from '../components/focus/TimerControls';
import { ModeToggle } from '../components/focus/ModeToggle';
import { TimerSettingsModal } from '../components/focus/TimerSettingsModal';
import { PermissionModal } from '../components/focus/PermissionModal';
import { StatusBadge } from '../components/common/StatusBadge';
import { Ionicons } from '@expo/vector-icons';

export function FocusScreen() {
  const {
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    updateSettings,
    toggleAutoLoop,
  } = useTimer();
  const { profile } = useAppState();
  const overlay = useOverlayPermission();
  const [showSettings, setShowSettings] = useState(false);
  const [verifyingPermission, setVerifyingPermission] = useState(false);
  const [hasCheckedOnce, setHasCheckedOnce] = useState(false);

  // Check overlay permission on first mount
  useEffect(() => {
    if (!hasCheckedOnce) {
      setHasCheckedOnce(true);
      overlay.promptIfNeeded();
    }
  }, [hasCheckedOnce]);

  const handleStart = useCallback(async () => {
    const granted = await overlay.promptIfNeeded();
    if (!granted) return;
    startTimer();
  }, [overlay, startTimer]);

  const handleAllowPermission = useCallback(async () => {
    setVerifyingPermission(true);
    await overlay.requestPermission();

    // Poll for permission grant after user returns
    const checkInterval = setInterval(async () => {
      const granted = await overlay.checkPermission();
      if (granted) {
        clearInterval(checkInterval);
        setVerifyingPermission(false);
        overlay.setShowModal(false);
      }
    }, 1000);

    // Stop polling after 30 seconds
    setTimeout(() => {
      clearInterval(checkInterval);
      setVerifyingPermission(false);
    }, 30000);
  }, [overlay]);

  const totalSeconds = timerState.isBreak
    ? timerState.breakDuration * 60
    : timerState.focusDuration * 60;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarCircle}>
              <Ionicons name="checkmark" size={18} color={COLORS.accent} />
            </View>
            <View>
              <Text style={styles.platformLabel}>AURA PLATFORM</Text>
              <Text style={styles.greeting}>
                Hi, {profile?.name || 'User'}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.dayLabel}>
              {new Date()
                .toLocaleDateString('en-US', { weekday: 'long' })
                .toUpperCase()}
            </Text>
            <StatusBadge
              label={
                overlay.hasPermission ? 'ENABLE OVERLAY' : '⚡ ENABLE OVERLAY'
              }
            />
          </View>
        </View>

        {/* Mode Toggle */}
        <View style={styles.modeContainer}>
          <ModeToggle
            isAutoLoop={timerState.isAutoLoop}
            onToggle={toggleAutoLoop}
          />
        </View>

        {/* Circular Timer */}
        <View style={styles.timerContainer}>
          <CircularTimer
            remainingSeconds={timerState.remainingSeconds}
            totalSeconds={totalSeconds}
            isBreak={timerState.isBreak}
          />
        </View>

        {/* Controls */}
        <TimerControls
          isRunning={timerState.isRunning}
          isPaused={timerState.isPaused}
          onStart={handleStart}
          onPause={pauseTimer}
          onReset={resetTimer}
          onEdit={() => setShowSettings(true)}
        />
      </ScrollView>

      {/* Timer Settings Modal */}
      <TimerSettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        onSave={updateSettings}
        currentFocus={timerState.focusDuration}
        currentBreak={timerState.breakDuration}
      />

      {/* Permission Modal */}
      <PermissionModal
        visible={overlay.showModal}
        onClose={() => {
          overlay.setShowModal(false);
          setVerifyingPermission(false);
        }}
        onAllow={handleAllowPermission}
        verifying={verifyingPermission}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingTop: 8,
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.accentSoft,
    borderWidth: 2,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformLabel: {
    color: COLORS.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  greeting: {
    color: COLORS.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  headerRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  dayLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modeContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
});
