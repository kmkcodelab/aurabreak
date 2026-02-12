import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../constants/colors';

interface Props {
  children: ReactNode;
  style?: ViewStyle;
  borderColor?: string;
}

export function GlassCard({
  children,
  style,
  borderColor = COLORS.glassBorderLight,
}: Props) {
  return (
    <View style={[styles.card, { borderColor }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.glassBg,
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    overflow: 'hidden',
  },
});
