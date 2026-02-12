import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

interface Props {
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onEdit: () => void;
}

export function TimerControls({
  isRunning,
  isPaused,
  onStart,
  onPause,
  onReset,
  onEdit,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Reset button */}
      <TouchableOpacity
        style={styles.sideButton}
        onPress={onReset}
        activeOpacity={0.7}
      >
        <Ionicons
          name="refresh-outline"
          size={22}
          color={COLORS.textSecondary}
        />
      </TouchableOpacity>

      {/* Main Start/Pause button */}
      <TouchableOpacity
        style={styles.mainButton}
        onPress={isRunning ? onPause : onStart}
        activeOpacity={0.8}
      >
        <View style={styles.mainButtonInner}>
          <Ionicons
            name={isRunning ? 'pause' : 'play'}
            size={28}
            color="#0A0E1A"
          />
          <Text style={styles.mainLabel}>
            {isRunning ? 'PAUSE' : isPaused ? 'RESUME' : 'START'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Edit button */}
      <TouchableOpacity
        style={styles.sideButton}
        onPress={onEdit}
        disabled={isRunning}
        activeOpacity={0.7}
      >
        <Ionicons
          name="pencil-outline"
          size={22}
          color={isRunning ? COLORS.textMuted : COLORS.textSecondary}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginTop: 32,
  },
  sideButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.glassBorderLight,
  },
  mainButton: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: COLORS.accent,
  },
  mainButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 32,
    gap: 8,
  },
  mainLabel: {
    color: '#0A0E1A',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
