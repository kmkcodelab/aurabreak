import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

interface Props {
  icon?: keyof typeof Ionicons.glyphMap;
  message: string;
}

export function EmptyState({ icon = 'star-outline', message }: Props) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={32} color={COLORS.textMuted} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
    gap: 8,
  },
  text: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontStyle: 'italic',
  },
});
