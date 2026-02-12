import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';

interface Props {
  onPress: () => void;
  label: string;
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function GradientButton({
  onPress,
  label,
  style,
  disabled = false,
  loading = false,
  icon,
  variant = 'primary',
}: Props) {
  const colors =
    variant === 'primary'
      ? [COLORS.accent, COLORS.accentDark]
      : variant === 'danger'
      ? [COLORS.danger, '#CC0000']
      : [COLORS.surfaceLight, COLORS.surface];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[styles.wrapper, style]}
    >
      <LinearGradient
        colors={colors as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, disabled && styles.disabled]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            {icon}
            <Text
              style={[
                styles.label,
                variant === 'secondary' && styles.labelSecondary,
              ]}
            >
              {label}
            </Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    gap: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: '#0A0E1A',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  labelSecondary: {
    color: COLORS.textPrimary,
  },
});
