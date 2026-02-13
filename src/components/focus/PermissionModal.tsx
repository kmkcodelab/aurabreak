import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { GlassModal } from '../common/GlassModal';
import { GradientButton } from '../common/GradientButton';
import { COLORS } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
  onAllow: () => void;
  verifying?: boolean;
}

export function PermissionModal({
  visible,
  onClose,
  onAllow,
  verifying = false,
}: Props) {
  return (
    <GlassModal visible={visible} onClose={onClose}>
      <Ionicons
        name="layers-outline"
        size={48}
        color={COLORS.accent}
        style={styles.icon}
      />
      <Text style={styles.title}>Display Over Apps</Text>
      <Text style={styles.description}>
        To make the{' '}
        <Text style={styles.highlight}>Unstoppable Break</Text> effective,
        Aura needs permission to display over other apps.
      </Text>

      {verifying ? (
        <View style={styles.verifyContainer}>
          <ActivityIndicator color={COLORS.accent} size="small" />
          <Text style={styles.verifyText}>VERIFYING PERMISSION...</Text>
        </View>
      ) : (
        <>
          <GradientButton
            onPress={onAllow}
            label="Allow in Settings"
            icon={
              <Ionicons name="settings-outline" size={18} color="#0A0E1A" />
            }
            style={styles.allowBtn}
          />
          <Text style={styles.later} onPress={onClose}>
            MAYBE LATER
          </Text>
        </>
      )}
    </GlassModal>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginBottom: 16,
  },
  title: {
    color: COLORS.textPrimary,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  highlight: {
    color: COLORS.accent,
    fontWeight: '700',
  },
  allowBtn: {
    width: '100%',
    marginBottom: 16,
  },
  later: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
  },
  verifyContainer: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  verifyText: {
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
