import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

interface Props {
  isAutoLoop: boolean;
  onToggle: () => void;
}

export function ModeToggle({ isAutoLoop, onToggle }: Props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.option, !isAutoLoop && styles.active]}
        onPress={!isAutoLoop ? undefined : onToggle}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, !isAutoLoop && styles.textActive]}>
          MANUAL
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.option, isAutoLoop && styles.active]}
        onPress={isAutoLoop ? undefined : onToggle}
        activeOpacity={0.7}
      >
        <Text style={[styles.text, isAutoLoop && styles.textActive]}>
          AUTO-LOOP
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 12,
    padding: 3,
    alignSelf: 'center',
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  active: {
    backgroundColor: COLORS.accent,
  },
  text: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textActive: {
    color: '#0A0E1A',
  },
});
