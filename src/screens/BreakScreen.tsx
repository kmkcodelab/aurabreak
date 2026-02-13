import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  BackHandler,
  StatusBar,
  Modal,
} from 'react-native';
import { COLORS } from '../constants/colors';
import { useTimer } from '../context/TimerContext';
import { formatTime } from '../utils/formatTime';
import { BannerAdView } from '../components/ads/BannerAdView';
import { NativeAdView } from '../components/ads/NativeAdView';
import { audioKillService } from '../services/AudioKillService';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export function BreakScreen() {
  const { timerState, onBreakComplete, showBreakScreen } = useTimer();
  const [breakRemaining, setBreakRemaining] = useState(
    timerState.breakDuration * 60
  );
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mute audio on mount
  useEffect(() => {
    if (showBreakScreen) {
      audioKillService.muteMedia();
      setBreakRemaining(timerState.breakDuration * 60);
    }

    return () => {
      audioKillService.restoreMedia();
    };
  }, [showBreakScreen]);

  // Break countdown
  useEffect(() => {
    if (!showBreakScreen) return;

    intervalRef.current = setInterval(() => {
      setBreakRemaining((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onBreakComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [showBreakScreen, onBreakComplete]);

  // Block back button
  useEffect(() => {
    if (!showBreakScreen) return;

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true // Block back
    );

    return () => backHandler.remove();
  }, [showBreakScreen]);

  if (!showBreakScreen) return null;

  const progress = breakRemaining / (timerState.breakDuration * 60);

  return (
    <Modal
      visible={showBreakScreen}
      animationType="fade"
      statusBarTranslucent
      presentationStyle="fullScreen"
      onRequestClose={() => {
        // Block close
      }}
    >
      <StatusBar hidden />
      <View style={styles.container}>
        {/* Focus Lock Badge */}
        <View style={styles.lockBadge}>
          <Ionicons name="lock-closed" size={14} color={COLORS.accent} />
          <Text style={styles.lockText}>FOCUS LOCK ACTIVE</Text>
        </View>

        {/* Checkmark */}
        <View style={styles.checkCircle}>
          <Ionicons name="checkmark" size={40} color={COLORS.accent} />
        </View>

        {/* Title */}
        <Text style={styles.title}>BREAK TIME</Text>
        <Text style={styles.subtitle}>Screen locked for recovery.</Text>

        {/* Timer */}
        <Text style={styles.timer}>{formatTime(breakRemaining)}</Text>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <LinearGradient
            colors={[COLORS.accent, COLORS.accentDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>

        {/* Native Ad */}
        <View style={styles.adContainer}>
          <NativeAdView />
        </View>

        {/* Banner Ad */}
        <View style={styles.bannerContainer}>
          <BannerAdView />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  lockBadge: {
    position: 'absolute',
    top: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.accentSoft,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  lockText: {
    color: COLORS.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.accentSoft,
    borderWidth: 2,
    borderColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 4,
    marginBottom: 6,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 32,
  },
  timer: {
    color: COLORS.textPrimary,
    fontSize: 72,
    fontWeight: '200',
    letterSpacing: 6,
    fontVariant: ['tabular-nums'],
    marginBottom: 40,
  },
  progressContainer: {
    width: '100%',
    height: 4,
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 32,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  adContainer: {
    width: '100%',
    marginBottom: 12,
  },
  bannerContainer: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
  },
});
